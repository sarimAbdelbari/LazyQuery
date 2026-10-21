# DECISIONS.md — Architecture Decision Records

> Log every significant technical decision here.
> The goal is to capture WHY, not just WHAT.
> Future-you (or your AI) will thank you.

The ADRs below were recorded on 2026-10-21 by reading the code that already exists. They describe decisions the codebase embodies. They were not newly chosen in that session.

---

## How to Write an ADR

```
## ADR-[number]: [Short title]
**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-N

### Context
What situation forced this decision? What constraints existed?

### Decision
What did we decide to do?

### Alternatives Considered
- Option A — why rejected
- Option B — why rejected

### Trade-offs
What do we gain? What do we give up?

### Risks
What could go wrong with this decision?

### Review Date (if applicable)
When should this be revisited?
```

---

## ADR-003: Prisma text is the only diagram input
**Date:** 2026-10-21
**Status:** Accepted

### Context
The diagram needs models, fields, enums, and relationships. Users were expected to arrive with Prisma, SQL, or JSON. The visualizer should not grow a parser per format.

### Decision
`PrismaParser` is the only parser the diagram calls. `SchemaConverter` turns SQL and JSON into Prisma text first, then validates by parsing. Demo data is stored as Prisma schema strings.

### Alternatives Considered
- Parse each format straight into `Model` / `Enum` / `ModelConnection`. Rejected in the code: SQL and JSON converters emit Prisma instead.
- Call `@prisma/internals` to get a real schema AST. The package is installed and unused.

### Trade-offs
One diagram model, and a second conversion step that can drop SQL details (inline `REFERENCES`, reverse relations, unknown types become `String`).

### Risks
The regex parser and the converters can disagree with real Prisma. A schema that Prisma accepts can still fail or mis-classify here.

### Review Date (if applicable)
When upload is turned on, or when a schema in the wild parses wrong.

---

## ADR-002: Schema state lives in React context for the tab session
**Date:** 2026-10-21
**Status:** Accepted

### Context
The visualizer is a different route from the page that chose the schema. The chosen text has to survive that navigation.

### Decision
`SchemaProvider` holds models, enums, connections, and the module name in `useState`. The Prisma source string is passed only through `location.state` until parse time. Nothing is persisted.

### Alternatives Considered
- Put the schema in the URL. Not implemented. Demo id is in the URL and is not read back.
- `localStorage`. Not implemented.

### Trade-offs
No account, no server, and a refresh returns the user to a blank visualizer that redirects home. Mode selection cannot be reloaded.

### Risks
Large schemas sit in memory twice (source string in history state, then parsed objects). The mode-selection page crashes if `location.state` is missing.

---

## ADR-001: The diagram is React Flow plus a Dagre layout
**Date:** 2026-10-21
**Status:** Accepted

### Context
The product is an interactive ERD: pan, zoom, select tables, color edges by cardinality, export a picture.

### Decision
Nodes and edges render with `@xyflow/react`. Positions come from `@dagrejs/dagre` in `getLayoutedElements`. PNG export uses `html-to-image` on the React Flow viewport.

### Alternatives Considered
- Cytoscape. `cytoscape` and `react-cytoscapejs` are dependencies and have no imports under `src/`.

### Trade-offs
React Flow gives custom nodes, handles, a minimap, and controls. Dagre is a one-shot ranked layout with a fixed node size, so it does not measure the real cards.

### Risks
Overlapping nodes on large models. User-dragged positions are discarded the next time layout runs. A hand-drawn edge from `onConnect` is not part of the schema.

### Review Date (if applicable)
If layout quality becomes the main complaint, replace the fixed 250×400 box with measured node sizes before replacing the library.
