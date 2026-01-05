'use client'

import { useDesign, neoColorThemes } from '@/components/providers/design-provider'
import { cn } from '@/lib/utils'
import { SparklesIcon, SquareIcon, ChevronDownIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const colorOptions = [
  { key: 'yellow', name: 'Sunny', color: '#f0e68c' },
  { key: 'pink', name: 'Bubblegum', color: '#ffb3ba' },
  { key: 'mint', name: 'Fresh', color: '#baffc9' },
  { key: 'sky', name: 'Ocean', color: '#bae1ff' },
  { key: 'lavender', name: 'Dream', color: '#e0b0ff' },
] as const

export function DesignSwitcher() {
  const { design, toggleDesign, neoColor, setNeoColor, neoTheme } = useDesign()
  const isNeoBrutalism = design === 'neobrutalism'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2" ref={dropdownRef}>
      <button
        onClick={toggleDesign}
        className={cn(
          'group flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300',
          isNeoBrutalism
            ? 'border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
            : 'bg-white border border-neutral-200 shadow-lg hover:shadow-xl'
        )}
        style={isNeoBrutalism ? { backgroundColor: neoTheme.bg } : undefined}
      >
        {/* Toggle Track */}
        <div
          className={cn(
            'relative w-12 h-6 rounded-full transition-all duration-300',
            isNeoBrutalism
              ? 'bg-black border-2 border-black'
              : 'bg-neutral-200'
          )}
        >
          {/* Toggle Thumb */}
          <div
            className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center',
              isNeoBrutalism
                ? 'left-[calc(100%-22px)] border-2 border-black'
                : 'left-0.5 bg-white border border-neutral-300 shadow-sm'
            )}
            style={isNeoBrutalism ? { backgroundColor: neoTheme.bg } : undefined}
          >
            {isNeoBrutalism ? (
              <SquareIcon className="size-3 text-black" />
            ) : (
              <SparklesIcon className="size-3 text-neutral-400" />
            )}
          </div>
        </div>

        {/* Label */}
        <span
          className={cn(
            'text-sm font-medium transition-all duration-300',
            isNeoBrutalism
              ? 'font-bold text-black'
              : 'text-neutral-600'
          )}
        >
          {isNeoBrutalism ? 'BRUTAL' : 'Modern'}
        </span>
      </button>

      {/* Color Theme Dropdown - Only visible when NeoBrutalism is active */}
      {isNeoBrutalism && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
            style={{ backgroundColor: neoTheme.bg }}
          >
            <div
              className="size-4 border-2 border-black"
              style={{ backgroundColor: neoTheme.bg }}
            />
            <span className="text-xs font-bold text-black uppercase">
              {neoTheme.name}
            </span>
            <ChevronDownIcon className={cn(
              "size-4 text-black transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[140px]">
              {colorOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setNeoColor(option.key)
                    setIsDropdownOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 transition-colors text-left",
                    neoColor === option.key && "bg-neutral-100"
                  )}
                >
                  <div
                    className="size-5 border-2 border-black"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm font-bold text-black">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
