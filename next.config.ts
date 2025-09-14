import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 部署配置
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  distDir: '.next',
  images: {
    unoptimized: true
  },

  // 开发配置
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 禁用 LightningCSS 以避免原生模块问题
  experimental: {
    optimizeCss: false,
  },

  // 环境变量配置
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL
  }
};

export default nextConfig;
