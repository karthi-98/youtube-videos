import { getVideoDocumentById, getVideoDocuments } from '@/actions/video-actions'
import { AddVideoDialog } from '@/components/features/video/add-video-dialog'
import { VideoLinkList } from '@/components/features/video/video-link-list'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VideoDocumentPage({ params }: PageProps) {
  const { id } = await params
  const result = await getVideoDocumentById(id)
  const allDocsResult = await getVideoDocuments()

  if (!result.success || !result.document) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Video Collection</h2>
          <p className="text-destructive">Failed to load video document. Please try again later.</p>
        </div>
      </div>
    )
  }

  const { document } = result
  const allDocuments = allDocsResult.success && allDocsResult.documents ? allDocsResult.documents : []
  const otherDocuments = allDocuments.filter(doc => doc.id !== id)

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">{document.name}</h2>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <AddVideoDialog docId={id} />
        </div>

        <Separator className="mb-6" />

        <VideoLinkList docId={id} links={document.links} otherDocuments={otherDocuments} />
      </div>
    </div>
  )
}
