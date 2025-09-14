# 罗永浩危机管理 API 代理 Worker

这是一个 Cloudflare Worker，为罗永浩-西贝危机管理应用提供安全的 AI API 转发服务。

## 🎯 功能特性

- **安全的 API 转发**：代理 Kimi AI API 调用，避免在前端暴露 API 密钥
- **域名访问控制**：仅允许指定域名（*.sking.cool, *.taskin.chat）访问
- **CORS 支持**：正确处理跨域请求
- **错误处理**：提供详细的错误信息和状态码
- **健康检查**：提供 `/api/health` 端点用于监控

## 🚀 部署步骤

### 1. 环境准备

确保您有以下信息：
- Cloudflare 账号和 API Token
- GitHub Secrets 中的环境变量

### 2. 设置 GitHub Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
OPENAI_API_KEY=your_kimi_api_key
```

### 3. 部署 Worker

#### 自动部署（推荐）
推送代码到 `main` 分支，GitHub Actions 会自动部署：

```bash
git add .
git commit -m "Deploy API proxy worker"
git push origin main
```

#### 手动部署
```bash
cd worker
npm install
npx wrangler secret put OPENAI_API_KEY
npx wrangler deploy --env production
```

### 4. 配置自定义域名

在 Cloudflare Dashboard 中：
1. 进入 Workers & Pages
2. 选择 `lyh-crisis-api-proxy` Worker
3. 点击 "Custom domains"
4. 添加域名：`lyh-crisis-api-proxy.sking.cool`

## 📡 API 端点

### POST /api/chat
处理 AI 聊天请求

**请求格式：**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "如何应对预制菜争议？"
    }
  ]
}
```

**响应格式：**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "针对预制菜争议，建议采取以下策略..."
      }
    }
  ]
}
```

### GET /api/health
健康检查端点

**响应格式：**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-14T12:00:00.000Z",
  "service": "lyh-crisis-api-proxy",
  "version": "1.0.0",
  "endpoints": {
    "chat": "/api/chat",
    "health": "/api/health"
  },
  "config": {
    "model": "kimi-k2-0905-preview",
    "baseUrl": "https://api.moonshot.cn/v1",
    "allowedDomainPatterns": 2
  }
}
```

## 🔒 安全特性

### 域名访问控制
Worker 仅允许以下域名模式访问：
- `*.sking.cool`（生产环境）
- `*.taskin.chat`（生产环境）
- `*.pages.dev`（预览环境）

### API 密钥保护
- API 密钥存储在 Cloudflare Workers 的 Secrets 中
- 前端无法直接访问 API 密钥
- 所有 API 调用都通过 Worker 代理

### CORS 配置
- 严格的 Origin 验证
- 支持预检请求（OPTIONS）
- 正确的 CORS 头设置

## 🛠️ 开发和调试

### 本地开发
```bash
cd worker
npm install
npm run dev
```

### 查看日志
```bash
npm run tail
```

### 测试 API
```bash
# 健康检查
curl https://lyh-crisis-api-proxy.sking.cool/api/health

# 聊天测试（需要正确的 Origin 头）
curl -X POST https://lyh-crisis-api-proxy.sking.cool/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://xb.sking.cool" \
  -d '{"messages":[{"role":"user","content":"测试消息"}]}'
```

## 📊 监控和维护

### 性能监控
- 在 Cloudflare Dashboard 中查看 Worker 的性能指标
- 监控请求量、错误率、响应时间

### 日志查看
```bash
npx wrangler tail --env production
```

### 更新部署
修改代码后推送到 main 分支即可自动部署。

## 🔧 配置说明

### wrangler.toml
- `ALLOWED_DOMAIN_PATTERNS`：允许访问的域名模式
- `OPENAI_BASE_URL`：Kimi AI API 基础 URL
- `OPENAI_MODEL`：使用的 AI 模型

### 环境变量
- `OPENAI_API_KEY`：Kimi AI API 密钥（通过 Secrets 设置）

## 🚨 故障排除

### 常见问题

1. **403 Forbidden**
   - 检查请求的 Origin 头是否在允许列表中
   - 确认域名模式配置正确

2. **500 Internal Server Error**
   - 检查 OPENAI_API_KEY 是否正确设置
   - 查看 Worker 日志获取详细错误信息

3. **CORS 错误**
   - 确认前端请求包含正确的 Origin 头
   - 检查 CORS 配置是否正确

### 调试步骤
1. 检查 Worker 部署状态
2. 查看 Cloudflare Dashboard 中的错误日志
3. 使用 `wrangler tail` 实时查看日志
4. 测试 `/api/health` 端点确认服务状态

## 📝 更新日志

### v1.0.0 (2025-09-14)
- 初始版本发布
- 支持 AI 聊天 API 代理
- 实现域名访问控制
- 添加健康检查端点
- 完整的错误处理和 CORS 支持
