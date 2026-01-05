'use client'

import { useDesign, neoColorThemes } from '@/components/providers/design-provider'
import { cn } from '@/lib/utils'
import { PlayCircleIcon, ChevronDownIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const colorOptions = [
  { key: 'yellow', name: 'Sunny', color: '#f0e68c' },
  { key: 'pink', name: 'Bubblegum', color: '#ffb3ba' },
  { key: 'mint', name: 'Fresh', color: '#baffc9' },
  { key: 'sky', name: 'Ocean', color: '#bae1ff' },
  { key: 'lavender', name: 'Dream', color: '#e0b0ff' },
] as const

export function Header() {
  const { design, toggleDesign, neoColor, setNeoColor, neoTheme } = useDesign()
  const isNeo = design === 'neobrutalism'
  const [isColorOpen, setIsColorOpen] = useState(false)
  const colorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setIsColorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isNeo
          ? "border-b-4 border-black bg-white"
          : "border-b border-neutral-200/80 bg-white/80 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center size-9 transition-all duration-300",
              isNeo
                ? "border-3 border-black"
                : "rounded-xl bg-black"
            )}
            style={isNeo ? { backgroundColor: neoTheme.primary } : undefined}
          >
            <PlayCircleIcon className={cn("size-5", isNeo ? "text-black" : "text-white")} />
          </div>
          <span
            className={cn(
              "text-lg font-bold text-black transition-all duration-300",
              isNeo && "uppercase tracking-wide"
            )}
          >
            {isNeo ? "VideoVault" : "VideoVault"}
          </span>
        </div>

        {/* Right side - Design Controls */}
        <div className="flex items-center gap-3">
          {/* Color Picker - Only visible in Neo mode */}
          {isNeo && (
            <div className="relative" ref={colorRef}>
              <button
                onClick={() => setIsColorOpen(!isColorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-black text-xs font-bold uppercase transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: neoTheme.bg }}
              >
                <div
                  className="size-3 border border-black"
                  style={{ backgroundColor: neoTheme.bg }}
                />
                {neoTheme.name}
                <ChevronDownIcon className={cn("size-3 transition-transform", isColorOpen && "rotate-180")} />
              </button>

              {isColorOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-w-[120px]">
                  {colorOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setNeoColor(option.key)
                        setIsColorOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-neutral-100 transition-colors",
                        neoColor === option.key && "bg-neutral-100"
                      )}
                    >
                      <div
                        className="size-4 border border-black"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Design Toggle */}
          <button
            onClick={toggleDesign}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all duration-300",
              isNeo
                ? "border-2 border-black font-bold uppercase hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            )}
            style={isNeo ? { backgroundColor: neoTheme.secondary } : undefined}
          >
            <div
              className={cn(
                "relative w-8 h-4 transition-all duration-300",
                isNeo
                  ? "bg-black border border-black"
                  : "bg-neutral-200 rounded-full"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 size-3 transition-all duration-300",
                  isNeo
                    ? "border border-black left-[calc(100%-14px)]"
                    : "bg-white rounded-full shadow-sm left-0.5"
                )}
                style={isNeo ? { backgroundColor: neoTheme.secondary } : undefined}
              />
            </div>
            <span className={isNeo ? "text-black" : "text-neutral-600"}>
              {isNeo ? "Brutal" : "Modern"}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
