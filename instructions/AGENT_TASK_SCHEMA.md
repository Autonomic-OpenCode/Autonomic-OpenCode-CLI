# General AgentTask Schema

This schema defines the structure for **Feature** and **Chore** tasks. For Bug Reports, use `BUG_REPORT_SCHEMA.md`.
All AgentTasks must be defined as YAML files in `.local/agenttasks/` (e.g., `.local/agenttasks/task-001-implement-login.yaml`).

**Naming Convention**: Files must be **lowercase** and use **hyphens** for separation.

## File Structure

```yaml
id: "TASK-[ID]" # e.g., TASK-001
title: "[Action] [Subject]" # e.g., "Implement User Login"
type: "feature" # Options: "feature", "chore" (For bugs, use BUG_REPORT_SCHEMA)
complexity: "Medium" # Options: Nano, Tiny, Medium, Large, Mega
assigned_to: "@Developer" # The agent responsible for execution

goal:
  summary: "A clear, one-sentence summary of the goal."
  success_criteria:
    - "Criterion 1 (e.g., Function X returns Y)"
    - "Criterion 2 (e.g., Tests pass)"

context:
  embedded_standards: |
    # Relevant standards from memory/Knowledge/
    - Use C# for backend.
    - Follow async/await pattern.
  
  embedded_learnings: |
    # Relevant patterns from memory/Pattern/ or memory/Learning/
    - Use the Repository pattern for data access.
  
  user_request: "Original user request text."

implementation:
  approach: "High-level technical approach."
  steps:
    - "Step 1: Create interface"
    - "Step 2: Implement class"
    - "Step 3: Write tests"

validation:
  unit_tests: "Description of unit tests to write."
  manual_verification: "Steps for manual verification (if applicable)."
```

## Complexity Tiers

| Tier | Points | Description |
| :--- | :--- | :--- |
| **Nano** | 0-2 | Trivial changes (typos, single line). Direct execution. |
| **Tiny** | 3-5 | Simple tasks (single function, small bug). Direct execution. |
| **Medium** | 6-15 | Standard features (new endpoint, component). Direct execution. |
| **Large** | 16-30 | Complex features. **Must be broken down into a Story.** |
| **Mega** | 30+ | Major initiatives. **Must be broken down into a Story.** |
