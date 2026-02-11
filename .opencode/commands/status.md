Generate a status report for the current project.

## Instructions

1. **Load context** — Use the `skill` tool to load `active-context`.
2. **Read stories** — List all files in `.local/stories/` and summarize each story's title, status, and completion percentage.
3. **Read tasks** — List all files in `.local/agenttasks/` and summarize each task's ID, title, complexity, assigned agent, and current status.
4. **Check recent activity** — Run `git log --oneline -10` to show the last 10 commits.
5. **Determine project phase** — Based on open tasks and stories, identify whether the project is in Planning, Design, or Implementation phase.
6. **Present the report** in this format:

```
## Project Status Report

### Stories
| Story | Title | Status |
|---|---|---|

### Tasks
| Task | Title | Complexity | Assigned To | Status |
|---|---|---|---|---|

### Recent Activity
(last 10 commits)

### Current Phase
(Planning / Design / Implementation)
```

