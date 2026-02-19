import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Memory Keeper Plugin
 *
 * Automatically manages the Memory-Bank by:
 * 1. Bootstrap: Detects empty/missing memory/ on session start and injects
 *    a system prompt instructing the agent to scan the codebase and create
 *    initial memory entries.
 * 2. Task Completion: Detects when a task in .local/agenttasks/ is marked
 *    as done and injects a prompt to update or create memory entries.
 *
 * Replaces memory-auto-record.js with proactive memory management.
 *
 * Memory categories: Knowledge/, Pattern/, Learning/, Debugging/
 */
export const MemoryKeeper = async ({ directory }) => {
  const MEMORY_SUBDIRS = ["Knowledge", "Pattern", "Learning", "Debugging"];

  // --- State ---
  let needsBootstrap = false;
  let completedTask = null;

  // --- Helpers ---

  /**
   * Checks if the memory/ directory is empty or missing.
   * Returns true if no files exist across any memory subdirectory.
   */
  async function isMemoryEmpty(projectDir) {
    for (const subdir of MEMORY_SUBDIRS) {
      const dir = join(projectDir, "memory", subdir);
      try {
        const files = await readdir(dir);
        if (files.length > 0) {
          return false;
        }
      } catch {
        // Directory doesn't exist — continue checking others
        continue;
      }
    }
    return true;
  }

  /**
   * Extracts the task title from YAML content using regex.
   * Avoids external YAML parser dependency.
   */
  function extractTaskTitle(content) {
    const match = content.match(/^title:\s*"?([^"\n]+)"?/m);
    return match ? match[1].trim() : null;
  }

  // --- Hooks ---

  return {
    /**
     * Event hook: Detects session.created to check if memory bootstrap is needed.
     */
    "event": async (input) => {
      const eventType = input?.properties?.type;
      if (eventType !== "session.created") return;

      console.log("[memory-keeper] Session created — checking memory status");

      try {
        const empty = await isMemoryEmpty(directory);
        if (empty) {
          needsBootstrap = true;
          console.log("[memory-keeper] Memory is empty — bootstrap required");
        } else {
          console.log("[memory-keeper] Memory has entries — no bootstrap needed");
        }
      } catch (err) {
        console.log("[memory-keeper] Error checking memory:", err.message);
      }
    },

    /**
     * Tool execution hook: Tracks writes to detect:
     * - Files written to memory/ (clears bootstrap flag)
     * - Task YAML files written with status: done (sets completedTask flag)
     */
    "tool.execute.after": async (input) => {
      const toolName = input?.tool;
      if (!toolName) return;

      // Only track write tools
      const writeTools = ["write", "write_file", "edit", "edit_file"];
      if (!writeTools.includes(toolName)) return;

      const filePath = input?.args?.filePath || input?.args?.path || "";
      if (!filePath) return;

      // Phase 1: Detect writes to memory/ — clear bootstrap flag
      if (filePath.includes("memory/") && needsBootstrap) {
        needsBootstrap = false;
        console.log("[memory-keeper] Memory write detected — bootstrap complete");
      }

      // Phase 2: Detect task completion in .local/agenttasks/
      if (filePath.includes(".local/agenttasks/") && filePath.match(/\.ya?ml$/)) {
        const content = input?.args?.content || "";
        const statusMatch = content.match(/^status:\s*"?done"?/m);

        if (statusMatch) {
          const title = extractTaskTitle(content) || "Unknown Task";
          completedTask = title;
          console.log(`[memory-keeper] Task completed: "${title}" — memory update needed`);
        }
      }
    },

    /**
     * System transform hook: Injects prompts into the system message.
     * - Bootstrap prompt when memory is empty
     * - Memory update prompt when a task was completed
     */
    "experimental.chat.system.transform": async (input, output) => {
      // Phase 1: Bootstrap injection
      if (needsBootstrap) {
        console.log("[memory-keeper] Injecting bootstrap prompt");
        output.system.push(
          "<memory-keeper-bootstrap>\n" +
          "Dieses Projekt hat noch keine Memory-Einträge. Bevor du mit der eigentlichen Aufgabe beginnst: " +
          "Scanne die Codebase (Ordnerstruktur, package.json/Cargo.toml/etc., Architektur-Patterns, Konventionen) " +
          "und erstelle initiale Einträge in `memory/Knowledge/`, `memory/Pattern/`, `memory/Learning/`. " +
          "Danach setze mit der ursprünglichen Aufgabe fort.\n" +
          "</memory-keeper-bootstrap>"
        );
      }

      // Phase 2: Task completion memory update injection
      if (completedTask) {
        const title = completedTask;
        completedTask = null; // Reset after single injection
        console.log(`[memory-keeper] Injecting memory update prompt for: "${title}"`);
        output.system.push(
          "<memory-keeper-task-complete>\n" +
          `Task '${title}' wurde abgeschlossen. Prüfe ob Memory-Einträge aktualisiert oder neue erstellt ` +
          "werden müssen (memory/Knowledge/, memory/Pattern/, memory/Learning/, memory/Debugging/).\n" +
          "</memory-keeper-task-complete>"
        );
      }
    },
  };
};

