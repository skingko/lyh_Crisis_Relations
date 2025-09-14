'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, TrendingDown, Users, AlertTriangle } from 'lucide-react'

interface TimelineEvent {
  date: string
  title: string
  description: string
  type: 'statement' | 'response' | 'impact' | 'controversy'
  icon: React.ReactNode
}

const timelineEvents: TimelineEvent[] = [
  {
    date: '9月10日',
    title: '罗永浩质疑西贝使用预制菜',
    description: '罗永浩发微博称西贝门店"几乎全部都是预制菜"，并批评其价格较高。',
    type: 'statement',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    date: '9月10日',
    title: '西贝创始人回应并宣布起诉',
    description: '西贝创始人贾国龙回应称"门店没有一道菜是预制菜"，并宣布将起诉罗永浩。',
    type: 'response',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  {
    date: '9月11日',
    title: '西贝公开菜品制作过程',
    description: '西贝公开罗永浩就餐的13道菜品及其详细制作过程，称这些菜品不属于预制菜，并将后厨向社会开放。',
    type: 'response',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    date: '9月11日',
    title: '西贝上线"罗永浩菜单"',
    description: '西贝上线"罗永浩菜单"（又称"老罗套餐"），但部分引发"隔夜菜"争议。',
    type: 'controversy',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  {
    date: '9月12日',
    title: '罗永浩持续回应',
    description: '罗永浩则持续转发相关内容，并表示已做好应对诉讼准备。',
    type: 'statement',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    date: '9月13日',
    title: '西贝营业额大幅下滑',
    description: '争议发酵导致西贝营业额下滑，据贾国龙称多日营业额每日减少百万以上。',
    type: 'impact',
    icon: <TrendingDown className="w-4 h-4" />
  },
  {
    date: '9月13日',
    title: '西贝内部召开动员会',
    description: '西贝内部连夜召开动员会，部署1.8万员工以应对舆论危机。',
    type: 'response',
    icon: <Users className="w-4 h-4" />
  },
  {
    date: '9月14日',
    title: '胖东来创始人表态后删除',
    description: '胖东来创始人于东来曾公开发文力挺西贝，表示"任何事没有完美"，但随后删除相关内容并将账号设为私密。',
    type: 'controversy',
    icon: <AlertTriangle className="w-4 h-4" />
  }
]

const typeColors = {
  statement: 'bg-blue-100 text-blue-800 border-blue-200',
  response: 'bg-green-100 text-green-800 border-green-200',
  impact: 'bg-red-100 text-red-800 border-red-200',
  controversy: 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const typeLabels = {
  statement: '声明',
  response: '回应',
  impact: '影响',
  controversy: '争议'
}

export default function EventTimeline() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            罗永浩与西贝"预制菜"争议事件时间线
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* 时间线主线 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  {/* 时间线节点 */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex-shrink-0">
                    {event.icon}
                  </div>
                  
                  {/* 事件卡片 */}
                  <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow min-w-0">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`${typeColors[event.type]} w-fit text-xs font-medium`}
                        >
                          {typeLabels[event.type]}
                        </Badge>
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{event.date}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}