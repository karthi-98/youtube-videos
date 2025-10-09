import { getVideoDocuments } from '@/actions/video-actions'
import { Card } from '@/components/ui/card'
import { VideoIcon, Play, Clock } from 'lucide-react'

export default async function Home() {
  const result = await getVideoDocuments()

  if (!result.success || !result.documents) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-destructive">Failed to load video documents. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold text-foreground mb-3">
              YouTube Watch Later
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Organize and manage your YouTube video collections with ease.
              Save, categorize, and never lose track of videos you want to watch.
            </p>
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Play className="size-4 text-primary" />
                <span>Smart Collections</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <VideoIcon className="size-4 text-primary" />
                <span>Easy Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {result.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-lg bg-muted p-6 mb-4">
              <VideoIcon className="size-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Collections Yet</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Get started by creating your first video collection from the sidebar.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-1">Your Collections</h2>
              <p className="text-sm text-muted-foreground">
                {result.documents.length} {result.documents.length === 1 ? 'collection' : 'collections'} ready to explore
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.documents.map((doc) => (
                <Card
                  key={doc.id}
                  title={doc.name}
                  href={`/video/${doc.id}`}
                  subtitle={`Updated: ${new Date(doc.updatedAt).toLocaleDateString()}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
