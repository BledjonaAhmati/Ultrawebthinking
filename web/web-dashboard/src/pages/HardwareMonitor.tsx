/**
 * 🖥️ Hardware Monitor Dashboard
 * Real-time RISC-V hardware metrics visualization
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Cpu, HardDrive, Activity, Zap, Server } from 'lucide-react'
import { api } from '@/lib/api'
import { useWebSocket } from '@/providers/WebSocketProvider'
import { format } from 'date-fns'

interface HardwareMetrics {
  timestamp: string
  cpu: {
    cores: number
    usage_percent: number
    frequency_mhz: number
    temperature_celsius?: number
  }
  memory: {
    total_bytes: number
    used_bytes: number
    available_bytes: number
    usage_percent: number
  }
  disk: Array<{
    name: string
    mount_point: string
    total_bytes: number
    available_bytes: number
    usage_percent: number
  }>
  network: Array<{
    interface: string
    rx_bytes: number
    tx_bytes: number
  }>
  riscv?: {
    core_count: number
    active_cores: number
    instruction_rate: number
    power_watts?: number
  }
}

interface RiscVInfo {
  architecture: string
  isa: string
  vendor: string
  model: string
  cores: number
  extensions: string[]
}

export default function HardwareMonitor() {
  // Fetch current metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['hardware-metrics'],
    queryFn: async () => {
      const response = await api.hardware.metrics()
      return response.data as HardwareMetrics
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  // Fetch RISC-V info
  const { data: riscvInfo } = useQuery({
    queryKey: ['riscv-info'],
    queryFn: async () => {
      const response = await api.hardware.riscv()
      return response.data as RiscVInfo
    },
  })

  // Fetch historical data
  const { data: history } = useQuery({
    queryKey: ['hardware-history'],
    queryFn: async () => {
      const response = await api.hardware.history(60)
      return response.data as HardwareMetrics[]
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Listen for real-time updates via WebSocket
  const { subscribe } = useWebSocket()
  
  React.useEffect(() => {
    const unsubscribe = subscribe('hardware:metrics', (data) => {
      console.log('Real-time hardware update:', data)
    })
    return unsubscribe
  }, [subscribe])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 ** 3)
    return `${gb.toFixed(2)} GB`
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hardware Monitor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time RISC-V hardware metrics
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4 animate-pulse text-green-500" />
          Live updating every 5s
        </div>
      </div>

      {/* RISC-V Info Card */}
      {riscvInfo && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {riscvInfo.architecture}
              </h2>
              <p className="text-blue-100 mb-4">
                {riscvInfo.vendor} - {riscvInfo.model}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">ISA</p>
                  <p className="font-mono font-bold">{riscvInfo.isa}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Cores</p>
                  <p className="font-mono font-bold">{riscvInfo.cores}</p>
                </div>
              </div>
            </div>
            <Server className="w-16 h-16 opacity-50" />
          </div>
          {riscvInfo.extensions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-400">
              <p className="text-blue-100 text-sm mb-2">Extensions</p>
              <div className="flex flex-wrap gap-2">
                {riscvInfo.extensions.map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-1 bg-blue-600 rounded text-xs font-mono"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Cpu className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.cpu.usage_percent.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-medium">CPU Usage</h3>
          <p className="text-sm text-gray-500 mt-1">
            {metrics?.cpu.cores} cores @ {metrics?.cpu.frequency_mhz} MHz
          </p>
          {metrics?.cpu.temperature_celsius && (
            <p className="text-sm text-gray-500">
              🌡️ {metrics.cpu.temperature_celsius.toFixed(1)}°C
            </p>
          )}
        </div>

        {/* Memory Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.memory.usage_percent.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-medium">Memory</h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatBytes(metrics?.memory.used_bytes || 0)} / {formatBytes(metrics?.memory.total_bytes || 0)}
          </p>
        </div>

        {/* RISC-V Active Cores */}
        {metrics?.riscv && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.riscv.active_cores}/{metrics.riscv.core_count}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">Active Cores</h3>
            <p className="text-sm text-gray-500 mt-1">
              {(metrics.riscv.instruction_rate / 1_000_000).toFixed(2)}M inst/s
            </p>
          </div>
        )}

        {/* Power Consumption */}
        {metrics?.riscv?.power_watts && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.riscv.power_watts.toFixed(2)}W
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-300 font-medium">Power</h3>
            <p className="text-sm text-gray-500 mt-1">Current consumption</p>
          </div>
        )}
      </div>

      {/* CPU Usage Chart */}
      {history && history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            CPU Usage History (Last 60 minutes)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(val) => format(new Date(val), 'HH:mm')}
                stroke="#9ca3af"
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelFormatter={(val) => format(new Date(val), 'HH:mm:ss')}
              />
              <Area 
                type="monotone" 
                dataKey="cpu.usage_percent" 
                stroke="#3b82f6" 
                fillOpacity={1}
                fill="url(#cpuGradient)"
                name="CPU %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Disk Usage */}
      {metrics?.disk && metrics.disk.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Disk Usage
          </h3>
          <div className="space-y-4">
            {metrics.disk.map((disk, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {disk.mount_point} ({disk.name})
                  </span>
                  <span className="text-sm text-gray-500">
                    {disk.usage_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      disk.usage_percent > 90 
                        ? 'bg-red-500' 
                        : disk.usage_percent > 70 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${disk.usage_percent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatBytes(disk.total_bytes - disk.available_bytes)} / {formatBytes(disk.total_bytes)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
