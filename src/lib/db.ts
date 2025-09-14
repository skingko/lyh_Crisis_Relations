// 检查是否在 Edge Runtime 环境中
function isEdgeRuntime() {
  return typeof globalThis !== 'undefined' &&
         (globalThis as any).EdgeRuntime !== undefined
}

// 检查是否在 Cloudflare 环境中
function isCloudflareEnvironment() {
  return typeof globalThis !== 'undefined' && (globalThis as any).DB
}

// 在 Edge Runtime 中，我们需要延迟加载 Prisma
let prismaClient: any = null

async function getPrismaClient() {
  if (prismaClient) return prismaClient

  if (isEdgeRuntime() && isCloudflareEnvironment()) {
    // 在 Cloudflare Edge Runtime 中使用 D1 适配器
    const { PrismaClient } = await import('@prisma/client')
    const { PrismaD1 } = await import('@prisma/adapter-d1')

    const d1Database = (globalThis as any).DB
    const adapter = new PrismaD1(d1Database)

    prismaClient = new PrismaClient({
      adapter: adapter as any,
      log: [],
    })
  } else if (!isEdgeRuntime()) {
    // 在 Node.js 环境中使用标准 Prisma
    const { PrismaClient } = await import('@prisma/client')

    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      datasourceUrl: process.env.DATABASE_URL || 'file:./dev.db',
    })
  } else {
    // Edge Runtime 但没有 D1，返回 null
    return null
  }

  return prismaClient
}

// 导出数据库实例
export { getPrismaClient as db }

// D1 数据库直接访问适配器（用于测试和直接查询）
export class D1Adapter {
  private db: any

  constructor(d1Database: any) {
    this.db = d1Database
  }

  async query(sql: string, params: any[] = []) {
    try {
      const result = await this.db.prepare(sql).bind(...params).all()
      return result
    } catch (error) {
      console.error('D1 Query Error:', error)
      throw error
    }
  }

  async execute(sql: string, params: any[] = []) {
    try {
      const result = await this.db.prepare(sql).bind(...params).run()
      return result
    } catch (error) {
      console.error('D1 Execute Error:', error)
      throw error
    }
  }
}

// 获取 D1 数据库直接访问实例
export function getD1DirectAccess() {
  if (isCloudflareEnvironment()) {
    return new D1Adapter((globalThis as any).DB)
  }
  return null
}