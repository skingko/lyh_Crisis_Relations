#!/usr/bin/env node

// D1 数据库迁移脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_NAME = 'lyh-crisis-relations-db';

console.log('🔄 开始 D1 数据库迁移...');

try {
  // 检查 Wrangler 是否已安装
  try {
    execSync('wrangler --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 安装 Wrangler...');
    execSync('npm install -g wrangler', { stdio: 'inherit' });
  }

  // 生成 Prisma 客户端
  console.log('🔧 生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 推送数据库结构到 D1
  console.log('📤 推送数据库结构到 D1...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Prisma db push 失败，使用 SQL 脚本初始化...');
    execSync(`wrangler d1 execute ${DB_NAME} --file=./scripts/init-db.sql`, { stdio: 'inherit' });
  }

  // 检查数据库内容
  console.log('📋 检查数据库内容...');
  try {
    const result = execSync(`wrangler d1 execute ${DB_NAME} --command="SELECT name FROM sqlite_master WHERE type='table';"`, {
      encoding: 'utf8'
    });
    console.log('数据库表:', result);
  } catch (error) {
    console.log('无法获取数据库表信息');
  }

  // 检查示例数据
  console.log('📊 检查示例数据...');
  try {
    const userResult = execSync(`wrangler d1 execute ${DB_NAME} --command="SELECT COUNT(*) as user_count FROM User;"`, {
      encoding: 'utf8'
    });
    const postResult = execSync(`wrangler d1 execute ${DB_NAME} --command="SELECT COUNT(*) as post_count FROM Post;"`, {
      encoding: 'utf8'
    });
    console.log('用户数量:', userResult);
    console.log('文章数量:', postResult);
  } catch (error) {
    console.log('无法获取数据统计');
  }

  console.log('✅ D1 数据库迁移完成！');

  // 显示后续步骤
  console.log('\n📝 后续步骤:');
  console.log('1. 在 Cloudflare Pages 中设置 D1 数据库绑定');
  console.log('2. 在 Cloudflare Pages 中设置环境变量');
  console.log('3. 部署应用到 Cloudflare Pages');

} catch (error) {
  console.error('❌ 迁移失败:', error.message);
  process.exit(1);
}