import type { Model, ModelConnection, Enum } from '../lib/types/schema';

/**
 * Prisma Schema Parser
 * Parses .prisma schema files and extracts models, fields, and relationships
 */

export class PrismaParser {
  /**
   * Parse a Prisma schema string into structured data
   * @param {string} schemaContent - Raw .prisma file content
   * @returns {Object} Parsed schema with models, enums, and relations
   */
  static parse(schemaContent: string): {
    models: Model[];
    enums: Enum[];
    connections: ModelConnection[];
  } {
    const models: Model[] = [];
    const enums: Enum[] = [];
    const connections: ModelConnection[] = [];

    // Parse models
    const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
    let match;

    const allModels: Array<{ name: string; body: string; fields: any[] }> = [];

    while ((match = modelRegex.exec(schemaContent)) !== null) {
      const modelName = match[1];
      const modelBody = match[2];

      const fields = this.parseFields(modelBody);
      allModels.push({ name: modelName, body: modelBody, fields });

      models.push({
        name: modelName,
        fields: fields,
        isChild: fields.some((f) => f.hasConnections && f.name.endsWith('Id')),
      });
    }

    // Parse relations and detect junction tables for M:N relationships
    for (const model of allModels) {
      const modelRelations = this.parseRelations(model.name, model.body, allModels);
      connections.push(...modelRelations);
    }

    // Parse enums
    const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
    while ((match = enumRegex.exec(schemaContent)) !== null) {
      const enumName = match[1];
      const enumBody = match[2];
      const values = enumBody
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('//'))
        .map((line) => line.split(/\s+/)[0]);

      enums.push({
        name: enumName,
        values,
      });
    }

    return {
      models,
      enums,
      connections,
    };
  }

  /**
   * Parse fields from a model body
   */
  private static parseFields(
    modelBody: string,
  ): Array<{ name: string; type: string; hasConnections?: boolean; isForeignKey?: boolean; isRelation?: boolean; isPrimaryKey?: boolean }> {
    const fields: Array<{ name: string; type: string; hasConnections?: boolean; isForeignKey?: boolean; isRelation?: boolean; isPrimaryKey?: boolean }> = [];
    const lines = modelBody
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    for (const line of lines) {
      // Skip comments and attributes
      if (line.startsWith('//') || line.startsWith('@@')) continue;

      // Match field: fieldName Type @attributes
      const fieldMatch = line.match(/^(\w+)\s+(\w+(\[\])?|\w+\?)\s*(.*)?$/);
      if (fieldMatch) {
        const [, fieldName, fieldType, , attributes = ''] = fieldMatch;

        // Check if this field has a relation
        const hasRelation = attributes.includes('@relation');
        const isObjectType = !this.isPrimitiveType(fieldType.replace('[]', '').replace('?', ''));
        
        // Check if this is a foreign key field (ends with Id or is referenced in @relation)
        const isForeignKey = this.isPrimitiveType(fieldType) && fieldName.endsWith('Id');
        
        // Check if this is a relation field (object type with @relation)
        const isRelation = hasRelation && isObjectType;

        // Check if this is a primary key field
        const isPrimaryKey = attributes.includes('@id') || 
                            (fieldName === 'id' && this.isPrimitiveType(fieldType)) ||
                            (fieldName.toLowerCase().includes('id') && attributes.includes('@unique'));

        fields.push({
          name: fieldName,
          type: fieldType,
          hasConnections: hasRelation || isObjectType,
          isForeignKey,
          isRelation,
          isPrimaryKey,
        });
      }
    }

    return fields;
  }

  /**
   * Check if a type is a Prisma primitive
   */
  private static isPrimitiveType(type: string): boolean {
    const primitives = [
      'String',
      'Int',
      'Float',
      'Boolean',
      'DateTime',
      'Json',
      'Bytes',
      'Decimal',
      'BigInt',
    ];
    return primitives.includes(type);
  }

  /**
   * Check if a model is a junction table (for M:N relationships)
   * Junction tables typically have:
   * - Two or more foreign key fields (ending with Id)
   * - Corresponding @relation fields
   */
  private static isJunctionTable(model: { name: string; body: string; fields: any[] }): { isJunction: boolean; relatedModels: string[] } {
    const foreignKeyFields = model.fields.filter(f => f.isForeignKey);
    
    // A junction table typically has at least 2 foreign keys
    if (foreignKeyFields.length >= 2) {
      // Extract the related model names from foreign key field names
      const relatedModels: string[] = [];
      const lines = model.body.split('\n').map(l => l.trim()).filter(l => l);
      
      for (const line of lines) {
        const fieldMatch = line.match(/^(\w+)\s+(\w+)\s+@relation\(fields:/);
        if (fieldMatch) {
          const fieldType = fieldMatch[2];
          if (!this.isPrimitiveType(fieldType)) {
            relatedModels.push(fieldType);
          }
        }
      }
      
      return { 
        isJunction: relatedModels.length >= 2, 
        relatedModels 
      };
    }
    
    return { isJunction: false, relatedModels: [] };
  }

  /**
   * Parse relationships between models
   */
  private static parseRelations(
    modelName: string,
    modelBody: string,
    allModels: Array<{ name: string; body: string; fields: any[] }>,
  ): ModelConnection[] {
    const relations: ModelConnection[] = [];
    const lines = modelBody
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    // Check if current model is a junction table
    const currentModel = allModels.find(m => m.name === modelName);
    const junctionInfo = currentModel ? this.isJunctionTable(currentModel) : { isJunction: false, relatedModels: [] };

    for (const line of lines) {
      const fieldMatch = line.match(/^(\w+)\s+(\w+(\[\])?|\w+\?)\s*(.*)?$/);
      if (fieldMatch) {
        const [, fieldName, fieldType, , attributes = ''] = fieldMatch;

        // Check if this field has @relation attribute or is an object type
        if (
          attributes.includes('@relation') ||
          !this.isPrimitiveType(fieldType.replace('[]', '').replace('?', ''))
        ) {
          const targetModel = fieldType.replace('[]', '').replace('?', '');

          // Only create connection if target is not a primitive type
          if (!this.isPrimitiveType(targetModel)) {
            // Extract relation details from @relation attribute
            let foreignKey = '';
            let references = '';
            let label = fieldName;
            let relationType: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many' = 'many-to-one';
            
            // Determine relation type based on field syntax
            const isArray = fieldType.includes('[]');
            const hasRelationFields = attributes.includes('fields:');
            
            // Check if this is part of a many-to-many relationship via junction table
            if (junctionInfo.isJunction && junctionInfo.relatedModels.includes(targetModel)) {
              relationType = 'many-to-many';
              label = `${fieldName} (M:N via ${modelName})`;
            } else if (isArray) {
              // Check if the target model has a junction table pointing back
              const targetModelObj = allModels.find(m => m.name === targetModel);
              if (targetModelObj) {
                const targetJunctionCheck = this.isJunctionTable(targetModelObj);
                if (targetJunctionCheck.isJunction) {
                  relationType = 'many-to-many';
                  label = `${fieldName} (M:N)`;
                } else {
                  // Regular one-to-many relationship
                  relationType = 'one-to-many';
                  label = `${fieldName} (1:N)`;
                }
              } else {
                relationType = 'one-to-many';
                label = `${fieldName} (1:N)`;
              }
            } else if (hasRelationFields) {
              // Has @relation(fields: [...]) - this is many-to-one
              relationType = 'many-to-one';
            } else {
              // Single field without @relation fields might be one-to-one
              relationType = 'one-to-one';
            }
            
            if (attributes.includes('@relation')) {
              const fieldsMatch = attributes.match(/fields:\s*\[([^\]]+)\]/);
              const referencesMatch = attributes.match(/references:\s*\[([^\]]+)\]/);
              
              if (fieldsMatch) {
                foreignKey = fieldsMatch[1].trim();
                relationType = 'many-to-one';
              }
              if (referencesMatch) {
                references = referencesMatch[1].trim();
              }
              
              // Create a more descriptive label with relation type
              if (foreignKey && references) {
                label = `${foreignKey} → ${references} (N:1)`;
              } else if (relationType === 'one-to-many') {
                label = `${fieldName} (1:N)`;
              } else if (relationType === 'one-to-one') {
                label = `${fieldName} (1:1)`;
              }
            }
            
            relations.push({
              source: `${modelName}-${fieldName}-source`,
              target: `${targetModel}-target`,
              name: fieldName,
              label,
              foreignKey,
              references,
              relationType,
            });
          }
        }
      }
    }

    return relations;
  }
}

