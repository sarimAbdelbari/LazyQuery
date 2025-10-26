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
            relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-16
            ${isDragging 
              ? 'border-[#667eea] bg-[rgba(102,126,234,0.1)] shadow-[0_0_40px_rgba(102,126,234,0.3)]' 
              : 'border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.02)]'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgba(255,255,255,0.04)]'}
          `}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`mb-6 transition-all duration-300 ${isDragging ? 'scale-110 rotate-12' : ''}`}>
              <Upload className={`w-20 h-20 ${isDragging ? 'text-[#667eea]' : 'text-[#a1a1aa]'}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              {isProcessing ? 'Processing file...' : 'Upload Schema File'}
            </h3>
            
            <p className="text-[#a1a1aa] mb-6 text-lg">
              {isDragging 
                ? 'Drop your file here' 
                : 'Drag and drop or click to browse'
              }
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Badge variant="info">📋 .json</Badge>
              <Badge variant="info">🗄️ .sql</Badge>
              <Badge variant="info">🐘 .psql</Badge>
              <Badge variant="gradient">⚡ .prisma</Badge>
            </div>
            
            <p className="text-sm text-[#71717a]">Maximum file size: 10MB</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-emerald-500/50 bg-[rgba(16,185,129,0.1)] backdrop-blur-md p-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <FileText className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold mb-2 truncate text-lg">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-3 text-base">
                  <Badge variant="success">
                    {SchemaConverter.getFileTypeIcon(getFileTypeFromName(selectedFile.name))}
                    {' '}
                    {SchemaConverter.getFileTypeDescription(getFileTypeFromName(selectedFile.name))}
                  </Badge>
                  <span className="text-[#a1a1aa]">•</span>
                  <span className="text-[#a1a1aa] font-medium">{(selectedFile.size / 1024).toFixed(2)} KB</span>
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
              className="flex-shrink-0 hover:bg-[rgba(255,255,255,0.1)]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

