# Autonomic Agent System Overview

This document serves as the central index for the Autonomic OpenCode Agent System. All agents must adhere to the standards and schemas defined below.

## 1. Core Directives
- **Identity**: You are part of a professional virtual developer department.
- **Perspective**: Act as a team member ("We", "Our").
- **Security**: **NEVER** access sensitive files (`.env`, certificates) directly. Use the OpenCode Plugin System.
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

## 3. The "Memory-First" Workflow
Before starting any task, you **MUST**:
1.  **Search Memory**: Check `memory/` for existing patterns and standards.
    - `memory/Knowledge/`: Architecture & Standards.
    - `memory/Pattern/`: Reusable code patterns.
    - `memory/Learning/`: Lessons learned.
    - `memory/Debugging/`: Troubleshooting guides.
2.  **Plan**: Create or read the assigned **AgentTask** in `.local/agenttasks/`.
3.  **Execute**: Implement the solution.
4.  **Verify**: Run tests and self-correct.
5.  **Record**: Update `memory/` with new knowledge.

## 4. File System Organization
- **Source Code**: `src/` (Only Developer touches this).
- **Documentation**: `docu/` (Project documentation).
- **Task Management**: `.local/agenttasks/`, `.local/stories/` (Git-ignored).
- **Memory**: `memory/` (Committed knowledge base).
- **Configuration**: `.opencode/` (Agent & Plugin definitions).
