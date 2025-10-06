'use client'

import { YouTubeLink, VideoDocument } from '@/types'
import { VideoLinkItem } from './video-link-item'
import { VideoIcon } from 'lucide-react'

interface VideoLinkListProps {
  docId: string
  links: YouTubeLink[]
  otherDocuments: VideoDocument[]
}

export function VideoLinkList({ docId, links, otherDocuments }: VideoLinkListProps) {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
        <VideoIcon className="size-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          No videos saved yet. Click "Add Video" to get started!
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-base font-semibold mb-4 text-foreground flex items-center gap-2">
        <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-sm">
          {links.length}
        </span>
        Saved Videos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {links.map((link) => (
          <VideoLinkItem
            key={link.id}
            docId={docId}
            link={link}
            otherDocuments={otherDocuments}
          />
        ))}
      </div>
    </div>
  )
}
