# Complete Reverse Engineering

This document is the source of truth for how the current app behaves. It was produced by reading the codebase. Marketing copy in `README.md` is older and is not authoritative.

The npm package name is `UML_Generator`. The product name in the UI is LazyQuery. The browser title is "LazyQuery UML Generator".

---

## 1. What this product is

A single-page app with three routes:

| Route | Screen | What the user can do |
|-------|--------|----------------------|
| `/` | Home | Pick one of four demo schemas, or open the upload tab |
| `/mode-selection/:demoId` | Mode choice | Visualize the schema that was passed in navigation state, or see the disabled AI card |
| `/visualizer` | Diagram | Explore the parsed schema. Empty state redirects to `/` |

There is no backend. A chosen schema is a string in memory. Choosing Visualize Schema parses that string into models, enums, and connections, stores them in React context, and draws them with React Flow.

Two advertised capabilities are blocked in the UI:

- **Upload Schema** (`SchemaUpload`, upload tab) renders `FileUpload`, then covers it with a "COMING SOON" overlay. The overlay's only action switches back to the demo tab.
- **Talk to Your Database** (`ModeSelectionPage`) is a card covered by a "COMING SOON / AI Chat Feature" overlay. It has no click handler.

---

## 2. Tech stack (current)

From `package.json`, as of 2026-10-21:

| Layer | Package | Used by the app |
|-------|---------|-----------------|
| UI | `react` 19, `react-dom` 19 | Yes |
| Routing | `react-router-dom` 7 | Yes |
| Build | `vite` 7, `@vitejs/plugin-react` | Yes. Dev server port 5173 |
| Style | `tailwindcss` 4, `@tailwindcss/postcss` | Yes |
| Diagram | `@xyflow/react` 12 | Yes |
| Layout | `@dagrejs/dagre` | Yes, via `src/lib/utils/layout-utils.ts` |
| PNG export | `html-to-image` | Yes, via `src/lib/utils/screenshot.ts` |
| Icons | `lucide-react` | Yes |
| Equality checks | `fast-deep-equal` | Yes, in `useGraph` |
| Color UI | `react-colorful` | Yes, settings color pickers |
| Graph (unused) | `cytoscape`, `react-cytoscapejs` | No imports under `src/` |
| Prisma (unused) | `@prisma/internals` | No imports under `src/` |

---

## 3. Package map

```
src/
├── main.tsx                 mounts <App> in StrictMode
├── App.tsx                  BrowserRouter + SchemaProvider + 3 routes
├── pages/
│   ├── HomePage.tsx         nav + SchemaUpload; maps a module name to a demo id
│   ├── ModeSelectionPage.tsx  parses Prisma text, writes context, goes to /visualizer
│   └── VisualizerPage.tsx   full-screen diagram; clears context on "Back to Modules"
├── layouts/NavigationBar.tsx
├── components/
│   ├── SchemaUpload.tsx     demo grid + blocked upload tab
│   ├── FileUpload.tsx       drag/drop, 10MB cap, calls SchemaConverter (unreachable)
│   ├── SchemaVisualizer.tsx selection, edges, React Flow canvas
│   ├── ModelNode.tsx        table card
│   ├── EnumNode.tsx         enum card
│   ├── TableFieldSelector.tsx  table checklist + field search (Ctrl/Cmd+K)
│   ├── RelationLegend.tsx   show/hide the four relationship types
│   ├── SettingsPanel.tsx    direction, background, field display, colors
│   └── ui/                  Button, Card, Alert, Badge, Switch, Select, Accordion, ColorPicker
├── parsers/
│   ├── PrismaParser.ts      regex parser → models, enums, connections
│   ├── SchemaConverter.ts   extension router + validation
│   ├── SqlToPrismaConverter.ts
│   └── JsonToPrismaConverter.ts
├── data/
│   ├── crmSchema.ts         populated
│   ├── pmsSchema.ts         populated
│   ├── erpSchema.ts         populated
│   ├── dmsSchema.ts         EMPTY string (card still shows stats)
│   └── demoSchema.ts        e-commerce sample, not imported anywhere
├── lib/
│   ├── hooks/               SchemaContext, useSchemaContext, useGraph
│   ├── contexts/            settings, theme
│   ├── types/               schema.ts, routing.ts
│   └── utils/               layout-utils, screenshot, colors
└── assets/                  logos used on the canvas and nav
```

Public logos for the demo cards live in `public/logos/` (Salesforce, AppFolio, DocuWare, Odoo).

---

## 4. System design

### 4.1 High-level architecture

```
Browser
  HomePage
    SchemaUpload
      demo string (crm | pms | dms | erp)
        navigate /mode-selection/:demoId
        location.state = { schemaContent, moduleName }
  ModeSelectionPage
    PrismaParser.parse(schemaContent)
    SchemaProvider.setSchemaData(models, enums, connections, moduleName)
    navigate /visualizer
  VisualizerPage
    if models and enums are both empty → navigate /
    else SchemaVisualizer
      filter tables + relation types
      useGraph → dagre layout
      React Flow nodes (ModelNode, EnumNode) and edges
```

`SchemaProvider` wraps every route in `App.tsx`. It holds four pieces of state: `models`, `enums`, `connections`, `currentModule`. Nothing is written to `localStorage`, `sessionStorage`, or a server.

`demoId` is in the URL (`crm`, `pms`, `dms`, `erp`) but `ModeSelectionPage` never reads the route param. The schema comes only from `location.state`. A refresh or a pasted URL has no schema, and the page will throw when it destructures `location.state`.

### 4.2 Runtime layers

1. **Route shell.** `NavigationBar` on home and mode selection. The visualizer hides that bar and draws its own logo, module title, and "Back to Modules" button.
2. **Schema memory.** `SchemaContext` in `src/lib/hooks/`.
3. **Parse.** `PrismaParser.parse` on the Visualize click. Upload conversion (`SchemaConverter`) exists and is not on the live path.
4. **Diagram state.** Local to `SchemaVisualizer`: selected tables, highlighted field, expanded tables, enabled relation types.
5. **Graph state.** `useGraph` owns React Flow nodes/edges and reapplies dagre when the layout direction or the node data changes.
6. **Appearance.** `SettingsProvider` and `ThemeProvider` wrap only the visualizer. Theme is hardcoded to `ColorThemeKind.Dark`.

### 4.3 Data flow after a demo is chosen

1. `SchemaUpload` calls `onSchemaLoad(schemaString, displayName)`.
2. `HomePage.handleSchemaLoad` picks a demo id by checking whether the display name contains `CRM`, `PMS`, `DMS`, or `ERP`. Unknown names become `crm`.
3. It navigates to `/mode-selection/{demoId}` with `{ schemaContent, moduleName }` in history state.
4. Visualize Schema runs `PrismaParser.parse`. On throw, it `console.error`s and `alert`s "Failed to parse schema. Please check the file format."
5. On success, `setSchemaData` stores the parse result and the module name, then navigates to `/visualizer`.
6. `VisualizerPage` reads context. If both arrays are empty it calls `navigate('/')` during render and returns `null`.
7. "Back to Modules" calls `clearSchemaData()` and navigates to `/`.

### 4.4 What the parser produces

`PrismaParser.parse` returns:

```ts
{
  models: { name, fields, isChild }[]
  enums: { name, values }[]
  connections: { source, target, name, label, foreignKey, references, relationType }[]
}
```

Field flags:

- `isPrimaryKey` — attribute contains `@id`, or the field is a primitive named `id`, or the name contains `id` and the attribute contains `@unique`.
- `isForeignKey` — primitive type and the name ends with `Id`.
- `isRelation` — `@relation` on a non-primitive type.
- `hasConnections` — `@relation` or a non-primitive type.
- `isChild` on the model — some field has `hasConnections` and the name ends with `Id`. The visualizer does not read `isChild`.

Relation type, in the order the parser applies it:

| Condition | Type | Label shape |
|-----------|------|-------------|
| Model looks like a junction (2+ `*Id` fields and 2+ `@relation(fields:` targets) and this field points at one of those targets | `many-to-many` | `{field} (M:N via {Model})` |
| Field type is an array, and the target model itself looks like a junction | `many-to-many` | `{field} (M:N)` |
| Field type is an array, target is not a junction | `one-to-many` | `{field} (1:N)` |
| `@relation` includes `fields:` | `many-to-one` | `{foreignKey} → {references} (N:1)` when both are present |
| Otherwise a non-primitive field | `one-to-one` | `{field} (1:1)` |

Connection ids are `{Model}-{field}-source` and `{TargetModel}-target`. `SchemaVisualizer` splits on the first `-` to recover the table name, so a model name that itself contains `-` would be split wrong. Current demo models do not contain hyphens.

Enum values are non-empty, non-comment lines inside the `enum` block, first token only.

Parser limits that matter:

- Models and enums are matched with `\{([^}]*)\}`, so the first `}` ends the block.
- A field line must match `name type attributes` on one line.
- Primitive types are only `String`, `Int`, `Float`, `Boolean`, `DateTime`, `Json`, `Bytes`, `Decimal`, `BigInt`. Anything else is treated as a relation target, including enum names. Enum fields therefore become connections whose target is the enum node.
- Comments starting with `//` and `@@` block attributes are skipped. Inline comments after a field are not stripped before the field regex.

### 4.5 Diagram behavior

**Default selection.** On first load, table and enum names are sorted A–Z and the first five are selected. Edges are drawn only when both ends are selected and the relation type is enabled. All four types start enabled.

**Expand.** A model card shows a "{n} relations" control when it has neighbors. Expanding it adds those neighbors to the selection. Collapsing only clears the expanded flag; it does not deselect the neighbors.

**Search.** `TableFieldSelector` has a Tables mode and a Fields mode. Ctrl+K or Cmd+K opens Fields and focuses the input. Choosing a field selects that table if needed, highlights the field for 3 seconds, and centers the node. Field results are paged at 50.

**Edges.** Color comes from relation type: green 1:N, amber N:1, brand blue 1:1, cyan M:N. M:N edges are dashed, thicker, and animated. Labels are gold. Multiple edges between the same pair are separate edges. React Flow `onConnect` is enabled, so a user can draw a new edge; that edge is not written back into the schema.

**Layout.** Dagre ranks the graph. Directions are TB (default in both `useGraph` and settings), LR, BT, RL. Node size used for layout is fixed at 250×400, which does not match the rendered card (`min-w-[280px]`, fields capped at 500px tall). Changing direction in settings calls `applyLayout`. The first layout uses `TB` even if settings later differ; the settings effect then re-layouts when the values diverge.

**Minimap.** Always mounted. `settings.showMinimap` exists and defaults to `true`, and the settings panel does not expose it.

**Screenshot.** The control button fits the view, waits 300ms, and calls `html-to-image` `toPng` on `.react-flow__viewport` at `pixelRatio` 5. Controls and the minimap are filtered out. The download name is `schema-diagram.png`. The selector panel, legend, settings, logo, and module title sit outside the viewport, so they are not in the PNG. The React Flow attribution node is removed from the DOM on mount in `useGraph`.

**Settings (session only, not persisted):**

- Direction: TB, LR, BT, RL
- Show background, variant lines / dots / cross
- Show field types, show field icons
- Colors: primary `#00527d`, secondary `#001477`, enum `#4da7ca`, title `#ffffff`, background `#000a14`

`resetSettings` exists on the context and is not called by the panel.

**Node chrome:**

- Primary key: red left border, key mark, `PK` next to the type.
- Foreign key (`*Id` primitive): yellow left border.
- Relation field: blue left border and a link mark.
- Header gradient uses the primary and secondary theme colors. Enum header uses the enum color.
- Per-field source handles are rendered for `hasConnections` fields, but their `top` is `15 + 10 + 5 * index`, which does not track row height. Edges prefer those handles when the connection id contains `-`.

### 4.6 Demo catalogs

Stats below are the constants shown on the cards. They are not computed from the parser.

| Id | Name | Schema constant | Card stats (models / enums / relations) | Schema body |
|----|------|-----------------|------------------------------------------|-------------|
| crm | CRM - Customer Relationship Management | `CRM_SCHEMA` | 11 / 14 / 22 | Present |
| pms | PMS - Property Management System | `PMS_SCHEMA` | 14 / 17 / 28 | Present |
| dms | DMS - Document Management System | `DMS_SCHEMA` | 13 / 3 / 16 | Empty string |
| erp | ERP - Enterprise Resource Planning | `ERP_SCHEMA` | 25 / 15 / 40 | Present |

`DEMO_SCHEMA` in `src/data/demoSchema.ts` is an e-commerce example left over from the README. No page imports it.

Card features are hardcoded strings (for example "Lead Management"), not derived from the schema.

### 4.7 Upload pipeline (built, not reachable)

`FileUpload` accepts `.prisma`, `.sql`, `.psql`, `.json`, max 10MB, via click or drop. `SchemaConverter.convertToPrisma`:

- `.prisma` — kept as-is after `PrismaParser.parse` finds at least one model or enum.
- `.sql` and `.psql` — same converter. Strips `--` and `/* */` comments. Reads `CREATE TABLE` statements that end with `);`. Reads `FOREIGN KEY (col) REFERENCES table (col)` table constraints. Does not read inline `col TYPE REFERENCES table(col)`. Maps a short SQL type list to Prisma types; unknown types become `String`. Emits `generator` and `datasource` blocks and a `@relation` on the FK side only. Table names become PascalCase on `_`.
- `.json` — two shapes. Prisma-like (`models` / `enums`, or an array of `{ name, fields }`). Custom (`tables` / `schemas` / `entities`). The file comment mentions OpenAPI; the code does not detect OpenAPI and throws "Unsupported JSON schema format".

`HomePage` would pass the converted Prisma text straight to mode selection. That call never happens while the overlay is mounted, because the overlay covers the drop zone.

### 4.8 What a refresh does

Context resets. `/visualizer` sees empty arrays and navigates to `/`. `/mode-selection/:id` still has the id in the URL and has no `location.state`, so reading `schemaContent` throws.

---

## 5. Known mismatches

- README still documents a `client/` folder, React 18.3.1, Tailwind 3.4.1, a single e-commerce demo, and an upload flow that is the primary action. None of that matches `src/`.
- DMS card stats describe a schema the file does not contain.
- `showMinimap` is unused. The minimap always renders.
- Theme can represent light and high contrast. The visualizer always passes `ColorThemeKind.Dark`.
- Navigation links point at `https://docs.lazyquery.com` and `https://github.com/lazyquery`. This repo's README points at `https://github.com/sarimAbdelbari/LazyQuery`.
