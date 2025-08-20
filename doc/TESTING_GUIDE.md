# Project Testing Guide

This document outlines the testing philosophy, tools, and procedures for the `bun-glob-cli` project.

---

## 1. Testing Philosophy & Framework

Our testing strategy is built upon the principle that a reliable tool requires a robust and comprehensive test suite.

- **Framework**: We exclusively use **`bun:test`**, the ultra-fast, built-in test runner provided by the Bun runtime.
- **Reasoning**:
  - **Zero-Dependency**: No need to install or configure external libraries like Jest or Vitest.
  - **High Performance**: Being built-in and written in native code, it offers superior performance, leading to faster feedback cycles.
  - **Seamless Integration**: It works out-of-the-box with TypeScript, requiring no extra configuration.
- **Core Principles**:
  - All new features must be accompanied by corresponding tests.
  - All bug fixes must include a regression test that fails before the fix and passes after.

---

## 2. How to Run Tests

To execute the entire test suite for the project, simply run the following command from the project root:

```bash
bun test
```

### Reference: Successful Test Run Output

A successful test run will produce output similar to the following, indicating that all tests have passed and snapshots are up to date.

```
bun test v1.2.20 (6ad208bc)


index.test.ts:
(pass) bun-glob CLI > should show help message for --help flag [250.00ms]
(pass) bun-glob CLI > should find the package.json file in the current directory [219.00ms]
(pass) bun-glob CLI > should return no files for a non-existent pattern [234.00ms]

 3 pass
 0 fail
 snapshots: +1 added
 4 expect() calls
Ran 3 tests across 1 file. [735.00ms]
```

---

## 3. Writing Tests

- **Location & Naming**: All test files should be co-located with the code they are testing and must end with the `.test.ts` suffix. For our CLI, this is `index.test.ts`.

- **Test Structure**: We use the BDD-style `describe` and `it` blocks to structure tests clearly:
  - `describe("Component Name", () => { ... });`
  - `it("should do something under some condition", () => { ... });`

- **Types of Tests Used**:

  1.  **Snapshot Tests**: Used to verify the output of the CLI, such as the help menu. The test captures a "snapshot" of a known good output and compares future test runs against it. This is excellent for detecting unintended UI or text changes.
      - **Example**: The `should show help message for --help flag` test.
      - **Note**: Snapshots are stored in the `__snapshots__` directory.

  2.  **Functional Tests**: Used to verify the core logic of the application. These tests run the command and assert specific outcomes based on the output text.
      - **Example**: The `should find the package.json file...` and `should return no files for a non-existent pattern` tests.
