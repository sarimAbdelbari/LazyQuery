/**
 * JSON Schema to Prisma Converter
 * Converts JSON schema definitions to Prisma schema format
 * Supports multiple JSON formats:
 * - Prisma JSON export format
 * - Custom JSON schema format
 * - OpenAPI/Swagger schema format
 */

export class JsonToPrismaConverter {
  /**
   * Convert JSON schema to Prisma schema string
   */
  static convert(jsonContent: string): string {
    try {
      const jsonData = JSON.parse(jsonContent);
      
      // Detect JSON format and convert accordingly
      if (this.isPrismaJsonFormat(jsonData)) {
        return this.convertPrismaJson(jsonData);
      } else if (this.isCustomSchemaFormat(jsonData)) {
        return this.convertCustomSchema(jsonData);
      } else {
        throw new Error('Unsupported JSON schema format');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format: ' + error.message);
      }
      throw error;
    }
  }

  /**
   * Check if JSON is in Prisma export format
   */
  private static isPrismaJsonFormat(data: any): boolean {
    return data.models || data.enums || (Array.isArray(data) && data[0]?.name && data[0]?.fields);
  }

  /**
   * Check if JSON is in custom schema format
   */
  private static isCustomSchemaFormat(data: any): boolean {
    return data.tables || data.schemas || data.entities;
  }

  /**
   * Convert Prisma JSON format
   */
  private static convertPrismaJson(data: any): string {
    let schema = `// Auto-generated Prisma schema from JSON\n\n`;
    schema += `generator client {\n  provider = "prisma-client-js"\n}\n\n`;
    schema += `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;

    const models = data.models || data;
    const enums = data.enums || [];

    // Add enums first
    if (Array.isArray(enums) && enums.length > 0) {
      for (const enumDef of enums) {
        schema += `enum ${enumDef.name} {\n`;
        for (const value of enumDef.values) {
          schema += `  ${value}\n`;
        }
        schema += `}\n\n`;
      }
    }

    // Add models
    if (Array.isArray(models)) {
      for (const model of models) {
        schema += this.generateModelFromJson(model);
      }
    }

    return schema.trim();
  }

  /**
   * Convert custom schema format
   */
  private static convertCustomSchema(data: any): string {
    let schema = `// Auto-generated Prisma schema from JSON\n\n`;
    schema += `generator client {\n  provider = "prisma-client-js"\n}\n\n`;
    schema += `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;

    const tables = data.tables || data.schemas || data.entities;

    if (Array.isArray(tables)) {
      for (const table of tables) {
        const modelName = this.toPascalCase(table.name || table.tableName || table.entityName);
        schema += `model ${modelName} {\n`;

        const fields = table.fields || table.columns || table.properties || [];
        
        for (const field of fields) {
          const fieldName = field.name || field.columnName || field.propertyName;
          const fieldType = this.mapJsonTypeToPrisma(field.type || field.dataType);
          const nullable = field.nullable || field.optional || field.required === false ? '?' : '';
          
          let fieldLine = `  ${fieldName} ${fieldType}${nullable}`;
          
          // Add attributes
          const attributes: string[] = [];
          if (field.primaryKey || field.isPrimaryKey || field.primary) {
            attributes.push('@id @default(autoincrement())');
          }
          if (field.unique || field.isUnique) {
            attributes.push('@unique');
          }
          if (field.default || field.defaultValue) {
            const defaultVal = field.default || field.defaultValue;
            if (defaultVal === 'now' || defaultVal === 'CURRENT_TIMESTAMP') {
              attributes.push('@default(now())');
            } else if (typeof defaultVal === 'string') {
              attributes.push(`@default("${defaultVal}")`);
            } else {
              attributes.push(`@default(${defaultVal})`);
            }
          }
          
          if (attributes.length > 0) {
            fieldLine += ` ${attributes.join(' ')}`;
          }
          
          schema += fieldLine + '\n';
        }

        // Add relations if defined
        if (table.relations || table.foreignKeys) {
          const relations = table.relations || table.foreignKeys || [];
          for (const rel of relations) {
            const refTable = this.toPascalCase(rel.references || rel.referencedTable || rel.toTable);
            const fieldName = rel.field || rel.column;
            const refField = rel.referencesField || rel.referencedColumn || 'id';
            schema += `  ${rel.name || refTable.toLowerCase()} ${refTable} @relation(fields: [${fieldName}], references: [${refField}])\n`;
          }
        }

        schema += `}\n\n`;
      }
    }

    return schema.trim();
  }

  /**
   * Generate Prisma model from JSON model definition
   */
  private static generateModelFromJson(model: any): string {
    let modelSchema = `model ${model.name} {\n`;

    const fields = model.fields || [];
    
    for (const field of fields) {
      const fieldType = field.type || 'String';
      const nullable = field.isRequired === false || field.optional ? '?' : '';
      
      let fieldLine = `  ${field.name} ${fieldType}${nullable}`;
      
      // Add attributes
      const attributes: string[] = [];
      if (field.isId || field.isPrimaryKey) {
        attributes.push('@id');
        if (field.hasDefaultValue && !field.default) {
          attributes.push('@default(autoincrement())');
        }
      }
      if (field.isUnique) {
        attributes.push('@unique');
      }
      if (field.default) {
        if (field.default.name === 'now') {
          attributes.push('@default(now())');
        } else if (field.default.name === 'autoincrement') {
          attributes.push('@default(autoincrement())');
        } else if (field.default.name === 'uuid') {
          attributes.push('@default(uuid())');
        }
      }
      if (field.relationName) {
        const relFields = field.relationFromFields || [];
        const relRefs = field.relationToFields || [];
        if (relFields.length > 0 && relRefs.length > 0) {
          attributes.push(`@relation(fields: [${relFields.join(', ')}], references: [${relRefs.join(', ')}])`);
        }
      }
      
      if (attributes.length > 0) {
        fieldLine += ` ${attributes.join(' ')}`;
      }
      
      modelSchema += fieldLine + '\n';
    }

    modelSchema += `}\n\n`;
    return modelSchema;
  }

  /**
   * Map JSON type to Prisma type
   */
  private static mapJsonTypeToPrisma(jsonType: string): string {
    if (!jsonType) return 'String';
    
    const type = jsonType.toLowerCase();
    
    const typeMap: Record<string, string> = {
      'string': 'String',
      'text': 'String',
      'varchar': 'String',
      'char': 'String',
      
      'int': 'Int',
      'integer': 'Int',
      'number': 'Int',
      'smallint': 'Int',
      
      'bigint': 'BigInt',
      'long': 'BigInt',
      
      'float': 'Float',
      'double': 'Float',
      'real': 'Float',
      
      'decimal': 'Decimal',
      'numeric': 'Decimal',
      
      'boolean': 'Boolean',
      'bool': 'Boolean',
      
      'date': 'DateTime',
      'datetime': 'DateTime',
      'timestamp': 'DateTime',
      
      'json': 'Json',
      'jsonb': 'Json',
      'object': 'Json',
      
      'bytes': 'Bytes',
      'binary': 'Bytes',
      'blob': 'Bytes',
    };

    return typeMap[type] || 'String';
  }

  /**
   * Convert string to PascalCase
   */
  private static toPascalCase(str: string): string {
    return str
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

