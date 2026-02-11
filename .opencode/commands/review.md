Review the current changes against the active task:

$ARGUMENTS

## Instructions

1. **Identify the active task** — If `$ARGUMENTS` specifies a task ID, read that file from `.local/agenttasks/`. Otherwise, find the most recently modified task file.
2. **Load standards** — Use the `skill` tool to load `project-standards`.
3. **Read success criteria** — Extract the `success_criteria` list from the task's YAML definition.
4. **Evaluate each criterion** — Check the current state of the codebase against each criterion:
   - ✅ **Met** — The criterion is fully satisfied.
   - ❌ **Not Met** — The criterion is not satisfied.
   - ⚠️ **Partially Met** — Some progress, but not complete.
5. **Check quality standards** — Verify against `QUALITY_STANDARDS.md` Definition of Done:
   - Code compiles / lints without errors?
   - Tests written and passing?
   - Documentation updated?
   - Memory entries recorded for new patterns or learnings?
6. **Present the review** in this format:

```
## Task Review: [TASK-ID] — [Title]

### Success Criteria
| # | Criterion | Status | Notes |
|---|---|---|---|

### Quality Checklist
- [ ] Code compiles without errors
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Memory entries recorded

### Remaining Work
(list any unmet criteria and suggested next steps)
```

