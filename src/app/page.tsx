import { getVideoDocuments } from '@/actions/video-actions'
import { Card } from '@/components/ui/card'
import { VideoIcon } from 'lucide-react'

export default async function Home() {
  const result = await getVideoDocuments()

  if (!result.success || !result.documents) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500">Failed to load video documents. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome to YouTube Watch Later</h2>
          <p className="text-muted-foreground">
            Select a video collection from the sidebar to manage your YouTube videos
          </p>
        </div>

        {result.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <VideoIcon className="size-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No video collections found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.documents.map((doc) => (
              <Card
                key={doc.id}
                title={doc.name}
                href={`/video/${doc.id}`}
                subtitle={`Updated: ${doc.updatedAt.toLocaleDateString()}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
