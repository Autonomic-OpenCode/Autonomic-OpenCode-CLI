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

Open OpenCode and talk to the AI Department agent (it's the primary agent — selected by default, or press Tab to cycle to it). Just describe what you need in plain language.

Or use a shortcut command:
- **`/plan <request>`** — Jump straight into a planning session
- **`/status`** — See what's currently in progress
- **`/review`** — Check if a task's success criteria are met

### 2. Planning Phase → @requirements-engineer

The AI Department routes your request to the Requirements Engineer, who:
- Checks what work already exists (open stories, in-flight tasks)
- Breaks your request into **Stories** (big work) and **AgentTasks** (individual units of work)
- Assigns complexity estimates (Nano, Tiny, Medium, Large, Mega)
- Writes everything to structured files in `.local/stories/` and `.local/agenttasks/`

**Then it stops and asks you**: "Here's the plan. Approve to continue to Design?"

### 3. Design Phase → @software-architect

Once you approve, the Architect:
- Reviews the tasks for technical feasibility
- Adds implementation details (frameworks, patterns, interfaces)
- Creates Architecture Decision Records (ADRs) for significant choices
- Refines the tasks with specific technical constraints

**Then it stops and asks you**: "Here's the design. Approve to continue to Implementation?"

### 4. Implementation Phase → @developer

Once you approve, the Developer:
- Writes the actual code following the task specifications
- Writes tests
- Updates documentation
- Records new patterns and learnings for future reference

**Then it stops and asks you**: "Implementation complete. Ready for review?"

> **Shortcut**: Say "don't stop" at any gate to let agents flow through all phases without pausing.

## What's In This Repository

### The Agents

| Agent | What it does | When it's active |
|---|---|---|
| **AI Department** | Your single point of contact. Routes requests to the right specialist. | Always (primary agent) |
| **@requirements-engineer** | Creates backlogs — stories, tasks, estimates | Planning phase |
| **@software-architect** | Designs systems — architecture, ADRs, task refinement | Design phase |
| **@developer** | Writes code — implementation, tests, debugging | Implementation phase |

All agent definitions live in `.opencode/agents/`. Each is a markdown file with a system prompt that tells the AI how to behave, what tools it can use, and what it's not allowed to do.

### The Knowledge System

Agents need context to do good work. Three mechanisms provide it:

**Skills** (`.opencode/skills/`) — Instruction files agents load before starting work. Think of them as "cheat sheets" for each phase:
- `project-standards` — Your coding standards, naming conventions, quality rules
- `codebase-map` — How the project is structured, where things live
- `active-context` — What's currently being worked on (open stories, tasks)
- `debugging-playbook` — Known issues, troubleshooting steps

**Memory** (`memory/`) — A committed knowledge base that grows over time. Agents write to it after completing work, and search it before starting new work:
- `Knowledge/` — Architecture decisions, standards, tech stack choices
- `Pattern/` — Reusable code and workflow patterns
- `Learning/` — Lessons learned, things that didn't work
- `Debugging/` — Troubleshooting guides for known issues

**Compaction Plugin** — When a session gets long, OpenCode compresses the conversation. This plugin ensures the active task context (what you're working on, what the success criteria are) survives that compression.

### Commands

Shortcuts you type in OpenCode to trigger common workflows:

| Command | What it does |
|---|---|
| `/plan <request>` | Start a planning session — the agent loads context, checks existing work, creates tasks |
| `/status` | Get a status report — open stories, tasks, recent commits, current phase |
| `/review [task]` | Review a task — checks each success criterion as ✅/❌/⚠️ |
| `/memory-search <query>` | Search the knowledge base by keyword |

### Standards & Schemas (`instructions/`)

Templates and rules that keep everything consistent:

| File | What it defines |
|---|---|
| `AGENTS.md` | Central index — the master document all agents follow |
| `AGENT_TASK_SCHEMA.md` | How to write a task (fields, complexity tiers, success criteria) |
| `STORY_SCHEMA.md` | How to write a story (grouping related tasks) |
| `ADR_SCHEMA.md` | How to write architecture decisions |
| `QUALITY_STANDARDS.md` | Definition of Done, testing requirements |
| `COMMUNICATION_STANDARDS.md` | How agents should communicate |

### Task Management (`.local/` — git-ignored)

Work-in-progress files that are local to your machine:
- `.local/agenttasks/` — Individual task files (YAML) with goals, success criteria, complexity
- `.local/stories/` — Story files (Markdown) grouping related tasks

These are git-ignored because they're your local working state, not shared config.

## Project Structure

```
.opencode/
├── agents/          # Agent definitions (who does what)
├── skills/          # Knowledge files agents load on demand
├── plugins/         # Lifecycle hooks (security, compaction)
├── tools/           # Custom tools (memory-search)
└── commands/        # Shortcut templates (/plan, /status, /review, /memory-search)

instructions/        # Standards and schemas all agents follow
memory/              # Committed knowledge base (grows over time)
.local/              # Git-ignored local task management
scripts/             # Sync scripts for installing in other projects
opencode.jsonc       # OpenCode configuration
```

## Using This in Another Project

You don't need to clone this repo into every project. Run one command to sync the agent configuration:

**Linux / macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.sh | bash
```

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.ps1'))
```

This downloads the agents, skills, plugins, tools, commands, instructions, and config into your project. Run it again anytime to update.

The scripts auto-detect whether you're in a DevContainer (syncs to project root) or on your host machine (syncs to `~/.config/opencode` for global use).

