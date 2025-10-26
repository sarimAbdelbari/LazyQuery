import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';
import { Sparkles, Upload, Code2 } from 'lucide-react';
import { DEMO_SCHEMA, DEMO_SCHEMA_NAME, DEMO_SCHEMA_DESCRIPTION } from '../data/demoSchema';

interface SchemaUploadProps {
  onSchemaLoad: (content: string, name: string) => void;
}

export const SchemaUpload = ({ onSchemaLoad }: SchemaUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'upload'>('demo');

  const handleDemoLoad = () => {
    onSchemaLoad(DEMO_SCHEMA, DEMO_SCHEMA_NAME);
  };

  const handleFileLoad = (content: string, fileName: string) => {
    setError(null);
    onSchemaLoad(content, fileName);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">LazyQuery Schema Visualizer</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Visualize Your Database Schema
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your database schemas into beautiful, interactive UML diagrams. 
            Support for Prisma, SQL, PostgreSQL, and JSON formats.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Alert variant="error">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === 'demo' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('demo')}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Try Demo
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Schema
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'demo' && (
            <Card variant="elevated" className="overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-b border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-3xl">🛒</span>
                        {DEMO_SCHEMA_NAME}
                      </CardTitle>
                      <CardDescription className="text-base mt-3">
                        {DEMO_SCHEMA_DESCRIPTION}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Schema Statistics */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">12</div>
                      <div className="text-xs text-gray-400 mt-1">Models</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">5</div>
                      <div className="text-xs text-gray-400 mt-1">Enums</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">24</div>
                      <div className="text-xs text-gray-400 mt-1">Relations</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>User Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Product Catalog</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Shopping Cart</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Order Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Payment Processing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Reviews & Ratings</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleDemoLoad}
                    className="w-full mt-4"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Visualize Demo Schema
                  </Button>

                  {/* Info */}
                  <p className="text-xs text-gray-500 text-center">
                    Explore a complete e-commerce database with all relationships and constraints
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'upload' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  Upload Your Schema
                </CardTitle>
                <CardDescription className="text-base">
                  Support for multiple formats: Prisma, SQL, PostgreSQL, and JSON schema files
                </CardDescription>
              </CardHeader>

              <CardContent>
                <FileUpload onFileSelect={handleFileLoad} onError={handleError} />

                {/* Supported Formats Info */}
                <div className="mt-8 p-6 bg-gray-800/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Supported Formats
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-400 mb-1">⚡ Prisma (.prisma)</div>
                      <p className="text-gray-400 text-xs">Native Prisma schema files</p>
                    </div>
                    <div>
                      <div className="font-medium text-blue-400 mb-1">🗄️ SQL (.sql)</div>
                      <p className="text-gray-400 text-xs">Standard SQL DDL statements</p>
                    </div>
                    <div>
                      <div className="font-medium text-blue-400 mb-1">🐘 PostgreSQL (.psql)</div>
                      <p className="text-gray-400 text-xs">PostgreSQL-specific schemas</p>
                    </div>
                    <div>
                      <div className="font-medium text-blue-400 mb-1">📋 JSON (.json)</div>
                      <p className="text-gray-400 text-xs">JSON schema definitions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>100% Offline & Secure</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Powered by React Flow</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>🎨</span>
              <span>Interactive Visualization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

