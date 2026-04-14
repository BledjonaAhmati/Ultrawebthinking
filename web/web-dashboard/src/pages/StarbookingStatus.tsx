import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type StatusData = Record<string, unknown>

export default function StarbookingStatus() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadStatus() {
      setLoading(true)
      setError(null)

      try {
        const response = await api.services.status('app-starbooking')
        if (!mounted) {
          return
        }

        setData(response.data as StatusData)
      } catch (err: any) {
        if (!mounted) {
          return
        }

        const status = err?.response?.status
        const detail = err?.response?.data?.message || err?.message || 'Unknown error'
        if (status) {
          setError(`HTTP ${status}: ${detail}`)
        } else {
          setError(`Request failed: ${detail}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadStatus()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-white">Starbooking</h1>
      <p className="text-gray-400">Real service status from API Gateway.</p>

      {loading && <p className="text-gray-300">Loading real status...</p>}

      {!loading && error && (
        <div className="rounded border border-red-500/40 bg-red-900/30 p-4 text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && !data && (
        <div className="rounded border border-yellow-500/40 bg-yellow-900/30 p-4 text-yellow-200">
          No real data available.
        </div>
      )}

      {!loading && !error && data && (
        <pre className="overflow-x-auto rounded border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}
