import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { SchemaConverter, type SchemaFileType } from '../parsers';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  onError: (error: string) => void;
}

export const FileUpload = ({ onFileSelect, onError }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Validate file type
      if (!SchemaConverter.isSupportedFile(file.name)) {
        onError(
          `Unsupported file type. Please upload one of: ${SchemaConverter.getSupportedFileTypes()}`
        );
        setIsProcessing(false);
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        onError('File is too large. Maximum size is 10MB.');
        setIsProcessing(false);
        return;
      }

      // Read file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        if (!content || content.trim().length === 0) {
          onError('File is empty. Please select a valid schema file.');
          setIsProcessing(false);
          return;
        }

        // Convert to Prisma schema if needed
        const result = await SchemaConverter.convertToPrisma(content, file.name);
        
        if (result.success && result.prismaSchema) {
          setSelectedFile(file);
          onFileSelect(result.prismaSchema, file.name);
        } else {
          onError(result.error || 'Failed to process schema file');
        }
        
        setIsProcessing(false);
      };

      reader.onerror = () => {
        onError('Failed to read file. Please try again.');
        setIsProcessing(false);
      };

      reader.readAsText(file);
    } catch (error) {
      onError(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  }, [onFileSelect, onError]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, [validateAndProcessFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, [validateAndProcessFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const getFileTypeFromName = (fileName: string): SchemaFileType => {
    return SchemaConverter.getFileExtension(fileName) as SchemaFileType;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={SchemaConverter.getSupportedFileTypes()}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
      />

      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-12
            ${isDragging 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`mb-4 transition-transform ${isDragging ? 'scale-110' : ''}`}>
              <Upload className={`w-16 h-16 ${isDragging ? 'text-blue-400' : 'text-gray-500'}`} />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              {isProcessing ? 'Processing file...' : 'Upload Schema File'}
            </h3>
            
            <p className="text-gray-400 mb-4">
              {isDragging 
                ? 'Drop your file here' 
                : 'Drag and drop or click to browse'
              }
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="info">📋 .json</Badge>
              <Badge variant="info">🗄️ .sql</Badge>
              <Badge variant="info">🐘 .psql</Badge>
              <Badge variant="info">⚡ .prisma</Badge>
            </div>
            
            <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-green-600 bg-green-900/20 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FileText className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold mb-1 truncate">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Badge variant="success">
                    {SchemaConverter.getFileTypeIcon(getFileTypeFromName(selectedFile.name))}
                    {' '}
                    {SchemaConverter.getFileTypeDescription(getFileTypeFromName(selectedFile.name))}
                  </Badge>
                  <span>•</span>
                  <span>{(selectedFile.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClearFile();
              }}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

