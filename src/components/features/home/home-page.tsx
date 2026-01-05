'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { VideoCard } from './video-card'
import { AddVideoDialog } from '@/components/features/video/add-video-dialog'
import { CategoryManager } from './category-manager'
import { RefreshCwIcon, FilterIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDesign } from '@/components/providers/design-provider'

interface VideoWithDocInfo {
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
}

interface Document {
  id: string
  name: string
  categories: string[]
}

interface HomePageProps {
  videos: VideoWithDocInfo[]
  documents: Document[]
}

type TabType = 'rewatched' | 'toWatch'

export function HomePage({ videos, documents }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toWatch')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { design, neoTheme } = useDesign()
  const isNeo = design === 'neobrutalism'

  // Reset category filter when switching tabs
  useEffect(() => {
    setSelectedCategory(null)
  }, [activeTab])

  const handleReload = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // Get the current document based on active tab
  const currentDoc = documents.find((doc) => {
    const docNameLower = doc.name.toLowerCase()
    if (activeTab === 'rewatched') {
      return docNameLower === 'videosshouldberewatched'
    } else {
      return docNameLower === 'videostowatch'
    }
  })

  // Filter videos based on which document/collection they belong to
  const tabFilteredVideos = videos.filter((video) => {
    const docNameLower = video.docName.toLowerCase()
    if (activeTab === 'rewatched') {
      return docNameLower === 'videosshouldberewatched'
    } else {
      return docNameLower === 'videostowatch'
    }
  })

  // Further filter by category if selected
  const filteredVideos = selectedCategory
    ? tabFilteredVideos.filter((video) => {
        if (selectedCategory === '__uncategorized__') {
          return !video.link.category
        }
        return video.link.category === selectedCategory
      })
    : tabFilteredVideos

  // Get unique categories from current tab's videos with counts
  const categoryCounts = tabFilteredVideos.reduce((acc, video) => {
    const cat = video.link.category || '__uncategorized__'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get categories from the current document
  const availableCategories = currentDoc?.categories || []

  // Count videos for each tab
  const rewatchedCount = videos.filter(
    (v) => v.docName.toLowerCase() === 'videosshouldberewatched'
  ).length
  const toWatchCount = videos.filter(
    (v) => v.docName.toLowerCase() === 'videostowatch'
  ).length

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        !isNeo && "bg-neutral-50"
      )}
      style={isNeo ? { backgroundColor: neoTheme.bg } : undefined}
    >
      {/* Toolbar */}
      <div
        className={cn(
          "sticky top-16 z-30 transition-all duration-300",
          isNeo
            ? "bg-white border-b-3 border-black"
            : "bg-white/80 backdrop-blur-md border-b border-neutral-200/80"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Tab Switch */}
          <div className={cn(
            "relative p-1 transition-all duration-300",
            isNeo
              ? "bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              : "bg-neutral-100 rounded-xl"
          )}>
            <div
              className={cn(
                'absolute top-1 bottom-1 w-[calc(50%-4px)] transition-all duration-300 ease-out',
                isNeo
                  ? "border border-black"
                  : "bg-white rounded-lg shadow-sm",
                activeTab === 'rewatched' ? 'left-1' : 'left-[calc(50%+2px)]'
              )}
              style={isNeo ? { backgroundColor: neoTheme.primary } : undefined}
            />
            <div className="relative flex">
              <button
                onClick={() => setActiveTab('rewatched')}
                className={cn(
                  'relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:cursor-pointer flex items-center gap-2',
                  isNeo ? "font-bold uppercase text-xs" : "rounded-lg",
                  activeTab === 'rewatched'
                    ? isNeo ? 'text-black' : 'text-black'
                    : 'text-neutral-500 hover:text-black'
                )}
              >
                Rewatch
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs font-semibold transition-colors duration-300',
                    isNeo ? "border border-black bg-white text-black" : "rounded-full",
                    activeTab === 'rewatched'
                      ? isNeo ? '' : 'bg-black/10 text-black'
                      : isNeo ? 'bg-neutral-100' : 'bg-neutral-200/80 text-neutral-500'
                  )}
                >
                  {rewatchedCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('toWatch')}
                className={cn(
                  'relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:cursor-pointer flex items-center gap-2',
                  isNeo ? "font-bold uppercase text-xs" : "rounded-lg",
                  activeTab === 'toWatch'
                    ? isNeo ? 'text-black' : 'text-black'
                    : 'text-neutral-500 hover:text-black'
                )}
              >
                To Watch
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs font-semibold transition-colors duration-300',
                    isNeo ? "border border-black bg-white text-black" : "rounded-full",
                    activeTab === 'toWatch'
                      ? isNeo ? '' : 'bg-black/10 text-black'
                      : isNeo ? 'bg-neutral-100' : 'bg-neutral-200/80 text-neutral-500'
                  )}
                >
                  {toWatchCount}
                </span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              disabled={isPending}
              className={cn(
                "p-2 transition-all duration-200 disabled:opacity-50 hover:cursor-pointer disabled:hover:cursor-not-allowed",
                isNeo
                  ? "border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  : "rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-black hover:border-neutral-300"
              )}
              style={isNeo ? { backgroundColor: neoTheme.secondary } : undefined}
              title="Reload videos"
            >
              <RefreshCwIcon className={cn('size-4', isPending && 'animate-spin')} />
            </button>
            {currentDoc && (
              <>
                <CategoryManager docId={currentDoc.id} categories={currentDoc.categories} isNeo={isNeo} />
                <AddVideoDialog docId={currentDoc.id} categories={currentDoc.categories} isNeo={isNeo} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
        {/* Category Filter */}
        {tabFilteredVideos.length > 0 && (availableCategories.length > 0 || categoryCounts['__uncategorized__']) && (
          <div className={cn(
            "mb-6 flex items-center gap-3 transition-all duration-300",
            isNeo ? "p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : ""
          )}>
            <FilterIcon className={cn("size-4", isNeo ? "text-black" : "text-neutral-400")} />
            <span className={cn(
              "text-sm",
              isNeo ? "text-black uppercase font-bold text-xs" : "text-neutral-500 font-medium"
            )}>Filter</span>
            <Select
              value={selectedCategory || '__all__'}
              onValueChange={(value) => setSelectedCategory(value === '__all__' ? null : value)}
            >
              <SelectTrigger
                className={cn(
                  "w-[180px] h-9 transition-all duration-300",
                  isNeo
                    ? "rounded-none border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "rounded-lg border-neutral-200 bg-white text-sm"
                )}
                style={isNeo ? { backgroundColor: neoTheme.accent } : undefined}
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className={cn(
                isNeo ? "rounded-none border-2 border-black" : "rounded-lg"
              )}>
                <SelectItem value="__all__">
                  All categories ({tabFilteredVideos.length})
                </SelectItem>
                <SelectSeparator />
                {availableCategories.map((category) => {
                  const count = categoryCounts[category] || 0
                  return (
                    <SelectItem key={category} value={category}>
                      {category} ({count})
                    </SelectItem>
                  )
                })}
                {categoryCounts['__uncategorized__'] > 0 && (
                  <>
                    <SelectSeparator />
                    <SelectItem value="__uncategorized__">
                      Uncategorized ({categoryCounts['__uncategorized__']})
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {filteredVideos.length === 0 && !selectedCategory ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-neutral-100 p-10 mb-8">
              <svg
                className="size-16 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-black mb-3">
              {activeTab === 'rewatched'
                ? 'No Videos to Rewatch'
                : 'No Videos to Watch'}
            </h2>
            <p className="text-base text-neutral-500 max-w-md">
              {activeTab === 'rewatched'
                ? 'Videos you mark as watched will appear here for rewatching.'
                : 'Add videos to your collections to see them here.'}
            </p>
          </div>
        ) : filteredVideos.length === 0 && selectedCategory ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-neutral-100 p-10 mb-8">
              <FilterIcon className="size-12 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-black mb-3">
              No videos in this category
            </h2>
            <p className="text-base text-neutral-500 max-w-md mb-6">
              There are no videos in the &quot;{selectedCategory === '__uncategorized__' ? 'Uncategorized' : selectedCategory}&quot; category.
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-6 py-3 rounded-xl bg-[#1a1a1a] text-white text-sm font-medium hover:bg-black transition-colors"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <>
            <div className={cn(
              "mb-6 flex items-center justify-between pb-3",
              isNeo ? "border-b-2 border-black" : "border-b border-neutral-200"
            )}>
              <p className={cn(
                "text-sm",
                isNeo ? "font-bold text-black" : "text-neutral-500"
              )}>
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
                {selectedCategory && (
                  <span className="ml-1">
                    in &quot;{selectedCategory === '__uncategorized__' ? 'Uncategorized' : selectedCategory}&quot;
                  </span>
                )}
              </p>
            </div>
            <div className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              isNeo ? "gap-5" : "gap-6"
            )}>
              {filteredVideos.map((video) => {
                const otherDocs = documents
                  .filter((doc) => doc.id !== video.docId)
                  .map((doc) => ({ id: doc.id, name: doc.name }))
                const currentDocCategories = documents.find((doc) => doc.id === video.docId)?.categories || []
                return (
                  <VideoCard
                    key={video.link.id}
                    docId={video.docId}
                    docName={video.docName}
                    link={video.link}
                    otherDocuments={otherDocs}
                    categories={currentDocCategories}
                    isNeo={isNeo}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
