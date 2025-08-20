# 如何将项目上传到 GitHub (完整流程指南)

本文档将引导您完成将本地项目上传到 GitHub 的每一个步骤。

## 预备知识

在开始之前，请确保您已经准备好以下两项：

1.  **一个 GitHub 账户**: 如果没有，请访问 [github.com](https://github.com) 注册一个。
2.  **Git 已安装**: 在您的计算机上需要安装 Git。您可以在终端或命令提示符中运行 `git --version` 来检查。如果未安装，请从 [git-scm.com](https://git-scm.com/downloads) 下载并安装。

---

## 步骤一：在 GitHub 上创建一个新的远程仓库

1.  登录到您的 GitHub 账户。
2.  点击页面右上角的 **+** 图标，然后选择 **"New repository"** (新建仓库)。
3.  **填写仓库信息**:
    *   **Repository name** (仓库名称): 为您的项目取一个名字，例如 `bun-glob-cli`。
    *   **Description** (描述): (可选) 写一句关于项目的简短描述。
    *   **Public / Private**: 选择 **"Public"** (公开)，这样任何人都可以看到您的项目。
4.  **重要提示**: **不要** 勾选以下任何选项：
    *   `Add a README file`
    *   `Add .gitignore`
    *   `Choose a license`
    因为我们的本地项目已经包含了这些文件，勾选会导致后续步骤冲突。
5.  点击 **"Create repository"** (创建仓库) 按钮。

创建成功后，您会被带到一个新页面，上面显示了一些命令行指令。**请保持这个页面打开**，我们很快会用到里面的仓库 URL。

---

## 步骤二：在您的本地项目中初始化 Git

现在，回到您本地计算机上的项目目录 (`bun_project`)，然后打开终端或命令提示符。

1.  **初始化 Git 仓库**:
    运行以下命令来初始化一个本地 Git 仓库。`-b main` 会将默认分支名设置为 `main`，这是当前推荐的做法。
    ```bash
    git init -b main
    ```

---

## 步骤三：添加并提交您的项目文件

1.  **将所有文件添加到暂存区**:
    这个命令会将当前目录下的所有文件（除了被 `.gitignore` 忽略的）添加到 Git 的暂存区，准备进行提交。
    ```bash
    git add .
    ```

2.  **提交文件**:
    这个命令会将暂存区的文件正式提交到本地仓库，并附上一条提交信息。
    ```bash
    git commit -m "Initial commit: Add bun-glob CLI project"
    ```

---

## 步骤四：将本地仓库连接到 GitHub 远程仓库

1.  **复制远程仓库 URL**:
    回到您在步骤一中创建的 GitHub 仓库页面，找到 "…or push an existing repository from the command line" 部分，复制那里的 URL。它看起来应该像这样：`https://github.com/YourUsername/YourRepositoryName.git`。

2.  **添加远程仓库地址**:
    在您的本地终端中，运行以下命令。请将 `<Your-Repository-URL>` 替换为您刚刚复制的 URL。
    ```bash
    git remote add origin <Your-Repository-URL>
    ```
    这个命令告诉 Git，我们有一个名为 `origin` 的远程仓库地址。

---

## 步骤五：将您的代码推送到 GitHub

这是最后一步，将您本地提交的代码上传到 GitHub。

1.  **推送代码**:
    运行以下命令。`-u` 参数会将本地的 `main` 分支与远程的 `origin/main` 分支关联起来，这样未来推送时您只需要输入 `git push` 即可。
    ```bash
    git push -u origin main
    ```

    Git 可能会提示您输入 GitHub 的用户名和密码（或个人访问令牌）。

---

## 完成！

恭喜！刷新您的 GitHub 仓库页面，您应该能看到所有的项目文件都已成功上传。

### 未来的工作流程

在您对项目做出新的修改后，只需要重复以下三个命令即可将改动同步到 GitHub：

```bash
# 1. 添加修改过的文件到暂存区
git add .

# 2. 提交您的改动
git commit -m "在这里写下您的修改描述"

# 3. 推送到 GitHub
git push
```
