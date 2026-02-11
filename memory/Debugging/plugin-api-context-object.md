# Debugging: Plugin API Context Object

## Symptoms

- Plugin throws `TypeError: client.on is not a function` or similar errors.
- Plugin receives an object but methods don't exist on it.
- Plugin works in some hooks but fails in others.

## Root Cause

OpenCode plugins receive a **context object** with named properties, not a direct client instance. The context object must be destructured to access individual properties.

The context object contains:
- `client` — The OpenCode client API
- `project` — Project metadata
- `$` — Shell execution helper
- `directory` — The project root directory path
- `worktree` — The git worktree path

Different hooks receive different arguments:
- **`tool.execute.before`**: Receives `(input, output)` where `input.tool` is the tool name and `output.args` contains the tool arguments.
- **`experimental.session.compacting`**: Receives `(input, output)` where `output.context.push(...)` adds preserved context.

## Solution

Always destructure only the properties you need from the plugin factory function:

```javascript
// ✅ Correct — destructure what you need
export const MyPlugin = async ({ directory }) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Use directory, input, output
    },
  };
};

// ❌ Wrong — treating context as a direct client
export const MyPlugin = async (client) => {
  client.on("compacting", ...); // This will fail
};
```

## Prevention

- Always check the OpenCode Plugins documentation for the correct API signature.
- Destructure only the properties you actually use to avoid confusion.
- Test plugins in an actual OpenCode session before committing.

