# Bug Report Schema

Bug reports are specialized AgentTasks used to track and resolve defects. They are stored in `.local/agenttasks/` (e.g., `.local/agenttasks/bug-001-login-failure.yaml`).

## File Structure

```yaml
id: "BUG-[ID]" # e.g., BUG-001
title: "Bug: [Concise Description]"
type: "bug"
severity: "High" # Options: Critical, High, Medium, Low
assigned_to: "@Developer"

goal:
  summary: "Fix the issue where [Description]."
  success_criteria:
    - "The bug is no longer reproducible."
    - "Regression test is added and passing."

context:
  reproduction_steps:
    - "Step 1: Go to..."
    - "Step 2: Click on..."
    - "Step 3: Observe error..."
  
  expected_behavior: "What should have happened."
  actual_behavior: "What actually happened (include error logs if available)."
  
  environment:
    - "OS: [e.g., macOS]"
    - "Version: [e.g., 1.0.2]"

implementation:
  root_cause_analysis: "To be filled by Agent during investigation."
  fix_plan: "Proposed fix."

validation:
  regression_test: "Description of the test case to prevent recurrence."
```
