'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import EventTimeline from './event-timeline'
import AIChat from './ai-chat'
import { Clock, MessageSquare, TrendingDown, AlertTriangle, Users } from 'lucide-react'

export default function CrisisDashboard() {
  const [activeTab, setActiveTab] = useState('timeline')

  const eventSummary = {
    totalEvents: 8,
    impactLevel: 'high',
    keyParties: ['罗永浩', '西贝', '胖东来'],
    mainIssues: ['预制菜定义', '价格争议', '透明度问题']
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部信息 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              舆论危机监控中心
            </h1>
            <p className="text-gray-600 text-sm">
              罗永浩与西贝"预制菜"争议事件实时追踪
            </p>
          </div>
          
          {/* 关键指标 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-900">
                {eventSummary.totalEvents}
              </div>
              <div className="text-xs text-blue-700">关键事件</div>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-red-900">
                高
              </div>
              <div className="text-xs text-red-700">影响程度</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-900">
                {eventSummary.keyParties.length}
              </div>
              <div className="text-xs text-green-700">涉及方</div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-yellow-900">
                {eventSummary.mainIssues.length}
              </div>
              <div className="text-xs text-yellow-700">核心问题</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="timeline" className="flex items-center gap-2 h-full text-sm">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">事件时间线</span>
              <span className="sm:hidden">时间线</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 h-full text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">AI危机助手</span>
              <span className="sm:hidden">AI助手</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <EventTimeline />
            
            {/* 涉及方信息 */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">主要涉及方</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {eventSummary.keyParties.map((party, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{party}</h4>
                      <div className="space-y-1">
                        {party === '罗永浩' && (
                          <>
                            <Badge variant="outline" className="text-xs">质疑方</Badge>
                            <p className="text-xs text-gray-600">发起预制菜争议</p>
                          </>
                        )}
                        {party === '西贝' && (
                          <>
                            <Badge variant="outline" className="text-xs">被质疑方</Badge>
                            <p className="text-xs text-gray-600">餐饮品牌</p>
                          </>
                        )}
                        {party === '胖东来' && (
                          <>
                            <Badge variant="outline" className="text-xs">第三方</Badge>
                            <p className="text-xs text-gray-600">曾表态支持</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 核心问题 */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">核心争议问题</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventSummary.mainIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{issue}</h4>
                        <p className="text-sm text-gray-600">
                          {issue === '预制菜定义' && '行业标准不明确，各方理解存在差异'}
                          {issue === '价格争议' && '预制菜与现做菜的价格合理性讨论'}
                          {issue === '透明度问题' && '餐饮企业信息公开程度和消费者知情权'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <AIChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}