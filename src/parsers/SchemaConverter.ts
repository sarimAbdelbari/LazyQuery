/**
 * Schema Converter
 * Main orchestrator that detects file type and routes to appropriate converter
 */

import { PrismaParser } from './PrismaParser';
import { SqlToPrismaConverter } from './SqlToPrismaConverter';
import { JsonToPrismaConverter } from './JsonToPrismaConverter';

export type SchemaFileType = 'prisma' | 'sql' | 'psql' | 'json';

export interface ConversionResult {
  success: boolean;
  prismaSchema?: string;
  error?: string;
  fileType?: SchemaFileType;
}

export class SchemaConverter {
  /**
   * Supported file extensions
   */
  private static readonly SUPPORTED_EXTENSIONS: SchemaFileType[] = ['prisma', 'sql', 'psql', 'json'];

  /**
   * Validate file type
   */
  static isSupportedFile(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    return this.SUPPORTED_EXTENSIONS.includes(extension as SchemaFileType);
  }

  /**
   * Get file extension
   */
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Get supported file types as string for file input
   */
  static getSupportedFileTypes(): string {
    return this.SUPPORTED_EXTENSIONS.map(ext => `.${ext}`).join(',');
  }

  /**
   * Convert any supported schema format to Prisma schema
   */
  static async convertToPrisma(
    content: string,
    fileName: string
  ): Promise<ConversionResult> {
    try {
      const fileType = this.getFileExtension(fileName) as SchemaFileType;

      // Validate file type
      if (!this.isSupportedFile(fileName)) {
        return {
          success: false,
          error: `Unsupported file type. Supported formats: ${this.SUPPORTED_EXTENSIONS.join(', ')}`,
        };
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        return {
          success: false,
          error: 'File is empty. Please provide a valid schema file.',
        };
      }

      let prismaSchema: string;

      // Route to appropriate converter based on file type
      switch (fileType) {
        case 'prisma':
          // Already in Prisma format, just validate it
          const validationResult = this.validatePrismaSchema(content);
          if (!validationResult.valid) {
            return {
              success: false,
              error: validationResult.error,
              fileType,
            };
          }
          prismaSchema = content;
          break;

        case 'sql':
        case 'psql':
          try {
            prismaSchema = SqlToPrismaConverter.convert(content);
          } catch (error) {
            return {
              success: false,
              error: `SQL conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              fileType,
            };
          }
          break;

        case 'json':
          try {
            prismaSchema = JsonToPrismaConverter.convert(content);
          } catch (error) {
            return {
              success: false,
              error: `JSON conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              fileType,
            };
          }
          break;

        default:
          return {
            success: false,
            error: 'Unsupported file format',
          };
      }

      // Final validation of converted schema
      const finalValidation = this.validatePrismaSchema(prismaSchema);
      if (!finalValidation.valid) {
        return {
          success: false,
          error: `Converted schema validation failed: ${finalValidation.error}`,
          fileType,
        };
      }

      return {
        success: true,
        prismaSchema,
        fileType,
      };
    } catch (error) {
      return {
        success: false,
        error: `Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Validate Prisma schema has required structure
   */
  private static validatePrismaSchema(schema: string): { valid: boolean; error?: string } {
    // Check for at least one model or enum
    const hasModel = /model\s+\w+\s*{/i.test(schema);
    const hasEnum = /enum\s+\w+\s*{/i.test(schema);

    if (!hasModel && !hasEnum) {
      return {
        valid: false,
        error: 'Schema must contain at least one model or enum definition',
      };
    }

    // Try to parse with PrismaParser to ensure it's valid
    try {
      const parsed = PrismaParser.parse(schema);
      if (parsed.models.length === 0 && parsed.enums.length === 0) {
        return {
          valid: false,
          error: 'No valid models or enums found in schema',
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: `Schema parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    return { valid: true };
  }

  /**
   * Get file type description for UI
   */
  static getFileTypeDescription(fileType: SchemaFileType): string {
    const descriptions: Record<SchemaFileType, string> = {
      prisma: 'Prisma Schema',
      sql: 'SQL Database Schema',
      psql: 'PostgreSQL Database Schema',
      json: 'JSON Schema Definition',
    };
    return descriptions[fileType] || 'Unknown';
  }

  /**
   * Get file type icon for UI
   */
  static getFileTypeIcon(fileType: SchemaFileType): string {
    const icons: Record<SchemaFileType, string> = {
      prisma: '⚡',
      sql: '🗄️',
      psql: '🐘',
      json: '📋',
    };
    return icons[fileType] || '📄';
  }
}

