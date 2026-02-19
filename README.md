# Autonomic-OpenCode-CLI

A quick-start toolkit for OpenCode with autonomous agents. It provides a multi-agent system that functions like a complete developer department — agents plan, build, review, and ship code on their own.

## Goals

- **Quick Start** — Get up and running with OpenCode agents immediately.
- **Autonomic System** — Agents work autonomously to complete tasks.
- **Virtual Department** — Simulates roles within a software development team (Developers, PMs, QA).

## Documentation

- [Project Documentation](docu/PROJECT_DOCUMENTATION.md) — Full reference for all components, agents, commands, skills, tools, and plugins.
- [Example Workflow](docu/EXAMPLE_WORKFLOW.md) — End-to-end scenario walkthrough.

## Project Structure

```
.opencode/
├── agents/          # Agent definitions (ai-department, requirements-engineer, software-architect, developer, security-engineer, qa-engineer)
├── plugins/         # Lifecycle hooks (security-protection, context-compaction, memory-auto-record)
├── skills/          # On-demand knowledge (project-standards, codebase-map, active-context, debugging-playbook)
└── tools/           # Custom tools (memory-search, task-graph)

instructions/        # Standards and schemas (AGENTS.md, QUALITY_STANDARDS.md, etc.)
memory/              # Committed knowledge base (Knowledge/, Pattern/, Learning/, Debugging/)
.local/              # Git-ignored task management (agenttasks/, stories/)
```

## Installation

Use these agents in any project — no Git submodules required. The sync scripts download the latest configuration directly from this repository.

### How It Works

The scripts automatically detect your environment:
- **Inside a DevContainer** — Syncs to the **current project directory** (`.opencode/`, `instructions/`, `opencode.jsonc`).
- **Host Machine (Global)** — Syncs to your **global OpenCode config** (`~/.config/opencode` or `%USERPROFILE%\.config\opencode`).

### One-Liner Install

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.ps1'))
```

**Linux / macOS (Bash):**
```bash
curl -fsSL https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.sh | bash
```

### Manual Installation

Download the scripts from the `scripts/` directory and place them in your project root.
