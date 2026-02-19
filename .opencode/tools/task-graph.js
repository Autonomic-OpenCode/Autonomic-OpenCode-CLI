import { tool } from "@opencode-ai/plugin";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Task Graph Tool
 *
 * Reads .local/agenttasks/ and .local/stories/ to produce a text-based
 * visualization of task status and dependencies. Shows tasks grouped by
 * story with dependency arrows and status indicators.
 */

const STATUS_ICONS = { done: "✅", "in-progress": "🔄", ready: "⏳", blocked: "🔒", unknown: "❓" };

/** Parse a task YAML file using regex (no YAML parser dependency). */
function parseTaskFile(content, filename) {
  const get = (k) => content.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim() || null;
  const goal = content.match(/goal:\s*\n\s+summary:\s*"?([^"\n]+)"?/m)?.[1]?.trim() || null;
  return {
    id: get("id"), title: get("title"), complexity: get("complexity"),
    assignedTo: get("assigned_to"), status: get("status"), goalSummary: goal, filename,
  };
}

/** Infer task status from parsed fields and raw content. */
function inferStatus(task, content) {
  if (task.status) {
    const s = task.status.toLowerCase();
    if (s.includes("done") || s.includes("complete")) return "done";
    if (s.includes("progress") || s.includes("active")) return "in-progress";
    if (s.includes("block")) return "blocked";
    if (s.includes("ready") || s.includes("pending")) return "ready";
  }
  const lower = content.toLowerCase();
  if (/status:\s*(done|completed)/m.test(lower)) return "done";
  if (/status:\s*(in-progress|active)/m.test(lower)) return "in-progress";
  if (/status:\s*blocked/m.test(lower)) return "blocked";
  return "unknown";
}

/** Parse a story markdown file to extract ID, title, and Breakdown Plan tasks. */
function parseStoryFile(content, filename) {
  const heading = content.match(/^#\s+(STORY-\S+):\s*(.+)$/m);
  const storyId = heading?.[1]?.trim() || filename.replace(/\.md$/, "");
  const storyTitle = heading?.[2]?.trim() || storyId;
  const bpText = content.match(/## Breakdown Plan\s*\n([\s\S]*?)(?=\n## |$)/)?.[1] || "";
  const tasks = [];
  for (const entry of bpText.split(/\n(?=\d+\.\s)/)) {
    const m = entry.match(/\d+\.\s+\*\*(\S+)\*\*:\s*(.+?)(?:\(Complexity:\s*([^)]+)\))?\s*$/m);
    if (!m) continue;
    const depMatch = entry.match(/[-–]\s*Dependencies?:\s*(.+)/i);
    let deps = [];
    if (depMatch && !/^none$/i.test(depMatch[1].trim())) {
      deps = (depMatch[1].match(/(?:TASK|BUG)-\d+/gi) || []).map(d => d.toUpperCase());
    }
    tasks.push({ taskId: m[1], taskTitle: m[2].trim(), dependencies: deps });
  }
  return { storyId, storyTitle, tasks, filename };
}

/** Build a linear dependency chain from story tasks if one exists. */
function buildChain(storyTasks) {
  if (storyTasks.length <= 1) return [];
  const roots = storyTasks.filter(t => t.dependencies.length === 0);
  if (roots.length !== 1) return [];
  const chain = [roots[0].taskId];
  for (let i = 0; i < storyTasks.length; i++) {
    const cur = chain[chain.length - 1];
    const next = storyTasks.find(
      t => t.dependencies.length === 1 && t.dependencies[0] === cur && !chain.includes(t.taskId)
    );
    if (!next) break;
    chain.push(next.taskId);
  }
  return chain.length > 1 ? chain : [];
}

/** Safely read directory entries, returning empty array on error. */
async function safeReaddir(dir, pattern) {
  try { return (await readdir(dir)).filter(f => pattern.test(f)); }
  catch { return []; }
}

export default tool({
  description:
    "Visualize task status and dependencies from .local/agenttasks/ and .local/stories/. " +
    "Shows tasks grouped by story with dependency arrows and status indicators. " +
    "Use this to understand project progress and task relationships.",
  args: {
    story_id: tool.schema.string().optional()
      .describe('Filter to a specific story (e.g., "STORY-001"). Omit to show all.'),
  },
  async execute(args, context) {
    const root = context.worktree;
    const tasksDir = join(root, ".local", "agenttasks");
    const storiesDir = join(root, ".local", "stories");
    const taskFiles = await safeReaddir(tasksDir, /^(task|bug)-.*\.yaml$/);
    const storyFiles = await safeReaddir(storiesDir, /^story-.*\.md$/);

    if (!taskFiles.length && !storyFiles.length) {
      return "No tasks or stories found.\n\nTo create tasks and stories:\n" +
        "1. Ask the Requirements Engineer agent to create a plan\n" +
        "2. Or create files manually:\n" +
        "   - Tasks: .local/agenttasks/task-001-description.yaml (see instructions/AGENT_TASK_SCHEMA.md)\n" +
        "   - Stories: .local/stories/story-001-description.md (see instructions/STORY_SCHEMA.md)\n\n" +
        "The Requirements Engineer agent creates these during the Planning phase.";
    }

    // Parse all task YAML files
    const tasksMap = new Map();
    for (const f of taskFiles) {
      try {
        const content = await readFile(join(tasksDir, f), "utf-8");
        const task = parseTaskFile(content, f);
        const id = task.id || f.replace(/\.yaml$/, "").toUpperCase();
        tasksMap.set(id, { ...task, id, resolvedStatus: inferStatus(task, content) });
      } catch { continue; }
    }

    // Parse all story markdown files
    const allStories = [];
    for (const f of storyFiles) {
      try {
        allStories.push(parseStoryFile(await readFile(join(storiesDir, f), "utf-8"), f));
      } catch { continue; }
    }

    // Filter by story_id if specified
    const stories = args.story_id
      ? allStories.filter(s => s.storyId.toUpperCase() === args.story_id.toUpperCase())
      : allStories;
    if (args.story_id && !stories.length) {
      return `Story "${args.story_id}" not found. Available: ${allStories.map(s => s.storyId).join(", ") || "none"}`;
    }

    // Build summary statistics
    const lines = ["# 📊 Task Graph\n"];
    const allTasks = Array.from(tasksMap.values());
    const ct = { done: 0, "in-progress": 0, blocked: 0, ready: 0, unknown: 0 };
    for (const t of allTasks) ct[t.resolvedStatus] = (ct[t.resolvedStatus] || 0) + 1;
    lines.push("## Summary");
    lines.push(
      `Total: ${allTasks.length} | ✅ ${ct.done} done | 🔄 ${ct["in-progress"]} in-progress | ` +
      `🔒 ${ct.blocked} blocked | ⏳ ${ct.ready} ready | ❓ ${ct.unknown} unknown\n`
    );

    // Render each story with its tasks and dependencies
    const assigned = new Set();
    for (const story of stories) {
      lines.push(`## ${story.storyId}: ${story.storyTitle}\n`);
      if (!story.tasks.length) { lines.push("  (No tasks in breakdown plan)\n"); continue; }
      for (const st of story.tasks) {
        assigned.add(st.taskId.toUpperCase());
        const real = tasksMap.get(st.taskId.toUpperCase());
        const icon = STATUS_ICONS[real?.resolvedStatus] || STATUS_ICONS.unknown;
        let l = `  ${icon} **${st.taskId}**: ${st.taskTitle || real?.title || "Untitled"}`;
        if (real?.complexity) l += ` [${real.complexity}]`;
        if (real?.assignedTo) l += ` → ${real.assignedTo}`;
        lines.push(l);
      }
      lines.push("");
      if (story.tasks.some(t => t.dependencies.length > 0)) {
        lines.push("  Dependencies:");
        for (const st of story.tasks)
          for (const dep of st.dependencies) lines.push(`    ${dep} → ${st.taskId}`);
        const chain = buildChain(story.tasks);
        if (chain.length > 1) lines.push(`\n  Chain: ${chain.join(" → ")}`);
        lines.push("");
      }
    }

    // Show tasks not assigned to any story
    if (!args.story_id) {
      const ungrouped = allTasks.filter(t => !assigned.has(t.id.toUpperCase()));
      if (ungrouped.length > 0) {
        lines.push("## Ungrouped Tasks\n");
        for (const t of ungrouped) {
          const icon = STATUS_ICONS[t.resolvedStatus] || STATUS_ICONS.unknown;
          let l = `  ${icon} **${t.id}**: ${t.title || "Untitled"}`;
          if (t.complexity) l += ` [${t.complexity}]`;
          if (t.assignedTo) l += ` → ${t.assignedTo}`;
          lines.push(l);
        }
        lines.push("");
      }
    }
    return lines.join("\n");
  },
});

