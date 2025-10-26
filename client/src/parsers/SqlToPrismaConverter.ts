/**
 * SQL to Prisma Schema Converter
 * Converts SQL DDL statements to Prisma schema format
 */

export class SqlToPrismaConverter {
  /**
   * Convert SQL DDL to Prisma schema string
   */
  static convert(sqlContent: string): string {
    try {
      const tables = this.parseSqlTables(sqlContent);
      return this.generatePrismaSchema(tables);
    } catch (error) {
      throw new Error(`SQL conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse SQL CREATE TABLE statements
   */
  private static parseSqlTables(sql: string): Array<{
    name: string;
    columns: Array<{ name: string; type: string; nullable: boolean; primaryKey: boolean; unique: boolean; defaultValue?: string }>;
    foreignKeys: Array<{ column: string; refTable: string; refColumn: string }>;
  }> {
    const tables: Array<{
      name: string;
      columns: Array<{ name: string; type: string; nullable: boolean; primaryKey: boolean; unique: boolean; defaultValue?: string }>;
      foreignKeys: Array<{ column: string; refTable: string; refColumn: string }>;
    }> = [];

    // Remove comments
    const cleanedSql = sql
      .replace(/--.*$/gm, '') // Single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line comments

    // Match CREATE TABLE statements (case insensitive)
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?(\w+)["']?\s*\(([\s\S]*?)\);/gi;
    let match;

    while ((match = tableRegex.exec(cleanedSql)) !== null) {
      const tableName = match[1];
      const tableBody = match[2];

      const columns: Array<{ name: string; type: string; nullable: boolean; primaryKey: boolean; unique: boolean; defaultValue?: string }> = [];
      const foreignKeys: Array<{ column: string; refTable: string; refColumn: string }> = [];

      // Split by comma, but be careful with nested parentheses
      const lines = this.splitTableBody(tableBody);

      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines
        if (!trimmed) continue;

        // Check for foreign key constraints
        if (/FOREIGN\s+KEY/i.test(trimmed)) {
          const fkMatch = trimmed.match(/FOREIGN\s+KEY\s*\(["']?(\w+)["']?\)\s*REFERENCES\s+["']?(\w+)["']?\s*\(["']?(\w+)["']?\)/i);
          if (fkMatch) {
            foreignKeys.push({
              column: fkMatch[1],
              refTable: fkMatch[2],
              refColumn: fkMatch[3],
            });
          }
          continue;
        }

        // Check for table constraints (PRIMARY KEY, UNIQUE)
        if (/(?:PRIMARY\s+KEY|UNIQUE|CHECK|CONSTRAINT)/i.test(trimmed) && !trimmed.match(/^["']?\w+["']?\s+/)) {
          continue;
        }

        // Parse column definition
        const columnMatch = trimmed.match(/^["']?(\w+)["']?\s+([A-Z][A-Z0-9_]*(?:\([^)]+\))?)\s*(.*)?$/i);
        if (columnMatch) {
          const columnName = columnMatch[1];
          const dataType = columnMatch[2];
          const constraints = columnMatch[3] || '';

          const nullable = !/NOT\s+NULL/i.test(constraints);
          const primaryKey = /PRIMARY\s+KEY/i.test(constraints);
          const unique = /UNIQUE/i.test(constraints);
          
          const defaultMatch = constraints.match(/DEFAULT\s+(['"]?)([^,\s]+)\1/i);
          const defaultValue = defaultMatch ? defaultMatch[2] : undefined;

          columns.push({
            name: columnName,
            type: dataType,
            nullable: !primaryKey && nullable,
            primaryKey,
            unique,
            defaultValue,
          });
        }
      }

      tables.push({ name: tableName, columns, foreignKeys });
    }

    return tables;
  }

  /**
   * Split table body by commas, respecting parentheses
   */
  private static splitTableBody(body: string): string[] {
    const parts: string[] = [];
    let current = '';
    let depth = 0;

    for (const char of body) {
      if (char === '(') depth++;
      if (char === ')') depth--;
      
      if (char === ',' && depth === 0) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      parts.push(current);
    }

    return parts;
  }

  /**
   * Map SQL types to Prisma types
   */
  private static mapSqlTypeToPrisma(sqlType: string): string {
    const type = sqlType.toUpperCase().split('(')[0];
    
    const typeMap: Record<string, string> = {
      // Integer types
      'INT': 'Int',
      'INTEGER': 'Int',
      'SMALLINT': 'Int',
      'BIGINT': 'BigInt',
      'TINYINT': 'Int',
      
      // String types
      'VARCHAR': 'String',
      'CHAR': 'String',
      'TEXT': 'String',
      'LONGTEXT': 'String',
      'MEDIUMTEXT': 'String',
      
      // Decimal types
      'DECIMAL': 'Decimal',
      'NUMERIC': 'Decimal',
      'FLOAT': 'Float',
      'DOUBLE': 'Float',
      'REAL': 'Float',
      
      // Date/Time types
      'DATE': 'DateTime',
      'DATETIME': 'DateTime',
      'TIMESTAMP': 'DateTime',
      'TIME': 'DateTime',
      
      // Boolean types
      'BOOLEAN': 'Boolean',
      'BOOL': 'Boolean',
      
      // JSON types
      'JSON': 'Json',
      'JSONB': 'Json',
      
      // Binary types
      'BLOB': 'Bytes',
      'BYTEA': 'Bytes',
    };

    return typeMap[type] || 'String';
  }

  /**
   * Generate Prisma schema from parsed tables
   */
  private static generatePrismaSchema(tables: Array<{
    name: string;
    columns: Array<{ name: string; type: string; nullable: boolean; primaryKey: boolean; unique: boolean; defaultValue?: string }>;
    foreignKeys: Array<{ column: string; refTable: string; refColumn: string }>;
  }>): string {
    let schema = `// Auto-generated Prisma schema from SQL\n\n`;
    schema += `generator client {\n  provider = "prisma-client-js"\n}\n\n`;
    schema += `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n`;

    for (const table of tables) {
      schema += `model ${this.toPascalCase(table.name)} {\n`;

      // Add columns
      for (const column of table.columns) {
        const prismaType = this.mapSqlTypeToPrisma(column.type);
        const nullable = column.nullable && !column.primaryKey ? '?' : '';
        
        let fieldLine = `  ${column.name} ${prismaType}${nullable}`;
        
        // Add attributes
        const attributes: string[] = [];
        if (column.primaryKey) attributes.push('@id @default(autoincrement())');
        if (column.unique && !column.primaryKey) attributes.push('@unique');
        if (column.defaultValue && !column.primaryKey) {
          if (column.defaultValue.toLowerCase() === 'now()' || column.defaultValue.toLowerCase() === 'current_timestamp') {
            attributes.push('@default(now())');
          } else if (column.defaultValue.toLowerCase() === 'true' || column.defaultValue.toLowerCase() === 'false') {
            attributes.push(`@default(${column.defaultValue.toLowerCase()})`);
          }
        }
        
        if (attributes.length > 0) {
          fieldLine += ` ${attributes.join(' ')}`;
        }
        
        schema += fieldLine + '\n';
      }

      // Add foreign key relations
      for (const fk of table.foreignKeys) {
        const refTablePascal = this.toPascalCase(fk.refTable);
        schema += `  ${fk.refTable} ${refTablePascal} @relation(fields: [${fk.column}], references: [${fk.refColumn}])\n`;
      }

      schema += `}\n\n`;
    }

    return schema.trim();
  }

  /**
   * Convert string to PascalCase
   */
  private static toPascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

