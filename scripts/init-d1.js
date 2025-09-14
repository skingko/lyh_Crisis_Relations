#!/usr/bin/env node

// D1 数据库初始化脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 数据库配置
const DB_NAME = 'lyh-crisis-relations-db';

console.log('🚀 开始初始化 Cloudflare D1 数据库...');

try {
  // 检查 Wrangler 是否已安装
  console.log('📦 检查 Wrangler 安装...');
  try {
    execSync('wrangler --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('❌ Wrangler 未安装，正在安装...');
    execSync('npm install -g wrangler', { stdio: 'inherit' });
  }

  // 创建 D1 数据库
  console.log(`🗄️  创建 D1 数据库: ${DB_NAME}`);
  try {
    const createOutput = execSync(`wrangler d1 create ${DB_NAME}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    // 提取数据库 ID
    const dbIdMatch = createOutput.match(/database_id = "(.*?)"/);
    if (dbIdMatch) {
      const dbId = dbIdMatch[1];
      console.log(`✅ 数据库创建成功，ID: ${dbId}`);

      // 生成 wrangler.toml 配置
      const wranglerConfig = `
# D1 数据库配置
[[d1_databases]]
binding = "DB"
database_name = "${DB_NAME}"
database_id = "${dbId}"

# 数据库预览配置
[[d1_databases]]
binding = "DB_PREVIEW"
database_name = "${DB_NAME}"
database_id = "${dbId}"
preview_database_id = "${dbId}"
`;

      // 更新 wrangler.toml
      const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
      let existingConfig = '';
      if (fs.existsSync(wranglerPath)) {
        existingConfig = fs.readFileSync(wranglerPath, 'utf8');
      }

      // 检查是否已包含 D1 配置
      if (!existingConfig.includes('[[d1_databases]]')) {
        const newConfig = existingConfig + wranglerConfig;
        fs.writeFileSync(wranglerPath, newConfig);
        console.log('✅ wrangler.toml 配置已更新');
      }

      // 生成环境变量
      console.log('\n📋 请将以下环境变量添加到 GitHub Secrets:');
      console.log(`D1_DATABASE_ID=${dbId}`);
      console.log(`D1_DATABASE_NAME=${DB_NAME}`);
      console.log(`DATABASE_URL=file:./dev.db`);

      // 创建本地开发数据库
      console.log('\n🔧 创建本地开发数据库...');
      try {
        execSync(`wrangler d1 execute ${DB_NAME} --local --file=./scripts/init-db.sql`, {
          stdio: 'inherit'
        });
      } catch (error) {
        console.log('⚠️  本地数据库执行失败，可能需要手动执行');
      }

      console.log('\n✨ D1 数据库初始化完成！');
      console.log('\n📝 后续步骤:');
      console.log('1. 将上述环境变量添加到 GitHub Secrets');
      console.log('2. 将环境变量添加到 Cloudflare Pages 环境变量');
      console.log('3. 运行 `npx prisma generate` 生成 Prisma 客户端');
      console.log('4. 运行 `npx prisma db push` 推送数据库结构');

    } else {
      console.error('❌ 无法从输出中提取数据库 ID');
      console.log('输出内容:', createOutput);
    }

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`ℹ️  数据库 ${DB_NAME} 已存在，跳过创建`);

      // 获取现有数据库信息
      try {
        const listOutput = execSync(`wrangler d1 list`, { encoding: 'utf8' });
        console.log('现有数据库:', listOutput);
      } catch (listError) {
        console.log('无法获取数据库列表:', listError.message);
      }
    } else {
      console.error('❌ 创建数据库失败:', error.message);
      process.exit(1);
    }
  }

} catch (error) {
  console.error('❌ 初始化失败:', error.message);
  process.exit(1);
}