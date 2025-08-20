# Project Features & Development Plan

This document tracks the current feature set of `bun-glob-cli` and outlines the roadmap for future enhancements.

---

## Version 1.0: Core Functionality (Implemented)

The initial version of the tool is focused on high-performance, cross-platform file searching.

- **✅ Pattern-Based Search**: The core feature allows searching for files using glob patterns (e.g., `"src/**/*.ts"`).
- **✅ Custom Search Directory**: Users can specify a different starting directory for the search using the `-d, --cwd` flag.
- **✅ Ignore Patterns**: Support for excluding specific files or directories from the search results via the `-i, --ignore` flag.
- **✅ Dotfile Inclusion**: Provides a `--dot` flag to optionally include files and directories that start with a period (`.`).
- **✅ Absolute Path Output**: Includes an `--absolute` flag to return full absolute paths instead of relative ones.
- **✅ Cross-Platform Support**: Guaranteed to work on Windows, macOS, and Linux, with path separators automatically handled.
- **✅ Integrated Help**: A comprehensive help menu is available through the `-h, --help` flag.

---

## Version 2.0: File & Directory Management (Planned)

The next major version will transform the tool from a simple search utility into a lightweight, fast file system management toolkit. This will be achieved by introducing a subcommand structure.

### Proposed Command Structure

The CLI will adopt a `program <command> [arguments]` structure.

### New Commands: CRUD Operations

#### 1. **Create (增)**

- **`create file <path>`**: Creates a new, empty file at the specified path.
  - *Example*: `bun-glob create file ./src/new-component.ts`
- **`create dir <path>`**: Creates a new directory.
  - *Example*: `bun-glob create dir ./assets/images`
  - **Option**: `-p, --parents`: Automatically create parent directories if they do not exist (similar to `mkdir -p`).

#### 2. **Read / List (查)**

- **`show <path>`**: Displays the contents of a specified file directly in the terminal.
  - *Example*: `bun-glob show ./package.json`
- **`ls <path>`**: Lists the contents of a specified directory.
  - *Example*: `bun-glob ls ./src`
  - This command will leverage the existing glob engine and can be enhanced with options from the search command (e.g., `--ignore`).

#### 3. **Update / Move (改)**

- **`move <source> <destination>`**: Moves or renames a file or directory.
  - *Example (Rename)*: `bun-glob move ./old-name.txt ./new-name.txt`
  - *Example (Move)*: `bun-glob move ./src/app.ts ./lib/app.ts`

#### 4. **Delete (删)**

- **`remove <path>`**: Deletes a specified file or an **empty** directory.
  - *Example*: `bun-glob remove ./temp-file.tmp`
- **Recursive Deletion (with safeguards)**:
  - **Option**: `-r, --recursive`: Allows for the deletion of a directory and all of its contents.
  - **Safeguard**: When using `-r`, the command will require an interactive confirmation from the user to prevent accidental data loss.
  - **Option**: `-f, --force`: Can be used with `-r` to bypass the interactive confirmation.

### Implementation Plan for v2.0

1. **Refactor CLI Structure**: Modify `index.ts` to use `commander.js`'s subcommand system (`program.command(...)`) to handle the new commands (`create`, `show`, `move`, `remove`).
2. **Implement File System Logic**: Utilize Bun's high-performance, built-in file system APIs (e.g., `Bun.write`, `import { mkdir, rename, rm } from "fs/promises"`) to power the new operations.
3. **Add Interactive Prompts**: For destructive operations like `remove --recursive`, implement a user confirmation prompt to ensure safety.
4. **Expand Test Suite**: Create new test files (e.g., `create.test.ts`, `remove.test.ts`) to provide full test coverage for all new commands and their options.
5. **Update All Documentation**: Thoroughly update `README.md`, `Gemini.md`, and other relevant documents to reflect the new capabilities.
