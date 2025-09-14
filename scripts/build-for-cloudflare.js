#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️ 开始为 Cloudflare Pages 构建应用...');

try {
  // 1. 运行 Next.js 构建
  console.log('📦 运行 Next.js 构建...');
  execSync('npx next build', { stdio: 'inherit' });

  // 2. 检查构建输出
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    throw new Error('Next.js 构建失败：.next 目录不存在');
  }

  // 3. 运行 @cloudflare/next-on-pages 转换
  console.log('🔄 转换为 Cloudflare Pages 格式...');
  execSync('npx @cloudflare/next-on-pages@latest', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_DEPENDENCY_INSTALL: 'true'
    }
  });

  // 4. 验证输出
  const outputDir = path.join(process.cwd(), '.vercel/output/static');
  if (!fs.existsSync(outputDir)) {
    throw new Error('Cloudflare Pages 构建失败：输出目录不存在');
  }

  // 5. 复制 Cloudflare Pages Functions
  console.log('📁 复制 Cloudflare Pages Functions...');
  const functionsDir = path.join(process.cwd(), 'functions');
  const outputFunctionsDir = path.join(process.cwd(), '.vercel/output/functions');

  if (fs.existsSync(functionsDir)) {
    // 确保输出目录存在
    if (!fs.existsSync(outputFunctionsDir)) {
      fs.mkdirSync(outputFunctionsDir, { recursive: true });
    }

    // 复制 functions 目录内容
    execSync(`cp -r ${functionsDir}/* ${outputFunctionsDir}/`, { stdio: 'inherit' });
    console.log('✅ Functions 复制完成');

    // 列出复制的文件
    console.log('📋 Functions 文件列表：');
    execSync(`find ${outputFunctionsDir} -type f`, { stdio: 'inherit' });
  } else {
    console.log('⚠️ 未找到 functions 目录，跳过 Functions 复制');
  }

  console.log('✅ 构建完成！输出目录：.vercel/output/static');

} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
}
