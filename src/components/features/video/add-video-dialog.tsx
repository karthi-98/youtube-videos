'use client'

import { useState, useRef, useEffect } from 'react'
import { addYouTubeLink, addCategory } from '@/actions/video-actions'
import { PlusIcon, TagIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDesign } from '@/components/providers/design-provider'
import gsap from 'gsap'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddVideoDialogProps {
  docId: string
  categories: string[]
  isNeo?: boolean
}

export function AddVideoDialog({ docId, categories: initialCategories, isNeo = false }: AddVideoDialogProps) {
  const { neoTheme } = useDesign()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const newCategoryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      }
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
        )
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (showNewCategoryInput && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus()
    }
  }, [showNewCategoryInput])

  const handleClose = async () => {
    if (formRef.current && overlayRef.current) {
      await Promise.all([
        gsap.to(formRef.current, { opacity: 0, y: -20, scale: 0.95, duration: 0.25, ease: 'power2.in' }),
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 })
      ])
    }
    setOpen(false)
    setUrl('')
    setTitle('')
    setCategory('')
    setError('')
    setShowNewCategoryInput(false)
    setNewCategoryName('')
  }

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsAddingCategory(true)
    const result = await addCategory(docId, newCategoryName.trim())

    if (result.success) {
      setCategories([...categories, newCategoryName.trim()])
      setCategory(newCategoryName.trim())
      setNewCategoryName('')
      setShowNewCategoryInput(false)
    } else {
      setError(result.error || 'Failed to add category')
    }
    setIsAddingCategory(false)
  }

  const handleCategoryChange = (value: string) => {
    if (value === '__new__') {
      setShowNewCategoryInput(true)
    } else {
      setCategory(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!url || !title) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL')
      setIsLoading(false)
      return
    }

    const categoryToSubmit = category && category !== '__none__' ? category : undefined
    const result = await addYouTubeLink(docId, url, title, categoryToSubmit)

    if (result.success) {
      await handleClose()
    } else {
      setError(result.error || 'Failed to add video')
    }

    setIsLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "p-3 transition-all duration-200 hover:cursor-pointer",
          isNeo
            ? "border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            : "rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
        )}
        style={isNeo ? { backgroundColor: neoTheme.secondary } : undefined}
        title="Add video"
      >
        <PlusIcon className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div
            ref={formRef}
            className={cn(
              "relative w-full max-w-md bg-white p-6",
              isNeo
                ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                : "rounded-2xl shadow-2xl"
            )}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className={cn(
                "absolute top-4 right-4 size-8 flex items-center justify-center transition-colors",
                isNeo
                  ? "border-2 border-black hover:opacity-80"
                  : "rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100"
              )}
              style={isNeo ? { backgroundColor: neoTheme.primary } : undefined}
            >
              <XIcon className="size-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className={cn(
                "text-xl font-bold text-black",
                isNeo && "uppercase tracking-wide"
              )}>
                {isNeo ? "ADD NEW VIDEO" : "Add New Video"}
              </h2>
              <p className={cn(
                "text-sm mt-1",
                isNeo ? "text-black font-medium" : "text-neutral-500"
              )}>
                Add a YouTube video to your watch later collection
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="title" className={cn(
                  "block text-sm font-medium text-black mb-2",
                  isNeo && "uppercase font-bold"
                )}>
                  Video Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  className={cn(
                    "w-full px-4 py-3 text-sm focus:outline-none transition-colors",
                    isNeo
                      ? "border-3 border-black focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "rounded-xl border border-neutral-300 focus:border-black"
                  )}
                />
              </div>

              <div>
                <label htmlFor="url" className={cn(
                  "block text-sm font-medium text-black mb-2",
                  isNeo && "uppercase font-bold"
                )}>
                  YouTube URL
                </label>
                <input
                  id="url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    "w-full px-4 py-3 text-sm focus:outline-none transition-colors",
                    isNeo
                      ? "border-3 border-black focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "rounded-xl border border-neutral-300 focus:border-black"
                  )}
                />
              </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium text-black mb-2 flex items-center gap-2",
                  isNeo && "uppercase font-bold"
                )}>
                  <TagIcon className="size-4" />
                  Category (optional)
                </label>
                {showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <input
                      ref={newCategoryInputRef}
                      type="text"
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddNewCategory()
                        } else if (e.key === 'Escape') {
                          setShowNewCategoryInput(false)
                          setNewCategoryName('')
                        }
                      }}
                      disabled={isAddingCategory}
                      className={cn(
                        "flex-1 px-4 py-2.5 text-sm focus:outline-none transition-colors",
                        isNeo
                          ? "border-3 border-black focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "rounded-xl border border-neutral-300 focus:border-black"
                      )}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      disabled={isAddingCategory || !newCategoryName.trim()}
                      className={cn(
                        "px-4 py-2.5 text-sm font-medium disabled:opacity-50 transition-all",
                        isNeo
                          ? "border-3 border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "rounded-xl bg-[#1a1a1a] text-[#f5f5f0] hover:bg-black"
                      )}
                      style={isNeo ? { backgroundColor: neoTheme.secondary } : undefined}
                    >
                      {isAddingCategory ? 'Adding...' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false)
                        setNewCategoryName('')
                      }}
                      className={cn(
                        "px-3 py-2.5 transition-colors",
                        isNeo
                          ? "bg-white border-3 border-black hover:bg-neutral-100"
                          : "rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      )}
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ) : (
                  <Select value={category} onValueChange={handleCategoryChange} disabled={isLoading}>
                    <SelectTrigger className={cn(
                      "w-full px-4 py-3 h-auto text-sm focus:outline-none transition-colors bg-white",
                      isNeo
                        ? "rounded-none border-3 border-black"
                        : "rounded-xl border border-neutral-300 focus:border-black"
                    )}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className={cn(
                      isNeo ? "rounded-none border-3 border-black" : "rounded-xl"
                    )}>
                      <SelectItem value="__none__">None</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                      <SelectItem value="__new__" className="text-blue-600">
                        <PlusIcon className="size-4 mr-1" />
                        Add new category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {error && (
                <p
                  className={cn(
                    "text-sm p-3",
                    isNeo
                      ? "border-3 border-black text-black font-bold"
                      : "text-red-500 bg-red-50 rounded-xl"
                  )}
                  style={isNeo ? { backgroundColor: neoTheme.primary } : undefined}
                >
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 px-5 py-3.5 text-sm font-medium transition-all",
                    isNeo
                      ? "bg-white border-3 border-black text-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                      : "rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex-1 px-5 py-3.5 text-sm font-medium disabled:opacity-50 transition-all",
                    isNeo
                      ? "border-3 border-black text-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      : "rounded-2xl bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)]"
                  )}
                  style={isNeo ? { backgroundColor: neoTheme.primary } : undefined}
                >
                  {isLoading ? 'Adding...' : (isNeo ? 'ADD VIDEO' : 'Add Video')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
