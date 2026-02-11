import { tool } from "@opencode-ai/plugin";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";

/**
 * Memory Search Tool
 *
 * Searches across the memory/ directory structure by keyword and optional
 * category. Replaces manual directory browsing for agents populating
 * embedded_standards and embedded_learnings in AgentTasks.
 */

const CATEGORIES = {
  knowledge: "Knowledge",
  pattern: "Pattern",
  learning: "Learning",
  debugging: "Debugging",
};

const SEARCHABLE_EXTENSIONS = new Set([".md", ".yaml", ".yml", ".txt"]);
const MAX_FILE_SIZE = 5000; // chars — skip reading beyond this
const MAX_SNIPPET_LENGTH = 200; // chars per match snippet
const MAX_RESULTS = 10;

/**
 * Reads all searchable files from a single memory/ subdirectory (recursively).
 * Returns array of { path, name, content }.
 */
async function readMemoryCategory(memoryDir, categoryDir) {
  const dirPath = join(memoryDir, categoryDir);
  let entries;
  try {
    entries = await readdir(dirPath, { recursive: true });
  } catch {
    return [];
  }

  const results = [];
  for (const entry of entries) {
    const ext = extname(entry).toLowerCase();
    if (!SEARCHABLE_EXTENSIONS.has(ext)) continue;
    if (basename(entry).startsWith(".")) continue; // skip dotfiles like .gitkeep

    const filePath = join(dirPath, entry);
    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) continue;

      const content = await readFile(filePath, "utf-8");
      results.push({
        path: `memory/${categoryDir}/${entry}`,
        name: basename(entry, ext),
        content: content.slice(0, MAX_FILE_SIZE),
      });
    } catch {
      continue;
    }
  }
  return results;
}

/**
 * Extracts a snippet around the first match of the query in the content.
 */
function extractSnippet(content, queryLower) {
  const contentLower = content.toLowerCase();
  const idx = contentLower.indexOf(queryLower);
  if (idx === -1) return null;

  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + queryLower.length + MAX_SNIPPET_LENGTH - 60);
  let snippet = content.slice(start, end).replace(/\n/g, " ").trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  return snippet;
}

export default tool({
  description:
    "Search across the project memory/ directory (Knowledge, Pattern, Learning, Debugging) by keyword. " +
    "Returns matching file paths, titles, and relevant snippets. " +
    "Use this to find existing standards, patterns, learnings, and debugging guides before starting work.",
  args: {
    query: tool.schema
      .string()
      .describe("Keyword or phrase to search for (case-insensitive)"),
    category: tool.schema
      .string()
      .optional()
      .describe(
        'Filter to a specific category: "knowledge", "pattern", "learning", or "debugging". Omit to search all.'
      ),
  },
  async execute(args, context) {
    const memoryDir = join(context.worktree, "memory");
    const query = args.query.trim();

    if (!query) {
      return "Error: query parameter is required and cannot be empty.";
    }

    // Determine which categories to search
    let categoriesToSearch;
    if (args.category) {
      const key = args.category.toLowerCase();
      const dirName = CATEGORIES[key];
      if (!dirName) {
        return `Error: Unknown category "${args.category}". Valid categories: ${Object.keys(CATEGORIES).join(", ")}`;
      }
      categoriesToSearch = [[key, dirName]];
    } else {
      categoriesToSearch = Object.entries(CATEGORIES);
    }

    // Collect all files from target categories
    const allFiles = [];
    for (const [, dirName] of categoriesToSearch) {
      const files = await readMemoryCategory(memoryDir, dirName);
      allFiles.push(...files);
    }

    if (allFiles.length === 0) {
      const scope = args.category ? `memory/${CATEGORIES[args.category.toLowerCase()]}/` : "memory/";
      return `No files found in ${scope}. The memory directory may not have been populated yet. Create files in memory/Knowledge/, memory/Pattern/, memory/Learning/, or memory/Debugging/ to build the project knowledge base.`;
    }

    // Search: score each file
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    const scored = allFiles
      .map((file) => {
        const nameLower = file.name.toLowerCase();
        const contentLower = file.content.toLowerCase();
        let score = 0;

        // Exact phrase match in name (highest value)
        if (nameLower.includes(queryLower)) score += 10;

        // Exact phrase match in content
        if (contentLower.includes(queryLower)) score += 5;

        // Individual word matches
        for (const word of queryWords) {
          if (nameLower.includes(word)) score += 3;
          // Count occurrences in content (capped at 5)
          const occurrences = Math.min(5, (contentLower.split(word).length - 1));
          score += occurrences;
        }

        const snippet = extractSnippet(file.content, queryLower) ||
          extractSnippet(file.content, queryWords[0] || "") ||
          file.content.slice(0, MAX_SNIPPET_LENGTH).replace(/\n/g, " ").trim() + "...";

        return { ...file, score, snippet };
      })
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);

    if (scored.length === 0) {
      return `No results found for "${query}"${args.category ? ` in category "${args.category}"` : ""}. Try broader keywords or check a different category.`;
    }

    // Format output
    const lines = [`Found ${scored.length} result(s) for "${query}":\n`];
    for (const result of scored) {
      lines.push(`### ${result.path}`);
      lines.push(`**Relevance**: ${result.score} | **File**: ${result.name}`);
      lines.push(`> ${result.snippet}`);
      lines.push("");
    }

    return lines.join("\n");
  },
});

