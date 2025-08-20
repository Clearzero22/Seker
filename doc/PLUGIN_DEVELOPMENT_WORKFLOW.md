### **`bun-glob-cli` 插件开发工作流**

本文档概述了开发、测试和集成 `bun-glob-cli` 工具插件的推荐工作流。

**1. 理解插件概念**

*   查阅 `doc/ARCHITECTURE_EXTENSIBILITY.md`，了解 `GlobPlugin` 接口和插件集成点。
*   理解 `name`, `description`, `cliOptions`, `apply`, `modifyPattern`, `formatOutput` 和 `init` 方法的用途。

**2. 设置插件开发环境**

*   **先决条件:**
    *   Bun (最新稳定版本)
    *   TypeScript
    *   `bun-glob-cli` 源代码 (从仓库克隆)
*   **创建新的插件项目:**
    *   插件应该是独立的 Bun/TypeScript 项目。
    *   `bun init -y`
    *   `bun add typescript`
    *   `bun add --dev @types/node` (如果使用 Node.js API)
    *   `bun add bun-glob-cli` (作为开发依赖，用于 `GlobPlugin` 接口)
*   **`tsconfig.json`:** 确保 `target`, `module`, `esModuleInterop`, `forceConsistentCasingInFileNames`, `strict`, `skipLibCheck` 配置正确。

**3. 开发你的插件**

*   **实现 `GlobPlugin` 接口:**
    *   在你的插件项目中创建一个 `index.ts` (或类似) 文件。
    *   导出一个实现 `GlobPlugin` 的 `default` 对象。
    *   示例:

        ```typescript
        // my-plugin/index.ts
        import { GlobPlugin } from 'bun-glob-cli'; // 假设 bun-glob-cli 已安装

        const myPlugin: GlobPlugin = {
            name: 'my-custom-plugin',
            description: '一个执行自定义操作的插件。',
            cliOptions: [
                { flags: '--my-option <value>', description: '我的插件的自定义选项' }
            ],
            async apply(files: string[], options: any): Promise<string[]> {
                // 你的自定义逻辑来过滤或转换文件
                console.log('我的插件正在应用逻辑，选项:', options.myOption);
                return files.filter(file => !file.includes('temp'));
            },
            init() {
                console.log('我的自定义插件已初始化！');
            }
        };

        export default myPlugin;
        ```
*   **选择集成点:** 决定哪些 `GlobPlugin` 方法 (`apply`, `modifyPattern`, `formatOutput`, `cliOptions`) 与你的插件功能相关。
*   **错误处理:** 在你的插件逻辑中实现健壮的错误处理。

**4. 测试你的插件**

*   **单元测试:** 使用 `bun:test` 为你的插件核心逻辑编写单元测试。
*   **集成测试 (与 `bun-glob-cli`):**
    *   **方法 1: 本地链接 (用于开发)**
        *   在你的插件项目中: `bun link`
        *   在 `bun-glob-cli` 项目中: `bun link <你的插件包名>` (例如，`bun link my-custom-plugin`)
        *   这使得你的插件可以被 `bun-glob-cli` 使用，就像它被安装了一样。
    *   **方法 2: 基于配置加载**
        *   修改 `bun-glob-cli` 的 `.bun-glob-rc` (或等效的配置文件)，包含你的插件编译后的 `index.js` (如果 Bun 支持直接加载 TS 插件，也可以是 `index.ts`) 的路径。
        *   示例 `.bun-glob-rc`:
            ```json
            {
                "plugins": [
                    "./path/to/your/my-plugin/dist/index.js"
                ]
            }
            ```
        *   运行 `bun-glob-cli` 命令来测试你的插件行为。
*   **调试:** 使用 Bun 的调试功能来逐步执行你的插件代码。

**5. 集成和分发你的插件**

*   **打包 (如果需要):** 为了分发，你可能需要使用 `bun build` 将你的插件打包成一个单独的 JavaScript 文件。
*   **发布 (可选):** 如果你打算分享你的插件，考虑将其发布到 NPM (或类似的注册表)，并遵循清晰的命名约定 (例如，`bun-glob-cli-plugin-myfeature`)。
*   **文档:** 为你的插件提供清晰的 `README.md`，解释其目的、安装、使用和任何特定选项。

**6. 最佳实践**

*   **命名约定:** 为你的插件使用清晰一致的命名 (例如，`bun-glob-cli-plugin-myfeature`)。
*   **模块化:** 保持你的插件专注于单一职责。
*   **性能:** 注意性能，特别是对于可能处理大量文件的 `apply` 方法。
*   **兼容性:** 测试你的插件与不同版本的 `bun-glob-cli` 和 Bun 的兼容性。
*   **安全性:** 在你的插件中处理用户输入或外部资源时要谨慎。