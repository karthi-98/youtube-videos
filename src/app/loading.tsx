'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function Loading() {
  useEffect(() => {
    // Prevent scrolling when loading
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 backdrop-blur-lg">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-16 animate-spin text-primary" />
        <p className="text-xl font-medium text-foreground">Loading...</p>
      </div>
    </div>,
    document.body
  )
}
