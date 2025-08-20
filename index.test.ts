import { describe, it, expect } from "bun:test";
import { execSync } from "child_process";

// Helper function to run the CLI command
const runCLI = (args: string): string => {
  try {
    return execSync(`bun run index.ts ${args}`).toString();
  } catch (error: any) {
    // For commands that are expected to exit with a non-zero code (like --help)
    // execSync throws an error, but the output is still available.
    return error.stdout.toString();
  }
};

describe("bun-glob CLI", () => {

  it("should show help message for --help flag", () => {
    const output = runCLI("--help");

    // We can use a snapshot test to ensure the help output doesn't change unexpectedly.
    // The first time this test runs, it will create a __snapshots__/index.test.ts.snap file.
    // Subsequent runs will compare the output to this snapshot.
    expect(output).toMatchSnapshot();
  });

  it("should find the package.json file in the current directory", () => {
    // This is a functional test
    const output = runCLI("package.json");
    
    // We expect the output to contain the file name
    expect(output).toContain("package.json");
    // And to report 1 file found
    expect(output).toContain("Found 1 matching files");
  });

  it("should return no files for a non-existent pattern", () => {
    const output = runCLI("non-existent-file-pattern-12345.xyz");

    expect(output).toContain("No files found matching the pattern");
  });

});
