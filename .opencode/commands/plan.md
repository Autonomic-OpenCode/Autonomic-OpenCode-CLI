Start a planning session for the following request:

$ARGUMENTS

## Instructions

1. **Load skills** — Use the `skill` tool to load `active-context` and `project-standards`.
2. **Check open stories** — Read all files in `.local/stories/` and identify any open or in-progress stories.
3. **Check existing tasks** — Read all files in `.local/agenttasks/` and identify tasks related to the request.
4. **Assess scope** — Determine whether the request fits into an existing story or requires a new one.
5. **Create or update work items**:
   - If a new story is needed, create it in `.local/stories/` following `STORY_SCHEMA.md`.
   - Break the work into AgentTasks in `.local/agenttasks/` following `AGENT_TASK_SCHEMA.md`.
   - Assign complexity tiers (Nano 0-2pts, Tiny 3-5pts, Medium 6-15pts, Large 16-30pts, Mega 30+pts).
6. **Follow the Planning phase workflow** from `instructions/AGENTS.md` — pause for user feedback before proceeding to Design.

