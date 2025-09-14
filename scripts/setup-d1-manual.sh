#!/bin/bash

# D1 数据库手动设置脚本
# 使用方法: ./scripts/setup-d1-manual.sh

set -e

echo "🚀 D1 数据库手动设置脚本"
echo "================================"

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler 未安装，正在安装..."
    npm install -g wrangler
fi

# 检查是否已登录
echo "🔐 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ 请先登录 Cloudflare:"
    echo "   wrangler login"
    exit 1
fi

# 数据库名称
DB_NAME="lyh-crisis-relations-db"

echo "📋 数据库信息:"
echo "   名称: $DB_NAME"

# 尝试获取数据库信息
echo "🔍 检查数据库是否存在..."
if wrangler d1 info $DB_NAME &> /dev/null; then
    echo "✅ 数据库已存在"

    # 获取数据库ID
    DB_INFO=$(wrangler d1 info $DB_NAME)
    DB_ID=$(echo "$DB_INFO" | grep -o '"id": "[^"]*"' | cut -d'"' -f4)
    echo "📝 数据库ID: $DB_ID"

    echo "🔧 请将以下信息添加到 GitHub Secrets:"
    echo "   D1_DATABASE_ID: $DB_ID"

else
    echo "❌ 数据库不存在"
    echo "📝 请手动创建数据库:"
    echo "   1. 访问 https://dash.cloudflare.com/"
    echo "   2. 进入 Workers & Pages"
    echo "   3. 点击 Create Application → D1 Database"
    echo "   4. 数据库名称: $DB_NAME"
    echo "   5. 创建后重新运行此脚本"
fi

# 询问是否初始化数据库
echo ""
read -p "🔄 是否要初始化数据库结构? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 初始化数据库结构..."
    if wrangler d1 execute $DB_NAME --file=./scripts/init-db.sql; then
        echo "✅ 数据库初始化成功"
    else
        echo "❌ 数据库初始化失败"
        exit 1
    fi
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "📋 下一步:"
echo "   1. 确保在 GitHub Secrets 中添加了 D1_DATABASE_ID"
echo "   2. 推送代码到触发自动部署"
echo "   3. 在 Cloudflare Pages 项目设置中添加 D1 绑定"
echo ""
echo "🔗 绑定配置:"
echo "   Variable name: DB"
echo "   D1 database: $DB_NAME"