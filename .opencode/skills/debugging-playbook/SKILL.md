---
name: debugging-playbook
description: Load troubleshooting guides, known issues, error solutions, and lessons learned from previous work. Use this skill when encountering errors, investigating bugs, or before starting work in a problem-prone area.
compatibility: opencode
metadata:
    category: debugging
    source: memory/Debugging/ + memory/Learning/
---

# Debugging Playbook

Load this skill when you encounter an error or need to troubleshoot an issue.

## How to Use

1. Follow the diagnostic workflow below
2. Check existing knowledge before investigating from scratch
3. Record any new findings back to memory

## Step 1: Check Known Issues

Search `memory/Debugging/` for existing troubleshooting guides:

```bash
ls -la memory/Debugging/ 2>/dev/null || echo "No debugging guides found yet"
```

Read any files that match the area you're working in. Also use the `memory-search` tool:

```
memory-search({ query: "<your error or topic>", category: "debugging" })
```

## Step 2: Check Lessons Learned

Search `memory/Learning/` for past solutions to similar problems:

```bash
ls -la memory/Learning/ 2>/dev/null || echo "No learnings recorded yet"
```

Also search with the tool:

```
memory-search({ query: "<your error or topic>", category: "learning" })
```

## Step 3: Diagnostic Workflow

If no existing solution is found, follow this systematic approach:

### 3a. Reproduce the Issue

- Identify the exact steps or conditions that trigger the error
- Note the full error message, stack trace, and relevant logs
- Determine if the issue is consistent or intermittent

### 3b. Isolate the Cause

- Narrow down which component, file, or function is involved
- Check recent changes (`git diff`, `git log`) for potential regressions
- Test with minimal input to isolate the trigger

### 3c. Research

- Check project patterns in `memory/Pattern/` for the correct approach
- Check project standards in `memory/Knowledge/` for relevant conventions
- Use external documentation if needed (via MCP tools like Context7)

### 3d. Fix and Verify

- Implement the fix
- Write a regression test that would have caught the issue
- Run the full test suite to ensure no side effects
- Verify the original reproduction steps no longer trigger the error

## Step 4: Record the Solution

After resolving the issue, **always** record the solution:

### For Troubleshooting Guides (recurring/complex issues)

Create a file in `memory/Debugging/` following this format:

```markdown
# [Issue Title]

## Symptoms

- [What the error looks like]
- [Error message or behavior]

## Root Cause

[Why this happens]

## Solution

[Step-by-step fix]

## Prevention

[How to avoid this in the future]
```

### For Lessons Learned (one-time insights)

Create a file in `memory/Learning/` following this format:

```markdown
# [Learning Title]

## Context

We encountered [situation] while working on [task/feature].

## What We Learned

[The key insight or solution]

## Impact

[How this affects future work]
```

## Failure Protocol (from Quality Standards)

When a fix attempt fails:

1. **Self-Correction** (up to 3 attempts): If the error is clear and fixable, try again
2. **Clarification**: If information is missing or ambiguous, ask the user for specifics
3. **User Decision**: If the fix is risky or the path is unclear, present options to the user

Never silently ignore a failing test or unresolved error.
