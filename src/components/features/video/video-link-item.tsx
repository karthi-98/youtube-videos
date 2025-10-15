'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { YouTubeLink, VideoDocument } from '@/types'
import { deleteYouTubeLink, moveYouTubeLink, updateYouTubeLinkCategory } from '@/actions/video-actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const thumbnailUrl = getYouTubeThumbnailFromUrl(link.url, 'maxres')
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
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
  }

  const handleCategoryChange = async (category: string) => {
    setIsUpdatingCategory(true)
    await updateYouTubeLinkCategory(docId, link.id, category)
    setIsUpdatingCategory(false)
  }

  return (
    <div
      ref={cardRef}
      className="group rounded-lg border bg-card overflow-hidden w-full max-w-sm cursor-pointer"
    >
      {/* Thumbnail - 16:9 aspect ratio */}
      <div ref={imageRef} className="relative w-full aspect-video bg-muted overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={link.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 384px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayIcon className="size-12 text-muted-foreground" />
          </div>
        )}

        {/* Actions Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                className="bg-black/50 hover:bg-black/70 text-white border-0"
                disabled={isDeleting || isMoving}
              >
                <MoreVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {categories.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Category
                  </DropdownMenuLabel>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      disabled={isUpdatingCategory}
                      className={cn(
                        link.category === category && "bg-accent"
                      )}
                    >
                      <TagIcon className="size-4" />
                      {category}
                    </DropdownMenuItem>
                  ))}
                  {link.category && (
                    <DropdownMenuItem
                      onClick={() => handleCategoryChange('')}
                      disabled={isUpdatingCategory}
                      className="text-muted-foreground"
                    >
                      <TagIcon className="size-4" />
                      Remove Category
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </>
              )}

              {otherDocuments.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Move to
                  </DropdownMenuLabel>
                  {otherDocuments.map((doc) => (
                    <DropdownMenuItem
                      key={doc.id}
                      onClick={() => handleMove(doc.id)}
                      disabled={isMoving}
                    >
                      <MoveIcon className="size-4" />
                      {doc.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-4 flex flex-col">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[3rem]">
          {link.title}
        </h3>

        {link.category && (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              <TagIcon className="size-3" />
              {link.category}
            </span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          Added: {new Date(link.addedAt).toLocaleDateString()}
        </p>

        <Button
          variant="default"
          size="sm"
          onClick={() => window.open(link.url, '_blank')}
          className="w-full mt-auto"
        >
          <PlayIcon className="size-4" />
          Watch Now
        </Button>
      </div>
    </div>
  )
}
