# Pattern: Agent Task Creation

## Context

When creating AgentTasks, we follow a consistent pattern to ensure tasks are well-defined, properly scoped, and contain enough context for the assigned agent to execute without ambiguity.

## Pattern

1. **Load context first** — Use the `active-context` skill to understand current work state.
2. **Search for related work** — Use `memory-search` to find existing patterns, standards, and learnings relevant to the task.
3. **Define the task** — Create a YAML file in `.local/agenttasks/` following `AGENT_TASK_SCHEMA.md`.
4. **Embed standards** — Populate `embedded_standards` with relevant entries from `memory/Knowledge/`.
5. **Embed learnings** — Populate `embedded_learnings` with relevant entries from `memory/Pattern/` and `memory/Learning/`.
6. **Set complexity** — Use the tier system: Nano (0-2), Tiny (3-5), Medium (6-15), Large (16-30), Mega (30+).
7. **Assign agent** — Route to the appropriate specialist (`@developer`, `@software-architect`, etc.).

## Example

```yaml
id: "TASK-042"
title: "Implement user authentication endpoint"
complexity: "Medium (8)"
assigned_to: "@developer"
goal:
  summary: "Create a REST API endpoint for user login with JWT token generation."
  success_criteria:
    - "POST /api/auth/login accepts email and password"
    - "Returns JWT token on valid credentials"
    - "Returns 401 on invalid credentials"
    - "Unit tests cover happy path and error cases"
embedded_standards:
  - "Use repository pattern for data access (ADR-003)"
embedded_learnings:
  - "JWT tokens should include user role claims (Learning: auth-token-design)"
```

## When to Use

Every time a new piece of work is identified during the Planning phase.

