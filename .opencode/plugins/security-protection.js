export const SecurityProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      // Check for file reading tools
      // "read" is the internal name used in docs, "read_file" is the tool name seen in context
      if (input.tool === "read" || input.tool === "read_file") {
        const filePath = (output.args.filePath || "").toLowerCase();
        const sensitivePatterns = [".env", ".pfx", ".pem", "id_rsa"];
        
        for (const pattern of sensitivePatterns) {
          if (filePath.includes(pattern)) {
             throw new Error(`Security Violation: Direct access to sensitive file containing '${pattern}' is prohibited. Use environment variables instead.`);
          }
        }
      }
    },
  }
}
