Generate a structured handoff document for transitioning between agents, sessions, or team members.

$ARGUMENTS

## Instructions

1. **Load context** — Use the `skill` tool to load `active-context` and `project-standards`.
2. **Read stories** — List all files in `.local/stories/` and summarize each story's title, status, and completion percentage.
3. **Read tasks** — List all files in `.local/agenttasks/` and summarize each task's ID, title, complexity, assigned agent, status, and what work remains.
4. **Check recent activity** — Run `git log --oneline -10` to show the last 10 commits.
5. **Check uncommitted changes** — Run `git diff --stat` to identify any uncommitted work.
6. **Determine current phase** — Based on open tasks and stories, identify whether the project is in Planning, Design, or Implementation phase.
7. **Identify blockers and risks** — Note any blocked tasks, unresolved decisions, or open questions.
8. **Present the handoff document** in this format:

```
## Handoff Document

### Current Phase
(Planning / Design / Implementation)

### Project Summary
(Brief overview of what the project is and its current state)

### Stories
| Story | Title | Status | Completion |
|---|---|---|---|

### Tasks
| Task | Title | Complexity | Assigned To | Status | Remaining Work |
|---|---|---|---|---|---|

### Recent Activity
(last 10 commits)

### Uncommitted Changes
(output of git diff --stat, or "None" if clean)

### Blockers & Risks
(any blocked tasks, unresolved decisions, or open questions)

### Key Decisions Made
(important architecture or design decisions from memory/Knowledge/)

### Recommended Next Steps
(prioritized list of what the next agent or session should focus on)
```

