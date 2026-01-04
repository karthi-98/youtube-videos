'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { VideoCard } from './video-card'
import { AddVideoDialog } from '@/components/features/video/add-video-dialog'
import { RefreshCwIcon, PlusIcon } from 'lucide-react'

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
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

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
  const filteredVideos = videos.filter((video) => {
    const docNameLower = video.docName.toLowerCase()
    if (activeTab === 'rewatched') {
      // Show videos from VideosShouldBeRewatched document
      return docNameLower === 'videosshouldberewatched'
    } else {
      // Show videos from VideosToWatch document
      return docNameLower === 'videostowatch'
    }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimalist centered design */}
      <div className="flex flex-col items-center justify-center pt-10 pb-16 px-8">
        <h1 className="text-5xl font-bold text-black text-center tracking-tight leading-[1.1]">
          My Youtube Collections
        </h1>
        {/* <p className="mt-8 text-lg md:text-xl text-neutral-500 text-center max-w-lg">
          Organize your YouTube videos in minutes—never lose track again
        </p> */}

        {/* Tab Options */}
        <div className="flex items-center gap-4 mt-12">
          <button
            onClick={() => setActiveTab('rewatched')}
            className={cn(
              'px-8 py-4 rounded-2xl text-base font-medium transition-all duration-200 hover:cursor-pointer',
              activeTab === 'rewatched'
                ? 'bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
            )}
          >
            VideosShouldBeRewatched
          </button>
          <button
            onClick={() => setActiveTab('toWatch')}
            className={cn(
              'px-8 py-4 rounded-2xl text-base font-medium transition-all duration-200 hover:cursor-pointer',
              activeTab === 'toWatch'
                ? 'bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
            )}
          >
            VideosToWatch
          </button>
          <button
            onClick={handleReload}
            disabled={isPending}
            className="p-4 rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black transition-all duration-200 disabled:opacity-50 hover:cursor-pointer disabled:hover:cursor-not-allowed"
            title="Reload videos"
          >
            <RefreshCwIcon className={cn('size-5', isPending && 'animate-spin')} />
          </button>
          {currentDoc && (
            <AddVideoDialog docId={currentDoc.id} categories={currentDoc.categories} />
          )}
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        {filteredVideos.length === 0 ? (
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
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-4">
              <p className="text-sm text-neutral-500">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
