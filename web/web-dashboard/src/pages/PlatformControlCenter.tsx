/**
 * 🎛️ Platform Control Center - Web8 Unified Dashboard
 * 
 * Monitors and controls all 7 core components:
 * 1. Cwy Nin Engine - Emotional Intelligence (7500)
 * 2. Ocean Core - AI Reasoning (7000)
 * 3. ASI Agents - Agent Registry (7001)
 * 4. AI-v2 Neighborhood - Model Orchestration (7002)
 * 5. Euroweb AGI - Thinking Engine (7003)
 * 6. Clisonix Labors - Labor Units (7004)
 * 7. Orchestrator - Main Coordination (8000)
 * 
 * Attribution:
 * - Architecture: Alba
 * - Integration: Lagter
 * - Frontend: Blerina
 * - System Design: Albi, Albana
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Waves, 
  Bot, 
  Home, 
  Brain, 
  Users, 
  Settings,
  Play,
  Square,
  RefreshCw,
  Zap,
  Code,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CwyNinDisplay from '../components/CwyNinDisplay';

// ============================================
// Types
// ============================================

interface ServiceStatus {
  name: string;
  icon: React.ReactNode;
  port: number;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  endpoint: string;
  description: string;
  metrics?: {
    uptime?: string;
    requests?: number;
    errors?: number;
    cpu?: number;
    memory?: number;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  endpoint: string;
  method: 'GET' | 'POST';
  description: string;
  category: 'control' | 'analysis' | 'ai';
}

// ============================================
// Main Component
// ============================================

const PlatformControlCenter: React.FC = () => {
  // State
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Cwy Nin Engine',
      icon: <Heart className="w-6 h-6" />,
      port: 7500,
      status: 'unknown',
      endpoint: 'http://localhost:7500/api/v1/nin/current',
      description: 'Emotional Intelligence & Code Sensing',
    },
    {
      name: 'Ocean Core',
      icon: <Waves className="w-6 h-6" />,
      port: 7000,
      status: 'unknown',
      endpoint: 'http://localhost:7000/api/v1/health',
      description: 'AI Reasoning & Reflection',
    },
    {
      name: 'ASI Agents',
      icon: <Bot className="w-6 h-6" />,
      port: 7001,
      status: 'unknown',
      endpoint: 'http://localhost:7001/api/v1/health',
      description: 'Agent Registry & Management',
    },
    {
      name: 'AI-v2 Neighborhood',
      icon: <Home className="w-6 h-6" />,
      port: 7002,
      status: 'unknown',
      endpoint: 'http://localhost:7002/api/v1/health',
      description: 'Model Orchestration',
    },
    {
      name: 'Euroweb AGI',
      icon: <Brain className="w-6 h-6" />,
      port: 7003,
      status: 'unknown',
      endpoint: 'http://localhost:7003/api/v1/health',
      description: 'Thinking Engine',
    },
    {
      name: 'Clisonix Labors',
      icon: <Users className="w-6 h-6" />,
      port: 7004,
      status: 'unknown',
      endpoint: 'http://localhost:7004/api/v1/health',
      description: 'Labor Units & Task Distribution',
    },
    {
      name: 'Orchestrator',
      icon: <Settings className="w-6 h-6" />,
      port: 8000,
      status: 'unknown',
      endpoint: 'http://localhost:8000/api/v1/health',
      description: 'Main Coordination Hub',
    },
  ]);

  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  // Quick Actions
  const quickActions: QuickAction[] = [
    {
      id: 'analyze-code',
      label: 'Analyze Code',
      icon: <Code className="w-5 h-5" />,
      endpoint: 'http://localhost:7500/api/v1/nin/code-analysis',
      method: 'GET',
      description: 'Trigger Cwy code analysis',
      category: 'analysis',
    },
    {
      id: 'ocean-insights',
      label: 'Get AI Insights',
      icon: <Lightbulb className="w-5 h-5" />,
      endpoint: 'http://localhost:7500/api/v1/nin/insights',
      method: 'GET',
      description: 'Get Ocean Core insights',
      category: 'ai',
    },
    {
      id: 'trigger-react',
      label: 'Trigger Reaction',
      icon: <Zap className="w-5 h-5" />,
      endpoint: 'http://localhost:7500/api/v1/nin/react',
      method: 'POST',
      description: 'Make Cwy react to change',
      category: 'control',
    },
  ];

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    checkAllServices();
    const interval = setInterval(checkAllServices, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // Functions
  // ============================================

  const checkAllServices = async () => {
    setIsChecking(true);
    
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(service.endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(3000), // 3 second timeout
          });

          if (response.ok) {
            return { ...service, status: 'online' as const };
          } else {
            return { ...service, status: 'degraded' as const };
          }
        } catch (error) {
          return { ...service, status: 'offline' as const };
        }
      })
    );

    setServices(updatedServices);
    setLastCheck(new Date());
    setIsChecking(false);

    // Log activity
    const onlineCount = updatedServices.filter(s => s.status === 'online').length;
    addLog(`Health check: ${onlineCount}/7 services online`);
  };

  const executeQuickAction = async (action: QuickAction) => {
    addLog(`Executing: ${action.label}...`);

    try {
      const response = await fetch(action.endpoint, {
        method: action.method,
        headers: { 'Content-Type': 'application/json' },
        body: action.method === 'POST' ? JSON.stringify({
          change_type: 'manual_trigger',
          details: { source: 'control_center' }
        }) : undefined,
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ ${action.label} completed successfully`);
        console.log(`${action.label} result:`, data);
      } else {
        addLog(`❌ ${action.label} failed: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ ${action.label} error: ${error}`);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const onlineCount = services.filter(s => s.status === 'online').length;
  const healthPercentage = (onlineCount / services.length) * 100;

  // ============================================
  // Render
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          🎛️ Web8 Platform Control Center
        </h1>
        <p className="text-purple-200">
          Unified dashboard for all 7 core components
        </p>
      </motion.div>

      {/* Platform Health Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-300" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Platform Health: {healthPercentage.toFixed(0)}%
              </h2>
              <p className="text-purple-200">
                {onlineCount} of 7 services online
              </p>
            </div>
          </div>
          
          <button
            onClick={checkAllServices}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                     text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* Health bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthPercentage}%` }}
            className={`h-full ${healthPercentage > 70 ? 'bg-green-500' : 
                       healthPercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
          />
        </div>

        {lastCheck && (
          <p className="text-xs text-purple-300 mt-2">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        )}
      </motion.div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20
                     hover:border-purple-400/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-purple-300">
                  {service.icon}
                </div>
                {getStatusIcon(service.status)}
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)} 
                            ${service.status === 'online' ? 'animate-pulse' : ''}`} 
              />
            </div>

            <h3 className="text-white font-semibold mb-1">{service.name}</h3>
            <p className="text-xs text-purple-200 mb-2">{service.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300">Port {service.port}</span>
              <span className={`px-2 py-1 rounded ${
                service.status === 'online' ? 'bg-green-500/20 text-green-300' :
                service.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {service.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Cwy Emotional State */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <CwyNinDisplay />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => executeQuickAction(action)}
                className="flex flex-col items-start gap-2 p-4 bg-purple-600/20 hover:bg-purple-600/30
                         border border-purple-400/30 rounded-lg transition-all text-left group"
              >
                <div className="flex items-center gap-2 text-purple-300 group-hover:text-purple-200">
                  {action.icon}
                  <span className="font-semibold">{action.label}</span>
                </div>
                <p className="text-xs text-purple-300/80">{action.description}</p>
                <div className="text-xs text-purple-400/60">
                  {action.method} {action.endpoint.split('/').pop()}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-400" />
          Activity Log
        </h2>

        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
          <AnimatePresence>
            {activityLog.length === 0 ? (
              <p className="text-purple-300/50">No activity yet...</p>
            ) : (
              activityLog.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-purple-200 mb-1"
                >
                  {log}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Attribution Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-purple-300/60 text-sm"
      >
        <p>
          Platform Control Center • Architecture: Alba • Integration: Lagter • Frontend: Blerina
        </p>
        <p className="text-xs mt-1">
          Monitoring all 7 core components of Web8 platform
        </p>
      </motion.div>
    </div>
  );
};

export default PlatformControlCenter;
