// src/components/chat/ConnectionStatus.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/services/supabase/client'

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const channel = supabase.channel('connection-status')
    
    channel
      .on('system', { event: 'disconnect' }, () => {
        console.log('🔴 Disconnected from Supabase')
        setIsOnline(false)
      })
      .on('system', { event: 'connect' }, () => {
        console.log('🟢 Connected to Supabase')
        setIsOnline(true)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="bg-yellow-500 text-white text-center py-1 px-4 text-sm">
      🔄 Connecting... Messages may be delayed
    </div>
  )
}
