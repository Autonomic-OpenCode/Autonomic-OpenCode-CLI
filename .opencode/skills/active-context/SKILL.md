---
name: active-context
description: Load current work-in-progress state including active AgentTasks, open Stories, recent decisions, and project phase. Use this skill at the start of any planning or review session to understand what work is in flight.
compatibility: opencode
metadata:
  category: workflow
  source: .local/agenttasks/ + .local/stories/
---

# Active Context

Load this skill to understand the current state of work in the project.

## How to Use

Follow these steps in order to build a complete picture of active work:

### Step 1: Check Active Stories

Read all files in `.local/stories/` to find open stories:

```bash
ls -la .local/stories/ 2>/dev/null || echo "No stories directory found"
```

For each story file, check:
- Which acceptance criteria are checked (✅) vs unchecked
- Which tasks in the breakdown are completed vs pending
- The overall completion percentage

### Step 2: Check Active AgentTasks

Read all files in `.local/agenttasks/` to find active tasks:

```bash
ls -la .local/agenttasks/ 2>/dev/null || echo "No agenttasks directory found"
```

For each task file, note:
- `id` and `title` — what the task is
- `complexity` — how big it is
- `assigned_to` — who should execute it
- `depends_on` — what must be done first
- `goal.success_criteria` — what "done" looks like

### Step 3: Check Recent Activity

Review recent git history for context on what's been worked on:

```bash
git log --oneline -10 2>/dev/null || echo "No git history available"
```

### Step 4: Check Architecture Decisions

Look for recent ADRs that may affect current work:

```bash
ls -la memory/Knowledge/adr-* 2>/dev/null || echo "No ADRs found"
```

### Step 5: Determine Current Phase

Based on the active tasks and stories, determine which phase the project is in:
- **Planning**: Stories/AgentTasks are being created or refined
- **Design**: Architecture is being designed, tasks are being detailed
- **Implementation**: Code is being written and tested
- **Review**: Work is complete and awaiting user approval

## Output Format

After gathering context, summarize as:

```
## Current Project State

**Active Story**: [Story ID and title, or "None"]
**Current Phase**: [Planning | Design | Implementation | Review]
**Active Tasks**: [Count] tasks in progress
**Blocked Tasks**: [Count] tasks waiting on dependencies
**Completed Tasks**: [Count] tasks done

### Task Summary
| ID | Title | Complexity | Status | Assigned To |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

### Recent Decisions
- [Any ADRs or significant choices made recently]

### Next Steps
- [What should be worked on next based on dependencies]
```

