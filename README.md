# 🤖 舆论危机AI助手

基于罗永浩与西贝"预制菜"争议事件的智能舆论危机处理助手，提供专业的公关策略和危机处理建议。

## ✨ 主要功能

### 🎯 舆论危机处理
- **危机公关策略**: 专业的危机公关处理方案
- **餐饮行业管理**: 针对餐饮行业的舆论管理建议
- **品牌形象维护**: 保护企业声誉的实用建议
- **媒体关系处理**: 与媒体沟通的专业指导
- **消费者沟通技巧**: 有效的客户沟通策略

### 🤖 AI助手特性
- **实时对话**: 24/7 在线AI助手，随时解答疑问
- **专业建议**: 基于真实案例的专业指导
- **定制化方案**: 根据具体情况提供个性化建议
- **案例学习**: 基于罗永浩与西贝争议事件的经验总结

## 🛠️ 技术栈

### 前端技术
- **⚡ Next.js 15** - 最新React框架，支持App Router
- **📘 TypeScript 5** - 类型安全的JavaScript
- **🎨 Tailwind CSS 4** - 现代CSS框架
- **🧩 shadcn/ui** - 高质量无头组件库

### AI集成
- **🤖 Kimi AI** - 强大的中文语言模型
- **🔗 OpenAI SDK** - 标准化AI API接口
- **🌐 实时对话** - 流畅的聊天体验

### 部署平台
- **☁️ Cloudflare Pages** - 全球CDN加速
- **🚀 GitHub Actions** - 自动化CI/CD流程
- **🔐 环境变量** - 安全的配置管理

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/skingko/lyh_Crisis_Relations.git
cd lyh_Crisis_Relations

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的API密钥

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 环境变量配置

创建 `.env.local` 文件：

```env
# Kimi API Configuration
OPENAI_API_KEY=your_kimi_api_key_here
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=kimi-k2-0905-preview
NODE_ENV=development
```

## 📦 部署指南

### 自动部署到 Cloudflare Pages

项目已配置 GitHub Actions，支持自动部署到 Cloudflare Pages：

1. **Fork 项目** 到你的 GitHub
2. **配置 GitHub Secrets**:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `OPENAI_API_KEY`
   - `OPENAI_BASE_URL`
   - `OPENAI_MODEL`
3. **推送代码** 到 main 分支，自动触发部署

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── chat/          # 聊天API
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── ai-chat.tsx        # AI聊天组件
│   ├── crisis-dashboard.tsx # 危机仪表板
│   └── ui/               # UI组件库
└── lib/                  # 工具函数
    └── utils.ts          # 通用工具
```

## 🎨 核心组件

### AI聊天助手
- **智能对话**: 基于专业知识的AI助手
- **上下文理解**: 记住对话历史，提供连贯建议
- **多轮对话**: 支持深入的策略讨论

### 危机处理建议
- **实时分析**: 根据当前情况提供即时建议
- **策略制定**: 长期危机管理策略
- **预防措施**: 避免类似危机再次发生

## 📞 联系我们

### 项目信息
- **项目名称**: 舆论危机AI助手
- **版本**: 1.0.0
- **技术支持**: [skingko](https://github.com/skingko)

### 联系方式
- **GitHub**: [@skingko](https://github.com/skingko)
- **微信**: skingko
- **项目链接**: [lyh_Crisis_Relations](https://github.com/skingko/lyh_Crisis_Relations)

## 📱 关注我们

<div align="center">

### 微信公众号
<img src="https://test-models.oss-cn-shanghai.aliyuncs.com/pics_go/202509110044079.jpg" width="200" alt="微信公众号二维码">

*扫描关注我们的微信公众号获取最新更新*

### 添加作者微信
<img src="https://test-models.oss-cn-shanghai.aliyuncs.com/pics_go/202509102242338.png" width="200" alt="作者微信二维码">

*扫描添加作者微信：skingko*

</div>

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **[Next.js](https://nextjs.org/)** - React 框架
- **[Kimi AI](https://kimi.moonshot.cn/)** - AI 语言模型
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - UI 组件库

---

<div align="center">

**构建于 ❤️ 之上，为开发者社区服务**

**Powered by AI & Modern Web Technology** 🚀

</div>