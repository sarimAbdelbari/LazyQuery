# STEPS.md
> Everything you need to run as a human after the AI makes changes.
> This is the "now run this" file. Keep it current.
> Clear completed steps. Don't let this become a graveyard.

---

## Initial Setup (Run Once)

```bash
# 1. Install dependencies (repo root — there is no client/ folder)
npm install

# 2. Environment variables
# None. Do not create a .env file for the current app.

# 3. Database migrations
# None. This app does not use a database.

# 4. Seed
# None. Demo schemas are TypeScript strings in src/data/.

# 5. Start the dev server
npm run dev
# Open http://localhost:5173
```

---

## Pending Steps (Run These Now)

- [ ] None. Documentation only; no install, migration, or env change.

---

## Reference: Common Commands

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` (port 5173) |
| Production build | `npm run build` (`tsc -b` then `vite build`) |
| Preview the build | `npm run preview` |
| Lint | `npm run lint` |
| Run tests | No test runner is configured |
| Run migrations | Not applicable |
| Generate types | Not applicable (`tsc` is part of `npm run build`) |

---

## Environment Variables Reference

| Variable | Purpose | Required |
|----------|---------|----------|
| — | The running app reads no environment variables | — |

SQL and JSON converters emit a Prisma `datasource` block that mentions `env("DATABASE_URL")`. That text is schema content for the diagram. The app does not read `DATABASE_URL`.

---

## Deployment Checklist

The app is a static Vite build. There is no database and no auth.

- [ ] `npm run build` succeeds
- [ ] `npm run lint` is clean for the files you changed
- [ ] No `.env` or secrets were added
- [ ] Demo schemas you care about are non-empty strings in `src/data/`
- [ ] Confirm the home page, one populated demo (CRM, PMS, or ERP), and the visualizer in a browser
