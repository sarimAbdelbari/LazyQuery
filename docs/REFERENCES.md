# REFERENCES.md
> All external documentation links in one place.
> When a link goes dead, update it here. Never hardcode doc links in rules.

---

## How to Use This File

- Add a link when you first use a new tool or service
- Add the specific section you used most, not just the homepage
- Mark deprecated links with ~~strikethrough~~

---

## Frontend

| Resource | URL | Notes |
|----------|-----|-------|
| React | https://react.dev/ | UI. App uses React 19. |
| React Router | https://reactrouter.com/ | Routes in `src/App.tsx`. v7. |
| Vite | https://vite.dev/guide/ | Dev server and build. Configured in `vite.config.ts`, port 5173. |
| Tailwind CSS | https://tailwindcss.com/docs | v4, wired through `@tailwindcss/postcss`. |
| Lucide | https://lucide.dev/ | Icons. |
| react-colorful | https://github.com/omgovich/react-colorful | Settings panel color pickers. |

---

## Diagram

| Resource | URL | Notes |
|----------|-----|-------|
| React Flow (`@xyflow/react`) | https://reactflow.dev/ | Canvas, nodes, edges, minimap, controls. |
| Dagre | https://github.com/dagrejs/dagre | Ranked layout in `src/lib/utils/layout-utils.ts`. Directions TB, LR, BT, RL. |
| html-to-image | https://github.com/bubkoo/html-to-image | `toPng` in `src/lib/utils/screenshot.ts`. |

---

## Backend / Database

| Resource | URL | Notes |
|----------|-----|-------|
| — | — | No database and no API. Prisma appears only as a schema text format. |

---

## Auth

| Resource | URL | Notes |
|----------|-----|-------|
| — | — | No auth. |

---

## Payments

| Resource | URL | Notes |
|----------|-----|-------|
| — | — | No payments. |

---

## Schema formats

| Resource | URL | Notes |
|----------|-----|-------|
| Prisma schema | https://www.prisma.io/docs/orm/prisma-schema/overview | The parser handles a subset: `model`, `enum`, `@id`, `@relation`, `@unique`. It does not call Prisma. |
| Prisma relation syntax | https://www.prisma.io/docs/orm/prisma-schema/data-model/relations | Used as the shape `PrismaParser` tries to classify. |

`@prisma/internals` is in `package.json` and is not imported. Do not document it as part of the runtime until something calls it.

---

## Deployment & Infrastructure

| Resource | URL | Notes |
|----------|-----|-------|
| Vite build | https://vite.dev/guide/build | `npm run build` emits a static `dist/`. No host config is in the repo. |

---

## Security & Compliance

| Resource | URL | Notes |
|----------|-----|-------|
| — | — | Schema text is processed in the browser. There is no account data to retain. |

---

## Tools & Dev Environment

| Tool | URL | Notes |
|------|-----|-------|
| Cursor | https://docs.cursor.com | AI code editor |
| TypeScript | https://www.typescriptlang.org/docs/ | `npm run build` runs `tsc -b` before Vite. |
| ESLint | https://eslint.org/docs/latest/ | `npm run lint`. Flat config in `eslint.config.js`. |

---

## Useful One-Pagers

| Topic | URL | Notes |
|-------|-----|-------|
| React Flow custom nodes | https://reactflow.dev/learn/customization/custom-nodes | `ModelNode` and `EnumNode`. |
| React Flow handles | https://reactflow.dev/learn/customization/handles | Field handles and node handles in `ModelNode`. |
