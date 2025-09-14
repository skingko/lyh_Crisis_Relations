// Cloudflare Pages Function for testing environment variables
export async function onRequestGet(context: any) {
  try {
    const { env } = context;

    // 检查环境变量
    const envVars = {
      NODE_ENV: env.NODE_ENV || 'undefined',
      OPENAI_API_KEY: env.OPENAI_API_KEY ? '***' + env.OPENAI_API_KEY.slice(-4) : 'undefined',
      OPENAI_BASE_URL: env.OPENAI_BASE_URL || 'undefined',
      OPENAI_MODEL: env.OPENAI_MODEL || 'undefined',
    };

    return new Response(JSON.stringify({
      message: 'API Test Successful',
      timestamp: new Date().toISOString(),
      environment: envVars,
      success: true
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Test function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 处理 OPTIONS 请求 (CORS 预检)
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
