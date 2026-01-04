'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { getYouTubeThumbnailFromUrl } from '@/lib/youtube'
import { moveYouTubeLink, updateYouTubeLinkCategory, addCategory } from '@/actions/video-actions'
import { PlayIcon, CheckCircleIcon, EyeIcon, FolderIcon, ArrowRightLeftIcon, XIcon, TagIcon, PlusIcon } from 'lucide-react'
import gsap from 'gsap'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Document {
  id: string
  name: string
}

interface VideoCardProps {
  docId: string
  docName: string
  link: {
    id: string
    url: string
    title: string
    addedAt: string
    watched: boolean
    category?: string
  }
  otherDocuments: Document[]
  categories: string[]
}

export function VideoCard({ docId, docName, link, otherDocuments, categories: initialCategories }: VideoCardProps) {
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(
    otherDocuments.length > 0 ? otherDocuments[0] : null
  )
  const [currentCategory, setCurrentCategory] = useState(link.category || '')
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const categoryDialogRef = useRef<HTMLDivElement>(null)
  const categoryOverlayRef = useRef<HTMLDivElement>(null)
  const newCategoryInputRef = useRef<HTMLInputElement>(null)
  const thumbnailUrl = getYouTubeThumbnailFromUrl(link.url, 'high')

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  useEffect(() => {
    if (showMoveDialog) {
      document.body.style.overflow = 'hidden'
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      }
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
        )
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMoveDialog])

  useEffect(() => {
    if (showCategoryDialog) {
      document.body.style.overflow = 'hidden'
      if (categoryOverlayRef.current) {
        gsap.fromTo(categoryOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      }
      if (categoryDialogRef.current) {
        gsap.fromTo(
          categoryDialogRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
        )
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showCategoryDialog])

  useEffect(() => {
    if (showNewCategoryInput && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus()
    }
  }, [showNewCategoryInput])

  const handleWatch = () => {
    window.open(link.url, '_blank')
  }

  const handleCloseDialog = async () => {
    if (dialogRef.current && overlayRef.current) {
      await Promise.all([
        gsap.to(dialogRef.current, { opacity: 0, y: -10, scale: 0.95, duration: 0.2 }),
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      ])
    }
    setShowMoveDialog(false)
  }

  const handleMove = async () => {
    if (!selectedDoc) return

    setIsMoving(true)

    if (cardRef.current) {
      await gsap.to(cardRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    }

    await moveYouTubeLink(docId, selectedDoc.id, link.id)
    setIsMoving(false)
    setShowMoveDialog(false)
  }

  const handleCloseCategoryDialog = async () => {
    if (categoryDialogRef.current && categoryOverlayRef.current) {
      await Promise.all([
        gsap.to(categoryDialogRef.current, { opacity: 0, y: -10, scale: 0.95, duration: 0.2 }),
        gsap.to(categoryOverlayRef.current, { opacity: 0, duration: 0.2 })
      ])
    }
    setShowCategoryDialog(false)
    setShowNewCategoryInput(false)
    setNewCategoryName('')
  }

  const handleCategoryChange = async (value: string) => {
    if (value === '__new__') {
      setShowNewCategoryInput(true)
      return
    }

    setIsUpdatingCategory(true)
    const categoryToSet = value === '__none__' ? '' : value
    const result = await updateYouTubeLinkCategory(docId, link.id, categoryToSet)

    if (result.success) {
      setCurrentCategory(categoryToSet)
    }
    setIsUpdatingCategory(false)
  }

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsAddingCategory(true)
    const result = await addCategory(docId, newCategoryName.trim())

    if (result.success) {
      setCategories([...categories, newCategoryName.trim()])
      // Also set this as the current category
      await updateYouTubeLinkCategory(docId, link.id, newCategoryName.trim())
      setCurrentCategory(newCategoryName.trim())
      setNewCategoryName('')
      setShowNewCategoryInput(false)
    }
    setIsAddingCategory(false)
  }

  return (
    <>
      <div
        ref={cardRef}
        className="group relative rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-neutral-300"
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-neutral-100 overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={link.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayIcon className="size-12 text-neutral-300" />
            </div>
          )}

          {/* Play overlay */}
          <div
            onClick={handleWatch}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 cursor-pointer"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
              <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <PlayIcon className="size-7 text-black fill-black ml-1" />
              </div>
            </div>
          </div>

          {/* Watched badge */}
          {link.watched && (
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black text-white text-xs font-medium flex items-center gap-1.5">
              <CheckCircleIcon className="size-3.5" />
              Watched
            </div>
          )}

          {/* Category badge */}
          {currentCategory && (
            <button
              onClick={() => setShowCategoryDialog(true)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 text-black text-xs font-medium shadow-sm hover:bg-white hover:shadow-md transition-all cursor-pointer"
            >
              {currentCategory}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-sm text-black line-clamp-2 mb-3 min-h-[2.5rem]">
            {link.title}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-5">
            <div className="flex items-center gap-1.5">
              <FolderIcon className="size-3.5" />
              <span className="truncate max-w-[100px]">{docName}</span>
            </div>
            <span className="text-neutral-300">|</span>
            <span>{new Date(link.addedAt).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleWatch}
              className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f0] text-sm font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)]"
            >
              <EyeIcon className="size-4" />
              Watch Now
            </button>
            <button
              onClick={() => setShowCategoryDialog(true)}
              className="p-3 rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black transition-all duration-200 hover:cursor-pointer"
              title="Change category"
            >
              <TagIcon className="size-4" />
            </button>
            {otherDocuments.length > 0 && (
              <button
                onClick={() => setShowMoveDialog(true)}
                className="p-3 rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black transition-all duration-200 hover:cursor-pointer"
                title="Move to another collection"
              >
                <ArrowRightLeftIcon className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Move Confirmation Dialog */}
      {showMoveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseDialog}
          />

          {/* Dialog */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            {/* Close button */}
            <button
              onClick={handleCloseDialog}
              className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <XIcon className="size-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black">Move Video</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Move this video to another collection
              </p>
            </div>

            {/* Video Title */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-medium text-black line-clamp-2">{link.title}</p>
              <p className="text-xs text-neutral-500 mt-1">From: {docName}</p>
            </div>

            {/* Destination Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Move to:
              </label>
              <div className="space-y-2">
                {otherDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <FolderIcon className="size-5 text-neutral-500" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseDialog}
                disabled={isMoving}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-neutral-100 text-neutral-600 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                disabled={isMoving || !selectedDoc}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-[#1a1a1a] text-[#f5f5f0] text-sm font-medium shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)] disabled:opacity-50 transition-all"
              >
                {isMoving ? 'Moving...' : 'Confirm Move'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Change Dialog */}
      {showCategoryDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            ref={categoryOverlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseCategoryDialog}
          />

          {/* Dialog */}
          <div
            ref={categoryDialogRef}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            {/* Close button */}
            <button
              onClick={handleCloseCategoryDialog}
              className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <XIcon className="size-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black">Change Category</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Update the category for this video
              </p>
            </div>

            {/* Video Title */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-medium text-black line-clamp-2">{link.title}</p>
              {currentCategory && (
                <p className="text-xs text-neutral-500 mt-1">Current: {currentCategory}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                <TagIcon className="size-4" />
                Category
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
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    disabled={isAddingCategory || !newCategoryName.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#1a1a1a] text-[#f5f5f0] text-sm font-medium hover:bg-black disabled:opacity-50 transition-colors"
                  >
                    {isAddingCategory ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryInput(false)
                      setNewCategoryName('')
                    }}
                    className="px-3 py-2.5 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ) : (
                <Select
                  value={currentCategory || '__none__'}
                  onValueChange={handleCategoryChange}
                  disabled={isUpdatingCategory}
                >
                  <SelectTrigger className="w-full px-4 py-3 h-auto text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black transition-colors bg-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseCategoryDialog}
                disabled={isUpdatingCategory}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-neutral-100 text-neutral-600 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
