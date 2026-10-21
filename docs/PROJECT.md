# PROJECT.md
> This is the first file any AI or new contributor should read.
> Keep it under 1 page. Update it when fundamentals change.

---

## What This Is

The repo today is a browser-only prototype that turns a Prisma schema into an interactive entity-relationship diagram. The working path is four bundled demo schemas. Upload and natural-language SQL are in the UI and marked coming soon.

The intended product, stated by the owner on 2026-10-21, is their own SaaS. They are coding the prototype to see how far it can go. The direction is a PostgreSQL-linked extension that reads a database's schema (Prisma `db pull` is one option they are considering), a NestJS backend, and AI text-to-SQL whose context comes from that database's ERD. That direction is not a build plan and is not implemented.

## Who It's For

Someone who needs to see how a large database is shaped — tables, fields, enums, and relationships — without installing a database or opening a modeling tool. The demos are enterprise-shaped: CRM, property management, document management, and ERP.

## The Problem It Solves

A schema file is a long list of models. Relationships are easy to miss when you only read the text. LazyQuery lays the selected tables out as a diagram you can filter, search, restyle, and export as a PNG.

## What Success Looks Like

The user picks a demo, chooses Visualize Schema, and gets a diagram of the first five tables (alphabetical), with edges colored by relationship type. They can add tables, jump to a field with Ctrl+K, expand a table to pull in its neighbors, and download a PNG.

---

## Boundaries (the prototype in this repo)

These describe the code that exists today. They do not reject the SaaS direction above.

- Not connected to a live database. Nothing is queried, migrated, or stored.
- Not an account product. There is no auth, no user data, and no server API.
- Not a SQL editor. "Talk to Your Database" is a disabled card.
- Not a file host. The upload UI is covered by a coming-soon overlay. The parser behind it runs only in the browser and is not reachable from the current home screen.
- Not a full Prisma toolchain. Parsing is a local regex parser. `@prisma/internals` is installed and unused.

---

## Tech Stack

- Frontend: React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4
- Diagram: `@xyflow/react` (React Flow) with `@dagrejs/dagre` for layout
- Export: `html-to-image` writes `schema-diagram.png`
- Backend / DB: none
- Auth: none
- Payments: none
- Deployment: static Vite build (`npm run build`). No host config lives in this repo.

---

## Key Constraints

- Schema text stays in React memory for the tab session. Refreshing the visualizer loses it and sends the user home.
- The parser only understands Prisma `model` / `enum` blocks that close on the first `}`. Nested attributes and multi-line blocks are outside what it handles.
- The DMS demo card is wired up, but `src/data/dmsSchema.ts` exports an empty schema string. Opening that demo parses nothing and the visualizer bounces back home.
- `README.md` describes an older `client/` layout, React 18, and Tailwind 3. Trust this folder and the source, not the README.

---

## Environment Setup

1. Install Node.js 18 or newer.
2. From the repo root, run `npm install`.
3. Run `npm run dev` and open `http://localhost:5173`.

Required environment variables: none. There is no `.env.example`.

---

## Key People

- Owner / Decision maker: repository owner
- Reviewers: none recorded

---

## Status

Phase: prototype

Last updated: 2026-10-21
