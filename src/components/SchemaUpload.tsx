import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';
import { Sparkles, Upload, Code2 } from 'lucide-react';
import { CRM_SCHEMA, CRM_SCHEMA_NAME, CRM_SCHEMA_DESCRIPTION, CRM_STATS } from '../data/crmSchema';
import { PMS_SCHEMA, PMS_SCHEMA_NAME, PMS_SCHEMA_DESCRIPTION, PMS_STATS } from '../data/pmsSchema';
import { DMS_SCHEMA, DMS_SCHEMA_NAME, DMS_SCHEMA_DESCRIPTION, DMS_STATS } from '../data/dmsSchema';
import { ERP_SCHEMA, ERP_SCHEMA_NAME, ERP_SCHEMA_DESCRIPTION, ERP_STATS } from '../data/erpSchema';

interface SchemaUploadProps {
  onSchemaLoad: (content: string, name: string) => void;
}

export const SchemaUpload = ({ onSchemaLoad }: SchemaUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'upload'>('demo');

  const handleDemoLoad = (schema: string, name: string) => {
    onSchemaLoad(schema, name);
  };

  const demos = [
    {
      icon: '/logos/salesforce.png',
      schema: CRM_SCHEMA,
      name: CRM_SCHEMA_NAME,
      description: CRM_SCHEMA_DESCRIPTION,
      stats: CRM_STATS,
      features: ['Lead Management', 'Opportunity Tracking', 'Activity Logging', 'Contact Management']
    },
    {
      icon: '/logos/appfolio.png',
      schema: PMS_SCHEMA,
      name: PMS_SCHEMA_NAME,
      description: PMS_SCHEMA_DESCRIPTION,
      stats: PMS_STATS,
      features: ['Property Management', 'Lease Tracking', 'Maintenance Requests', 'Payment Processing']
    },
    {
      icon: '/logos/DocuWareDMS.png',
      schema: DMS_SCHEMA,
      name: DMS_SCHEMA_NAME,
      description: DMS_SCHEMA_DESCRIPTION,
      stats: DMS_STATS,
      features: ['Document Versioning', 'Permission Control', 'Workflow Automation', 'Audit Trails']
    },
    {
      icon: '/logos/odoo.png',
      schema: ERP_SCHEMA,
      name: ERP_SCHEMA_NAME,
      description: ERP_SCHEMA_DESCRIPTION,
      stats: ERP_STATS,
      features: ['Financial Management', 'HR & Payroll', 'Inventory Control', 'Supply Chain']
    }
  ];

  const handleFileLoad = (content: string, fileName: string) => {
    setError(null);
    onSchemaLoad(content, fileName);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="pt-16 min-h-screen bg-[#000a14] text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00527d]/10 via-transparent to-[#001477]/10"></div>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 30% 20%, rgba(0, 82, 125, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0, 20, 119, 0.15) 0%, transparent 50%)'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#00527d] to-[#001477] rounded-full text-sm font-semibold mb-8 shadow-[0_0_30px_rgba(0,82,125,0.3)] hover:shadow-[0_0_40px_rgba(0,82,125,0.5)] transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white tracking-wide">LAZYQUERY SCHEMA VISUALIZER</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-white to-[rgba(255,255,255,0.6)] bg-clip-text text-transparent leading-tight">
            Explore Enterprise<br />Database Schemas
          </h1>
          
          <p className="text-2xl text-[rgba(255,255,255,0.6)] max-w-4xl mx-auto leading-relaxed">
            Experience the power of LazyQuery with real-world enterprise database examples. 
            See how complex systems are visualized with beautiful, interactive UML diagrams.
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
            View Demos
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
        <div className="max-w-7xl mx-auto">
          {activeTab === 'demo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {demos.map((demo, index) => (
                <Card key={index} variant="glass" className="overflow-hidden hover:border-[rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-[1.02]">
                  <div className="bg-gradient-to-br from-[#00527d]/10 to-[#001477]/10 border-b border-[rgba(255,255,255,0.1)]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <img 
                          src={demo.icon} 
                          alt={`${demo.name} logo`}
                          className="w-14 h-14 object-contain"
                        />
                        <span className="text-xl">{demo.name}</span>
                      </CardTitle>
                      <CardDescription className="text-base mt-3 leading-relaxed">
                        {demo.description}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-5">
                      {/* Schema Statistics */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-[rgba(0,82,125,0.03)] backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.1)]">
                        <div className="text-center">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[#00527d] to-[#001477] bg-clip-text text-transparent mb-1">
                            {demo.stats.models}
                          </div>
                          <div className="text-xs text-[rgba(255,255,255,0.6)] font-medium">Models</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[#001477] to-[#004268] bg-clip-text text-transparent mb-1">
                            {demo.stats.enums}
                          </div>
                          <div className="text-xs text-[rgba(255,255,255,0.6)] font-medium">Enums</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[#4da7ca] to-[#00527d] bg-clip-text text-transparent mb-1">
                            {demo.stats.relations}
                          </div>
                          <div className="text-xs text-[rgba(255,255,255,0.6)] font-medium">Relations</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-1 gap-2">
                        {demo.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-sm text-white">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => handleDemoLoad(demo.schema, demo.name)}
                        className="w-full mt-4 text-base"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        View Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="relative">
              <Card variant="glass" className="overflow-hidden hover:border-[rgba(255,255,255,0.25)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Upload className="w-8 h-8 text-[#00527d]" />
                      <span>Upload Your Schema</span>
                    </CardTitle>
                    <CardDescription className="text-xl">
                      Support for multiple formats: Prisma, SQL, PostgreSQL, and JSON schema files
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <FileUpload onFileSelect={handleFileLoad} onError={handleError} />

                    {/* Supported Formats Info */}
                    <div className="mt-10 p-8 bg-[rgba(0,82,125,0.03)] backdrop-blur-sm rounded-2xl border border-[rgba(255,255,255,0.1)]">
                      <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <Code2 className="w-6 h-6 text-[#00527d]" />
                        Supported Formats
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-[rgba(0,82,125,0.02)] hover:bg-[rgba(0,82,125,0.05)] transition-all">
                          <div className="font-semibold text-[#00527d] mb-2 text-base">⚡ Prisma (.prisma)</div>
                          <p className="text-[rgba(255,255,255,0.6)] text-sm">Native Prisma schema files</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[rgba(0,82,125,0.02)] hover:bg-[rgba(0,82,125,0.05)] transition-all">
                          <div className="font-semibold text-[#4da7ca] mb-2 text-base">🗄️ SQL (.sql)</div>
                          <p className="text-[rgba(255,255,255,0.6)] text-sm">Standard SQL DDL statements</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[rgba(0,82,125,0.02)] hover:bg-[rgba(0,82,125,0.05)] transition-all">
                          <div className="font-semibold text-[#001477] mb-2 text-base">🐘 PostgreSQL (.psql)</div>
                          <p className="text-[rgba(255,255,255,0.6)] text-sm">PostgreSQL-specific schemas</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[rgba(0,82,125,0.02)] hover:bg-[rgba(0,82,125,0.05)] transition-all">
                          <div className="font-semibold text-[#268ebb] mb-2 text-base">📋 JSON (.json)</div>
                          <p className="text-[rgba(255,255,255,0.6)] text-sm">JSON schema definitions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 backdrop-blur-[8px] bg-[rgba(0,0,0,0.5)] rounded-3xl flex items-center justify-center z-10">
                  <div className="text-center px-8 py-12 max-w-2xl">
                    <div className="mb-6">
                      <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#00527d] to-[#001477] rounded-full mb-6">
                        <span className="text-white font-bold text-lg tracking-wide">COMING SOON</span>
                      </div>
                    </div>
                    <h3 className="text-5xl font-bold text-white mb-6 leading-tight">
                      Upload Feature
                    </h3>
                    <p className="text-2xl text-[rgba(255,255,255,0.6)] leading-relaxed mb-8">
                    Upload functionality will be available soon. For now, explore our demo databases to see LazyQuery in action!
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setActiveTab('demo')}
                    className="text-lg px-8 py-4"
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Explore Demo Databases
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-[rgba(255,255,255,0.1)] text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-base text-[rgba(255,255,255,0.4)]">
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

