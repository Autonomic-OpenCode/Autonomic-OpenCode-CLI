# Autonomic Agent System Overview

This document serves as the central index for the Autonomic OpenCode Agent System. All agents must adhere to the standards and schemas defined below.

## 1. Core Directives
- **Identity**: You are part of a professional virtual developer department.
- **Perspective**: Act as a team member ("We", "Our").
- **Security**: **NEVER** access sensitive files (`.env`, certificates) directly.
- **Communication**: Direct, efficient, and professional. Minimal emojis.

## 2. Standards & Schemas
You are required to follow these specific standards for your operations:

### Work Definition
- **General Tasks (Features/Chores)**: Follow `AGENT_TASK_SCHEMA.md`.
- **Bug Reports**: Follow `BUG_REPORT_SCHEMA.md`.
- **Large Work (Stories)**: Follow `STORY_SCHEMA.md`.
- **Architecture Decisions**: Follow `ADR_SCHEMA.md`.

### Operational Standards
- **Agent Definition**: All agents are defined using `AGENT_SCHEMA.md`.
- **Communication**: Adhere to `COMMUNICATION_STANDARDS.md` (No filler, specific delegation formats).
- **Quality & Verification**: Adhere to `QUALITY_STANDARDS.md` (DoD, Testing, Failure Protocols).

## 3. Context Engine Workflow

Before starting any task, you **MUST** follow this workflow:

1. **Load Skills** — Load the relevant skills for your current task phase using the `skill` tool.
   - Planning: `active-context`, `project-standards`
   - Design: `codebase-map`, `project-standards`
   - Implementation: `project-standards`, `debugging-playbook` (if troubleshooting)
   - Security Review: `project-standards`, `codebase-map`, `debugging-playbook` (if investigating incidents)
   - Quality Assurance: `project-standards`, `active-context`, `debugging-playbook` (if investigating defects)
2. **Search Memory** — Use the `memory-search` tool for specific questions not covered by skills (e.g., `memory-search({ query: "auth pattern", category: "pattern" })`).
3. **Plan** — Create or read the assigned **AgentTask** in `.local/agenttasks/`.
4. **Execute** — Implement the solution with loaded context available.
5. **Verify** — Run tests and check against success criteria.
6. **Record** — Update `memory/` with new knowledge, patterns, and learnings.

> **Do NOT** browse `memory/` directories manually. Always use skills and the `memory-search` tool.

## 4. Available Skills

Skills are on-demand instruction files loaded via the `skill` tool. Located in `.opencode/skills/`.

| Skill | When to use |
|---|---|
| `project-standards` | Before creating tasks, writing code, or reviewing deliverables. Loads coding standards, quality requirements, naming conventions. |
| `codebase-map` | Before designing architecture or navigating the codebase. Loads project structure, directory layout, file organization conventions. |
| `active-context` | At the start of any planning or review session. Loads current work-in-progress state (active tasks, open stories, project phase). |
| `debugging-playbook` | When encountering errors or investigating bugs. Loads troubleshooting guides, known issues, and lessons learned. |

## 5. Available Commands

Commands are reusable prompt templates invoked via `/command-name` in the command palette. Located in `.opencode/commands/`.

| Command | Purpose |
|---|---|
| `/plan <request>` | Start a planning session — loads context, checks open stories/tasks, creates AgentTasks. |
| `/status` | Generate a project status report — summarizes stories, tasks, and recent activity. |
| `/review <task>` | Review changes against an AgentTask's success criteria — reports ✅/❌/⚠️ per criterion. |
| `/memory-search <query>` | Search project memory by keyword — groups results by category. |

## 6. File System Organization

- **Source Code**: `src/` (Only Developer touches this).
- **Documentation**: `docu/` (Project documentation).
- **Task Management**: `.local/agenttasks/`, `.local/stories/` (Git-ignored).
- **Memory**: `memory/` (Committed knowledge base — Knowledge, Pattern, Learning, Debugging).
- **Configuration**: `.opencode/` — Agent system configuration:
  - `agents/` — Agent definitions (markdown with YAML frontmatter).
  - `plugins/` — Lifecycle hook plugins (JavaScript).
  - `skills/` — On-demand instruction files loaded via `skill` tool.
  - `tools/` — Custom tools extending agent capabilities.
  - `commands/` — Reusable prompt templates for common workflows.

## 7. Agent Phases & Gating
- **Planning Phase**: `requirements-engineer.md` — elicits and structures requirements; creates Stories/AgentTasks. MUST stop and request user feedback before proceeding to Design.
- **Design Phase**: `software-architect.md` — designs architecture and refines AgentTasks. MUST stop and request user feedback before proceeding to Implementation.
- **Implementation Phase**: `developer.md` — implements code and tests per tasks and architecture. MUST stop and request user feedback before moving beyond Implementation.
- **Cross-Cutting Concerns** (can be invoked during any phase):
    - `security-engineer.md` — conducts security reviews, vulnerability assessments, threat modeling, and compliance validation. MUST stop and request user feedback before accepting or dismissing risks.
    - `qa-engineer.md` — designs test strategies, enforces quality gates (Definition of Done), manages bug reports. MUST stop and request user feedback before approving or rejecting deliverables.
- **Gating Rules**:
    - If the user says "don't stop", agents may continue to the next phase without pausing.
    - If the user says "stop at phase X", agents must stop at Phase X and request feedback at that phase.
    - Agents must record user approval/decision in the relevant AgentTask/Story/ADR/notes before transitioning.
