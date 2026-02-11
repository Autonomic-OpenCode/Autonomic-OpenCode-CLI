# ADR-001: Context Engine Architecture

## Status

Accepted

## Context

Agents were manually browsing `memory/` directories to find standards, patterns, and learnings before starting work. This was slow, inconsistent, and broke down during long sessions when context was compacted away.

## Decision

We adopted a three-layer Context Engine:

1. **Agent Skills** (`.opencode/skills/`) — On-demand instruction files loaded via the `skill` tool. Each agent loads phase-appropriate skills at startup.
2. **Context Compaction Plugin** (`.opencode/plugins/context-compaction.js`) — Preserves active task ID, title, goal, and success criteria when OpenCode compacts a long session.
3. **Memory Search Tool** (`.opencode/tools/memory-search.js`) — Custom tool that searches `memory/` by keyword and category, replacing manual directory browsing.

## Consequences

- Agents no longer browse `memory/` directories manually.
- Skills provide consistent, structured knowledge loading per phase.
- The compaction plugin prevents loss of task context in long sessions.
- The search tool enables ad-hoc lookups without knowing exact file paths.
- New knowledge categories must be added to both the tool's `CATEGORIES` map and the sync scripts.

