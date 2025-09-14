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
      // 直接调用 Kimi API
      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ***REMOVED***'
        },
        body: JSON.stringify({
          model: 'kimi-k2-0905-preview',
          messages: [
            {
              role: 'system',
              content: `你是一位专业的舆论危机管理专家，专门分析和处理企业公关危机。当前正在分析罗永浩与西贝预制菜争议事件。

**事件背景**：
- 罗永浩质疑西贝使用预制菜并批评其价格
- 西贝创始人贾国龙回应称门店没有预制菜并宣布起诉
- 争议导致西贝营业额大幅下滑
- 涉及预制菜定义、价格争议、透明度等核心问题

**你的专业领域**：
1. 危机公关策略制定
2. 舆论分析和预判
3. 品牌形象修复
4. 媒体沟通策略
5. 利益相关方管理

请基于专业知识，为用户提供具体、可操作的建议。回答要专业、客观、有建设性。`
            },
            ...[...messages, userMessage].map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答您的问题。',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '抱歉，AI服务暂时不可用。请稍后再试，或者查看页面上的事件时间线了解详细信息。',
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