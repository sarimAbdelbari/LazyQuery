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
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/10 via-transparent to-[#764ba2]/10"></div>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full text-sm font-semibold mb-8 shadow-[0_0_30px_rgba(102,126,234,0.3)] hover:shadow-[0_0_40px_rgba(102,126,234,0.5)] transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white tracking-wide">LAZYQUERY SCHEMA VISUALIZER</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-white to-[#a1a1aa] bg-clip-text text-transparent leading-tight">
            Visualize Your Database<br />Schema
          </h1>
          
          <p className="text-2xl text-[#a1a1aa] max-w-4xl mx-auto leading-relaxed">
            Transform your database schemas into beautiful, interactive UML diagrams. 
            Support for Prisma, SQL, PostgreSQL, and JSON formats.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-10 max-w-3xl mx-auto">
            <Alert variant="error">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-12">
          <Button
            variant={activeTab === 'demo' ? 'primary' : 'default'}
            onClick={() => setActiveTab('demo')}
            className="flex items-center gap-3 text-lg"
            size="lg"
          >
            <Sparkles className="w-5 h-5" />
            Try Demo
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'default'}
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-3 text-lg"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            Upload Schema
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'demo' && (
            <Card variant="glass" className="overflow-hidden hover:border-[rgba(255,255,255,0.25)]">
              <div className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 border-b border-[rgba(255,255,255,0.1)]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-5xl">🛒</span>
                        <span>{DEMO_SCHEMA_NAME}</span>
                      </CardTitle>
                      <CardDescription className="text-xl mt-4">
                        {DEMO_SCHEMA_DESCRIPTION}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Schema Statistics */}
                  <div className="grid grid-cols-3 gap-6 p-6 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">12</div>
                      <div className="text-sm text-[#a1a1aa] font-medium">Models</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#764ba2] to-[#ec4899] bg-clip-text text-transparent mb-2">5</div>
                      <div className="text-sm text-[#a1a1aa] font-medium">Enums</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent mb-2">24</div>
                      <div className="text-sm text-[#a1a1aa] font-medium">Relations</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-base text-white">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                      <span>User Management</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-white">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                      <span>Product Catalog</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-white">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                      <span>Shopping Cart</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-white">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                      <span>Order Management</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-white">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                      <span>Payment Processing</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-white">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">✓</span>
                      <span>Reviews & Ratings</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleDemoLoad}
                    className="w-full mt-6 text-lg py-4"
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Visualize Demo Schema
                  </Button>

                  {/* Info */}
                  <p className="text-base text-[#71717a] text-center leading-relaxed">
                    Explore a complete e-commerce database with all relationships and constraints
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'upload' && (
            <Card variant="glass" className="overflow-hidden hover:border-[rgba(255,255,255,0.25)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-[#667eea]" />
                  <span>Upload Your Schema</span>
                </CardTitle>
                <CardDescription className="text-xl">
                  Support for multiple formats: Prisma, SQL, PostgreSQL, and JSON schema files
                </CardDescription>
              </CardHeader>

              <CardContent>
                <FileUpload onFileSelect={handleFileLoad} onError={handleError} />

                {/* Supported Formats Info */}
                <div className="mt-10 p-8 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.1)]">
                  <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-[#667eea]" />
                    Supported Formats
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                      <div className="font-semibold text-[#667eea] mb-2 text-base">⚡ Prisma (.prisma)</div>
                      <p className="text-[#a1a1aa] text-sm">Native Prisma schema files</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                      <div className="font-semibold text-[#06b6d4] mb-2 text-base">🗄️ SQL (.sql)</div>
                      <p className="text-[#a1a1aa] text-sm">Standard SQL DDL statements</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                      <div className="font-semibold text-[#764ba2] mb-2 text-base">🐘 PostgreSQL (.psql)</div>
                      <p className="text-[#a1a1aa] text-sm">PostgreSQL-specific schemas</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                      <div className="font-semibold text-[#3b82f6] mb-2 text-base">📋 JSON (.json)</div>
                      <p className="text-[#a1a1aa] text-sm">JSON schema definitions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-[rgba(255,255,255,0.1)] text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-base text-[#71717a]">
            <div className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-medium">100% Offline & Secure</span>
            </div>
            <span className="text-[rgba(255,255,255,0.2)]">•</span>
            <div className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-xl">⚡</span>
              <span className="font-medium">Powered by React Flow</span>
            </div>
            <span className="text-[rgba(255,255,255,0.2)]">•</span>
            <div className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-xl">🎨</span>
              <span className="font-medium">Interactive Visualization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

