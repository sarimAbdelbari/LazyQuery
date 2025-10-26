# 🚀 LazyQuery

<div align="center">

![LazyQuery Banner](https://img.shields.io/badge/LazyQuery-Schema%20Visualizer-667eea?style=for-the-badge)

**Transform your database schemas into beautiful, interactive UML diagrams**

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-12.3.4-ff0072?style=flat)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06b6d4?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🎨 **Premium Design**
- **Luro AI-Inspired Interface** - Deep dark backgrounds with smooth gradients
- **Glassmorphism Effects** - Modern backdrop blur and transparency
- **Smooth Animations** - Buttery transitions and hover effects
- **Responsive Layout** - Works seamlessly on all screen sizes

### 📊 **Powerful Visualization**
- **Interactive ERD Diagrams** - Drag, zoom, and explore your schema
- **Relationship Mapping** - Visual representation of table relationships
- **Color-Coded Relations** - Different colors for 1:1, 1:N, N:1, and M:N relationships
- **Field Highlighting** - Quick search and locate specific fields
- **Table Filtering** - Select which tables to display

### 🔧 **Schema Support**
- ⚡ **Prisma** (.prisma) - Native Prisma schema files
- 🗄️ **SQL** (.sql) - Standard SQL DDL statements
- 🐘 **PostgreSQL** (.psql) - PostgreSQL-specific schemas
- 📋 **JSON** (.json) - JSON schema definitions

### 🎯 **Smart Features**
- **Field Search** - Search across all fields with `Ctrl+K`
- **Table Selection** - Choose specific tables to visualize
- **Enum Support** - Display and navigate enum types
- **Export Diagrams** - Download your visualizations
- **Minimap** - Navigate large schemas easily
- **Settings Panel** - Customize colors and layout

---

## 🎬 Demo

### Schema Upload
Beautiful file upload interface with drag-and-drop support for all schema formats.

### Interactive Visualization
Explore your database schema with an intuitive, interactive diagram that shows:
- ✅ All tables and their fields
- ✅ Primary keys, foreign keys, and relationships
- ✅ Data types and constraints
- ✅ Enum types and their values

### Field Search
Instantly find any field across your entire schema with the powerful search feature.

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sarimAbdelbari/LazyQuery
   cd LazyQuery
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to 
   ```

---

## 📖 Usage

### 1. Upload Your Schema

Choose between two options:

**Option A: Try the Demo**
- Click "Try Demo" to explore a pre-loaded e-commerce schema
- Includes 12 models, 5 enums, and 24 relationships

**Option B: Upload Your Own**
- Click "Upload Schema"
- Drag and drop your schema file or click to browse
- Supported formats: `.prisma`, `.sql`, `.psql`, `.json`

### 2. Explore Your Schema

Once loaded, you can:

- **Zoom & Pan** - Use mouse wheel to zoom, click and drag to pan
- **Search Fields** - Press `Ctrl+K` or click the search bar
- **Filter Tables** - Click "Tables (x/y)" to select specific tables
- **Toggle Relations** - Use the legend to show/hide relationship types
- **Adjust Layout** - Open settings panel (⚙️) to customize direction and theme
- **Export Diagram** - Click the download button to save as image

### 3. Customize Your View

**Settings Panel** (Top right corner)
- Change layout direction (TB, LR, BT, RL)
- Toggle minimap, background, field types, and icons
- Customize theme colors for models and enums

**Relationship Legend** (Bottom right corner)
- Toggle visibility of different relationship types
- One-to-Many (1:N) - Green
- Many-to-One (N:1) - Orange
- Many-to-Many (M:N) - Cyan
- One-to-One (1:1) - Purple

---

## 🏗️ Tech Stack

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript** - Type safety and better DX
- **Vite** - Lightning-fast build tool

### Visualization
- **React Flow 12.3.4** - Interactive node-based diagrams
- **Dagre** - Automatic graph layout

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Custom CSS Variables** - Theme customization
- **Lucide React** - Beautiful icon set

### State Management
- **React Context API** - Settings and theme management
- **React Hooks** - Local state management

### Schema Parsing
- **Custom Parsers** - Support for multiple schema formats
- **Schema Converters** - Convert SQL/JSON to Prisma format

---

## 📁 Project Structure

```
LazyQuery/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── EnumNode.tsx     # Enum visualization
│   │   │   ├── ModelNode.tsx    # Table visualization
│   │   │   ├── SchemaVisualizer.tsx
│   │   │   ├── SchemaUpload.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FieldSearch.tsx
│   │   │   ├── TableSelector.tsx
│   │   │   └── RelationLegend.tsx
│   │   ├── lib/
│   │   │   ├── contexts/        # React contexts
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── types/           # TypeScript types
│   │   │   └── utils/           # Utility functions
│   │   ├── parsers/             # Schema parsers
│   │   ├── data/                # Demo data
│   │   ├── services/            # API services
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🎨 Design System

### Color Palette (Luro AI Inspired)

**Primary Colors**
- Purple Blue: `#667eea`
- Deep Purple: `#764ba2`
- Cyan: `#06b6d4`
- Light Blue: `#3b82f6`

**Backgrounds**
- Primary: `#0a0a0a`
- Secondary: `#111111`
- Tertiary: `#1a1a1a`

**Glassmorphism**
- Semi-transparent backgrounds with backdrop blur
- Subtle borders with rgba opacity
- Soft shadows for depth

---

## 🔧 Configuration

### Custom Theme

Edit `client/src/lib/contexts/settings.tsx` to customize default colors:

```typescript
export const DEFAULT_SETTINGS: DiagramSettings = {
  theme: {
    primaryColor: '#667eea',    // Model header start color
    secondaryColor: '#764ba2',  // Model header end color
    enumColor: '#06b6d4',       // Enum header color
    titleColor: '#ffffff',      // Text color
    backgroundColor: '#0a0a0a', // Canvas background
  },
};
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Use TypeScript for type safety
- Write clean, self-documenting code
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 Schema Format Examples

### Prisma Schema (.prisma)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### SQL Schema (.sql)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id INTEGER REFERENCES users(id)
);
```

---

## 📊 Supported Relationship Types

| Type | Symbol | Color | Description |
|------|--------|-------|-------------|
| One-to-Many | 1:N | 🟢 Green | One record relates to many |
| Many-to-One | N:1 | 🟠 Orange | Many records relate to one |
| Many-to-Many | M:N | 🔵 Cyan | Many to many relationship |
| One-to-One | 1:1 | 🟣 Purple | One record relates to one |

---

## 🐛 Troubleshooting

### Schema not parsing correctly?
- Ensure your schema file is valid
- Check for syntax errors
- Try converting to Prisma format first

### Diagram not displaying?
- Refresh the page
- Check browser console for errors
- Try selecting fewer tables

### Performance issues?
- Reduce the number of visible tables
- Disable minimap for large schemas
- Use Chrome for best performance

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspired by [Luro AI](https://luro-ai.vercel.app/)
- Built with [React Flow](https://reactflow.dev/)
- Icons from [Lucide](https://lucide.dev/)
- UI components powered by [Tailwind CSS](https://tailwindcss.com/)

---

## 📧 Contact

Project Link: [https://github.com/sarimAbdelbari/LazyQuery](https://github.com/sarimAbdelbari/LazyQuery)

---

<div align="center">

**Made with ❤️ by the LazyQuery Team**

⭐ Star us on GitHub if you find this useful!

</div>
