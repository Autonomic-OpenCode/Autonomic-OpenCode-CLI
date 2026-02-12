---
name: codebase-map
description: Understand the project structure, directory layout, key modules, configuration files, and file organization conventions. Use this skill when designing architecture, navigating the codebase, or onboarding to a new area of the project.
compatibility: opencode
metadata:
  category: navigation
  source: project-root
---

# Codebase Map

Load this skill to understand how this project is organized and where things live.

## How to Use

1. Review the directory layout below for an overview
2. Use `ls` or `find` to explore specific directories for current state
3. Check `memory/Knowledge/` for architecture decisions that explain structural choices

## Project Directory Layout

```
project-root/
├── .opencode/                  # OpenCode agent system configuration
│   ├── agents/                 # Agent definitions (primary + subagents)
│   │   ├── ai-department.md    # Primary agent — routes all requests
│   │   ├── requirements-engineer.md  # Subagent — planning phase
│   │   ├── software-architect.md     # Subagent — design phase
│   │   └── developer.md              # Subagent — implementation phase
│   ├── plugins/                # OpenCode lifecycle plugins
│   │   ├── security-protection.js    # Blocks access to sensitive files
│   │   └── memory-auto-record.js     # Prompts agent to record learnings after tasks
│   ├── skills/                 # On-demand knowledge modules (this directory)
│   ├── tools/                  # Custom tools for agents
│   │   ├── memory-search.js    # Search memory/ directory by keyword
│   │   └── task-graph.js       # Visualize task status and dependencies
│   └── commands/               # Reusable command templates
│       ├── plan.md             # /plan — start a planning session
│       ├── status.md           # /status — generate project status report
│       ├── review.md           # /review — review changes against task criteria
│       ├── memory-search.md    # /memory-search — search project memory
│       └── handoff.md          # /handoff — generate structured handoff document
├── instructions/               # Standards and schemas (loaded via opencode.jsonc)
│   ├── AGENTS.md               # Central agent system overview
│   ├── AGENT_SCHEMA.md         # How to define new agents
│   ├── AGENT_TASK_SCHEMA.md    # How to define tasks (features/chores)
│   ├── BUG_REPORT_SCHEMA.md    # How to define bug reports
│   ├── STORY_SCHEMA.md         # How to define stories (large work)
│   ├── ADR_SCHEMA.md           # How to document architecture decisions
│   ├── QUALITY_STANDARDS.md    # Quality, testing, DoD, failure handling
│   └── COMMUNICATION_STANDARDS.md  # Tone, delegation format, status reporting
├── memory/                     # Committed knowledge base
│   ├── Knowledge/              # Architecture decisions, tech stack, ADRs
│   ├── Pattern/                # Reusable code patterns and templates
│   ├── Learning/               # Lessons learned, error solutions
│   └── Debugging/              # Troubleshooting guides, known issues
├── src/                        # Source code (only Developer touches this)
├── docu/                       # Project documentation (team perspective)
├── scripts/                    # Utility scripts
│   ├── sync-agents.sh          # Sync agent config (Linux/Mac)
│   └── sync-agents.ps1         # Sync agent config (Windows)
├── .local/                     # Git-ignored local work
│   ├── agenttasks/             # Active task YAML files
│   └── stories/                # Active story files
├── .github/agents/             # GitHub Copilot agent definitions
├── opencode.jsonc              # OpenCode configuration (MCP servers, keybinds)
└── README.md                   # Project overview
```

## Key Configuration Files

- **`opencode.jsonc`**: Main OpenCode config — MCP servers, keybinds, instruction paths
- **`instructions/*.md`**: Loaded as system instructions for all agents (via `opencode.jsonc` instructions array)
- **`.opencode/agents/*.md`**: Agent definitions with YAML frontmatter + system prompt

## Agent System Architecture

- **AI-Department** (primary): User-facing router, delegates to specialists
- **Requirements Engineer** (subagent): Planning phase — creates Stories and AgentTasks
- **Software Architect** (subagent): Design phase — designs architecture, refines tasks
- **Developer** (subagent): Implementation phase — writes code and tests

## Phase Flow

```
Planning → [User Gate] → Design → [User Gate] → Implementation → [User Gate]
```

Each phase requires user approval before proceeding (unless "don't stop" is specified).

## Where to Put New Files

| Content Type | Location | Format |
|---|---|---|
| Agent definitions | `.opencode/agents/` | Markdown with YAML frontmatter |
| Plugins | `.opencode/plugins/` | JavaScript/TypeScript |
| Skills | `.opencode/skills/<name>/` | `SKILL.md` with YAML frontmatter |
| Custom tools | `.opencode/tools/` | JavaScript/TypeScript |
| Commands | `.opencode/commands/` | Markdown templates |
| Standards/schemas | `instructions/` | Markdown |
| Architecture decisions | `memory/Knowledge/` | Markdown (ADR format) |
| Code patterns | `memory/Pattern/` | Markdown |
| Lessons learned | `memory/Learning/` | Markdown |
| Troubleshooting | `memory/Debugging/` | Markdown |
| Source code | `src/` | Language-specific |
| Project docs | `docu/` | Markdown |
| Tasks | `.local/agenttasks/` | YAML |
| Stories | `.local/stories/` | Markdown |

