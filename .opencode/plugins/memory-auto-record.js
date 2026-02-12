import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Memory Auto-Record Plugin
 *
 * Hooks into session compaction to detect completed tasks that have no
 * corresponding entry in the memory/ directory. When unrecorded tasks are
 * found, injects a context reminder prompting the agent to capture learnings,
 * patterns, or knowledge from that work.
 *
 * Memory categories: Knowledge/, Pattern/, Learning/, Debugging/
 */
export const MemoryAutoRecord = async ({ directory }) => {
  const MEMORY_SUBDIRS = ["Knowledge", "Pattern", "Learning", "Debugging"];

  /**
   * Scans .local/agenttasks/ and returns parsed task summaries.
   * Uses simple regex parsing to avoid external YAML dependencies.
   */
  async function getAllTasks(projectDir) {
    const tasksDir = join(projectDir, ".local", "agenttasks");

    let files;
    try {
      files = await readdir(tasksDir);
    } catch {
      return [];
    }

    const yamlFiles = files.filter(
      (f) => f.endsWith(".yaml") || f.endsWith(".yml")
    );

    const tasks = [];
    for (const file of yamlFiles) {
      try {
        const content = await readFile(join(tasksDir, file), "utf-8");
        const task = extractTaskFields(content);
        if (task.id || task.title) {
          tasks.push(task);
        }
      } catch {
        continue;
      }
    }

    return tasks;
  }

  /**
   * Extracts key fields from a YAML task file using simple string parsing.
   * Avoids external YAML parser dependency.
   */
  function extractTaskFields(content) {
    const fields = {};
    const patterns = {
      id: /^id:\s*"?([^"\n]+)"?/m,
      title: /^title:\s*"?([^"\n]+)"?/m,
    };

    for (const [key, regex] of Object.entries(patterns)) {
      const match = content.match(regex);
      if (match) fields[key] = match[1].trim();
    }

    return fields;
  }

  /**
   * Collects all filenames across memory/ subdirectories.
   * Returns a Set of lowercase filenames for efficient matching.
   */
  async function getMemoryFilenames(projectDir) {
    const filenames = new Set();

    for (const subdir of MEMORY_SUBDIRS) {
      const dir = join(projectDir, "memory", subdir);
      try {
        const files = await readdir(dir);
        for (const file of files) {
          filenames.add(file.toLowerCase());
        }
      } catch {
        continue;
      }
    }

    return filenames;
  }

  /**
   * Checks whether a task has a matching entry in the memory filenames.
   * Matches by task ID (e.g., "TASK-001") or significant title keywords
   * appearing in memory filenames.
   */
  function hasMemoryEntry(task, memoryFilenames) {
    const filenames = [...memoryFilenames];

    // Match by task ID (e.g., "task-001" in filename)
    if (task.id) {
      const idLower = task.id.toLowerCase();
      if (filenames.some((f) => f.includes(idLower))) {
        return true;
      }
    }

    // Match by significant title keywords (3+ chars, skip common words)
    if (task.title) {
      const stopWords = new Set([
        "the", "and", "for", "with", "from", "into", "that", "this",
        "will", "can", "has", "have", "are", "was", "been", "not",
        "all", "new", "add", "use", "set", "get",
      ]);
      const keywords = task.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !stopWords.has(w));

      // Require at least 2 keyword matches in a single filename
      const threshold = Math.min(2, keywords.length);
      if (
        filenames.some((f) => {
          const matches = keywords.filter((kw) => f.includes(kw)).length;
          return matches >= threshold;
        })
      ) {
        return true;
      }
    }

    return false;
  }

  return {
    "experimental.session.compacting": async (input, output) => {
      const projectDir = directory;

      const [tasks, memoryFilenames] = await Promise.all([
        getAllTasks(projectDir),
        getMemoryFilenames(projectDir),
      ]);

      if (tasks.length === 0) return;

      const unrecorded = tasks.filter(
        (task) => !hasMemoryEntry(task, memoryFilenames)
      );

      if (unrecorded.length === 0) return;

      const reminders = unrecorded.map(
        (task) =>
          `⚠️ Unrecorded learnings: Task ${task.id || "unknown"} — ${task.title || "Untitled"} was completed but no memory entry was found in memory/. Consider recording patterns or learnings from this work using the memory/ directory (Pattern/, Learning/, Knowledge/, or Debugging/).`
      );

      output.context.push(
        `<memory-auto-record>\n${reminders.join("\n")}\n</memory-auto-record>`
      );
    },
  };
};

