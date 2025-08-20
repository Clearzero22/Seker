### **`bun-glob-cli` 软件架构设计**

该架构将采用模块化设计，将关注点分离到不同的层中，以增强可维护性、可测试性和可扩展性。

```
bun-glob-cli/
├── src/
│   ├── cli/
│   │   ├── index.ts          # CLI主入口点 (Commander.js 配置)
│   │   └── commands.ts       # 定义 CLI 命令和选项
│   ├── core/
│   │   ├── globber.ts        # 封装 node-glob 逻辑和文件过滤
│   │   ├── types.ts          # 核心数据结构类型定义
│   │   └── interfaces.ts     # 核心功能接口
│   ├── output/
│   │   ├── formatter.ts      # 处理输出格式化 (纯文本, JSON, 彩色)
│   │   └── index.ts          # 导出输出格式化器
│   ├── config/
│   │   ├── index.ts          # 管理配置加载 (.bun-glob-rc)
│   │   └── defaults.ts       # 默认配置值
│   ├── utils/
│   │   ├── path.ts           # 路径处理工具
│   │   ├── error.ts          # 自定义错误处理
│   │   └── logger.ts         # 日志工具
│   └── index.ts              # 主应用入口点 (协调各层)
├── index.ts                  # (遗留/临时) 当前主文件，将重构到 src/ 中
├── package.json
├── tsconfig.json
├── bun.lock
├── README.md
├── DEVELOPMENT.md
├── ROADMAP.md
├── .gitignore
├── index.test.ts             # 当前 index.ts 的测试
└── tests/                    # 新的结构化测试目录
    ├── cli.test.ts
    ├── core.test.ts
    └── output.test.ts
```

**架构分层与职责：**

1.  **CLI 层 (`src/cli/`)**:
    *   **目的**: 定义命令行接口，解析参数，验证用户输入。
    *   **组件**:
        *   `index.ts`: 初始化 Commander.js，设置全局选项，并注册命令。
        *   `commands.ts`: 包含特定命令（例如 `glob`, `find`）及其选项的定义。每个命令将把实际逻辑委托给 `Core` 层。
    *   **依赖**: Commander.js, Core 层。

2.  **核心逻辑层 (`src/core/`)**:
    *   **目的**: 包含应用程序的基本业务逻辑，独立于 CLI。该层执行实际的文件 glob 匹配、过滤和处理。
    *   **组件**:
        *   `globber.ts`: 封装 `node-glob` 库。它将处理模式匹配，应用忽略规则（来自 `.gitignore`, `.bun-glob-rc`），并返回文件路径。
        *   `types.ts`: 定义核心逻辑中使用的 TypeScript 数据结构类型（例如 `GlobOptions`, `GlobResult`）。
        *   `interfaces.ts`: 定义核心层内服务或模块的接口，促进松散耦合。
    *   **依赖**: `node-glob`, Utils 层。

3.  **输出层 (`src/output/`)**:
    *   **目的**: 负责以各种格式向用户格式化和呈现结果。
    *   **组件**:
        *   `formatter.ts`: 包含格式化 glob 结果的函数（例如，纯列表、JSON、彩色输出）。它将从 Core 层获取原始数据并将其转换为显示格式。
        *   `index.ts`: 导出可用的格式化器。
    *   **依赖**: Utils 层（如果适用，用于着色）。

4.  **配置层 (`src/config/`)**:
    *   **目的**: 管理应用程序配置，包括从文件（例如 `.bun-glob-rc`）加载设置和提供默认值。
    *   **组件**:
        *   `index.ts`: 处理查找和解析配置文件。
        *   `defaults.ts`: 定义应用程序的默认配置设置。
    *   **依赖**: Utils 层（用于文件系统访问）。

5.  **工具层 (`src/utils/`)**:
    *   **目的**: 提供可在不同层之间使用的通用辅助函数。
    *   **组件**:
        *   `path.ts`: 用于规范化路径、解析绝对路径等函数。
        *   `error.ts`: 用于一致错误处理的自定义错误类。
        *   `logger.ts`: 用于调试和信息性消息的简单日志工具。
    *   **依赖**: 无（纯函数）。

**数据流：**

1.  用户执行 CLI 命令 (`bun-glob-cli <pattern> [options]`)。
2.  **CLI 层** (`src/cli/index.ts`, `src/cli/commands.ts`) 解析参数和选项。
3.  **CLI 层** 调用 **核心逻辑层** (`src/core/globber.ts`) 中的函数，并传递解析后的选项和模式。
4.  **核心逻辑层** 使用 `node-glob` 查找文件，应用忽略规则（可能由 **配置层** 加载）。
5.  **核心逻辑层** 将原始结果（文件路径列表）返回给 **CLI 层**。
6.  **CLI 层** 将原始结果传递给 **输出层** (`src/output/formatter.ts`)，根据用户选择的输出选项（例如 `--json`, `--color`）进行格式化。
7.  **输出层** 将格式化后的结果打印到 `stdout`。

**此架构的优点：**

*   **职责分离**: 每层都有清晰的单一职责，使代码库更易于理解和管理。
*   **可测试性**: 每层都可以独立测试。例如，可以在不模拟 CLI 参数的情况下测试 `Core` 层。
*   **可维护性**: 一层中的更改（例如，更新 CLI 层中的 Commander.js）不太可能影响其他层。
*   **可扩展性**: 可以通过扩展现有层或添加新模块来添加新功能（例如，新的输出格式，新的 glob 策略），而不会破坏核心结构。
*   **灵活性**: 核心逻辑可以在其他上下文（例如，GUI 应用程序）中重用，而无需 CLI 开销。
*   **符合原则**: 支持 `GEMINI.md` 中概述的“代码质量与一致性”和“测试驱动理念”原则。

**下一步实施建议：**

1.  创建 `src/` 目录及其子目录 (`cli`, `core`, `output`, `config`, `utils`)。
2.  将现有 `index.ts` 逻辑迁移到 `src/` 中相应的新文件。
3.  如有必要，更新 `package.json` 以反映新的入口点。
4.  逐层开始实现组件，从 `Core` 和 `CLI` 层开始。