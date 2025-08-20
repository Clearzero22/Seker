### **通用扩展性设计原则**

1.  **清晰的接口和抽象**: 为每个模块或层定义清晰的 TypeScript 接口。这允许在不影响核心逻辑的情况下，替换不同的实现或添加新的实现。
2.  **依赖倒置原则 (DIP)**: 高层模块不应依赖于低层模块。两者都应依赖于抽象。这对于插件系统至关重要，核心应用程序不应该知道具体的插件实现，只知道它们实现的接口。
3.  **配置驱动**: 允许通过外部配置文件（例如 `.bun-glob-rc`）启用/禁用或配置功能和插件。
4.  **事件驱动架构 (可选但强大)**: 对于更复杂的扩展性，事件总线或发布/订阅机制可以允许插件在应用程序内部响应或触发事件，而无需直接耦合。

### **实现插件系统**

插件系统将主要与**核心逻辑层**交互，并可能与**输出层**和**CLI 层**交互。

以下是实现插件系统的详细方法：

**1. 定义插件接口/契约**

*   **目的**: 一个清晰的 TypeScript 接口，所有插件都必须遵守。这定义了主应用程序期望从插件获得的方法和属性。
*   **位置**: `src/core/plugins/interfaces.ts` (如果插件成为顶级关注点，也可以是 `src/plugins/interfaces.ts`)。

    ```typescript
    // src/core/plugins/interfaces.ts
    export interface GlobPlugin {
        name: string; // 插件名称
        description: string; // 插件描述
        // 可选: 插件特有的 CLI 选项
        cliOptions?: {
            flags: string; // 例如: '--my-plugin-option <value>'
            description: string;
            defaultValue?: any;
        }[];
        // 方法: 对 glob 结果应用自定义过滤或转换
        apply?(files: string[], options: any): Promise<string[]> | string[];
        // 可选: 方法: 修改 glob 模式本身
        modifyPattern?(pattern: string, options: any): string;
        // 可选: 方法: 提供自定义输出格式
        formatOutput?(files: string[], options: any): string;
        // 可选: 生命周期钩子 (例如，初始化，关闭)
        init?(): Promise<void> | void;
    }
    ```

**2. 插件发现和加载**

*   **目的**: 应用程序发现和加载可用插件的机制。
*   **位置**: `src/core/plugins/loader.ts`
*   **方法**:
    *   **基于配置**: `config` 层 (`src/config/index.ts`) 可以在 `.bun-glob-rc` 中定义一个 `plugins` 数组，指定插件模块的路径。
    *   **基于目录**: 应用程序可以扫描预定义的 `plugins/` 目录（例如 `~/.bun-glob-cli/plugins/` 或 `node_modules/bun-glob-cli-plugin-*`），查找导出 `GlobPlugin` 实例的模块。
    *   **动态导入**: 使用 Bun 的动态 `import()` 在运行时加载插件模块。

    ```typescript
    // src/core/plugins/loader.ts
    import { GlobPlugin } from './interfaces';
    import { getConfig } from '../../config'; // 假设有 config 模块

    export async function loadPlugins(): Promise<GlobPlugin[]> {
        const config = getConfig();
        const pluginPaths = config.plugins || []; // 从配置中获取插件路径

        const loadedPlugins: GlobPlugin[] = [];
        for (const pluginPath of pluginPaths) {
            try {
                // 解析插件模块的绝对路径
                const absolutePluginPath = require.resolve(pluginPath, { paths: [process.cwd()] }); // 或者一个专门的插件目录
                const pluginModule = await import(absolutePluginPath);
                if (pluginModule.default && typeof pluginModule.default === 'object' && 'name' in pluginModule.default) {
                    loadedPlugins.push(pluginModule.default as GlobPlugin);
                    if (pluginModule.default.init) {
                        await pluginModule.default.init(); // 调用 init 钩子
                    }
                } else {
                    console.warn(`[Plugin Loader] 无效的插件模块: ${pluginPath}`);
                }
            } catch (error) {
                console.error(`[Plugin Loader] 加载插件失败 ${pluginPath}:`, error);
            }
        }
        return loadedPlugins;
    }
    ```

**3. 插件集成点**

*   **核心逻辑 (`src/core/globber.ts`)**:
    *   `globber` 应该接受一个 `GlobPlugin` 实例数组。
    *   在执行 glob 之前，遍历插件以允许 `modifyPattern` 修改模式。
    *   在 `node-glob` 返回初始结果之后，遍历插件以允许 `apply` 过滤或转换 `files` 数组。

    ```typescript
    // src/core/globber.ts (简化)
    import { glob } from 'glob'; // node-glob
    import { GlobPlugin } from './plugins/interfaces';

    export async function findFiles(pattern: string, options: any, plugins: GlobPlugin[]): Promise<string[]> {
        let currentPattern = pattern;
        // 应用插件的模式修改
        for (const plugin of plugins) {
            if (plugin.modifyPattern) {
                currentPattern = plugin.modifyPattern(currentPattern, options);
            }
        }

        let files = await glob(currentPattern, options);

        // 应用插件的文件转换/过滤
        for (const plugin of plugins) {
            if (plugin.apply) {
                files = await Promise.resolve(plugin.apply(files, options)); // 处理异步/同步
            }
        }
        return files;
    }
    ```

*   **CLI 层 (`src/cli/commands.ts`)**:
    *   在定义命令时，动态添加插件提供的 CLI 选项 (`cliOptions`)。
    *   将解析后的 CLI 参数中插件特有的选项传递给 `Core` 层。

    ```typescript
    // src/cli/commands.ts (简化)
    import { Command } from 'commander';
    import { loadPlugins } from '../core/plugins/loader';
    import { findFiles } from '../core/globber';
    import { formatOutput } from '../output/formatter'; // 假设有 formatter

    export async function setupCommands(program: Command) {
        const plugins = await loadPlugins();

        const globCommand = program.command('glob <pattern>')
            .description('使用 glob 模式查找文件');

        // 添加插件特有的 CLI 选项
        plugins.forEach(plugin => {
            plugin.cliOptions?.forEach(opt => {
                globCommand.option(opt.flags, opt.description, opt.defaultValue);
            });
        });

        globCommand.action(async (pattern, options) => {
            // 传递所有解析后的选项，包括插件特有的选项
            const files = await findFiles(pattern, options, plugins);

            // 允许插件提供自定义输出格式
            let output = '';
            const customFormatterPlugin = plugins.find(p => p.formatOutput); // 查找第一个带有自定义格式化器的插件
            if (customFormatterPlugin && customFormatterPlugin.formatOutput) {
                output = customFormatterPlugin.formatOutput(files, options);
            } else {
                output = formatOutput(files, options); // 默认格式化器
            }
            console.log(output);
        });
    }
    ```

*   **输出层 (`src/output/formatter.ts`)**:
    *   `formatOutput` 函数可以检查是否有任何已加载的插件为当前上下文/选项提供了自定义的 `formatOutput` 方法。如果有，则委托给该插件。

**4. 插件开发指南**

*   插件应该是独立的 Bun/TypeScript 项目。
*   它们应该导出一个符合 `GlobPlugin` 接口的默认对象。
*   插件可以包含自己的依赖项。

**修订后的架构图 (概念性添加):**

```
bun-glob-cli/
├── src/
│   ├── cli/
│   │   ├── index.ts
│   │   └── commands.ts
│   ├── core/
│   │   ├── globber.ts
│   │   ├── types.ts
│   │   ├── interfaces.ts
│   │   └── plugins/              # 插件系统的新目录
│   │       ├── interfaces.ts     # 定义 GlobPlugin 接口
│   │       └── loader.ts         # 处理插件发现和加载
│   ├── output/
│   │   ├── formatter.ts
│   │   └── index.ts
│   ├── config/
│   │   ├── index.ts
│   │   └── defaults.ts
│   ├── utils/
│   │   ├── path.ts
│   │   ├── error.ts
│   │   └── logger.ts
│   └── index.ts
├── plugins/                      # 可选: 示例/捆绑插件目录
│   ├── bun-glob-plugin-json-pretty/
│   │   └── index.ts              # 实现 GlobPlugin 以提供漂亮的 JSON 输出
│   └── bun-glob-plugin-checksum/
│       └── index.ts              # 实现 GlobPlugin 以添加文件校验和
├── package.json
├── tsconfig.json
└── ...
```

**扩展性和插件建议总结：**

1.  **规范插件接口**: 定义一个清晰的 TypeScript 接口 (`GlobPlugin`)，所有插件都必须实现。
2.  **集中式插件加载**: 创建一个专门的模块 (`src/core/plugins/loader.ts`) 来发现和加载插件，可以基于配置或特定目录。
3.  **战略性集成点**: 确定插件可以注入逻辑的位置（例如，glob 之前的 `modifyPattern`，glob 之后的 `apply`，用于展示的 `formatOutput`，用于命令行集成的 `cliOptions`）。
4.  **插件配置**: 允许用户通过主应用程序的配置文件 (`.bun-glob-rc`) 启用/禁用特定插件或传递插件特有的配置。
5.  **文档**: 为插件开发者提供清晰的指南，说明如何创建和集成他们的插件。