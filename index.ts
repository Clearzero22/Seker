#!/usr/bin/env bun

import { globSync } from 'glob';
import { program } from 'commander';
import path from 'path';

// 定义程序的版本和描述
program
  .name('bun-glob')
  .description('A high-performance file searching CLI powered by Bun and node-glob. Supports Windows, Linux, and macOS.')
  .version('1.0.0');

// 定义主命令
program
  .argument('<pattern>', 'The glob pattern to match files against (e.g., "src/**/*.ts").')
  .option('-i, --ignore <patterns...>', 'Glob patterns to ignore. Can be specified multiple times.')
  .option('-d, --cwd <directory>', 'The directory to start searching from.', process.cwd())
  .option('--dot', 'Include files and directories starting with a dot (e.g., .gitignore).', false)
  .option('--absolute', 'Return absolute paths.', false)
  .action((pattern, options) => {
    try {
      console.log(`Searching in: ${path.resolve(options.cwd)}`);
      console.log(`Using pattern: "${pattern}"`);
      if (options.ignore) {
        console.log(`Ignoring patterns: ${options.ignore.join(', ')}`);
      }
      
      // 调用 glob 的同步 API
      const files = globSync(pattern, {
        cwd: options.cwd,
        ignore: options.ignore,
        dot: options.dot,
        absolute: options.absolute,
      });

      // 输出结果
      if (files.length > 0) {
        console.log(`
Found ${files.length} matching files:`);
        files.forEach(file => {
          // 在 Windows 上，glob 可能会返回反斜杠路径，我们将其标准化为正斜杠以便于阅读
          console.log(file.replace(/\\/g, '/'));
        });
      } else {
        console.log(`
No files found matching the pattern.`);
      }

    } catch (error) {
      console.error(`
An error occurred:`);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
      process.exit(1);
    }
  });

// 解析命令行参数并执行
program.parse(process.argv);