'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { YouTubeLink, VideoDocument } from '@/types'
import { deleteYouTubeLink, moveYouTubeLink, updateYouTubeLinkCategory } from '@/actions/video-actions'
import { PlayIcon, MoreVerticalIcon, Trash2Icon, MoveIcon, TagIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getYouTubeThumbnailFromUrl } from '@/lib/youtube'
import gsap from 'gsap'

interface VideoLinkItemProps {
  docId: string
  link: YouTubeLink
  otherDocuments: VideoDocument[]
  categories: string[]
}

export function VideoLinkItem({ docId, link, otherDocuments, categories }: VideoLinkItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const thumbnailUrl = getYouTubeThumbnailFromUrl(link.url, 'high')
  const cardRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video?')) return

    if (cardRef.current) {
      await gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in',
      })
    }

    setIsDeleting(true)
    await deleteYouTubeLink(docId, link.id)
    setIsDeleting(false)
  }

  const handleMove = async (toDocId: string) => {
    if (cardRef.current) {
      await gsap.to(cardRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      })
    }

    setIsMoving(true)
    await moveYouTubeLink(docId, toDocId, link.id)
    setIsMoving(false)
    setShowMenu(false)
  }

  const handleCategoryChange = async (category: string) => {
    setIsUpdatingCategory(true)
    await updateYouTubeLinkCategory(docId, link.id, category)
    setIsUpdatingCategory(false)
    setShowMenu(false)
  }

  const handleWatch = () => {
    window.open(link.url, '_blank')
  }

  return (
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
            <div className="size-14 rounded-full bg-white flex items-center justify-center shadow-lg">
              <PlayIcon className="size-6 text-black fill-black ml-1" />
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            disabled={isDeleting || isMoving}
            className="size-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <MoreVerticalIcon className="size-4" />
          </button>

          {showMenu && (
            <div className="absolute top-10 right-0 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-10">
              <div className="px-3 py-1.5 text-xs font-medium text-neutral-500">Actions</div>

              {categories.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-xs text-neutral-400">Category</div>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      disabled={isUpdatingCategory}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 transition-colors',
                        link.category === category && 'bg-neutral-100'
                      )}
                    >
                      <TagIcon className="size-4 text-neutral-500" />
                      {category}
                    </button>
                  ))}
                  {link.category && (
                    <button
                      onClick={() => handleCategoryChange('')}
                      disabled={isUpdatingCategory}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100 transition-colors"
                    >
                      <TagIcon className="size-4" />
                      Remove Category
                    </button>
                  )}
                  <div className="my-1 border-t border-neutral-200" />
                </>
              )}

              {otherDocuments.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-xs text-neutral-400">Move to</div>
                  {otherDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleMove(doc.id)}
                      disabled={isMoving}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 transition-colors"
                    >
                      <MoveIcon className="size-4 text-neutral-500" />
                      {doc.name}
                    </button>
                  ))}
                  <div className="my-1 border-t border-neutral-200" />
                </>
              )}

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2Icon className="size-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Category badge */}
        {link.category && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 text-black text-xs font-medium shadow-sm">
            {link.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-sm text-black line-clamp-2 mb-3 min-h-[2.5rem]">
          {link.title}
        </h3>

        <p className="text-xs text-neutral-500 mb-4">
          Added: {new Date(link.addedAt).toLocaleDateString()}
        </p>

        <button
          onClick={handleWatch}
          className="w-full px-5 py-3 rounded-2xl bg-[#1a1a1a] text-[#f5f5f0] text-sm font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)]"
        >
          Watch Now
        </button>
      </div>
    </div>
  )
}
