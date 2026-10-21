# PLANS.md
> What we intend to build and in what order.
> This is the forward-looking document. Not a commitment — a direction.
> Revisit and update this regularly. Outdated plans cause confusion.

Items below are unfinished work already visible in the code. They are not a new roadmap.

---

## Current Focus (Now)

- [x] Document the running app from the source (PROJECT, APPLOGIC, ARCHITECTURE, STEPS, REFERENCES, DECISIONS, this file)

---

## Up Next (Short-term)

- [ ] Restore `DMS_SCHEMA` in `src/data/dmsSchema.ts`. The card advertises 13 models, 3 enums, and 16 relations, and the exported string is empty, so the demo cannot open.
- [ ] Decide whether Upload Schema stays behind the overlay. The converter and `FileUpload` already exist underneath it.
- [ ] Decide whether "Talk to Your Database" stays a disabled card. There is no query screen behind the overlay.

---

## Horizon (Medium-term)

- Replace the regex parser with something that matches real Prisma, or delete `@prisma/internals` if it will not be used.
- Remove `cytoscape` and `react-cytoscapejs` if React Flow remains the diagram, or finish a migration onto them. ADR-001 records the current choice.

---

## Backlog (Parked)

- Persist diagram settings and the last schema across refresh.
- Make `/mode-selection/:demoId` load the bundled schema from the id, so refresh and shared links work.
- Wire `showMinimap` and `resetSettings`, which exist on the settings context and have no control.
- Bring `README.md` in line with `src/` (no `client/` folder, React 19, Tailwind 4, four demos).

---

## Explicitly Out of Scope

| Item | Reason deferred / rejected |
|------|---------------------------|
|      |                           |

Live Postgres access and AI text-to-SQL are the owner's intended product. Do not treat them as rejected. The owner asked not to turn that direction into a build plan until they ask.

The current prototype still has no accounts, billing, or database connection.

---

## Open Questions

- [ ] Is the upload overlay temporary, or is upload deferred on purpose?
- [x] Is text-to-SQL still a product goal? Yes. The owner wants AI text-to-SQL grounded in the database ERD. Not scheduled.
- [ ] Should the empty DMS schema be filled, or should the card be removed until it exists?

---

Last updated: 2026-10-21
