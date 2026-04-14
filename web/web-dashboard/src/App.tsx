/**
 * 🎨 UltraThinking Dashboard - Main Application
 * Real-time monitoring for all microservices
 * NO PLACEHOLDERS - Real API integration
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Layouts
import DashboardLayout from '@/components/layouts/DashboardLayout'

// Pages
import Overview from '@/pages/Overview'
import HardwareMonitor from '@/pages/HardwareMonitor'
import AIMLDashboard from '@/pages/AIMLDashboard'
import ServicesStatus from '@/pages/ServicesStatus'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'
import CwyAdvancedDashboard from '@/pages/CwyAdvancedDashboard'
import CwyDashboard from '@/pages/CwyDashboard'
import CwyNinMonitor from '@/pages/CwyNinMonitor'
import PlatformControlCenter from '@/pages/PlatformControlCenter'
import StarbookingStatus from '@/pages/StarbookingStatus'

// Providers
import { WebSocketProvider } from '@/providers/WebSocketProvider'

// Styles
import './App.css'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/platform" replace />} />
              <Route path="platform" element={<PlatformControlCenter />} />
              <Route path="starbooking" element={<StarbookingStatus />} />
              <Route path="cwy" element={<CwyAdvancedDashboard />} />
              <Route path="cwy-basic" element={<CwyDashboard />} />
              <Route path="cwy-nin" element={<CwyNinMonitor />} />
              <Route path="overview" element={<Overview />} />
              <Route path="hardware" element={<HardwareMonitor />} />
              <Route path="ai-ml" element={<AIMLDashboard />} />
              <Route path="services" element={<ServicesStatus />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '8px',
            },
          }}
        />
      </WebSocketProvider>
    </QueryClientProvider>
  )
}

export default App
