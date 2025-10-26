// import { useState } from 'react';

interface ModuleSelectorProps {
  onSchemaLoad: (content: string, name: string) => void;
}

export const ModuleSelector = ({ onSchemaLoad }: ModuleSelectorProps) => {
  // const [uploadedSchema, setUploadedSchema] = useState<string | null>(null);

  const modules = [
    { id:'testSTPM', name: 'TestSTPM', icon: '📦', description: 'Visualize and explore your article database schema' },
    { id:'achats', name: 'Achats', icon: '🛒', description: 'Visualize and explore your purchase management database schema' },
    // { id:'tiers', name: 'Tiers', icon: '👥', description: 'Visualize and explore your tiers database schema' },
    // { id: 'stock', name: 'Stock', icon: '📦', description: 'Map out your inventory control database architecture' },
    // { id: 'ventes', name: 'Ventes', icon: '💰', description: 'Visualize and explore your sales management database schema' },
    // { id: 'production', name: 'Production', icon: '🏭', description: 'Visualize and explore your production management database schema' },
    // { id:'ComptabiliteGenerale', name: 'Comptabilité Générale', icon: '💰', description: 'Visualize and explore your comptabilité générale database schema' },
    // { id:'ComptabiliteTiers', name: 'Comptabilité Tiers', icon: '💰', description: 'Visualize and explore your comptabilité tiers database schema' },
    // { id: 'GrandDb', name: 'Gestion Moyen', icon: '💰', description: 'Visualize and explore your gestion moyen database schema' },
  ];

  const handleModuleClick = async (module: typeof modules[0]) => {
    try {
      const schemaModule = await import(`../database Modules/${module.id}/schema.prisma?raw`);
      const schemaContent = schemaModule.default;

      if (schemaContent && schemaContent.trim()) {
        onSchemaLoad(schemaContent, module.name);
      } else {
        alert(`⚠️ The ${module.name} schema file is empty.`);
      }
    } catch (error) {
      console.error('Error loading module schema:', error);
      alert(`❌ Could not load ${module.name} schema.`);
    }
  };

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file && file.name.endsWith('.prisma')) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const content = e.target?.result as string;
  //       setUploadedSchema(file.name);
  //       onSchemaLoad(content, file.name);
  //     };
  //     reader.readAsText(file);
  //   } else {
  //     alert('⚠️ Please upload a .prisma file');
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center gap-11 ">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6">
            UML Generator
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Visualize your database schemas
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your Prisma schemas into interactive UML diagrams. Choose a module to explore or upload your own schema file.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module)}
              className="text-left p-8 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all"
            >
              <div className="text-4xl mb-4">{module.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{module.name}</h3>
              <p className="text-gray-400 leading-relaxed">{module.description}</p>
            </button>
          ))}
        </div>

        {/* Upload Section */}
        {/* <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Upload Custom Schema</h2>
            <p className="text-gray-400">Have your own Prisma schema? Upload it here</p>
          </div>

          <label htmlFor="schema-upload" className="block cursor-pointer">
            <div className="p-12 bg-gray-900 border border-gray-800 border-dashed rounded-xl text-center hover:border-gray-700 transition-all">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-2">Click to upload or drag and drop</h3>
              <p className="text-gray-400 text-sm">Prisma schema files (.prisma) only</p>
            </div>
            <input
              id="schema-upload"
              type="file"
              accept=".prisma"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadedSchema && (
            <div className="mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-400">Schema loaded successfully</p>
                  <p className="text-gray-400 text-sm">{uploadedSchema}</p>
                </div>
              </div>
            </div>
          )}
        </div> */}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-6">
            <span>🔒 100% Offline & Secure</span>
            <span>•</span>
            <span>⚡ Powered by React Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

