'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type DesignMode = 'modern' | 'neobrutalism'
type NeoColorTheme = 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender'

export const neoColorThemes: Record<NeoColorTheme, {
  name: string
  bg: string
  primary: string
  secondary: string
  accent: string
  card: string
}> = {
  yellow: {
    name: 'Sunny',
    bg: '#f0e68c',
    primary: '#ff6b6b',
    secondary: '#98fb98',
    accent: '#dda0dd',
    card: '#fffacd'
  },
  pink: {
    name: 'Bubblegum',
    bg: '#ffb3ba',
    primary: '#ff6b6b',
    secondary: '#baffc9',
    accent: '#ffdfba',
    card: '#ffd1d8'
  },
  mint: {
    name: 'Fresh',
    bg: '#baffc9',
    primary: '#ff6b6b',
    secondary: '#bae1ff',
    accent: '#ffffba',
    card: '#d4ffdb'
  },
  sky: {
    name: 'Ocean',
    bg: '#bae1ff',
    primary: '#ff6b6b',
    secondary: '#baffc9',
    accent: '#ffdfba',
    card: '#d4edff'
  },
  lavender: {
    name: 'Dream',
    bg: '#e0b0ff',
    primary: '#ff6b6b',
    secondary: '#baffc9',
    accent: '#ffffba',
    card: '#ecd0ff'
  }
}

interface DesignContextType {
  design: DesignMode
  setDesign: (design: DesignMode) => void
  toggleDesign: () => void
  neoColor: NeoColorTheme
  setNeoColor: (color: NeoColorTheme) => void
  neoTheme: typeof neoColorThemes.yellow
}

const DesignContext = createContext<DesignContextType | undefined>(undefined)

export function DesignProvider({ children }: { children: ReactNode }) {
  const [design, setDesignState] = useState<DesignMode>('modern')
  const [neoColor, setNeoColorState] = useState<NeoColorTheme>('yellow')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedDesign = localStorage.getItem('design-mode') as DesignMode
    const storedColor = localStorage.getItem('neo-color') as NeoColorTheme
    if (storedDesign && (storedDesign === 'modern' || storedDesign === 'neobrutalism')) {
      setDesignState(storedDesign)
    }
    if (storedColor && Object.keys(neoColorThemes).includes(storedColor)) {
      setNeoColorState(storedColor)
    }
  }, [])

  const setDesign = (newDesign: DesignMode) => {
    setDesignState(newDesign)
    localStorage.setItem('design-mode', newDesign)
  }

  const setNeoColor = (color: NeoColorTheme) => {
    setNeoColorState(color)
    localStorage.setItem('neo-color', color)
  }

  const toggleDesign = () => {
    const newDesign = design === 'modern' ? 'neobrutalism' : 'modern'
    setDesign(newDesign)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <DesignContext.Provider value={{
      design,
      setDesign,
      toggleDesign,
      neoColor,
      setNeoColor,
      neoTheme: neoColorThemes[neoColor]
    }}>
      {children}
    </DesignContext.Provider>
  )
}

export function useDesign() {
  const context = useContext(DesignContext)
  if (!context) {
    // Return default values when used outside provider (e.g., error pages)
    return {
      design: 'modern' as const,
      setDesign: () => {},
      toggleDesign: () => {},
      neoColor: 'yellow' as const,
      setNeoColor: () => {},
      neoTheme: neoColorThemes.yellow
    }
  }
  return context
}
