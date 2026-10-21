# ARCHITECTURE.md
> System structure, data flow, and the reasoning behind key design choices.
> This is the "how it works" document. For "why we built it this way", see DECISIONS.md.
> Behavior details live in APPLOGIC.md.

---

## High-Level Overview

LazyQuery is one Vite app. The browser holds the schema, parses it, and draws it. There is no API process and no database.

```
[Browser]
   │
   ├─ /                         HomePage → SchemaUpload
   │                               demo schema string
   │                               history.state { schemaContent, moduleName }
   │
   ├─ /mode-selection/:demoId   ModeSelectionPage
   │                               PrismaParser.parse
   │                               SchemaProvider (in-memory)
   │
   └─ /visualizer               VisualizerPage
                                   SettingsProvider + ThemeProvider
                                   ReactFlowProvider
                                   SchemaVisualizer
                                      ├─ TableFieldSelector
                                      ├─ ModelNode / EnumNode
                                      ├─ RelationLegend
                                      ├─ SettingsPanel
                                      └─ useGraph → dagre layout
                                                     html-to-image PNG
```

---

## Folder Structure

```
/
├── docs/                  product and session docs
├── public/logos/          demo card images
├── src/
│   ├── pages/             one screen per route
│   ├── layouts/           NavigationBar
│   ├── components/        upload, diagram, nodes, ui kit
│   ├── parsers/           Prisma regex parser and SQL/JSON converters
│   ├── data/              bundled Prisma schema strings
│   ├── lib/
│   │   ├── hooks/         schema context and React Flow graph hook
│   │   ├── contexts/      diagram settings and color theme
│   │   ├── types/         Model, Enum, routes
│   │   └── utils/         dagre layout, PNG capture, minimap colors
│   ├── App.tsx
│   └── main.tsx
├── index.html             title: LazyQuery UML Generator
├── vite.config.ts         dev server port 5173
└── package.json           name: UML_Generator
```

---

## Data Flow

### Opening a demo

1. `SchemaUpload` holds four schema strings imported from `src/data/`.
2. "View Demo" calls `HomePage.handleSchemaLoad(content, name)`.
3. The name is matched with `includes('CRM' | 'PMS' | 'DMS' | 'ERP')` to build `/mode-selection/:demoId`. The id is not used to reload the schema later.
4. The Prisma text travels in `location.state`, not in the URL and not in storage.

### Visualize

1. `ModeSelectionPage` calls `PrismaParser.parse`.
2. The result is `setSchemaData(models, enums, connections, moduleName)`.
3. `/visualizer` reads that context. Empty models and empty enums together redirect to `/`.
4. `SchemaVisualizer` keeps UI filters locally, builds React Flow nodes and edges, and `useGraph` runs dagre.

### Leaving the diagram

"Back to Modules" clears context and goes to `/`. A reload also clears context, because it lives in `useState`.

### Auth Flow

There is no auth flow.

### Upload flow (not on the live path)

`FileUpload` → `SchemaConverter.convertToPrisma` → Prisma text → the same `onSchemaLoad` callback as a demo. The home upload tab paints a full-card overlay on top of this UI.

---

## Key Modules / Layers

### SchemaProvider

- **Purpose:** Share one parsed schema across routes.
- **Inputs:** `setSchemaData(models, enums, connections, moduleName)` and `clearSchemaData()`.
- **Outputs:** Those four values via `useSchemaContext()`.
- **Dependencies:** React context only.
- **Notes:** Provider is above the router, so it survives navigation and dies on refresh.

### PrismaParser

- **Purpose:** Turn a Prisma schema string into models, enums, and connections.
- **Inputs:** Raw schema text.
- **Outputs:** The types in `src/lib/types/schema.ts`.
- **Dependencies:** None. Regex only.
- **Notes:** See APPLOGIC section 4.4 for relation classification and the limits of the regex.

### SchemaConverter

- **Purpose:** Normalize `.prisma`, `.sql`, `.psql`, and `.json` into Prisma text, then validate with `PrismaParser`.
- **Inputs:** File text and file name.
- **Outputs:** `{ success, prismaSchema?, error?, fileType? }`.
- **Dependencies:** `SqlToPrismaConverter`, `JsonToPrismaConverter`, `PrismaParser`.
- **Notes:** Only `FileUpload` calls it. That component is covered on the home screen.

### SchemaVisualizer + useGraph

- **Purpose:** Filter the schema and render the diagram.
- **Inputs:** `models`, `connections`, `enums`, plus `DiagramSettings`.
- **Outputs:** React Flow nodes and edges. PNG download as a side effect.
- **Dependencies:** `@xyflow/react`, `getLayoutedElements`, `screenshot`.
- **Notes:** Default visible set is the first five names after an A–Z sort. `showMinimap` is unused; the minimap is always on.

### SettingsProvider

- **Purpose:** Layout direction, background, field display, and theme colors for the current visualizer visit.
- **Inputs:** `updateSetting`, `updateTheme`, `resetSettings`.
- **Outputs:** `DiagramSettings`.
- **Dependencies:** None.
- **Notes:** Mounted only under `VisualizerPage`. Values reset when the user leaves the page. `resetSettings` has no button.

---

## State Management

| State | Where | Lifetime |
|-------|--------|----------|
| Parsed schema and module name | `SchemaProvider` | Until clear, unmount, or refresh |
| Selected tables, highlight, expansion, relation toggles | `SchemaVisualizer` | While the visualizer is mounted |
| Node positions and edges | `useGraph` (`useNodesState` / `useEdgesState`) | Recomputed by dagre when inputs or direction change. User-dragged positions are replaced on the next layout. |
| Diagram settings | `SettingsProvider` | Visualizer visit only |
| Theme | `ThemeProvider` | Fixed to dark by `VisualizerPage` |
| Chosen file | `FileUpload` local state | Unused while the overlay is up |

---

## External Services

| Service | Purpose | Failure Behavior |
|---------|---------|-----------------|
| None at runtime | The app does not call an API | Not applicable |

Nav links open `https://docs.lazyquery.com` and `https://github.com/lazyquery` in a new tab. Those are static anchors, not app dependencies.

---

## Known Limitations

- DMS demo schema string is empty, so that card cannot open a diagram.
- Deep-linking `/mode-selection/:demoId` or `/visualizer` after a refresh has no schema.
- Parser is not a Prisma parser. First `}` closes a block. Enum-typed fields are treated as relations.
- SQL conversion ignores inline `REFERENCES` and does not emit the reverse side of a relation.
- Layout uses a fixed 250×400 node box, so large models overlap or leave gaps.
- `cytoscape`, `react-cytoscapejs`, and `@prisma/internals` are dependencies with no `src/` imports.
- `README.md` describes a previous project shape.

---

Last updated: 2026-10-21
