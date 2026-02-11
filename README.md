# Autonomic-OpenCode-CLI

## Overview
This project provides a quick start for OpenCode with agents. It implements an autonomic multi-agent system designed to function like a complete developer department.

## Goals

- **Quick Start**: Get up and running with OpenCode agents immediately.
- **Autonomic System**: Agents work autonomously to complete tasks.
- **Virtual Department**: Simulates roles within a software development team (e.g., Developers, PMs, QA).

## Context Engine

The project includes a three-layer Context Engine that gives agents a deeper understanding of the project before they act.

### 1. Agent Skills (on-demand knowledge)

Skills are instruction files loaded via the `skill` tool. Each agent loads the skills relevant to their phase.

| Skill | Purpose |
|---|---|
| `project-standards` | Coding standards, quality requirements, naming conventions |
| `codebase-map` | Project structure, directory layout, file organization |
| `active-context` | Current work state — open stories, in-flight tasks, project phase |
| `debugging-playbook` | Troubleshooting guides, known issues, lessons learned |

### 2. Context Compaction (session persistence)

A plugin that hooks into OpenCode's session compaction to preserve the active task ID, title, goal, and success criteria across long sessions.

### 3. Memory Search (knowledge retrieval)

A custom tool (`memory-search`) that searches the `memory/` knowledge base by keyword and category, replacing manual directory browsing.

### Quick Commands

| Command | What it does |
|---|---|
| `/plan <request>` | Start a planning session with full context |
| `/status` | Generate a project status report |
| `/review <task>` | Review changes against task success criteria |
| `/memory-search <query>` | Search project memory by keyword |

## Project Structure

```
.opencode/
├── agents/          # Agent definitions (ai-department, requirements-engineer, software-architect, developer)
├── plugins/         # Lifecycle hooks (security-protection, context-compaction)
├── skills/          # On-demand knowledge (project-standards, codebase-map, active-context, debugging-playbook)
├── tools/           # Custom tools (memory-search)
└── commands/        # Prompt templates (/plan, /status, /review, /memory-search)

instructions/        # Standards and schemas (AGENTS.md, QUALITY_STANDARDS.md, etc.)
memory/              # Committed knowledge base (Knowledge/, Pattern/, Learning/, Debugging/)
.local/              # Git-ignored task management (agenttasks/, stories/)
```

## Usage in Other Projects

You can easily use these agents in any other project without using Git submodules. We provide synchronization scripts that download the latest configuration directly from this repository.

### Synchronization Logic

The scripts automatically detect your environment:
- **Inside a DevContainer**: Syncs configuration to the **current project directory** (`.opencode/`, `instructions/`, `opencode.jsonc`).
- **Host Machine (Global)**: Syncs configuration to your **global OpenCode config** (`~/.config/opencode` or `%USERPROFILE%\.config\opencode`).

### Quick Start (One-Liner)

Run these commands in your terminal to install or update the agents.

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.ps1'))
```

**Linux / macOS (Bash):**
```bash
curl -fsSL https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.sh | bash
```

### Manual Installation

Alternatively, you can download the scripts from the `scripts/` directory and place them in your project root.

