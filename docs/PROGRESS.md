# PROGRESS.md
> Running log of what has been built and when.
> Newest entries at the top.
> This is the factual record — for decisions and reasoning, see DECISIONS.md.

---

## Log Format

```
## [YYYY-MM-DD] — [Short title]
**Completed:**
- What was built or changed (be specific about files/tables/routes)

**Decisions made:**
- Any quick decisions made during implementation (link to DECISIONS.md if significant)

**Known issues / TODO:**
- Anything left incomplete or deferred

**Commit(s):** `type(scope): description`
```

---

<!-- Add entries below. Newest at the top. -->

## [2026-10-21] — Owner stated the product direction
**Completed:**
- Recorded the owner's direction on `docs/PROJECT.md`.
- Removed the PLANS.md line that treated a live database connection as out of scope.

**Decisions made:**
- No implementation choices. The owner asked to keep this in mind and not to plan or code it.
- Direction, in their words: a PostgreSQL-linked extension that reads the database schema (Prisma `db pull` is a maybe), a NestJS backend, and AI text-to-SQL whose context comes from that database's ERD.
- They are still coding the current prototype to see how far it can go. This is their own SaaS.

**Known issues / TODO:**
- Do not start the NestJS service, Prisma pull, or text-to-SQL until the owner asks.

**Commit(s):** none

## [2026-10-21] — Document the running app
**Completed:**
- Read `src/` and recorded what the code does, not what `README.md` claims.
- Filled `docs/PROJECT.md`, `docs/APPLOGIC.md`, `docs/ARCHITECTURE.md`, `docs/STEPS.md`, `docs/REFERENCES.md`.
- Recorded ADR-001, ADR-002, and ADR-003 in `docs/DECISIONS.md` from decisions already in the code.
- Pointed `docs/SESSION-START.md` at `docs/APPLOGIC.md` in the reading order.
- Noted unfinished work already in the UI in `docs/PLANS.md`.

**Decisions made:**
- No product decisions. ADRs describe the existing app. See DECISIONS.md.

**Known issues / TODO:**
- `src/data/dmsSchema.ts` exports an empty schema. The DMS card still shows stats and cannot open a diagram.
- Upload and "Talk to Your Database" are covered by coming-soon overlays.
- `README.md` still describes a `client/` app on React 18.
- `cytoscape`, `react-cytoscapejs`, and `@prisma/internals` are unused dependencies.
- Refreshing `/mode-selection/:demoId` throws because the schema only lives in `location.state`.

**Commit(s):** none (documentation only, not committed)

## [YYYY-MM-DD] — Project Initialized
**Completed:**
- Repository created
- Cursor rules configured
- Documentation structure initialized

**Decisions made:**
- None yet

**Known issues / TODO:**
- Fill in PROJECT.md
- Fill in first ADR in DECISIONS.md

**Commit(s):** `chore(docs): initialize project documentation structure`
