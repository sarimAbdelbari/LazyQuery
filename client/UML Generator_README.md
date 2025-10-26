#  Schema Visualizer

## ✨ What We Just Built

A **Cytoscape.js-powered** Prisma schema visualizer with:
- 📊 Interactive graph visualization of database models
- 🔗 Relationship and foreign key mapping
- 📁 Modular schema organization
- 📤 File upload support for custom schemas

---

## 🚀 How to Test

### 1. Start the Development Server

```bash
cd client
npm run dev
```

Visit: `http://localhost:5173`

### 2. Test Options

#### Option A: Use Pre-Built Modules
- Click on **"📦 Stock (Inventory)"** module
- This has a complete sample schema with:
  - Products, Categories, Suppliers
  - Stock Movements, Purchase Orders
  - Foreign key relationships

#### Option B: Upload a Schema File
1. Click **"📤 Upload Custom Schema"**
2. Upload the test schema from `client/public/test-schema.prisma`
3. Or upload your own `.prisma` file

#### Option C: Add Your Own Module
1. Go to `client/src/database Modules/[module-name]/`
2. Add your Prisma schema to `schema.prisma`
3. Reload and select the module

---

## 🎨 Features Implemented

### ✅ Prisma Parser (`utils/prismaParser.js`)
- Parses Prisma schema syntax
- Extracts models, fields, attributes
- Identifies `@relation` foreign keys
- Converts to Cytoscape.js format

### ✅ Schema Visualizer (`components/SchemaVisualizer.jsx`)
- Cytoscape.js graph rendering
- Interactive nodes (models) and edges (relations)
- Click nodes → See field details in console
- Click edges → See foreign key info in console
- Zoom, pan, fit-to-view controls

### ✅ Module Selector (`components/ModuleSelector.jsx`)
- Beautiful module cards
- File upload support
- Multiple module support:
  - 🛒 Achat (Purchase)
  - 💰 Finance
  - 🏭 Production
  - 📦 Stock (Inventory)

---

## 🎯 What's Next?

### Immediate Enhancements
1. **Field Details Panel** - Show fields in UI instead of console
2. **Better Layouts** - Try different Cytoscape layouts (cose, dagre)
3. **Foreign Key Highlighting** - Visual indicators for FK fields
4. **Export Diagrams** - Save as PNG/SVG

### Phase 2 Features
1. **Local AI Integration** (Ollama)
2. **Text-to-SQL Interface**
3. **Query Execution**
4. **Multi-module Visualization** (combine schemas)

---

## 🔧 Current Architecture

```
client/
├── src/
│   ├── components/
│   │   ├── SchemaVisualizer.jsx    # Cytoscape diagram
│   │   ├── SchemaVisualizer.css
│   │   ├── ModuleSelector.jsx      # Module picker
│   │   └── ModuleSelector.css
│   ├── utils/
│   │   └── prismaParser.js         # Schema parser
│   ├── database Modules/
│   │   ├── stock/schema.prisma     # ✅ Has test data
│   │   ├── achat/schema.prisma     # Empty
│   │   ├── finance/schema.prisma   # Empty
│   │   └── production/schema.prisma # Empty
│   ├── App.jsx                     # Main app logic
│   └── main.jsx
└── public/
    └── test-schema.prisma          # Sample for upload
```

---

## 🐛 Known Issues / Limitations

1. **File Loading**: Schema files in `src/database Modules/` may not load in production build
   - **Fix**: Move to `public/schemas/` or use backend API
   
2. **No Field Panel Yet**: Click events only log to console
   - **Next**: Add a details sidebar

3. **Basic Layout**: Using `breadthfirst` layout
   - **Next**: Experiment with `cose`, `dagre`, or `cola` for better ERD layouts

---

## 💡 Tips for Testing

- Open **DevTools Console** to see click events
- Try **clicking nodes** to see model details
- Try **clicking edges** to see relation info
- Use **Fit to View** button if graph is off-screen
- Test with **different schema sizes**

---

## 🎨 Cytoscape.js Customization

Current style highlights:
- **Blue nodes** for models
- **Red selection** highlight
- **Arrows** show relationship direction
- **Labels** show relation field names

Edit in `SchemaVisualizer.jsx` → `stylesheet` array

---

## 🔥 Quick Start Checklist

- [ ] Run `npm run dev`
- [ ] Click "Stock" module
- [ ] See interactive diagram
- [ ] Click a node (check console)
- [ ] Click an edge (check console)
- [ ] Try uploading `public/test-schema.prisma`
- [ ] Zoom and pan the diagram

**You're all set!** 🚀

