# Learning: Skill Naming Conventions

## Context

We encountered naming validation errors while creating OpenCode skills during the Context Engine implementation.

## What We Learned

OpenCode skill names must follow strict rules:

- **Regex**: `^[a-z0-9]+(-[a-z0-9]+)*$`
- **Allowed**: Lowercase alphanumeric characters with single hyphens as separators.
- **Not allowed**: Uppercase letters, underscores, leading/trailing hyphens, consecutive hyphens.
- **Length**: 1-64 characters.
- **Directory name must match**: The skill directory name (e.g., `project-standards/`) must exactly match the `name` field in `SKILL.md` frontmatter.

### Valid examples

- `project-standards`
- `codebase-map`
- `active-context`
- `debugging-playbook`

### Invalid examples

- `Project_Standards` (uppercase, underscores)
- `-leading-hyphen` (leading hyphen)
- `double--hyphen` (consecutive hyphens)

## Impact

All future skills must be named following this pattern. The directory name and frontmatter `name` field must be identical.

