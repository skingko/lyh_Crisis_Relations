-- 初始化 D1 数据库表结构
-- 基于 Prisma schema 生成

-- 创建 User 表
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建 Post 表
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "idx_post_authorId" ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS "idx_post_published" ON "Post"("published");
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"("email");

-- 创建触发器以自动更新 updatedAt
CREATE TRIGGER IF NOT EXISTS "update_user_updatedAt"
    AFTER UPDATE ON "User"
    FOR EACH ROW
    BEGIN
        UPDATE "User" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

CREATE TRIGGER IF NOT EXISTS "update_post_updatedAt"
    AFTER UPDATE ON "Post"
    FOR EACH ROW
    BEGIN
        UPDATE "Post" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
    END;

-- 插入示例数据（可选）
-- 插入示例用户
INSERT OR IGNORE INTO "User" ("id", "email", "name") VALUES
    ('clx1y2z3a4b5c6d7e8f9g0h1', 'admin@example.com', '管理员'),
    ('clx2y3z4b5c6d7e8f9g0h1i2', 'user@example.com', '普通用户');

-- 插入示例文章
INSERT OR IGNORE INTO "Post" ("id", "title", "content", "published", "authorId") VALUES
    ('clx3y4z5b6c7d8e9f0g1h2i3', '欢迎使用舆论危机AI助手', '这是一个基于罗永浩与西贝预制菜争议事件的AI助手，提供专业的危机公关建议。', 1, 'clx1y2z3a4b5c6d7e8f9g0h1'),
    ('clx4y5z6b7c8d9e0f1g2h3i4', '危机公关处理策略', '在面临舆论危机时，企业应该如何制定有效的公关策略来保护品牌形象。', 1, 'clx1y2z3a4b5c6d7e8f9g0h1'),
    ('clx5y6z7b8c9d0e1f2g3h4i5', '餐饮行业舆论管理', '餐饮行业在面对预制菜争议等舆论问题时，应该如何有效管理公众情绪。', 0, 'clx2y3z4b5c6d7e8f9g0h1i2');