Search project memory for:

$ARGUMENTS

## Instructions

1. **Search all categories** — Use the `memory-search` tool: `memory-search({ query: "$ARGUMENTS" })`.
2. **If no results**, try broader or alternative search terms (synonyms, related concepts).
3. **Group results by category** and present them:

```
## Memory Search Results: "$ARGUMENTS"

### Knowledge
(architecture decisions, standards, tech stack)

### Pattern
(reusable code patterns)

### Learning
(lessons learned, error solutions)

### Debugging
(troubleshooting guides, known issues)
```

4. **Suggest related skills** to load if the results indicate a broader topic:
   - Architecture/structure questions → suggest loading `codebase-map`
   - Standards/conventions questions → suggest loading `project-standards`
   - Error/bug questions → suggest loading `debugging-playbook`
   - Project state questions → suggest loading `active-context`

