export const SecurityProtection = async ({ project, client, $, directory, worktree }) => {
  // --- Configuration ---

  // Patterns indicating sensitive files (matched case-insensitively as substrings)
  const sensitivePatterns = [
    ".env",         // .env, .env.local, .env.production, etc.
    ".pem",
    ".pfx",
    ".key",
    "id_rsa",
    "id_ed25519",
    "credentials",
    "secrets",
    ".htpasswd",
  ];

  // Shell commands that can read, copy, or expose file contents
  const dangerousShellCommands = [
    "cat", "tac", "less", "more", "head", "tail", "nl",
    "grep", "egrep", "fgrep", "rg",
    "sed", "awk", "gawk",
    "cp", "mv", "scp", "rsync",
    "vim", "nvim", "nano", "vi", "emacs",
    "code", "open", "xdg-open",
    "base64", "xxd", "strings", "od", "hexdump",
    "bat", "batcat",
    "sort", "uniq", "wc", "diff",
    "curl", "wget",
    "source", "tee",
    "dd", "tar", "zip", "gzip",
  ];

  // Tool name groups
  const readToolNames = ["read", "read_file"];
  const writeToolNames = ["write", "write_file"];
  const shellToolNames = ["bash", "shell", "execute"];

  // --- Helpers ---

  /** Returns the first matched sensitive pattern found in text, or null. */
  function matchesSensitivePattern(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const pattern of sensitivePatterns) {
      if (lower.includes(pattern)) return pattern;
    }
    return null;
  }

  // Pre-compiled regex for dangerous shell commands (word-boundary matching)
  const dangerousCmdRegex = new RegExp(
    "\\b(" +
      dangerousShellCommands
        .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|") +
      ")\\b",
    "i",
  );

  /**
   * Checks a shell command string for attempts to access sensitive files.
   * Detects:
   *   - Direct access:  cat .env, less secrets.pem, head .env.local
   *   - Copy / move:    cp .env /tmp/, mv .env.bak .env
   *   - Subshells:      $(cat .env), `cat .env`
   *   - Pipes:          cat .env | base64
   *   - Redirects:      echo x > .env, echo x >> .env.local
   *   - Dot-source:     . .env  (shell builtin)
   *
   * @returns {string|null} The matched sensitive pattern, or null if safe.
   */
  function checkShellCommand(command) {
    if (!command) return null;

    // Quick exit: does the command reference any sensitive pattern at all?
    const matched = matchesSensitivePattern(command);
    if (!matched) return null;

    // 1) Dangerous read/copy/expose command present alongside a sensitive file
    //    Covers direct access, subshells ($(...), backticks), and pipes.
    if (dangerousCmdRegex.test(command)) return matched;

    // 2) Output redirect targeting a sensitive file  (echo x > .env)
    for (const m of command.matchAll(/[12]?>{1,2}\s*(\S+)/g)) {
      if (matchesSensitivePattern(m[1])) return matched;
    }

    // 3) Dot-source builtin:  . .env  (POSIX shell sourcing)
    for (const m of command.matchAll(/(?:^|[;&|\n])\s*\.\s+(\S+)/gm)) {
      if (matchesSensitivePattern(m[1])) return matched;
    }

    return null;
  }

  // --- Hook ---

  return {
    "tool.execute.before": async (input, output) => {
      const toolName = input.tool;

      // 1) File read tools — existing protection with extended patterns
      if (readToolNames.includes(toolName)) {
        const filePath = output.args.filePath || output.args.path || "";
        const pattern = matchesSensitivePattern(filePath);
        if (pattern) {
          throw new Error(
            `Security Violation: Direct access to sensitive file containing '${pattern}' is prohibited. Use environment variables instead.`,
          );
        }
      }

      // 2) File write tools — block writes to sensitive files
      if (writeToolNames.includes(toolName)) {
        const filePath = output.args.filePath || output.args.path || "";
        const pattern = matchesSensitivePattern(filePath);
        if (pattern) {
          throw new Error(
            `Security Violation: Write access to sensitive file containing '${pattern}' is prohibited.`,
          );
        }
      }

      // 3) Shell execution tools — parse command for sensitive file access
      if (shellToolNames.includes(toolName)) {
        const command = output.args.command || output.args.input || "";
        const pattern = checkShellCommand(command);
        if (pattern) {
          throw new Error(
            `Security Violation: Shell command attempts to access sensitive file matching '${pattern}'. Direct access to sensitive files is prohibited.`,
          );
        }
      }
    },
  };
}
