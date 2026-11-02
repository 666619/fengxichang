---
name: github-push
description: 当用户要求将项目提交并推送到 GitHub 时触发。处理 Windows 环境下 22 端口被代理拦截、SSH 公钥认证、PowerShell 语法与 git 前置条件检查，确保 push 成功并返回远端 commit hash。
---

# GitHub Push 技能

## 前置检查（必须在 commit 之前）

1. **Git 身份**：`git config user.name / user.email` 本仓库级别优先，避免污染 global
2. **网络**：Windows 上公司网络常见 22 端口被代理拦截，`ssh -T git@github.com` 失败时：
   - 用 `GIT_SSH_COMMAND = "ssh -p 443 -o StrictHostKeyChecking=accept-new"` 临时覆盖走 GitHub 官方支持的 `ssh.github.com:443`
   - **不要**修改全局 SSH config（`~/.ssh/config`），仅本次会话生效
3. **SSH 公钥**：`Test-Path "$env:USERPROFILE\.ssh\id_ed25519.pub"` 或 `id_rsa.pub`，确认已存在
4. **远端状态**：`git ls-remote` 确认是否空仓。空仓直接 push；非空仓用 `--allow-unrelated-histories` 合并，**禁止**使用强推 `-f` 除非用户显式授权

## 提交规范（PowerShell 环境）

- **禁止** bash heredoc（`cat <<'EOF'`）拼接提交信息，PowerShell 无法解析
- 使用单行 `-m "feat: xxx"` 或多次 `-m "line1" -m "line2"`
- 首次提交前先建立 `.gitignore`，排除 IDE 目录（`.vscode/`, `.idea/`, `.trae/`）与缓存

## 多远端约定（本项目）

- `origin` 指向 Gitee：`https://gitee.com/feng-xicheng/fxc403.git`
- GitHub 仓库 `666619/fengxichang403`、`666619/fengxichang` 按本次任务单独指定，推送用临时 URL 或独立 remote，不覆盖 `origin`
- 推送命令示例：`git push git@ssh.github.com:666619/fengxichang.git master`

## 推送规范（PowerShell 环境）

```powershell
$env:GIT_SSH_COMMAND = "ssh -p 443 -o StrictHostKeyChecking=accept-new"
git push git@ssh.github.com:<owner>/<repo>.git master
Remove-Item Env:GIT_SSH_COMMAND
```

## 交付收口

- 返回远端 commit hash（`git push` 输出中的 `xxxx..yyyy master -> master`）
- 输出仓库 URL 供用户点击验证
- 若任务包含"创建 skill"，本轮同目录下输出对应 SKILL.md
