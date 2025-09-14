import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 部署配置 - 不使用静态导出以支持 API 路由
  trailingSlash: true,
  distDir: '.next',
  // 静态资源路径配置 - 使用相对路径以适配 Cloudflare Pages
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true
  },

  // 开发配置
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 禁用 LightningCSS 以避免原生模块问题
  experimental: {
    optimizeCss: false,
  },

  // 压缩配置
  compress: true,
  poweredByHeader: false,

  // 环境变量配置
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL
  }
};

export default nextConfig;
