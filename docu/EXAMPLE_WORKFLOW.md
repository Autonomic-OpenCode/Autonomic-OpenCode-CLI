# Autonomic OpenCode — Example Workflow

This document walks through a complete, end-to-end scenario using Autonomic OpenCode: from a user's initial request through planning, design, implementation, and review. Every component in the system — agents, skills, tools, plugins, and commands — is demonstrated in context.

**Scenario**: Add a REST API for user profile management with CRUD operations.

---

## Table of Contents

1. [Overview](#1-overview)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [The Example Scenario](#3-the-example-scenario)
4. [Behind the Scenes: How Components Work Together](#4-behind-the-scenes-how-components-work-together)
5. [Quick Reference](#5-quick-reference)
6. [Getting Started](#6-getting-started)

---

## 1. Overview

### What Is Autonomic OpenCode?

Autonomic OpenCode is a multi-agent AI developer department that runs inside [OpenCode](https://opencode.ai). Instead of prompting a single AI assistant to write code, you talk to one primary agent — the **AI Department** — and it delegates work to specialist agents who handle planning, architecture, implementation, security, and quality assurance.

### What Can It Accomplish?

The system covers the full software development lifecycle (SDLC):

- **Planning** — The Requirements Engineer creates structured backlogs with stories and tasks.
- **Design** — The Software Architect designs systems, makes architecture decisions, and refines tasks with technical details.
- **Implementation** — The Developer writes code, tests, and documentation.
- **Security** — The Security Engineer conducts vulnerability assessments and threat modeling.
- **Quality Assurance** — The QA Engineer enforces quality gates and manages test strategies.

### The Key Differentiator

You talk to one agent. It delegates to specialists. Each specialist pauses at phase boundaries and asks for your approval before the next phase begins. You stay in control without doing the planning, structuring, or task breakdown yourself.

---

## 2. System Architecture Overview

### The `.opencode/` Configuration Structure

The entire agent system is configured through files in the project directory:

```
.opencode/
├── agents/                 # Agent definitions (primary + subagents)
│   ├── ai-department.md    # Primary agent — routes all requests
│   ├── requirements-engineer.md  # Planning phase
│   ├── software-architect.md     # Design phase
│   ├── developer.md              # Implementation phase
│   ├── security-engineer.md      # Cross-cutting — security reviews
│   └── qa-engineer.md            # Cross-cutting — quality gates
├── plugins/                # Lifecycle hook plugins
│   ├── security-protection.js    # Blocks access to sensitive files
│   ├── context-compaction.js     # Preserves task context during session compaction
│   └── memory-auto-record.js     # Reminds agents to record learnings
├── skills/                 # On-demand knowledge modules
│   ├── project-standards/        # Coding standards, quality rules, naming conventions
│   ├── codebase-map/             # Project structure and directory layout
│   ├── active-context/           # Current work state (open stories, tasks)
│   └── debugging-playbook/       # Troubleshooting guides and known issues
├── tools/                  # Custom tools for agents
│   ├── memory-search.js          # Search memory/ by keyword and category
│   └── task-graph.js             # Visualize task status and dependencies
└── commands/               # Reusable command templates
    ├── plan.md                   # /plan — start a planning session
    ├── status.md                 # /status — generate project status report
    ├── review.md                 # /review — review changes against task criteria
    ├── memory-search.md          # /memory-search — search project memory
    └── handoff.md                # /handoff — generate structured handoff document
```

### Component Types

| Component | Location | Purpose |
|---|---|---|
| **Agents** | `.opencode/agents/` | Markdown files with YAML frontmatter defining each agent's role, permissions, and system prompt |
| **Plugins** | `.opencode/plugins/` | JavaScript modules that hook into OpenCode lifecycle events (tool execution, session compaction) |
| **Skills** | `.opencode/skills/` | On-demand instruction files loaded via the `skill` tool — phase-specific knowledge |
| **Tools** | `.opencode/tools/` | Custom tools that extend agent capabilities (searching memory, visualizing tasks) |
| **Commands** | `.opencode/commands/` | Markdown templates invoked via `/command-name` in the command palette |

### The `instructions/` Standards and Schemas

All agents follow shared standards loaded via `opencode.jsonc`:

| File | What It Defines |
|---|---|
| `instructions/AGENTS.md` | Central index — the master document all agents follow |
| `instructions/AGENT_TASK_SCHEMA.md` | How to define tasks (YAML in `.local/agenttasks/`) |
| `instructions/STORY_SCHEMA.md` | How to define stories (Markdown in `.local/stories/`) |
| `instructions/ADR_SCHEMA.md` | How to document architecture decisions (Markdown in `memory/Knowledge/`) |
| `instructions/QUALITY_STANDARDS.md` | Definition of Done, testing requirements, failure protocols |
| `instructions/COMMUNICATION_STANDARDS.md` | Tone, delegation format, status reporting |

### The `memory/` Committed Knowledge Base

A version-controlled knowledge base that grows over time as agents complete work:

| Directory | Content |
|---|---|
| `memory/Knowledge/` | Architecture Decision Records (ADRs), tech stack decisions, standards |
| `memory/Pattern/` | Reusable code and workflow patterns |
| `memory/Learning/` | Lessons learned, error solutions, insights |
| `memory/Debugging/` | Troubleshooting guides, known issues, diagnostic steps |

### The `.local/` Git-Ignored Task Management

Work-in-progress files local to your machine:

- `.local/agenttasks/` — Individual task YAML files with goals, success criteria, and complexity
- `.local/stories/` — Story Markdown files grouping related tasks into larger features

These are git-ignored because they represent your local working state.

### How `opencode.jsonc` Ties It Together

The `opencode.jsonc` configuration file tells OpenCode where to find instructions and what MCP servers to use:

```jsonc
{
    "$schema": "https://opencode.ai/config.json",
    "instructions": ["~/.config/opencode/instructions/*.md", "./instructions/*.md"],
    "keybinds": {
        "session_child_cycle": "shift+ctrl+right",
        "session_child_cycle_reverse": "shift+ctrl+left",
    },
    "mcp": {
        "context7": {
            "type": "local",
            "command": ["npx", "-y", "@upstash/context7-mcp"],
            "enabled": true,
        },
    },
}
```

The `instructions` array loads all Markdown files from `instructions/` as system-level context for every agent.

---

## 3. The Example Scenario

**Scenario**: A user wants to add a REST API for user profile management with CRUD operations (Create, Read, Update, Delete).

Here is the complete lifecycle, showing every component in action.

### Step 1: User Makes a Request

The user opens OpenCode. The **AI Department** agent (defined in `.opencode/agents/ai-department.md`) is the primary agent — it's selected by default. The user types a command in the command palette:

```
/plan Add a REST API for user profile management with CRUD operations
```

The `/plan` command is a template defined in `.opencode/commands/plan.md`. When invoked, OpenCode expands the template and passes the user's text as `$ARGUMENTS`. The expanded prompt instructs the agent to:

1. Load skills `active-context` and `project-standards`
2. Check `.local/stories/` for open stories
3. Check `.local/agenttasks/` for existing tasks
4. Assess scope and create work items
5. Follow the Planning phase workflow from `instructions/AGENTS.md`

### Step 2: AI Department Routes the Request

The AI Department agent receives the expanded `/plan` prompt. Before delegating, it follows the Context Engine Workflow from `instructions/AGENTS.md`:

**First, it searches memory for existing context:**

```
memory-search({ query: "user profile API", category: "knowledge" })
```

The `memory-search` tool (`.opencode/tools/memory-search.js`) searches across `memory/Knowledge/` and returns any relevant ADRs or standards. In this case, it finds `memory/Knowledge/adr-001-context-engine-architecture.md` — not directly related, but confirms the memory system is active.

**Then, it delegates to the Requirements Engineer with skill-loading instructions:**

> @requirements-engineer execute planning for user profile REST API. Context: User requests CRUD operations for user profile management. Load skills `active-context` and `project-standards` before starting.

This delegation format follows `instructions/COMMUNICATION_STANDARDS.md` — direct, efficient, no filler.

### Step 3: Planning Phase (@requirements-engineer)

The Requirements Engineer agent (`.opencode/agents/requirements-engineer.md`) begins its startup workflow.

**Loading skills:**

The agent loads two skills using the `skill` tool:

1. **`active-context`** (`.opencode/skills/active-context/SKILL.md`) — Checks `.local/stories/` and `.local/agenttasks/` for existing work, reviews recent git history, and determines the current project phase.

2. **`project-standards`** (`.opencode/skills/project-standards/SKILL.md`) — Loads coding standards, quality requirements, naming conventions, task schemas, and complexity tiers.

**Searching memory for related patterns:**

```
memory-search({ query: "task creation", category: "pattern" })
```

The tool finds `memory/Pattern/agent-task-creation.md`, which provides the standard pattern for creating well-defined AgentTasks with embedded standards and learnings.

```
memory-search({ query: "REST API", category: "knowledge" })
```

No direct matches — this is a new feature area.

**Creating a Story:**

Since this feature involves multiple endpoints (CRUD), the agent estimates it as **Large (20 points)** complexity, which requires a Story per `instructions/STORY_SCHEMA.md`. The agent creates `.local/stories/story-001-user-profile-api.md`:

```markdown
# STORY-001: User Profile REST API

## Description
Add a complete REST API for user profile management. The API must support
Create, Read, Update, and Delete operations for user profiles, following
RESTful conventions and project coding standards.

## Acceptance Criteria
- [ ] POST /api/profiles creates a new user profile
- [ ] GET /api/profiles/:id retrieves a user profile by ID
- [ ] PUT /api/profiles/:id updates an existing user profile
- [ ] DELETE /api/profiles/:id deletes a user profile
- [ ] All endpoints return appropriate HTTP status codes
- [ ] Input validation rejects malformed requests with 400 responses
- [ ] Unit tests cover all CRUD operations
- [ ] API documentation is updated

## Complexity Analysis
- **Total Points**: 20
- **Breakdown**:
    - Files affected: 6 (6)
    - Code volume: ~400 lines (6)
    - Integrations: 1 database (4)
    - Security: Medium — input validation (4)

## Breakdown Plan
1. **TASK-001**: Define profile data model and repository interface (Complexity: Tiny)
   - Description: Create the profile entity, DTO, and repository interface
   - Dependencies: None

2. **TASK-002**: Implement profile repository (Complexity: Medium)
   - Description: Implement the repository with database access logic
   - Dependencies: TASK-001

3. **TASK-003**: Implement profile API controller with CRUD endpoints (Complexity: Medium)
   - Description: Create the REST controller with Create, Read, Update, Delete endpoints
   - Dependencies: TASK-002

4. **TASK-004**: Add input validation and error handling (Complexity: Tiny)
   - Description: Add request validation, error responses, and edge case handling
   - Dependencies: TASK-003

5. **TASK-005**: Write unit and integration tests (Complexity: Medium)
   - Description: Write tests covering all CRUD operations and error cases
   - Dependencies: TASK-003
```

**Creating AgentTasks:**

For each task in the breakdown, the agent creates a YAML file in `.local/agenttasks/` following `instructions/AGENT_TASK_SCHEMA.md`. Here is `task-001-define-profile-model.yaml`:

```yaml
id: "TASK-001"
title: "Define profile data model and repository interface"
type: "feature"
complexity: "Tiny (4)"
assigned_to: "@developer"

goal:
  summary: "Create the UserProfile entity, ProfileDTO, and IProfileRepository interface."
  success_criteria:
    - "UserProfile entity class exists with Id, FirstName, LastName, Email, Bio, and CreatedAt fields"
    - "ProfileDTO class exists for API request/response serialization"
    - "IProfileRepository interface defines GetById, Create, Update, and Delete methods"
    - "All classes follow project naming conventions"

context:
  embedded_standards: |
    # From memory/Knowledge/adr-001-context-engine-architecture
    - Agents must use memory-search tool instead of browsing memory/ manually
    - Follow the three-layer Context Engine pattern for knowledge retrieval

  embedded_learnings: |
    # From memory/Pattern/agent-task-creation
    - Define clear success criteria for each task
    - Embed relevant standards and learnings directly in the task
    # From memory/Learning/skill-naming-conventions
    - Use lowercase with hyphens for all file names

  user_request: "Add a REST API for user profile management with CRUD operations"

implementation:
  approach: "Define the domain model and data access interface before implementation."
  steps:
    - "Step 1: Create UserProfile entity class in src/Models/"
    - "Step 2: Create ProfileDTO class in src/DTOs/"
    - "Step 3: Create IProfileRepository interface in src/Repositories/"

validation:
  unit_tests: "Verify entity properties and DTO mapping in unit tests."
  manual_verification: "Confirm classes compile and interfaces are correctly defined."
```

The agent creates similar YAML files for TASK-002 through TASK-005, each with appropriate complexity, dependencies, and embedded context from memory.

**Phase gate:**

After creating all work items, the Requirements Engineer pauses and asks:

> We've created STORY-001 with 5 tasks (TASK-001 through TASK-005) covering the full user profile API. Total estimated complexity: 20 points (Large).
>
> **Approve to continue to Design? (yes/no/don't stop/stop at phase X)**

The user reviews the plan and responds: **"yes"**

The agent records the approval in the story file before transitioning.

### Step 4: Design Phase (@software-architect)

The AI Department delegates to the Software Architect (`.opencode/agents/software-architect.md`).

**Loading skills:**

1. **`codebase-map`** (`.opencode/skills/codebase-map/SKILL.md`) — Loads the project directory layout, key modules, file organization conventions, and the phase flow diagram.

2. **`project-standards`** (`.opencode/skills/project-standards/SKILL.md`) — Loads coding standards, task schemas, and the AgentTask embedded context requirements.

**Searching memory for architecture patterns:**

```
memory-search({ query: "repository pattern", category: "pattern" })
```

The tool finds `memory/Pattern/agent-task-creation.md` which references the repository pattern. The architect notes this as a confirmed project convention.

```
memory-search({ query: "API design", category: "knowledge" })
```

No existing ADR for API design — the architect will create one.

**Reviewing and refining AgentTasks:**

The architect reads each task YAML file from `.local/agenttasks/` and adds technical constraints. For example, TASK-003 gets refined with specific implementation details:

```yaml
implementation:
  approach: "Create a RESTful controller using standard HTTP conventions."
  steps:
    - "Step 1: Create ProfileController class in src/Controllers/"
    - "Step 2: Inject IProfileRepository via constructor dependency injection"
    - "Step 3: Implement POST /api/profiles — accepts ProfileDTO, returns 201 with Location header"
    - "Step 4: Implement GET /api/profiles/:id — returns 200 with profile or 404 if not found"
    - "Step 5: Implement PUT /api/profiles/:id — returns 200 with updated profile or 404"
    - "Step 6: Implement DELETE /api/profiles/:id — returns 204 on success or 404"
    - "Step 7: Add consistent error response format for all endpoints"
```

**Creating an Architecture Decision Record:**

The architect creates `memory/Knowledge/adr-002-user-profile-api-design.md` following `instructions/ADR_SCHEMA.md`:

```markdown
# ADR-002: User Profile API Design

## Status
Accepted

## Context
We need a REST API for user profile management with CRUD operations.
The API must follow RESTful conventions, support JSON request/response
bodies, and integrate with the existing data access layer.

- The project uses the Repository pattern for data access.
- We need consistent error handling across all endpoints.
- Input validation must reject malformed requests before they reach business logic.

## Decision
We will implement the API using a controller-repository architecture:
- A single ProfileController handles all CRUD routes under /api/profiles.
- The controller depends on IProfileRepository (injected via DI).
- Request validation occurs at the controller level using DTO validation attributes.
- Error responses follow a consistent format: { "error": "<message>", "status": <code> }.

## Consequences
- **Positive**: Clean separation between HTTP handling and data access.
- **Positive**: Repository interface enables easy testing with mocks.
- **Negative**: Additional DTO mapping layer adds some boilerplate.
- **Risks**: Must ensure validation attributes cover all edge cases to prevent invalid data reaching the repository.
```

**Phase gate:**

> Architecture review complete. We've refined all 5 tasks with technical implementation details and created ADR-002 documenting the API design decisions.
>
> **Approve to continue to Implementation? (yes/no/don't stop/stop at phase X)**

The user responds: **"yes"**

### Step 5: Implementation Phase (@developer)

The AI Department delegates to the Developer agent (`.opencode/agents/developer.md`).

**Loading skills:**

1. **`project-standards`** (`.opencode/skills/project-standards/SKILL.md`) — Loads coding standards, naming conventions, quality requirements, and the Definition of Done checklist.

The Developer reads the refined AgentTask from `.local/agenttasks/task-003-implement-profile-controller.yaml` and begins implementation.

**Searching memory before writing code:**

```
memory-search({ query: "controller pattern", category: "pattern" })
```

```
memory-search({ query: "REST API", category: "learning" })
```

The agent checks for existing patterns and learnings to avoid reinventing solutions or repeating past mistakes.

**Writing code:**

The Developer implements the controller in `src/Controllers/ProfileController.cs`, the repository in `src/Repositories/ProfileRepository.cs`, and writes tests. All work follows the task's `implementation.steps` and `success_criteria`.

**Encountering an error — loading the debugging playbook:**

While running tests, the Developer encounters a database connection error. It loads the `debugging-playbook` skill (`.opencode/skills/debugging-playbook/SKILL.md`) and follows the diagnostic workflow:

1. **Check known issues** — Searches `memory/Debugging/`:
   ```
   memory-search({ query: "database connection", category: "debugging" })
   ```
   Finds `memory/Debugging/plugin-api-context-object.md` — not directly related, but confirms the debugging memory system works.

2. **Check lessons learned** — Searches `memory/Learning/`:
   ```
   memory-search({ query: "connection string", category: "learning" })
   ```
   No matches — this is a new issue.

3. **Diagnostic workflow** — The agent reproduces the issue, isolates the cause (missing test database configuration), and fixes it by adding a test configuration file.

4. **Records the solution** — Creates `memory/Learning/test-database-configuration.md`:
   ```markdown
   # Learning: Test Database Configuration

   ## Context
   We encountered a database connection error while running integration tests
   for the user profile API (TASK-003).

   ## What We Learned
   Integration tests require a separate test database configuration. The test
   project must include its own connection string pointing to an in-memory or
   test-specific database instance.

   ## Impact
   All future integration tests must verify database configuration exists
   before running. Add this to the test setup checklist.
   ```

**Recording new patterns:**

After completing the implementation, the Developer records a new pattern in `memory/Pattern/rest-controller-pattern.md`:

```markdown
# Pattern: REST Controller with Repository

## Context
When implementing REST APIs, we follow a controller-repository pattern
with dependency injection and consistent error handling.

## Pattern
1. Create a controller class with constructor-injected repository interface
2. Map each CRUD operation to standard HTTP methods (POST, GET, PUT, DELETE)
3. Return appropriate status codes (201, 200, 204, 400, 404)
4. Use DTOs for request/response serialization
5. Validate input at the controller level before calling the repository

## When to Use
Any time we create a new REST API endpoint with data persistence.
```

**Phase gate:**

> ✅ Task TASK-003 completed. ProfileController implements all CRUD endpoints with proper status codes and error handling. Tests pass. Updated memory at `memory/Pattern/rest-controller-pattern.md` and `memory/Learning/test-database-configuration.md`.
>
> **Implementation complete. Ready for review?**

### Step 6: Cross-Cutting Concerns

At any phase, the AI Department can invoke cross-cutting specialists for additional review.

#### Security Review (@security-engineer)

The user asks: "Can we get a security review on the profile API before we finalize?"

The AI Department delegates to the Security Engineer (`.opencode/agents/security-engineer.md`):

> @security-engineer execute security review for user profile API. Context: `.local/agenttasks/task-003-implement-profile-controller.yaml`.

**The Security Engineer's startup workflow:**

1. **Loads `project-standards`** — Understands coding standards and security-related conventions.
2. **Loads `codebase-map`** — Identifies attack surfaces and sensitive areas in the project structure.
3. **Searches memory:**
   ```
   memory-search({ query: "input validation", category: "pattern" })
   ```
   ```
   memory-search({ query: "API security", category: "knowledge" })
   ```

The Security Engineer reviews the profile API for:
- Input validation completeness (SQL injection, XSS via profile fields)
- Authorization checks (can users only access their own profiles?)
- Data exposure (are sensitive fields excluded from API responses?)
- Rate limiting considerations

> Security review complete. Found 2 recommendations:
> 1. Add authorization middleware to ensure users can only modify their own profiles.
> 2. Sanitize the Bio field to prevent stored XSS.
>
> **Approve risk assessment and proceed? (yes/no/don't stop)**

#### Quality Gate Enforcement (@qa-engineer)

The AI Department can also invoke the QA Engineer (`.opencode/agents/qa-engineer.md`) for quality gate enforcement:

> @qa-engineer execute quality review for TASK-003. Context: `.local/agenttasks/task-003-implement-profile-controller.yaml`.

**The QA Engineer's startup workflow:**

1. **Loads `project-standards`** — Understands the Definition of Done and testing requirements.
2. **Loads `active-context`** — Understands what tasks are in progress and what needs review.
3. **Searches memory:**
   ```
   memory-search({ query: "test pattern", category: "pattern" })
   ```

The QA Engineer verifies:
- Test coverage meets standards
- All success criteria from the AgentTask are tested
- Edge cases are covered (empty fields, duplicate emails, non-existent IDs)
- No regressions in existing tests

### Step 7: Review Phase

The user runs the review command:

```
/review TASK-003
```

The `/review` command template (`.opencode/commands/review.md`) expands and instructs the agent to:

1. Read the task file from `.local/agenttasks/task-003-implement-profile-controller.yaml`
2. Load the `project-standards` skill
3. Extract the `success_criteria` list
4. Evaluate each criterion against the current codebase
5. Check against `instructions/QUALITY_STANDARDS.md` Definition of Done

**The review output:**

```
## Task Review: TASK-003 — Implement profile API controller with CRUD endpoints

### Success Criteria
| # | Criterion | Status | Notes |
|---|---|---|---|
| 1 | POST /api/profiles creates a new user profile | ✅ Met | Returns 201 with Location header |
| 2 | GET /api/profiles/:id retrieves a profile | ✅ Met | Returns 200 or 404 |
| 3 | PUT /api/profiles/:id updates a profile | ✅ Met | Returns 200 or 404 |
| 4 | DELETE /api/profiles/:id deletes a profile | ✅ Met | Returns 204 or 404 |
| 5 | Consistent error response format | ✅ Met | All errors return { error, status } |
| 6 | Unit tests cover all operations | ⚠️ Partially Met | Missing edge case for duplicate email on create |

### Quality Checklist
- [x] Code compiles without errors
- [x] Tests written and passing
- [x] Documentation updated
- [x] Memory entries recorded

### Remaining Work
- Add unit test for duplicate email rejection on POST /api/profiles
```


### Step 8: Status Check and Handoff

#### Checking project status

The user runs:

```
/status
```

The `/status` command template (`.opencode/commands/status.md`) instructs the agent to load the `active-context` skill, read all stories and tasks, check recent git activity, and present a structured report:

```
## Project Status Report

### Stories
| Story | Title | Status |
|---|---|---|
| STORY-001 | User Profile REST API | In Progress |

### Tasks
| Task | Title | Complexity | Assigned To | Status |
|---|---|---|---|---|
| TASK-001 | Define profile data model and repository interface | Tiny (4) | @developer | Done |
| TASK-002 | Implement profile repository | Medium (8) | @developer | Done |
| TASK-003 | Implement profile API controller with CRUD endpoints | Medium (8) | @developer | In Review |
| TASK-004 | Add input validation and error handling | Tiny (4) | @developer | Ready |
| TASK-005 | Write unit and integration tests | Medium (8) | @developer | Ready |

### Recent Activity
a1b2c3d feat: add UserProfile entity and IProfileRepository interface
e4f5g6h feat: implement ProfileRepository with database access
i7j8k9l feat: implement ProfileController with CRUD endpoints
m0n1o2p test: add unit tests for profile CRUD operations
q3r4s5t docs: create ADR-002 for user profile API design

### Current Phase
Implementation
```

#### Visualizing task dependencies

The user invokes the `task-graph` tool (`.opencode/tools/task-graph.js`) to see task relationships:

```
# 📊 Task Graph

## Summary
Total: 5 | ✅ 2 done | 🔄 1 in-progress | 🔒 0 blocked | ⏳ 2 ready | ❓ 0 unknown

## STORY-001: User Profile REST API

  ✅ **TASK-001**: Define profile data model and repository interface [Tiny (4)] → @developer
  ✅ **TASK-002**: Implement profile repository [Medium (8)] → @developer
  🔄 **TASK-003**: Implement profile API controller with CRUD endpoints [Medium (8)] → @developer
  ⏳ **TASK-004**: Add input validation and error handling [Tiny (4)] → @developer
  ⏳ **TASK-005**: Write unit and integration tests [Medium (8)] → @developer

  Dependencies:
    TASK-001 → TASK-002
    TASK-002 → TASK-003
    TASK-003 → TASK-004
    TASK-003 → TASK-005

  Chain: TASK-001 → TASK-002 → TASK-003 → TASK-004
```

#### Searching memory

The user can search the knowledge base at any time using the `/memory-search` command:

```
/memory-search REST API patterns
```

The `/memory-search` command template (`.opencode/commands/memory-search.md`) invokes the `memory-search` tool and groups results by category:

```
## Memory Search Results: "REST API patterns"

### Knowledge
- memory/Knowledge/adr-002-user-profile-api-design.md
  > We will implement the API using a controller-repository architecture...

### Pattern
- memory/Pattern/rest-controller-pattern.md
  > When implementing REST APIs, we follow a controller-repository pattern...

### Learning
- memory/Learning/test-database-configuration.md
  > Integration tests require a separate test database configuration...

### Debugging
(No results)
```

#### Generating a handoff document

At the end of a session, the user runs:

```
/handoff
```

The `/handoff` command template (`.opencode/commands/handoff.md`) generates a structured handoff document for the next session or team member:

```
## Handoff Document

### Current Phase
Implementation

### Project Summary
We are building a REST API for user profile management with CRUD operations.
The data model and repository are complete. The API controller is implemented
and under review. Input validation and comprehensive testing remain.

### Stories
| Story | Title | Status | Completion |
|---|---|---|---|
| STORY-001 | User Profile REST API | In Progress | 60% |

### Tasks
| Task | Title | Complexity | Assigned To | Status | Remaining Work |
|---|---|---|---|---|---|
| TASK-001 | Define profile data model | Tiny (4) | @developer | Done | — |
| TASK-002 | Implement profile repository | Medium (8) | @developer | Done | — |
| TASK-003 | Implement profile API controller | Medium (8) | @developer | In Review | Fix duplicate email test |
| TASK-004 | Add input validation | Tiny (4) | @developer | Ready | Not started |
| TASK-005 | Write tests | Medium (8) | @developer | Ready | Not started |

### Recent Activity
(last 10 commits shown)

### Uncommitted Changes
None

### Blockers & Risks
- Security review identified 2 recommendations (authorization middleware, XSS sanitization)
- TASK-003 review found missing edge case test

### Key Decisions Made
- ADR-002: Controller-repository architecture for the profile API
- Consistent error response format: { error, status }

### Recommended Next Steps
1. Address security review findings (authorization + XSS sanitization)
2. Complete TASK-003 review by adding duplicate email test
3. Start TASK-004 (input validation and error handling)
4. Start TASK-005 (comprehensive test suite)
```

---

## 4. Behind the Scenes: How Components Work Together

### The Context Engine (Three Layers)

The Context Engine (documented in `memory/Knowledge/adr-001-context-engine-architecture.md`) provides agents with project knowledge through three complementary layers:

#### Layer 1: Skills — On-Demand Knowledge

Skills are instruction files in `.opencode/skills/` loaded via the `skill` tool at the start of each phase. They provide structured, phase-appropriate knowledge without agents needing to browse files manually.

| Skill | File | Loaded By | Purpose |
|---|---|---|---|
| `project-standards` | `.opencode/skills/project-standards/SKILL.md` | All agents | Coding standards, quality requirements, naming conventions, task schemas |
| `codebase-map` | `.opencode/skills/codebase-map/SKILL.md` | @software-architect, @security-engineer | Project structure, directory layout, file organization |
| `active-context` | `.opencode/skills/active-context/SKILL.md` | @requirements-engineer, @qa-engineer | Current work state — open stories, tasks, project phase |
| `debugging-playbook` | `.opencode/skills/debugging-playbook/SKILL.md` | @developer (when troubleshooting), @security-engineer, @qa-engineer | Troubleshooting guides, known issues, diagnostic workflows |

#### Layer 2: Context Compaction Plugin — Session Persistence

The **context-compaction** plugin (`.opencode/plugins/context-compaction.js`) hooks into OpenCode's `experimental.session.compacting` event. When a long session is compacted to save context window space, this plugin preserves the active task's critical information:

- Reads `.local/agenttasks/` to find the most recently modified task file
- Extracts the task ID, title, goal, complexity, assigned agent, and top 5 success criteria
- Reads `.local/stories/` for the active story title
- Injects this context into the compacted session via `output.context.push(...)`

Without this plugin, agents would lose track of what they were working on after session compaction.

#### Layer 3: Memory Search Tool — Knowledge Retrieval

The **memory-search** tool (`.opencode/tools/memory-search.js`) provides keyword-based search across the `memory/` directory. It replaces manual directory browsing and supports filtering by category:

```
memory-search({ query: "repository pattern", category: "pattern" })
memory-search({ query: "API design" })  // searches all categories
```

The tool scores results by relevance (exact phrase matches in filenames score highest, followed by content matches and individual keyword matches) and returns up to 10 results with file paths and snippets.

### Plugins

#### security-protection.js

**File**: `.opencode/plugins/security-protection.js`
**Hook**: `tool.execute.before`

This plugin intercepts file read operations and blocks access to sensitive files. Before any `read` or `read_file` tool execution, it checks the file path against a list of sensitive patterns:

- `.env` — Environment variables
- `.pfx` — Certificate bundles
- `.pem` — SSL certificates
- `id_rsa` — SSH private keys

If a match is found, the plugin throws a `Security Violation` error, preventing the agent from accessing the file. This enforces the security rule from `instructions/QUALITY_STANDARDS.md` at the system level.

#### context-compaction.js

**File**: `.opencode/plugins/context-compaction.js`
**Hook**: `experimental.session.compacting`

Described in the Context Engine section above. Preserves active task and story context during session compaction by reading `.local/agenttasks/` and `.local/stories/` and injecting a `<project-context>` block into the compacted output.

#### memory-auto-record.js

**File**: `.opencode/plugins/memory-auto-record.js`
**Hook**: `experimental.session.compacting`

This plugin detects completed tasks that have no corresponding entry in the `memory/` directory. During session compaction, it:

1. Scans `.local/agenttasks/` for all task files
2. Scans `memory/Knowledge/`, `memory/Pattern/`, `memory/Learning/`, and `memory/Debugging/` for existing entries
3. Matches tasks to memory entries by task ID or significant title keywords
4. For any unrecorded tasks, injects a `<memory-auto-record>` reminder:

```
⚠️ Unrecorded learnings: Task TASK-003 — Implement profile API controller was completed
but no memory entry was found in memory/. Consider recording patterns or learnings from
this work using the memory/ directory (Pattern/, Learning/, Knowledge/, or Debugging/).
```

This ensures agents don't forget to capture knowledge from completed work.

### Tools

#### memory-search.js

**File**: `.opencode/tools/memory-search.js`

A custom tool that searches the `memory/` directory by keyword and optional category. Agents use it instead of manually browsing memory directories.

**Parameters**:
- `query` (required) — Keyword or phrase to search for (case-insensitive)
- `category` (optional) — Filter to `"knowledge"`, `"pattern"`, `"learning"`, or `"debugging"`

**How it works**: Reads all `.md`, `.yaml`, `.yml`, and `.txt` files from the target category directories. Scores each file by exact phrase matches in the filename (10 points), exact phrase matches in content (5 points), and individual word matches (1-3 points each). Returns the top 10 results with file paths and relevant snippets.

#### task-graph.js

**File**: `.opencode/tools/task-graph.js`

A custom tool that visualizes task status and dependencies from `.local/agenttasks/` and `.local/stories/`.

**Parameters**:
- `story_id` (optional) — Filter to a specific story (e.g., `"STORY-001"`)

**How it works**: Parses all task YAML files and story Markdown files. Groups tasks by story, infers status from task fields (✅ done, 🔄 in-progress, 🔒 blocked, ⏳ ready, ❓ unknown), extracts dependency relationships from story breakdown plans, and builds dependency chains. Ungrouped tasks (not assigned to any story) are shown separately.

### The Memory System

The `memory/` directory is a committed knowledge base that grows over time. Agents write to it after completing work and search it before starting new work.

| Directory | Content | Example |
|---|---|---|
| `memory/Knowledge/` | ADRs and architecture decisions | `adr-001-context-engine-architecture.md` — Documents the three-layer Context Engine design |
| `memory/Pattern/` | Reusable code and workflow patterns | `agent-task-creation.md` — Standard pattern for creating well-defined AgentTasks |
| `memory/Learning/` | Lessons learned and insights | `skill-naming-conventions.md` — OpenCode skill names must be lowercase with hyphens |
| `memory/Debugging/` | Troubleshooting guides | `plugin-api-context-object.md` — How to correctly destructure the plugin context object |

**How agents write to memory**: After completing a task, agents record new patterns in `memory/Pattern/`, architecture decisions as ADRs in `memory/Knowledge/`, lessons learned in `memory/Learning/`, and troubleshooting guides in `memory/Debugging/`. All entries are written from a team perspective ("We encountered...", "Our approach...").

**How agents search memory**: Before starting work, agents use the `memory-search` tool to find relevant context. The `memory-auto-record` plugin reminds agents to record learnings if they forget.

---

## 5. Quick Reference

### All Agents

| Agent | File | Mode | Phase | What It Does |
|---|---|---|---|---|
| **AI Department** | `.opencode/agents/ai-department.md` | Primary | Always active | Routes user requests to specialist agents |
| **@requirements-engineer** | `.opencode/agents/requirements-engineer.md` | Subagent | Planning | Creates stories and AgentTasks from user requests |
| **@software-architect** | `.opencode/agents/software-architect.md` | Subagent | Design | Designs architecture, refines tasks, creates ADRs |
| **@developer** | `.opencode/agents/developer.md` | Subagent | Implementation | Writes code, tests, and documentation |
| **@security-engineer** | `.opencode/agents/security-engineer.md` | Subagent | Cross-cutting | Security reviews, vulnerability assessments, threat modeling |
| **@qa-engineer** | `.opencode/agents/qa-engineer.md` | Subagent | Cross-cutting | Quality gate enforcement, test strategies, bug management |

### All Commands

| Command | File | What It Does |
|---|---|---|
| `/plan <request>` | `.opencode/commands/plan.md` | Start a planning session — loads context, checks existing work, creates tasks |
| `/status` | `.opencode/commands/status.md` | Generate a project status report — stories, tasks, recent activity, current phase |
| `/review <task>` | `.opencode/commands/review.md` | Review changes against task success criteria — ✅/❌/⚠️ per criterion |
| `/memory-search <query>` | `.opencode/commands/memory-search.md` | Search project memory by keyword — groups results by category |
| `/handoff` | `.opencode/commands/handoff.md` | Generate a structured handoff document — stories, tasks, blockers, next steps |

### All Skills

| Skill | File | When to Load |
|---|---|---|
| `project-standards` | `.opencode/skills/project-standards/SKILL.md` | Before creating tasks, writing code, or reviewing deliverables |
| `codebase-map` | `.opencode/skills/codebase-map/SKILL.md` | Before designing architecture or navigating the codebase |
| `active-context` | `.opencode/skills/active-context/SKILL.md` | At the start of any planning or review session |
| `debugging-playbook` | `.opencode/skills/debugging-playbook/SKILL.md` | When encountering errors or investigating bugs |

### All Tools

| Tool | File | What It Does |
|---|---|---|
| `memory-search` | `.opencode/tools/memory-search.js` | Searches `memory/` by keyword and category — returns file paths and snippets |
| `task-graph` | `.opencode/tools/task-graph.js` | Visualizes task status and dependencies from `.local/` — shows story groupings and chains |

### All Plugins

| Plugin | File | Hook | What It Does |
|---|---|---|---|
| `security-protection` | `.opencode/plugins/security-protection.js` | `tool.execute.before` | Blocks agent access to sensitive files (.env, .pem, .pfx, id_rsa) |
| `context-compaction` | `.opencode/plugins/context-compaction.js` | `experimental.session.compacting` | Preserves active task and story context during session compaction |
| `memory-auto-record` | `.opencode/plugins/memory-auto-record.js` | `experimental.session.compacting` | Reminds agents to record learnings for completed tasks without memory entries |

### Phase Gating Rules

Each phase boundary requires explicit user approval before proceeding:

```
Planning → [User Gate] → Design → [User Gate] → Implementation → [User Gate]
```

- Agents ask: "Approve to continue to [next phase]? (yes/no/don't stop/stop at phase X)"
- **"yes"** — Proceed to the next phase
- **"no"** — Stay in the current phase for revisions
- **"don't stop"** — Proceed through all remaining phases without pausing
- **"stop at phase X"** — Proceed until reaching phase X, then pause for feedback

Agents must record the user's decision in the relevant AgentTask, Story, or ADR before transitioning.

### The "don't stop" Shortcut

Say **"don't stop"** at any phase gate to let agents flow through all remaining phases without pausing. This is useful when you trust the plan and want the system to execute end-to-end without interruption. The agents will still record their work in memory and follow all quality standards — they just skip the approval prompts.

---

## 6. Getting Started

### Installing in Another Project

You don't need to clone the Autonomic OpenCode repository into every project. Run one command to sync the agent configuration:

**Linux / macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.sh | bash
```

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/Autonomic-OpenCode/Autonomic-OpenCode-CLI/main/scripts/sync-agents.ps1'))
```

This downloads the agents, skills, plugins, tools, commands, instructions, and `opencode.jsonc` into your project. Run it again anytime to update to the latest version.

The scripts auto-detect your environment:
- **Inside a DevContainer**: Syncs to the current project directory (`.opencode/`, `instructions/`, `opencode.jsonc`)
- **Host machine**: Syncs to `~/.config/opencode` for global use across all projects

### First Steps After Installation

1. **Open OpenCode** in your project directory
2. **Talk to the AI Department** — it's the primary agent, selected by default (press Tab to cycle agents if needed)
3. **Start with `/plan`** — describe what you want to build, and the system handles the rest
4. **Review each phase gate** — approve, revise, or say "don't stop" to let it run
5. **Use `/status`** anytime to see where things stand
6. **Use `/review`** to verify task completion against success criteria
7. **Use `/handoff`** at the end of a session to generate context for the next one