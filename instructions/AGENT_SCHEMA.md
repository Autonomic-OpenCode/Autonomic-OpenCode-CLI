# OpenCode Agent Schema

All agents in this project must be defined as Markdown files (e.g., `.opencode/agent/my-agent.md`) following this schema.

## File Structure

The file consists of a YAML frontmatter block for configuration, followed by the system prompt body.

```markdown
---
description: "A concise description of what the agent does and when to use it."
mode: "subagent" # Options: "primary", "subagent", "all" (default: "all")
model: "anthropic/claude-sonnet-4-20250514" # Optional: Override default model
temperature: 0.5 # Optional: 0.0-1.0 (0.0=focused, 1.0=creative)
tools:
  write: true    # Enable/disable specific tools
  edit: true
  bash: false
  "mcp_*": true  # Wildcards supported
permission:      # Optional: Configure tool permissions
  edit: "ask"    # Options: "allow", "ask", "deny"
  bash:
    "git status": "allow"
    "*": "ask"
---

# System Prompt

[The content below the frontmatter is the system prompt for the agent.]

You are a [Role Name].
Your objective is [Objective].

## Responsibilities
- [Task 1]
- [Task 2]

## Guidelines

### ✅ What to Do
- **AgentTask Driven**: All work must be initiated from and tracked by an AgentTask.
- **Memory-First**: Always search `memory/` for existing patterns, standards (e.g., `memory/Knowledge/tech-stack.md`), and learnings before starting work.
  - `memory/Learning/`: Error solutions and lessons learned.
  - `memory/Pattern/`: Reusable code patterns.
  - `memory/Knowledge/`: Architecture decisions and standards.
  - `memory/Debugging/`: Troubleshooting guides.
- **Record Knowledge**: Store new reusable patterns and important learnings in `memory/`. Write these entries from a **project team perspective** (using "We", "Our team"), providing natural language context for humans while optimizing for AI with clear headers and keywords.
- **Documentation**: Document important project information in `docu/` using the same human-centric yet AI-optimized style.
- **File Naming**: Always use **lowercase** and **hyphens** for new files (e.g., `my-new-file.md`).
- **Verify & Handle Failure**: Always verify output before completion. If verification fails, decide to **Retry** (self-correct), **Ask** (for info), or **Consult** (user decision) based on the error severity.
- [Action 1]
- [Action 2]

### ❌ What NOT to Do
- **No Ad-hoc Work**: Do not perform tasks without an assigned AgentTask.
- **Ignore Standards**: Do not ignore established patterns found in `memory/`.
- **No Sensitive Data**: Do not touch `.env` or certificate files directly.
- [Restriction 1]
- [Restriction 2]

## Success Metrics
- [Metric 1]: Measurable indicator of success (e.g., "All tests pass").
- [Metric 2]: Quality indicator (e.g., "Documentation is updated").
```

```

## Configuration Fields

| Field | Required | Description |
| :--- | :--- | :--- |
| `description` | **Yes** | Brief summary of the agent's purpose. Used by the router to select agents. |
| `mode` | No | `primary`: Main assistant (cycle with Tab). `subagent`: Specialized tool (invoke with @). `all`: Both. |
| `model` | No | Specific LLM to use (e.g., `openai/gpt-4o`, `anthropic/claude-3-5-sonnet`). |
| `temperature` | No | Creativity level (0.0 - 1.0). Low for code/planning, high for brainstorming. |
| `tools` | No | Enable (`true`) or disable (`false`) specific tools. |
| `permission` | No | Set `allow`, `ask`, or `deny` for sensitive tools (`edit`, `bash`, `webfetch`). |

## Best Practices

1.  **Clear Description**: The `description` is crucial for the primary agent to know when to call this subagent.
2.  **Focused Scope**: Subagents should have a narrow, well-defined purpose (e.g., "Security Auditor" vs "General Developer").
3.  **Restricted Tools**: Disable dangerous tools (like `bash` or `edit`) if the agent only needs to analyze or plan.
4.  **Structured Prompt**: Use the prompt body to define the persona, constraints, and output format clearly.
