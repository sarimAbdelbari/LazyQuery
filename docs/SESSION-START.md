# SESSION-START.md
> Copy and paste the message below at the start of any new session.
> The "Quick Reconnect" variant is for sessions where the project is already running.

---

## FULL SESSION OPENER
> Use this: first time on a project, or after a long break.

---

Before we start any work, orient yourself. Here is how this project is structured and what your responsibilities are.

---

### YOUR READING ORDER (do this now, in order)

1. `docs/PROJECT.md` — Read this first, every session. It tells you what we're building, who it's for, and what the hard boundaries are. If anything in our conversation contradicts it, flag it.

2. `docs/APPLOGIC.md` — Read this next. It is the behavior source of truth, written from the current code. The README is older and must not override it.

3. `docs/PROGRESS.md` — Read the last 3 entries. This tells you where we left off. Do not ask me to re-explain what's already in here.

4. `docs/PLANS.md` — Scan the "Current Focus" and "Up Next" sections. This tells you what's prioritized.

5. `docs/DECISIONS.md` — Do NOT read this in full now. Open it only when you're about to suggest something architectural, or when an existing pattern seems wrong to you. It explains why things are built the way they are. Before questioning a pattern, check here first.

6. `docs/ARCHITECTURE.md` — Open this when working on structure, data flow, or when adding new modules. It is the map of how the system fits together.

---

### FILE RESPONSIBILITIES — WHAT YOU UPDATE AND WHEN

| File | When to update | What to write |
|------|---------------|---------------|
| `docs/PROGRESS.md` | After every completed task | What was built, files changed, decisions made, commits |
| `docs/DECISIONS.md` | After any significant architectural or technical decision | ADR format: context, decision, alternatives, trade-offs, risks |
| `docs/STEPS.md` | Any time I need to run something locally | Commands I need to execute, env vars to set, migrations to run |
| `docs/REFERENCES.md` | When you use an external documentation link | Add it to the correct category with a short note |
| `docs/PLANS.md` | Only when I explicitly ask you to update it | Never reorder or remove items without being told |
| `docs/ARCHITECTURE.md` | When a new module, layer, or data flow is added | Update the relevant section, keep it factual |
| `docs/APPLOGIC.md` | When user-visible behavior changes | Update the matching section so it still matches the code |

---

### WHAT YOU DO NOT TOUCH WITHOUT BEING ASKED

- `docs/PROJECT.md` — This is my document. You may suggest changes, but never edit it unilaterally.
- `docs/PLANS.md` — You do not reprioritize, add, or remove items unless I ask.
- `docs/DECISIONS.md` entries that already exist — You do not revise past decisions. You may add a new ADR that supersedes one, but old records stay.
- The `.cursor/rules/` folder — Never suggest editing the rules mid-project. Raise rule issues separately.

---

### HOW EVERY RESPONSE MUST BE STRUCTURED

Follow the output format in `.cursor/rules/01-core.mdc` without exception:

For every technical request, provide a single cohesive response. Start by briefly confirming the goal and any underlying assumptions, then provide the clean, documented code to achieve it. After the code, outline any critical edge cases, rollback strategies, and the specific tests needed to validate it. Finish by listing any necessary updates to local environments (like STEPS.md), documentation (like PROGRESS.md), and the immediate next steps.

---

### WHEN YOU ARE UNSURE

- If the requirement is ambiguous → state your interpretation and ask one specific clarifying question before proceeding.
- If two approaches are valid → present both with trade-offs. Do not pick one silently.
- If something in the docs contradicts what I just asked → flag the conflict explicitly before writing any code.

---

### CONFIRM YOU'RE ORIENTED

After reading the files above, reply with:
1. One sentence: what this project is and who it's for (from PROJECT.md)
2. One sentence: where we left off (from PROGRESS.md)
3. One sentence: what is currently prioritized (from PLANS.md)
4. Any conflicts or questions you have before we start

Do not begin any task until you've confirmed orientation.

---
---

## QUICK RECONNECT
> Use this: when continuing work mid-project in a new chat window.

---

We're continuing work on this project. Orient yourself quickly before we proceed.

Read:
- `docs/PROGRESS.md` — last 2–3 entries only
- `docs/PLANS.md` — Current Focus section only
- `docs/PROJECT.md` — if you haven't read it this session
- `docs/APPLOGIC.md` — if the task touches behavior and you have not read it this session

Then reply with:
- What was last completed
- What is currently in focus
- Any blockers or open questions from the previous session

Output format from `01-core.mdc` applies to all responses. Do not start any task before confirming you're oriented.
