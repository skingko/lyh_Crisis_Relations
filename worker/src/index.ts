/**
 * Cloudflare Worker API 转发层
 * 专门为罗永浩-西贝危机管理应用提供安全的 AI API 访问
 */

interface Env {
  ALLOWED_DOMAIN_PATTERNS: string;
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL: string;
  OPENAI_MODEL: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// 系统提示词 - 专注于舆论危机管理
const SYSTEM_PROMPT = `你是一位专业的舆论危机管理专家，专门分析和处理企业危机事件。当前你正在协助分析"罗永浩与西贝预制菜争议"事件。

## 你的专业领域：
- 舆论危机分析与应对策略
- 企业声誉管理
- 公关传播策略
- 利益相关方沟通
- 危机预警与监控

## 当前事件背景：
罗永浩在直播中质疑西贝使用预制菜，引发关于餐饮行业透明度、预制菜定义、价格合理性等争议。

## 回复要求：
1. 保持专业、客观的分析态度
2. 提供具体可行的建议和策略
3. 考虑多方利益相关者的立场
4. 回复简洁明了，重点突出
5. 如涉及具体策略，请提供实施步骤

请基于用户的问题，提供专业的危机管理建议。`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS(request, env);
    }

    // 验证来源域名
    const origin = request.headers.get('Origin');
    if (!isOriginAllowed(origin, env)) {
      return new Response('Forbidden: Invalid origin', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // 路由处理
    const url = new URL(request.url);
    
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChatRequest(request, env, origin);
    }
    
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return handleHealthCheck(env, origin);
    }

    return new Response('Not Found', { 
      status: 404,
      headers: { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': origin || '*'
      }
    });
  },
};

/**
 * 处理 CORS 预检请求
 */
function handleCORS(request: Request, env: Env): Response {
  const origin = request.headers.get('Origin');
  
  if (!isOriginAllowed(origin, env)) {
    return new Response('Forbidden', { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*',
    },
  });
}

/**
 * 验证请求来源是否被允许
 * 支持泛域名匹配，如 *.sking.cool, *.taskin.chat
 */
function isOriginAllowed(origin: string | null, env: Env): boolean {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    const allowedPatterns = env.ALLOWED_DOMAIN_PATTERNS.split(',').map((pattern: string) => pattern.trim());

    return allowedPatterns.some((pattern: string) => {
      if (pattern.startsWith('*.')) {
        // 泛域名匹配：*.sking.cool 匹配 xb.sking.cool, api.sking.cool 等
        const domain = pattern.substring(2); // 移除 "*."
        return hostname === domain || hostname.endsWith('.' + domain);
      } else {
        // 精确匹配
        return hostname === pattern;
      }
    });
  } catch (error) {
    console.error('Invalid origin URL:', origin, error);
    return false;
  }
}

/**
 * 处理聊天请求
 */
async function handleChatRequest(request: Request, env: Env, origin: string | null): Promise<Response> {
  try {
    const { messages }: ChatRequest = await request.json();

    // 验证请求数据
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
        },
      });
    }

    // 构建完整的消息数组，包含系统提示词
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // 调用 Kimi AI API
    const response = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kimi API Error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: 'AI service temporarily unavailable',
        details: `API returned ${response.status}`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
        },
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin || '*',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Chat request error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin || '*',
      },
    });
  }
}

/**
 * 健康检查端点
 */
function handleHealthCheck(env: Env, origin: string | null): Response {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'lyh-crisis-api-proxy',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      health: '/api/health'
    },
    config: {
      model: env.OPENAI_MODEL,
      baseUrl: env.OPENAI_BASE_URL,
      allowedDomainPatterns: env.ALLOWED_DOMAIN_PATTERNS.split(',').length
    }
  };

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || '*',
      ...corsHeaders,
    },
  });
}
