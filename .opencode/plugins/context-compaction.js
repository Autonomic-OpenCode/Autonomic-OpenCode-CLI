import { readdir, readFile, stat } from "node:fs/promises";
import { join, basename } from "node:path";

/**
 * Context Compaction Plugin
 *
 * Preserves critical task context (active task, recent decisions, key files)
 * when OpenCode compacts a long session. Without this, agents lose track of
 * what they were working on after compaction.
 */
export const ContextCompaction = async ({ directory }) => {
  /**
   * Reads .local/agenttasks/ and returns the most recently modified task file's content.
   */
  async function getActiveTaskContext(projectDir) {
    const tasksDir = join(projectDir, ".local", "agenttasks");

    let files;
    try {
      files = await readdir(tasksDir);
    } catch {
      return null;
    }

    const yamlFiles = files.filter(
      (f) => f.endsWith(".yaml") || f.endsWith(".yml")
    );
    if (yamlFiles.length === 0) return null;

    // Find the most recently modified task file
    let latestFile = null;
    let latestMtime = 0;

    for (const file of yamlFiles) {
      try {
        const filePath = join(tasksDir, file);
        const fileStat = await stat(filePath);
        if (fileStat.mtimeMs > latestMtime) {
          latestMtime = fileStat.mtimeMs;
          latestFile = filePath;
        }
      } catch {
        continue;
      }
    }

    if (!latestFile) return null;

    try {
      const content = await readFile(latestFile, "utf-8");
      return { fileName: basename(latestFile), content };
    } catch {
      return null;
    }
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
      complexity: /^complexity:\s*"?([^"\n]+)"?/m,
      assigned_to: /^assigned_to:\s*"?([^"\n]+)"?/m,
    };

    for (const [key, regex] of Object.entries(patterns)) {
      const match = content.match(regex);
      if (match) fields[key] = match[1].trim();
    }

    // Extract goal summary (indented under goal:)
    const goalMatch = content.match(
      /goal:\s*\n\s+summary:\s*"?([^"\n]+)"?/m
    );
    if (goalMatch) fields.goal = goalMatch[1].trim();

    // Extract success criteria
    const criteriaSection = content.match(
      /success_criteria:\s*\n((?:\s+-\s*"[^"]*"\n?)*)/m
    );
    if (criteriaSection) {
      fields.criteria = criteriaSection[1]
        .match(/"([^"]*)"/g)
        ?.map((c) => c.replace(/"/g, ""))
        .slice(0, 5); // Keep top 5 to save tokens
    }

    return fields;
  }

  /**
   * Reads .local/stories/ for the active story summary.
   */
  async function getActiveStoryContext(projectDir) {
    const storiesDir = join(projectDir, ".local", "stories");

    let files;
    try {
      files = await readdir(storiesDir);
    } catch {
      return null;
    }

    const mdFiles = files.filter((f) => f.endsWith(".md"));
    if (mdFiles.length === 0) return null;

    // Read the most recent story
    let latestFile = null;
    let latestMtime = 0;

    for (const file of mdFiles) {
      try {
        const filePath = join(storiesDir, file);
        const fileStat = await stat(filePath);
        if (fileStat.mtimeMs > latestMtime) {
          latestMtime = fileStat.mtimeMs;
          latestFile = filePath;
        }
      } catch {
        continue;
      }
    }

    if (!latestFile) return null;

    try {
      const content = await readFile(latestFile, "utf-8");
      // Extract just the title line
      const titleMatch = content.match(/^#\s+(.+)$/m);
      return titleMatch ? titleMatch[1].trim() : basename(latestFile);
    } catch {
      return null;
    }
  }

  return {
    "experimental.session.compacting": async (input, output) => {
      const projectDir = directory;
      const contextParts = [];

      // 1. Active task context
      const taskData = await getActiveTaskContext(projectDir);
      if (taskData) {
        const fields = extractTaskFields(taskData.content);
        const taskLines = [`Active Task: ${fields.id || "unknown"} — ${fields.title || taskData.fileName}`];
        if (fields.goal) taskLines.push(`Goal: ${fields.goal}`);
        if (fields.complexity) taskLines.push(`Complexity: ${fields.complexity}`);
        if (fields.assigned_to) taskLines.push(`Assigned to: ${fields.assigned_to}`);
        if (fields.criteria && fields.criteria.length > 0) {
          taskLines.push(`Success Criteria:`);
          fields.criteria.forEach((c) => taskLines.push(`  - ${c}`));
        }
        contextParts.push(taskLines.join("\n"));
      }

      // 2. Active story context
      const storyTitle = await getActiveStoryContext(projectDir);
      if (storyTitle) {
        contextParts.push(`Active Story: ${storyTitle}`);
      }

      // 3. Build final context block
      if (contextParts.length > 0) {
        output.context.push(
          `<project-context>\n${contextParts.join("\n\n")}\n</project-context>`
        );
      }
    },
  };
};

