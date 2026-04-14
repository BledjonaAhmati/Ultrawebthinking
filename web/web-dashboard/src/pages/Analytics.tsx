/**
 * 📈 Analytics Dashboard
 * Performance metrics and analytics visualization
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users,
  Clock,
  Database,
  Zap
} from 'lucide-react'
import { api } from '@/lib/api'
import { format, subDays } from 'date-fns'

interface AnalyticsData {
  requestsOverTime: Array<{ timestamp: string; count: number }>
  responseTimeOverTime: Array<{ timestamp: string; avg: number; p95: number; p99: number }>
  errorRateOverTime: Array<{ timestamp: string; rate: number }>
  topEndpoints: Array<{ endpoint: string; count: number; avgTime: number }>
  statusCodes: Array<{ code: string; count: number }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('24h')

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await api.get(`/api/analytics?range=${timeRange}`)
      return response.data
    },
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const totalRequests = analytics?.requestsOverTime.reduce((sum, item) => sum + item.count, 0) || 0
  const avgResponseTime = analytics?.responseTimeOverTime.reduce((sum, item) => sum + item.avg, 0) / 
    (analytics?.responseTimeOverTime.length || 1) || 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Requests</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white">
            {totalRequests.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>12.5%</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Response Time</span>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-white">
            {avgResponseTime.toFixed(0)}ms
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingDown className="w-4 h-4" />
            <span>8.2%</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Users</span>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white">1,234</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>5.1%</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Error Rate</span>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-white">0.42%</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
            <TrendingUp className="w-4 h-4" />
            <span>0.1%</span>
          </div>
        </div>
      </div>

      {/* Requests Over Time */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Requests Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics?.requestsOverTime || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af"
              tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelFormatter={(value) => format(new Date(value), 'PPpp')}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              name="Requests"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Response Time Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.responseTimeOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9ca3af"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              />
              <Legend />
              <Line type="monotone" dataKey="avg" stroke="#10b981" name="Average" />
              <Line type="monotone" dataKey="p95" stroke="#f59e0b" name="P95" />
              <Line type="monotone" dataKey="p99" stroke="#ef4444" name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Codes */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">HTTP Status Codes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.statusCodes || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ code, percent }) => `${code}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics?.statusCodes?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Top Endpoints</h2>
        <div className="space-y-2">
          {analytics?.topEndpoints?.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex-1">
                <div className="font-mono text-sm text-white">{endpoint.endpoint}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {endpoint.count.toLocaleString()} requests · {endpoint.avgTime.toFixed(0)}ms avg
                </div>
              </div>
              <div className="w-32 bg-gray-600 rounded-full h-2 ml-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ 
                    width: `${(endpoint.count / (analytics.topEndpoints[0]?.count || 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
