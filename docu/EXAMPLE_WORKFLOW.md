# Autonomic OpenCode — Example Workflow

This document walks through a complete end-to-end scenario demonstrating every component of Autonomic OpenCode in action. For a system overview and component reference, see [Project Documentation](PROJECT_DOCUMENTATION.md). For installation instructions, see the [README](../README.md).

**Scenario**: Add a REST API for user profile management with CRUD operations.

---

## Table of Contents

1. [The Example Scenario](#1-the-example-scenario)
2. [Behind the Scenes: How Components Work Together](#2-behind-the-scenes-how-components-work-together)

---

## 1. The Example Scenario

**Scenario**: A user wants to add a REST API for user profile management with CRUD operations (Create, Read, Update, Delete).

Here is the complete lifecycle, showing every component in action.

### Step 1: User Makes a Request

The user opens OpenCode. The **AI Department** agent (defined in `.opencode/agents/ai-department.md`) is the primary agent — it's selected by default. The user describes the request:

```
Add a REST API for user profile management with CRUD operations
```

The AI Department agent receives the request and follows the Context Engine Workflow from `instructions/AGENTS.md`:

### Step 2: AI Department Routes the Request

Before delegating, it follows the Context Engine Workflow:

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

The user asks the AI Department to review the task:

```
Review TASK-003 against its success criteria
```

The agent:

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

The user asks:

```
Give me a project status report
```

The agent loads the `active-context` skill, reads all stories and tasks, checks recent git activity, and presents a structured report:

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

The user can search the knowledge base at any time. The agent uses the `memory-search` tool (`.opencode/tools/memory-search.js`) to find relevant entries:

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

At the end of a session, the user asks for a handoff summary. The agent generates a structured handoff document for the next session or team member:

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

## 2. Behind the Scenes: How Components Work Together

This section summarizes how the components demonstrated above fit together. For full details on every component, see [Project Documentation](PROJECT_DOCUMENTATION.md).

### The Context Engine (Three Layers)

Agents get project knowledge through three complementary layers (documented in `memory/Knowledge/adr-001-context-engine-architecture.md`):

1. **Skills** — On-demand instruction files in `.opencode/skills/` loaded via the `skill` tool at the start of each phase. The four skills (`project-standards`, `codebase-map`, `active-context`, `debugging-playbook`) provide phase-appropriate knowledge without agents needing to browse files manually.

2. **Context Compaction Plugin** — The `context-compaction.js` plugin preserves the active task and story context when OpenCode compacts a long session. Without it, agents would lose track of what they were working on.

3. **Memory Search Tool** — The `memory-search.js` tool provides keyword-based search across the `memory/` directory, replacing manual directory browsing. Agents use it before starting work to find relevant patterns, learnings, and decisions.

### Plugins

- **security-protection.js** — Hooks into `tool.execute.before` to block agent access to sensitive files (`.env`, `.pem`, `.pfx`, `id_rsa`). Throws a `Security Violation` error if a match is found.
- **context-compaction.js** — Hooks into `experimental.session.compacting` to preserve active task and story context during session compaction.
- **memory-keeper.js** — Automatically manages the Memory-Bank — bootstraps initial entries on first session, prompts memory updates on task completion.

### Tools

- **memory-search.js** — Searches `memory/` by keyword and optional category (`knowledge`, `pattern`, `learning`, `debugging`). Returns up to 10 results ranked by relevance with file paths and snippets.
- **task-graph.js** — Visualizes task status and dependencies from `.local/agenttasks/` and `.local/stories/`. Groups tasks by story and builds dependency chains.

### The Memory System

The `memory/` directory is a committed knowledge base that grows over time:

| Directory | Content | Example |
|---|---|---|
| `memory/Knowledge/` | ADRs and architecture decisions | `adr-001-context-engine-architecture.md` |
| `memory/Pattern/` | Reusable code and workflow patterns | `agent-task-creation.md` |
| `memory/Learning/` | Lessons learned and insights | `skill-naming-conventions.md` |
| `memory/Debugging/` | Troubleshooting guides | `plugin-api-context-object.md` |