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
      // 尝试调用 API
      const response = await fetch('/api/chat', {
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

      let assistantMessage: ChatMessage

      if (response.ok) {
        const data = await response.json()
        assistantMessage = {
          role: 'assistant',
          content: data.content || data.message || '抱歉，我暂时无法回答您的问题。',
          timestamp: new Date()
        }
      } else {
        // API 不可用时，使用智能模拟响应
        assistantMessage = {
          role: 'assistant',
          content: generateSmartResponse(currentInput),
          timestamp: new Date()
        }
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('发送消息失败:', error)
      // 网络错误时，使用智能模拟响应
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: generateSmartResponse(currentInput),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 生成智能模拟响应
  const generateSmartResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('罗永浩') || input.includes('老罗')) {
      return `关于罗永浩在此次预制菜争议中的表现，我的专业分析如下：

🎯 **核心观点分析**
罗永浩作为知名企业家和意见领袖，他对西贝预制菜问题的质疑体现了消费者对食品透明度的关切。

📊 **影响评估**
• **正面影响**：推动了行业对预制菜标准的讨论
• **争议点**：表达方式是否过于激烈存在争议
• **后续效应**：引发了更广泛的食品安全和透明度讨论

💡 **专业建议**
建议各方以事实为准，理性讨论，共同推动行业标准的完善和消费者权益保护。

*注：当前为演示模式，完整AI功能正在优化中。*`
    }

    if (input.includes('西贝') || input.includes('预制菜')) {
      return `关于西贝预制菜争议的专业危机管理分析：

🏢 **企业应对策略**
西贝面临的挑战主要集中在消费者信任重建和品牌形象维护上。

📈 **危机管理建议**
• **透明沟通**：主动公开食材来源和制作工艺
• **标准建立**：积极参与制定行业预制菜标准
• **消费者教育**：科学解释预制菜的安全性和营养价值
• **品质保证**：加强质量控制和第三方监督机制

🎯 **长期策略**
建议西贝将此次危机转化为提升透明度和建立消费者信任的机会，通过主动改进来重塑品牌形象。

*注：当前为演示模式，完整AI功能正在优化中。*`
    }

    if (input.includes('危机') || input.includes('公关') || input.includes('应对')) {
      return `舆论危机管理的专业建议：

🚨 **危机应对四大原则**
• **快速响应**：在24小时内给出初步回应
• **诚实透明**：承认问题，避免掩盖事实
• **承担责任**：主动承担应有责任
• **积极改进**：提出具体可行的改进措施

📱 **媒体沟通策略**
• 统一对外口径，避免信息混乱
• 选择合适的发声渠道和时机
• 密切关注社交媒体舆论动向
• 及时澄清不实信息和谣言

🔄 **品牌修复策略**
• 重建消费者信任机制
• 加强内部管理和监督
• 持续监控舆论反馈
• 建立长效预防机制

*注：当前为演示模式，完整AI功能正在优化中。*`
    }

    if (input.includes('透明度') || input.includes('标准') || input.includes('定义')) {
      return `关于预制菜行业标准和透明度的专业建议：

📋 **行业标准建议**
• **明确定义**：制定预制菜的统一行业定义和分类标准
• **标识要求**：要求餐厅明确标识预制菜品
• **质量标准**：建立预制菜的质量和安全标准
• **监管机制**：完善第三方监督和检测机制

🔍 **透明度提升**
• **信息公开**：主动公开食材来源和制作工艺
• **消费者教育**：普及预制菜相关知识
• **标签标识**：清晰标注预制菜信息
• **追溯体系**：建立完整的食品追溯系统

💼 **企业实施建议**
建议餐饮企业主动提升透明度，将其作为竞争优势而非负担。

*注：当前为演示模式，完整AI功能正在优化中。*`
    }

    // 默认响应
    return `感谢您的提问。作为舆论危机分析专家，我针对您的问题提供以下专业建议：

🎯 **分析框架**
针对您提到的问题，我建议从以下维度进行分析：
• 事件背景和起因分析
• 各方立场和利益考量
• 舆论发展趋势预判
• 潜在影响和风险评估

💡 **专业建议**
• 保持客观理性的分析态度
• 关注事实而非情绪化表达
• 考虑多方利益平衡
• 寻求建设性的解决方案

📞 **进一步咨询**
如需更详细的分析，请提供更具体的问题描述，我将为您提供更有针对性的专业建议。

*注：当前为演示模式，完整AI功能正在优化中。*`
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