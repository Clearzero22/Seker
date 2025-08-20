# bun-glob CLI

这是一个使用 Bun 和 `node-glob` 构建的高性能、跨平台文件查找 CLI 工具。

## 功能

- 使用 glob 模式快速查找文件。
- 支持多重忽略规则。
- 可在任意指定目录中执行搜索。
- 跨平台兼容 Windows, macOS 和 Linux。

## 安装

当前，您可以通过源码直接运行。

```bash
# 克隆项目后，安装依赖
bun install
```

## 基本用法

```bash
bun run index.ts <pattern> [options]
```

## 参数

-   `<pattern>`: (必需) 用于匹配文件的 glob 模式。**注意：建议将模式用引号括起来**，以防止 shell 自动展开它。

## 选项

-   `-i, --ignore <patterns...>`: 需要忽略的 glob 模式。可以多次指定。
-   `-d, --cwd <directory>`: 在哪个目录执行搜索。默认为当前目录。
-   `--dot`: 包含以 `.` 开头的文件/文件夹（例如 `.gitignore`）。默认为不包含。
-   `--absolute`: 返回绝对路径。默认为相对路径。
-   `-h, --help`: 显示帮助信息。

## 使用示例

1.  **查找当前目录下所有的 TypeScript 文件**:
    ```bash
    bun run index.ts "*.ts"
    ```

2.  **查找 `src` 目录下的所有 `.js` 和 `.ts` 文件**:
    ```bash
    bun run index.ts "src/**/*.{js,ts}"
    ```

3.  **查找所有文件，但忽略 `node_modules` 和 `dist` 目录中的文件**:
    ```bash
    bun run index.ts "**/*" --ignore "node_modules/**" "dist/**"
    ```

4.  **在 `/path/to/your/project` 目录中查找所有 `package.json` 文件**:
    ```bash
    bun run index.ts "**/package.json" -d "/path/to/your/project"
    ```

5.  **查找所有隐藏的 "dotfiles"**:
    ```bash
    bun run index.ts ".*" --dot
    ```