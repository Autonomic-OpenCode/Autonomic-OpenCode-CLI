# Autonomic-OpenCode-CLI

## Overview
This project provides a quick start for OpenCode with agents. It implements an autonomic multi-agent system designed to function like a complete developer department.

## Goals
- **Quick Start**: Get up and running with OpenCode agents immediately.
- **Autonomic System**: Agents work autonomously to complete tasks.
- **Virtual Department**: Simulates roles within a software development team (e.g., Developers, PMs, QA).

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

