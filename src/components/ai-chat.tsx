'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Send, Bot, User, Loader2, Lightbulb, Shield, TrendingUp } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "如何应对预制菜争议带来的舆论危机？",
  "餐饮企业应该如何提高透明度？",
  "预制菜的标准应该如何定义？",
  "如何处理与网红的公开争议？",
  "营业额下滑时应该采取什么措施？"
]

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '您好！我是舆论危机AI助手，可以为您提供专业的公关建议和危机处理方案。请问有什么可以帮助您的？',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      // 调用 Cloudflare Worker API 代理
      const WORKER_API_URL = 'https://lyh-crisis-api-proxy.sking.cool'

      const response = await fetch(`${WORKER_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Worker API Error:', response.status, errorData)
        throw new Error(`API请求失败: ${response.status} - ${errorData.error || 'Unknown error'}`)
      }

      const data = await response.json()

      let content = ''
      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Kimi API 响应格式
        content = data.choices[0].message.content
      } else if (data.content) {
        // Worker API 响应格式
        content = data.content
      } else if (data.message) {
        content = data.message
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        content = '抱歉，我暂时无法回答您的问题。'
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('发送消息失败:', error)

      // 提供更友好的错误信息
      let errorContent = '抱歉，AI服务暂时不可用。'

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorContent = '网络连接失败，请检查网络连接后重试。'
        } else if (error.message.includes('403')) {
          errorContent = '访问被拒绝，请确认您有权限访问此服务。'
        } else if (error.message.includes('429')) {
          errorContent = '请求过于频繁，请稍后再试。'
        } else if (error.message.includes('500')) {
          errorContent = 'AI服务暂时不可用，请稍后再试。'
        } else {
          errorContent = `服务异常：${error.message}`
        }
      }

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Bot className="w-5 h-5" />
            舆论危机AI助手
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            专业的公关建议和危机处理方案
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 功能特点 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">危机处理</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">公关策略</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">专业建议</span>
            </div>
          </div>

          <Separator />

          {/* 聊天区域 */}
          <div className="h-96 border rounded-lg">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 输入区域 */}
          <div className="space-y-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="请输入您的问题..."
              className="min-h-[80px] resize-none text-base"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="flex-1 h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                发送
              </Button>
            </div>
          </div>

          {/* 建议问题 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">常见问题：</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 text-xs p-2 h-auto leading-relaxed text-center"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}