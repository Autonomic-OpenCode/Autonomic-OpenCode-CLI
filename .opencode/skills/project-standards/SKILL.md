---
name: project-standards
description: Load project coding standards, quality requirements, communication rules, naming conventions, and architecture decisions. Use this skill before creating AgentTasks, writing code, or reviewing deliverables.
compatibility: opencode
metadata:
    category: knowledge
    source: instructions/ + memory/Knowledge/
---

# Project Standards

Load this skill to understand the standards and conventions that govern all work in this project.

## How to Use

1. Read the sections below for a summary of each standard
2. For full details, open the referenced file
3. Check `memory/Knowledge/` for project-specific ADRs and tech stack decisions

## Quality Standards (from `instructions/QUALITY_STANDARDS.md`)

- **Completeness**: No TODOs or placeholders in final outputs
- **Accuracy**: Verify facts and file paths before execution
- **Clean Code**: Readable, maintainable, no dead code
- **Naming**: lowercase/kebab-case for files, language-specific conventions for code
- **Testing**: Every functional change needs a corresponding test
- **Definition of Done**: Deliverable meets goal, code follows standards, tests pass, docs updated, no new errors
- **Failure Protocol**: Self-correct (up to 3 attempts) → Ask for info → Consult user
- **Security**: Never access `.env`, certificates, or secrets directly

## Communication Standards (from `instructions/COMMUNICATION_STANDARDS.md`)

- **Perspective**: Act as a team member ("We", "Our")
- **Tone**: Professional, concise, solution-oriented
- **Emojis**: Minimal — only for status indicators (✅/❌)
- **Delegation format**: `@AgentName execute [Task ID]. Context: .local/agenttasks/[filename].`
- **Status reporting**: `✅ Task [ID] completed. [Summary]. Updated memory at [path].`

## Task Schemas

- **Features/Chores**: Follow `instructions/AGENT_TASK_SCHEMA.md` — YAML in `.local/agenttasks/`
- **Bug Reports**: Follow `instructions/BUG_REPORT_SCHEMA.md` — YAML in `.local/agenttasks/`
- **Stories** (Large/Mega work): Follow `instructions/STORY_SCHEMA.md` — Markdown in `.local/stories/`
- **Architecture Decisions**: Follow `instructions/ADR_SCHEMA.md` — Markdown in `memory/Knowledge/`
- **Complexity Tiers**: Nano (0-2), Tiny (3-5), Medium (6-15), Large (16-30, needs Story), Mega (30+, needs Story)

## AgentTask Embedded Context

When creating AgentTasks, populate these fields from memory:

- `embedded_standards`: Pull from `memory/Knowledge/` — tech stack, coding conventions, relevant ADRs
- `embedded_learnings`: Pull from `memory/Pattern/` and `memory/Learning/` — reusable patterns, past solutions

Use the `memory-search` tool to find relevant content for these fields.

## File Naming Conventions

- All files: **lowercase** with **hyphens** (e.g., `my-new-feature.md`)
- AgentTasks: `task-[id]-[description].yaml` (e.g., `task-001-implement-login.yaml`)
- Bug Reports: `bug-[id]-[description].yaml`
- Stories: `story-[id]-[description].md`
- ADRs: `adr-[id]-[description].md`
- Agents: `[role-name].md` in `.opencode/agents/`

## Memory Update Rules

- Store new patterns in `memory/Pattern/`
- Store architecture decisions as ADRs in `memory/Knowledge/`
- Store lessons learned in `memory/Learning/`
- Store troubleshooting guides in `memory/Debugging/`
- Write from team perspective ("We encountered...", "Our approach...")
