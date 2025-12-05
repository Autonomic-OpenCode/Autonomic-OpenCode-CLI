# SOP Framework & Meta-Governance

## 1. Purpose
This document defines the **Standard Operating Procedure (SOP) Framework**. It is the "Constitution" for how agents operate, how processes are defined, and how the system self-optimizes.
Agents do not just "work"; they follow strict SOPs. These SOPs are living documents, continuously improved by the **SOP Architect**.

## 2. The SOP Definition (Meta-Schema)
Every SOP in the system must adhere to this structure. Agents must reject malformed SOPs.

### 2.1 SOP Structure
An SOP is a Markdown or YAML file containing:

1.  **Metadata**:
    -   `id`: Unique identifier (e.g., `SOP-DEV-001`).
    -   `version`: Semantic versioning (e.g., `1.2.0`).
    -   `role`: The primary agent role responsible (e.g., `Developer`).
    -   `trigger`: What event starts this SOP.

2.  **Prerequisites**:
    -   Required inputs (files, variables, state).
    -   Required tools/skills.

3.  **Procedure (The "Happy Path")**:
    -   Step-by-step deterministic instructions.
    -   Decision points (If X, then Y).

4.  **Validation & Quality Gates**:
    -   How to verify the output is correct.
    -   "Definition of Done".

5.  **Error Handling**:
    -   What to do if a step fails.
    -   Escalation triggers.

## 3. The SOP Lifecycle

1.  **Draft**: Created by the SOP Architect or Project Manager. Not yet executable.
2.  **Validated**: Checked against this Framework. Ready for use.
3.  **Active**: Currently in use by agents.
4.  **Under Review**: Flagged for optimization due to failures or inefficiency.
5.  **Deprecated**: Replaced by a newer version.

## 4. The Optimization Loop (Self-Correction)

The system is designed to improve itself. This is the core "Autonomic" feature.

### 4.1 Execution Analysis
After an SOP is executed, the **Outcome Evaluator** (a system function or specialized agent) generates a report:
-   **Success**: Did it produce the expected output?
-   **Efficiency**: How many steps/tokens did it take?
-   **Quality**: Did the output pass all quality gates?

### 4.2 The SOP Architect
The **SOP Architect** is a specialized agent role responsible for the meta-system.
**Responsibilities**:
1.  **Analyze** execution reports.
2.  **Identify** bottlenecks, frequent errors, or ambiguities in active SOPs.
3.  **Refactor** SOPs (e.g., clarify a step, add a validation check, split a large SOP).
4.  **Version** the new SOP and deploy it.

## 5. Directory Structure
SOPs are stored in `.opencode/sops/` (to be created), organized by domain:
-   `.opencode/sops/development/`
-   `.opencode/sops/planning/`
-   `.opencode/sops/qa/`
-   `.opencode/sops/system/` (Meta-SOPs like this one)
