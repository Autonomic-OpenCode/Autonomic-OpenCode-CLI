# Quality Standards

To ensure the reliability and maintainability of our codebase and operations, all agents must adhere to these quality standards.

## 1. General Work Quality
- **Completeness**: All deliverables (plans, analyses, documentation, code) must be complete and directly usable. No "TODOs" or placeholders in final outputs.
- **Accuracy**: Verify facts, requirements, and file paths before execution. Assumptions must be explicitly stated.
- **Clarity**: Adhere strictly to `COMMUNICATION_STANDARDS.md`. Be direct, professional, and unambiguous.
- **Professionalism**: Keep emoji usage minimal and functional (e.g., status indicators), avoiding decorative excess.
- **Process Adherence**: Follow the "Memory-First" approach. Always check existing standards before creating new ones.

## 2. Task & Analysis Quality
- **Context**: AgentTasks must contain all necessary context (embedded standards, relevant memory patterns).
- **Granularity**: Tasks must be small enough to be executed reliably (Complexity ≤ 15).
- **Logical Breakdown**: Stories must be broken down into a logical sequence of dependencies.

## 3. Code Quality
- **Clean Code**: Write code that is easy to read, understand, and maintain.
- **Naming**: Follow the project's naming conventions (lowercase/kebab-case for files, language-specific conventions for code symbols).
- **Comments**: Explain *why* complex logic exists, not just *what* it does.
- **No Dead Code**: Remove unused variables, functions, and commented-out blocks.

## 4. Testing Standards
- **Mandatory Testing**: Every functional change must be accompanied by a corresponding test (Unit or Integration).
- **Test Coverage**: Aim for high coverage of business logic.
- **Green Build**: All tests must pass before a task is considered complete.
- **Regression**: Ensure new changes do not break existing functionality.

## 5. Documentation & Memory
- **Project Documentation**: Store important project documentation in `docu/`. Write these files from a **project team perspective** ("We", "Our"), providing natural language context for humans while optimizing for AI with clear headers and keywords.
- **Self-Documenting**: Code should be self-explanatory where possible.
- **Memory Updates**: Update `memory/` with any new patterns, architectural decisions, or significant learnings.
- **README**: Update project `README.md` or specific module documentation if the change affects usage.

## 6. Definition of Done (DoD)
A task is only complete when:
1.  ✅ Deliverable meets the specific goal defined in the AgentTask.
2.  ✅ Code (if any) is implemented and follows standards.
3.  ✅ Tests (if applicable) are written and passing.
4.  ✅ Documentation and Memory are updated.
5.  ✅ No new linting or build errors are introduced.

## 7. Verification & Failure Handling
- **Mandatory Verification**: Agents must verify their work (run tests, build, check requirements) *before* declaring a task complete.
- **Failure Protocol**: If verification fails, choose the appropriate path:
    1.  **Self-Correction**: If the error is clear and fixable, try to fix it autonomously (up to 3 attempts).
    2.  **Clarification**: If the error implies missing information or ambiguity, ask the user for specific details.
    3.  **User Decision**: If the fix is risky, costly, or the path forward is unclear, present the situation to the user and ask whether to continue or abort.

## 8. Security & Sensitive Data
- **No Direct Access**: Agents must NEVER read, write, or process sensitive files directly (e.g., `.env`, `*.pfx`, `*.pem`, `id_rsa`).
- **Protection**: The OpenCode Plugin System is used to **block** access to these files.
- **Secret Management**: Never hardcode secrets in code or memory. Use environment variables provided by the execution environment.
