# Autonomic-OpenCode-CLI — Project Documentation

## The Problem

When you use a single AI coding assistant, you're doing all the thinking yourself — deciding what to build, how to structure it, what to test, and then prompting the AI to write code. You're still the PM, the architect, and the developer. The AI is just a faster keyboard.

## What This Project Does

This project gives you a **team of AI agents** inside [OpenCode](https://opencode.ai) that work like a small developer department. You talk to one primary agent (the "AI Department"), and it delegates work to specialists:

- **You say**: "We need user authentication with OAuth2"
- **Requirements Engineer** creates a structured backlog with stories and tasks
- **Software Architect** designs the system and makes architecture decisions
- **Developer** writes the code and tests

Each specialist pauses and asks for your approval before the next one starts. You stay in control, but you don't have to do the planning, structuring, or task breakdown yourself.

## How a Typical Session Works

### 1. You make a request

Open OpenCode and talk to the AI Department agent. Describe what you need in plain language, or use a shortcut command (`/plan`, `/status`, `/review`).

### 2. Planning Phase → @requirements-engineer

The AI Department routes your request to the Requirements Engineer, who breaks it into **Stories** and **AgentTasks** with complexity estimates, then writes them to `.local/stories/` and `.local/agenttasks/`.

**Then it stops and asks you**: "Approve to continue to Design?"

### 3. Design Phase → @software-architect

The Architect reviews tasks for technical feasibility, adds implementation details, creates ADRs, and refines tasks with technical constraints.

**Then it stops and asks you**: "Approve to continue to Implementation?"

### 4. Implementation Phase → @developer

The Developer writes code, tests, and documentation following the task specifications, then records new patterns and learnings.

**Then it stops and asks you**: "Implementation complete. Ready for review?"

> **Shortcut**: Say "don't stop" at any gate to let agents flow through all phases without pausing.

---

## The Agents

| Agent | What it does | When it's active |
|---|---|---|
| **AI Department** | Your single point of contact. Routes requests to the right specialist. | Always (primary agent) |
| **@requirements-engineer** | Creates backlogs — stories, tasks, estimates | Planning phase |
| **@software-architect** | Designs systems — architecture, ADRs, task refinement | Design phase |
| **@developer** | Writes code — implementation, tests, debugging | Implementation phase |
| **@security-engineer** | Conducts security reviews, vulnerability assessments, threat modeling | Security review phase |
| **@qa-engineer** | Designs test strategies, creates test plans, enforces quality gates | QA phase |

All agent definitions live in `.opencode/agents/`. Each is a markdown file with a system prompt defining behavior, tools, and permissions.

---

## Context Engine Architecture

The Context Engine gives agents project knowledge through three complementary layers.

### Layer 1: Skills — On-Demand Knowledge

Skills are instruction files in `.opencode/skills/` loaded via the `skill` tool at the start of each phase.

| Skill | Purpose |
|---|---|
| `project-standards` | Coding standards, quality requirements, naming conventions |
| `codebase-map` | Project structure, directory layout, file organization |
| `active-context` | Current work state — open stories, in-flight tasks, project phase |
| `debugging-playbook` | Troubleshooting guides, known issues, lessons learned |

### Layer 2: Context Compaction — Session Persistence

The `context-compaction` plugin hooks into OpenCode's session compaction to preserve the active task ID, title, goal, and success criteria across long sessions.

### Layer 3: Memory Search — Knowledge Retrieval

The `memory-search` tool searches the `memory/` knowledge base by keyword and category, replacing manual directory browsing.

---

## The Knowledge System

**Skills** (`.opencode/skills/`) — Instruction files agents load before starting work:
- `project-standards` — Coding standards, naming conventions, quality rules
- `codebase-map` — Project structure, where things live
- `active-context` — Open stories, in-flight tasks
- `debugging-playbook` — Known issues, troubleshooting steps

**Memory** (`memory/`) — A committed knowledge base that grows over time:
- `Knowledge/` — Architecture decisions, standards, tech stack choices
- `Pattern/` — Reusable code and workflow patterns
- `Learning/` — Lessons learned, things that didn't work
- `Debugging/` — Troubleshooting guides for known issues

---

## Plugins

| Plugin | File | Hook | What it does |
|---|---|---|---|
| **security-protection** | `.opencode/plugins/security-protection.js` | `tool.execute.before` | Blocks agent access to sensitive files (`.env`, `.pem`, `.pfx`, `id_rsa`) |
| **context-compaction** | `.opencode/plugins/context-compaction.js` | `experimental.session.compacting` | Preserves active task and story context during session compaction |
| **memory-auto-record** | `.opencode/plugins/memory-auto-record.js` | `experimental.session.compacting` | Detects completed tasks with no memory entry and reminds agents to record learnings |

---

## Tools

| Tool | File | What it does |
|---|---|---|
| **memory-search** | `.opencode/tools/memory-search.js` | Searches `memory/` by keyword and optional category. Returns file paths and relevant snippets, scored by relevance. |
| **task-graph** | `.opencode/tools/task-graph.js` | Visualizes task status and dependencies from `.local/agenttasks/` and `.local/stories/`. Shows story groupings and dependency chains. |

---

## Commands

| Command | What it does |
|---|---|
| `/plan <request>` | Start a planning session — loads context, checks existing work, creates tasks |
| `/status` | Get a status report — open stories, tasks, recent commits, current phase |
| `/review [task]` | Review a task — checks each success criterion as ✅/❌/⚠️ |
| `/memory-search <query>` | Search the knowledge base by keyword |
| `/handoff` | Generate a structured handoff document for transitioning between sessions or team members |

---

## Standards & Schemas (`instructions/`)

| File | What it defines |
|---|---|
| `AGENTS.md` | Central index — the master document all agents follow |
| `AGENT_TASK_SCHEMA.md` | How to write a task (fields, complexity tiers, success criteria) |
| `STORY_SCHEMA.md` | How to write a story (grouping related tasks) |
| `ADR_SCHEMA.md` | How to write architecture decisions |
| `QUALITY_STANDARDS.md` | Definition of Done, testing requirements |
| `COMMUNICATION_STANDARDS.md` | How agents should communicate |

---

## Task Management (`.local/` — git-ignored)

Work-in-progress files local to your machine:
- `.local/agenttasks/` — Individual task files (YAML) with goals, success criteria, complexity
- `.local/stories/` — Story files (Markdown) grouping related tasks

These are git-ignored because they're your local working state, not shared config.

---

## Phase Gating Rules

Each phase boundary requires explicit user approval before proceeding:

```
Planning → [User Gate] → Design → [User Gate] → Implementation → [User Gate]
```

At each gate, agents ask: **"Approve to continue to [next phase]? (yes/no/don't stop/stop at phase X)"**

| Response | Effect |
|---|---|
| **"yes"** | Proceed to the next phase |
| **"no"** | Stay in the current phase for revisions |
| **"don't stop"** | Proceed through all remaining phases without pausing |
| **"stop at phase X"** | Proceed until reaching phase X, then pause for feedback |

Agents record the user's decision in the relevant AgentTask, Story, or ADR before transitioning.
