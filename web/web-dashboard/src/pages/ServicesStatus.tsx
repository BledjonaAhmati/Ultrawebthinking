import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  XCircle,
} from 'lucide-react'

type ServiceState = 'online' | 'offline' | 'degraded'

interface ServiceConfig {
  id: string
  name: string
  port: number
  healthPaths: string[]
  category: 'core' | 'application' | 'infrastructure'
}

interface ServiceSnapshot {
  id: string
  name: string
  port: number
  category: ServiceConfig['category']
  status: ServiceState
  pathUsed: string | null
  responseTimeMs: number | null
  statusCode: number | null
  checkedAt: string
  detail: string | null
}

const SERVICE_CONFIGS: ServiceConfig[] = [
  { id: 'ocean-core', name: 'Ocean Core', port: 7000, healthPaths: ['/api/v1/health', '/health'], category: 'core' },
  { id: 'asi-agents', name: 'ASI Agents', port: 7100, healthPaths: ['/api/v1/health', '/api/v1/agents/health', '/health'], category: 'core' },
  { id: 'ai-v2-neighborhood', name: 'AI V2 Neighborhood', port: 7200, healthPaths: ['/api/v1/health', '/health'], category: 'core' },
  { id: 'euroweb-agi', name: 'Euroweb AGI', port: 7300, healthPaths: ['/api/v1/health', '/health'], category: 'core' },
  { id: 'clisonix-labors', name: 'Clisonix Labors', port: 7400, healthPaths: ['/api/v1/health', '/api/v1/labors/health', '/health'], category: 'core' },
  { id: 'cwy-nin', name: 'Cwy Nin Engine', port: 7500, healthPaths: ['/api/v1/health', '/api/v1/nin/current', '/health'], category: 'core' },
  { id: 'orchestrator', name: 'Orchestrator', port: 8000, healthPaths: ['/api/v1/health', '/health'], category: 'core' },
  { id: 'starbooking', name: 'Starbooking', port: 3000, healthPaths: ['/api/health', '/health'], category: 'application' },
  { id: 'kloud-hardware', name: 'KLOUD Hardware', port: 6000, healthPaths: ['/api/v1/health', '/health'], category: 'infrastructure' },
]

async function checkService(config: ServiceConfig): Promise<ServiceSnapshot> {
  let lastError: string | null = null

  for (const path of config.healthPaths) {
    const url = `http://localhost:${config.port}${path}`
    const started = Date.now()

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3000),
      })

      return {
        id: config.id,
        name: config.name,
        port: config.port,
        category: config.category,
        status: response.ok ? 'online' : 'degraded',
        pathUsed: path,
        responseTimeMs: Date.now() - started,
        statusCode: response.status,
        checkedAt: new Date().toISOString(),
        detail: response.ok ? null : `HTTP ${response.status}`,
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
  }

  return {
    id: config.id,
    name: config.name,
    port: config.port,
    category: config.category,
    status: 'offline',
    pathUsed: null,
    responseTimeMs: null,
    statusCode: null,
    checkedAt: new Date().toISOString(),
    detail: lastError,
  }
}

function renderStatusBadge(status: ServiceState) {
  if (status === 'online') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
        <CheckCircle className="h-3.5 w-3.5" /> Online
      </span>
    )
  }

  if (status === 'degraded') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-300">
        <AlertTriangle className="h-3.5 w-3.5" /> Degraded
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-300">
      <XCircle className="h-3.5 w-3.5" /> Offline
    </span>
  )
}

export default function ServicesStatus() {
  const [services, setServices] = useState<ServiceSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const refreshAll = async (firstLoad = false) => {
    if (firstLoad) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    const snapshots = await Promise.all(SERVICE_CONFIGS.map((service) => checkService(service)))
    setServices(snapshots)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    void refreshAll(true)
  }, [])

  useEffect(() => {
    if (!autoRefresh) {
      return
    }

    const interval = setInterval(() => {
      void refreshAll(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const summary = useMemo(() => {
    const online = services.filter((service) => service.status === 'online').length
    const degraded = services.filter((service) => service.status === 'degraded').length
    const offline = services.filter((service) => service.status === 'offline').length

    const responseTimes = services
      .map((service) => service.responseTimeMs)
      .filter((value): value is number => typeof value === 'number')

    const avgResponse = responseTimes.length
      ? Math.round(responseTimes.reduce((acc, curr) => acc + curr, 0) / responseTimes.length)
      : null

    return { online, degraded, offline, avgResponse }
  }, [services])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-slate-300">
          <Server className="mx-auto mb-3 h-8 w-8 animate-pulse" />
          Checking real services...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Status</h1>
            <p className="mt-1 text-sm text-slate-400">Live health checks from localhost endpoints. No fake metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh((value) => !value)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
            >
              Auto refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => void refreshAll(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh now
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Online</p>
            <p className="mt-1 text-3xl font-bold text-emerald-300">{summary.online}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Degraded</p>
            <p className="mt-1 text-3xl font-bold text-amber-300">{summary.degraded}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Offline</p>
            <p className="mt-1 text-3xl font-bold text-rose-300">{summary.offline}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Avg response</p>
            <p className="mt-1 text-3xl font-bold text-cyan-300">{summary.avgResponse === null ? 'n/a' : `${summary.avgResponse} ms`}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{service.name}</h2>
                  <p className="text-xs text-slate-400">Port {service.port} · {service.category}</p>
                </div>
                {renderStatusBadge(service.status)}
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <dt>Endpoint</dt>
                  <dd>{service.pathUsed ? `:${service.port}${service.pathUsed}` : 'not reachable'}</dd>
                </div>
                <div className="flex justify-between text-slate-300">
                  <dt>Latency</dt>
                  <dd>{service.responseTimeMs === null ? 'n/a' : `${service.responseTimeMs} ms`}</dd>
                </div>
                <div className="flex justify-between text-slate-300">
                  <dt>Status code</dt>
                  <dd>{service.statusCode ?? 'n/a'}</dd>
                </div>
              </dl>

              <p className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
                Checked at {new Date(service.checkedAt).toLocaleTimeString()}
                {service.detail ? ` · ${service.detail}` : ''}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
          <div className="mb-2 flex items-center gap-2 text-slate-200">
            <Activity className="h-4 w-4" /> Real-service mode
          </div>
          <p>
            This page shows only measured responses from localhost services. If data is unavailable, values remain n/a and status is offline/degraded.
          </p>
        </div>
      </div>
    </div>
  )
}
