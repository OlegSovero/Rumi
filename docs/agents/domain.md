# Domain Docs

Rumi is a single-context repository. Domain documentation lives at the repository root and architectural decisions live under `docs/adr/`.

## Before Exploring

- Read `CONTEXT.md` when it exists.
- Read any relevant records under `docs/adr/` before changing an established architectural decision.
- If these files do not exist, proceed without treating their absence as a problem. Create them when the project has a domain decision worth recording.

## Layout

```text
/
├── CONTEXT.md
└── docs/
    ├── adr/
    └── agents/
```

Use the terminology established in `CONTEXT.md` and surface conflicts with existing ADRs instead of silently overriding them.
