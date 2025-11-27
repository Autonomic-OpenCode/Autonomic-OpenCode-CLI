# Story Schema

Stories are used to break down Large and Mega tasks into manageable AgentTasks. They are stored in `.local/stories/` (e.g., `story-001-user-auth.md`).
**Naming Convention**: Files must be **lowercase** and use **hyphens** for separation.

## File Structure

```markdown
# STORY-[ID]: [Title]

## Description
A detailed description of the feature or requirement. Explain the "Why" and the "What".

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Complexity Analysis
- **Total Points**: [Total]
- **Breakdown**:
    - Files affected: [Count] ([Points])
    - Code volume: [Lines] ([Points])
    - Integrations: [Count] ([Points])
    - Security: [Level] ([Points])

## Breakdown Plan
List the AgentTasks required to complete this story. Each task must be ≤15 points.

1. **[TASK-ID]**: [Task Title] (Complexity: [Tier])
   - Description: [Brief description]
   - Dependencies: [None / Previous Task]

2. **[TASK-ID]**: [Task Title] (Complexity: [Tier])
   - ...
```
