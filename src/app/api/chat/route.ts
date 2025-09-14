import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// 静态导出配置
export const dynamic = 'force-static'
export const revalidate = false

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // 添加系统提示，专注于舆论危机处理
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `你是一位专业的舆论危机处理顾问，专注于餐饮行业的公关策略。请基于罗永浩与西贝"预制菜"争议事件，为用户提供专业的建议。

你的专业领域包括：
1. 危机公关处理策略
2. 餐饮行业舆论管理
3. 品牌形象维护
4. 媒体关系处理
5. 消费者沟通技巧

请提供实用、具体、可操作的建议，避免空洞的理论。结合当前事件的特点，给出针对性的解决方案。

当前事件背景：
- 罗永浩质疑西贝使用预制菜
- 西贝否认并宣布起诉
- 事件导致西贝营业额大幅下滑
- 引发行业对预制菜标准的讨论

请以专业、客观、建设性的语气回答用户问题。`
    }

    // 将系统消息添加到消息列表的开头
    const allMessages = [systemMessage, ...messages]

    // 创建 OpenAI 实例（配置为使用 Kimi API）
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
      dangerouslyAllowBrowser: false // 服务器端使用
    })

    // 调用 AI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'kimi-k2-0905-preview',
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 4000
    })

    // 提取AI回复内容
    const aiResponse = completion.choices[0]?.message?.content || '抱歉，我暂时无法回答您的问题。'

    return NextResponse.json({
      content: aiResponse,
      success: true
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        content: '抱歉，服务器发生了错误，请稍后再试。'
      },
      { status: 500 }
    )
  }
}