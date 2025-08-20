# 开发文档 (Development Documentation)

本文档旨在帮助开发者理解项目结构、技术选型和开发流程。

*   **项目概述**: 一个基于 Bun 和 `node-glob` 构建的高性能、跨平台文件查找 CLI 工具。
*   **技术栈**:
    *   **运行时**: Bun (v1.1.x+)
    *   **核心逻辑**: `glob` (v11.x+)
    *   **CLI 框架**: `commander` (v12.x+)
    *   **语言**: TypeScript
*   **项目结构**:
    ```
    bun_project/
    ├── .gitignore
    ├── bun.lockb         # Bun 的二进制锁文件
    ├── index.ts          # CLI 入口文件和核心逻辑
    ├── node_modules/     # 依赖包
    ├── package.json      # 项目元数据和依赖列表
    └── tsconfig.json     # TypeScript 配置文件
    ```
*   **如何运行与开发**:
    *   **运行**: `bun run index.ts -- <pattern> [options]`
        *   *示例*: `bun run index.ts -- "**/*.ts" --ignore "node_modules/**"`
    *   **格式化代码**: `bun format`
    *   **代码检查**: `bun lint`
*   **代码逻辑**:
    *   `index.ts` 是应用的唯一入口。
    *   使用 `commander` 库定义了程序的参数（`pattern`）和一系列选项（`--ignore`, `--cwd` 等）。
    *   `.action()` 回调函数是核心业务逻辑，它接收解析后的参数和选项。
    *   内部调用 `globSync()` 函数执行文件查找。选择同步版本是因为在 CLI 场景下，操作是阻塞性的，同步代码更简单直观。
    *   对 `globSync` 的结果进行处理后，输出到标准输出流。
    *   包含基本的错误处理机制，捕获异常并打印错误信息。
