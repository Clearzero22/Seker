# Gemini Agent Protocol for bun-glob-cli

This document outlines the operational protocol and development philosophy for the Gemini AI Agent responsible for the `bun-glob-cli` project. The agent's primary mission is to autonomously develop, maintain, and enhance the tool, ensuring high performance, reliability, and excellent documentation.

---

## 1. Project Overview

- **Project Name**: `bun-glob-cli` (or other chosen name)
- **Description**: A high-performance, cross-platform command-line interface for finding files using glob patterns.
- **Technology Stack**: 
  - **Runtime**: Bun
  - **Language**: TypeScript
  - **CLI Framework**: Commander.js
  - **Core Logic**: node-glob

## 2. Core Principles

The agent must adhere to the following principles in all tasks:

1.  **Performance First**: All code modifications and dependency choices must prioritize and leverage Bun's high-performance characteristics.
2.  **User-Centric Design**: CLI commands, options, and outputs should be intuitive, clear, and well-documented for the end-user.
3.  **Cross-Platform Compatibility**: All features must be verified to work seamlessly on Windows, macOS, and Linux.
4.  **Code Quality & Consistency**: Code must be clean, readable, and strictly adhere to modern TypeScript best practices. Use `bun format` before committing.
5.  **Test-Driven Mentality**: No feature is considered complete without corresponding tests. No bug fix is complete without a regression test.
6.  **Atomic & Conventional Commits**: All changes must be committed in small, logical units with messages following the [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) specification.

---

## 3. Development Workflow

This section defines the step-by-step process for the agent to handle various development tasks.

### 3.1. Planning & Feature Development

1.  **Analyze Request**: Thoroughly understand the user's request for a new feature or enhancement.
2.  **Consult Roadmap**: Review `ROADMAP.md` to align the new feature with the project's long-term vision.
3.  **Formulate Plan**: Break down the task into a clear, logical sequence of steps (e.g., 1. Add CLI option -> 2. Update handler logic -> 3. Write tests -> 4. Update docs).
4.  **Confirm Plan**: Present the plan to the user for approval before writing any code.

### 3.2. Coding & Implementation

- **File Structure**: For now, logic resides in `index.ts`. If the application complexity grows, the agent should propose and execute a migration to a `src/` directory structure (e.g., `src/cli.ts`, `src/core.ts`).
- **Dependencies**: Use `bun add` for adding dependencies and `bun remove` for removing them. Ensure types are added (`@types/...`) for any non-TypeScript native libraries.
- **Error Handling**: Implement robust error handling for file system operations and invalid user input.

### 3.3. Testing & Quality Assurance

- **Framework**: Use the built-in `bun:test` framework.
- **Test Location**: Test files should be named `*.test.ts` (e.g., `index.test.ts`).
- **Process**:
  1.  **For New Features**: Create tests that cover the main functionality, edge cases (e.g., empty results, invalid patterns), and option combinations.
  2.  **For Bug Fixes**: Before fixing, write a new test that specifically fails by reproducing the bug. The fix is complete only when this test passes.
- **Quality Gates**: Before finalizing a task, run the full quality suite:
  - `bun test`
  - `bun format --check`
  - `bun tsc --noEmit` (Requires adding a `typecheck` script to `package.json`)

### 3.4. Documentation

Documentation is not an afterthought; it is part of the development process.

- **`README.md`**: The User Manual. Must be updated with any changes to CLI commands, options, or usage examples.
- **`DEVELOPMENT.md`**: The Developer Manual. Must be updated if the architecture, build process, or testing strategy changes.
- **`ROADMAP.md`**: The Vision Document. Should be updated to reflect the completion of major features and the addition of future goals.
- **Code Comments**: Add comments only when the *reason* for the code is not obvious. Do not comment on *what* the code is doing.

---

## 4. Project Command Reference

A quick reference for the agent.

| Command                               | Description                                       |
| ------------------------------------- | ------------------------------------------------- |
| `bun run index.ts -- [args]`          | Executes the CLI in development mode.             |
| `bun test`                            | Runs the entire test suite.                       |
| `bun format`                          | Formats all source code files.                    |
| `bun build ./index.ts --outfile name` | Builds a standalone executable for the project.   |
| `git status`                          | Checks the status of the working tree.            |
| `git add [file]`                      | Stages a file for the next commit.                |
| `git commit -m "type: message"`       | Commits staged files with a conventional message. |
