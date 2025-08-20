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

(Details for Create, Read, Update, Delete commands as previously defined)

#### 1. **Create (增)**

- **`create file <path>`**: Creates a new, empty file at the specified path.
- **`create dir <path>`**: Creates a new directory.
  - **Option**: `-p, --parents`: Automatically create parent directories.

#### 2. **Read / List (查)**

- **`show <path>`**: Displays the contents of a specified file.
- **`ls <path>`**: Lists the contents of a specified directory.

#### 3. **Update / Move (改)**

- **`move <source> <destination>`**: Moves or renames a file or directory.

#### 4. **Delete (删)**

- **`remove <path>`**: Deletes a specified file or an **empty** directory.
- **Option**: `-r, --recursive`: Allows for recursive deletion.
- **Safeguard**: Requires interactive confirmation for recursive deletion.
- **Option**: `-f, --force`: Bypasses the confirmation.

---

## Version 3.0: Modern CLI Enhancements (Future)

This phase focuses on improving user experience, automation, and extensibility to make the tool truly modern and powerful.

### 🎨 Rich & Interactive Experience

- **Colorized Output**: Automatically apply colors to output based on file type, directory, or status (e.g., errors in red, success in green). This dramatically improves readability.
- **Progress Indicators**: For long-running operations (e.g., large recursive deletes or searches), display a spinner or progress bar to give the user feedback that the application is working.
- **Interactive Selection**: For search results, provide an interactive mode (`-i, --interactive`) that presents a checklist or selectable list, allowing the user to choose which files to apply a subsequent action to (e.g., select files to delete).

### ⚙️ Advanced Operations & Watch Mode

- **Watch Mode**: Introduce a `--watch` flag for search and `ls` commands. The command will remain active and re-run automatically whenever files change in the target directory, making it a powerful tool for development.
- **Content Search (`grep`-like)**: Add a new command `search content <text> [glob]` that searches for a specific string or regex *inside* the files found by a glob pattern.
- **Execute Command on Results (`xargs`-like)**: Add an `--exec <command>` flag to the search command. For each file found, it will execute the provided shell command, replacing a placeholder (e.g., `{}`) with the file path.
  - *Example*: `bun-glob "*.ts" --exec "bun format {}"` would format every found TypeScript file.

### 🔧 Configuration & Customization

- **Configuration Files**: Allow users to set default preferences (e.g., always ignore `node_modules`, default to absolute paths) in a `.bun-glob-rc` file at the project root or in a global config file (`~/.config/bun-glob/config.json`).
- **`config` Command**: Add a `config <action> [key] [value]` command to allow users to manage these settings directly from the CLI.

### 🔌 Extensibility & Scripting

- **JSON Output**: Add a `--json` flag to all commands that produce listable output. This makes the tool's output machine-readable and easily pipeable to other tools like `jq`.
- **Plugin System (Ambitious)**: In a future state, design a simple plugin system where users can write their own commands or hooks in TypeScript, which the CLI can discover and load.

