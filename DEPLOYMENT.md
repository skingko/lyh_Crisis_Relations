# 部署指南 - Cloudflare Pages

## 🚀 自动部署到 Cloudflare Pages

本项目已配置支持通过 GitHub Actions 自动部署到 Cloudflare Pages。

### 前置条件

1. **GitHub 仓库**
   - 确保代码已推送到 GitHub 仓库

2. **Cloudflare 账户**
   - 注册 Cloudflare 账户
   - 获取 Account ID 和 API Token

### 配置步骤

#### 1. 获取 Cloudflare 凭据

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 获取 Account ID：
   - 在右侧导航栏找到 "Workers & Pages"
   - Account ID 显示在页面左侧

3. 创建 API Token：
   - 前往 "My Profile" → "API Tokens"
   - 点击 "Create Token"
   - 选择 "Edit Cloudflare Workers" 模板
   - 设置权限：
     - Account → Workers & Pages → Edit
     - Account → D1 → Edit
     - Zone → DNS → Read
   - 创建并保存 Token（**仅显示一次，请妥善保存**）

   **重要**: 确保包含 **D1 → Edit** 权限，否则无法创建和管理数据库

#### 2. 配置 GitHub 仓库密钥

在 GitHub 仓库中配置以下 Secrets：

1. 进入仓库的 "Settings" → "Secrets and variables" → "Actions"
2. 添加以下 Secrets：

| 密钥名称 | 值 | 说明 |
|---------|-----|-----|
| `CLOUDFLARE_API_TOKEN` | 你的 Cloudflare API Token | 用于部署到 Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Cloudflare Account ID | 标识你的 Cloudflare 账户 |
| `OPENAI_API_KEY` | `***REMOVED***` | Kimi API 密钥 |
| `OPENAI_BASE_URL` | `https://api.moonshot.cn/v1` | Kimi API 基础 URL |
| `OPENAI_MODEL` | `kimi-k2-0905-preview` | 使用的 AI 模型 |
| `D1_DATABASE_ID` | 你的 D1 数据库 ID | 创建 D1 数据库后获得 |
| `D1_DATABASE_NAME` | `lyh-crisis-relations-db` | D1 数据库名称 |
| `DATABASE_URL` | `file:./dev.db` | 数据库连接 URL |

#### 3. 创建 Cloudflare Pages 项目

1. 在 Cloudflare Dashboard 中：
   - 进入 "Workers & Pages" → "Create application"
   - 选择 "Pages" → "Connect to Git"
   - 选择你的 GitHub 仓库
   - 配置构建设置：
     - Build command: `npm run build:static`
     - Build output directory: `.next`
   - 环境变量：
     - `NODE_ENV`: `production`
     - `OPENAI_API_KEY`: 同上
     - `OPENAI_BASE_URL`: 同上
     - `OPENAI_MODEL`: 同上
     - `DATABASE_URL`: `file:./dev.db`
     - `D1_DATABASE_ID`: 同上
     - `D1_DATABASE_NAME`: `lyh-crisis-relations-db`

#### 4. D1 数据库配置

**自动创建（推荐）**

GitHub Actions 会自动创建和初始化 D1 数据库，无需手动操作。

**手动创建（可选）**

如果需要手动创建数据库：

```bash
# 安装 Wrangler
npm install -g wrangler

# 创建 D1 数据库
wrangler d1 create lyh-crisis-relations-db

# 初始化数据库结构
wrangler d1 execute lyh-crisis-relations-db --file=./scripts/init-db.sql
```

**数据库绑定配置**

在 Cloudflare Pages 项目设置中添加 D1 绑定：

1. 进入 Pages 项目设置
2. 找到 "Functions" 选项卡
3. 添加 D1 数据库绑定：
   - Variable name: `DB`
   - D1 database: `lyh-crisis-relations-db`

#### 5. 部署配置

**方式一：自动部署（推荐）**

- 推送代码到 `main` 或 `master` 分支
- GitHub Actions 会自动触发部署
- 部署完成后会收到邮件通知

**方式二：手动部署**

```bash
# 本地构建测试
npm run build:static

# 检查构建输出
ls -la .next
```

## 📋 环境变量配置

### 开发环境

创建 `.env.local` 文件：

```env
# Kimi API Configuration
OPENAI_API_KEY=***REMOVED***
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=kimi-k2-0905-preview
NODE_ENV=development
```

### 生产环境

通过 Cloudflare Pages 或 GitHub Actions Secrets 配置。

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本是否为 20+
   - 确认所有依赖已正确安装
   - 检查环境变量是否正确设置

2. **API 连接问题**
   - 验证 Kimi API 密钥是否有效
   - 检查 API 基础 URL 和模型名称
   - 确认 Cloudflare Pages 环境变量配置

3. **部署失败**
   - 检查 GitHub Actions 权限
   - 验证 Cloudflare API Token 是否有效
   - 确认仓库分支名称正确

### 调试步骤

1. **本地测试**
   ```bash
   npm run build:static
   npm run start:static
   ```

2. **检查日志**
   - GitHub Actions → Actions 标签页
   - Cloudflare Dashboard → Pages 项目

3. **API 测试**
   ```bash
   curl -X POST http://localhost:3000/api/chat \
   -H "Content-Type: application/json" \
   -d '{"messages":[{"role":"user","content":"Hello"}]}'
   ```

## 🌐 项目特性

### 已实现功能
- ✅ Next.js 15 + TypeScript + Tailwind CSS
- ✅ 舆论危机 AI 助手
- ✅ Kimi AI 集成
- ✅ 响应式设计
- ✅ 自动部署到 Cloudflare Pages
- ✅ 环境变量配置
- ✅ 安全性配置

### 技术栈
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI SDK + Kimi API
- **部署**: Cloudflare Pages + GitHub Actions
- **数据库**: Prisma (可选)

## 📞 支持

如遇问题，请检查：
1. 本地开发环境是否正常
2. GitHub Actions 执行日志
3. Cloudflare Pages 部署日志
4. 网络连接和 API 状态

---

**部署状态**: 🟢 已配置
**最后更新**: 2025-09-14