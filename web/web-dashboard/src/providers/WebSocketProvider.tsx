/**
 * 🔌 WebSocket Provider - Real-time Updates
 * NO POLLING - Real WebSocket connection
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000'

interface WebSocketContextType {
  socket: Socket | null
  connected: boolean
  subscribe: (event: string, callback: (data: any) => void) => () => void
  emit: (event: string, data?: any) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false,
  subscribe: () => () => {},
  emit: () => {},
})

export const useWebSocket = () => useContext(WebSocketContext)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Create socket connection
    const newSocket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    })

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected')
      setConnected(true)
      toast.success('Connected to real-time updates', {
        duration: 2000,
      })
    })

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected')
      setConnected(false)
      toast.error('Lost connection to server', {
        duration: 2000,
      })
    })

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const subscribe = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (!socket) {
        console.warn(`Cannot subscribe to ${event}: socket not connected`)
        return () => {}
      }

      socket.on(event, callback)

      return () => {
        socket.off(event, callback)
      }
    },
    [socket]
  )

  const emit = useCallback(
    (event: string, data?: any) => {
      if (!socket) {
        console.warn(`Cannot emit ${event}: socket not connected`)
        return
      }

      socket.emit(event, data)
    },
    [socket]
  )

  return (
    <WebSocketContext.Provider value={{ socket, connected, subscribe, emit }}>
      {children}
    </WebSocketContext.Provider>
  )
}
