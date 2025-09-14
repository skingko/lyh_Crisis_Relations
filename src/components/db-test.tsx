'use client'

import { useState, useEffect } from 'react'

interface DatabaseInfo {
  success: boolean
  message: string
  data?: {
    userCount: number
    postCount: number
    users: Array<{
      id: string
      email: string
      name: string | null
      createdAt: string
    }>
    posts: Array<{
      id: string
      title: string
      published: boolean
      createdAt: string
      authorId: string
    }>
    timestamp: string
  }
  error?: string
}

export default function DatabaseTest() {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDatabase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/db/test')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '数据库测试失败')
      }

      setDbInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testDatabase()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">数据库连接测试</h2>
        <button
          onClick={testDatabase}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '测试中...' : '重新测试'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 font-medium">❌ {error}</p>
        </div>
      )}

      {dbInfo && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-600 font-medium">✅ {dbInfo.message}</p>
            <p className="text-sm text-gray-600 mt-1">
              测试时间: {new Date(dbInfo.data?.timestamp || '').toLocaleString()}
            </p>
          </div>

          {dbInfo.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium text-gray-700 mb-2">数据统计</h3>
                <div className="space-y-1 text-sm">
                  <p>用户数量: <span className="font-medium">{dbInfo.data.userCount}</span></p>
                  <p>文章数量: <span className="font-medium">{dbInfo.data.postCount}</span></p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium text-gray-700 mb-2">最近用户</h3>
                <div className="space-y-1 text-sm max-h-20 overflow-y-auto">
                  {dbInfo.data.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <span className="truncate">{user.email}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {dbInfo.data && dbInfo.data.posts.length > 0 && (
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium text-gray-700 mb-2">最近文章</h3>
              <div className="space-y-2 text-sm">
                {dbInfo.data.posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <span className="truncate flex-1">{post.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.published ? '已发布' : '草稿'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}