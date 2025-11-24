import Link from 'next/link'
import { getVideoDocumentById, getVideoDocuments } from '@/actions/video-actions'
import { AddVideoDialog } from '@/components/features/video/add-video-dialog'
import { VideoLinkList } from '@/components/features/video/video-link-list'
import { ArrowLeftIcon } from 'lucide-react'

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
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
          <h2 className="text-2xl font-bold text-black mb-4">Video Collection</h2>
          <p className="text-red-500">Failed to load video document. Please try again later.</p>
        </div>
      </div>
    )
  }

  const { document } = result
  const allDocuments = allDocsResult.success && allDocsResult.documents ? allDocsResult.documents : []
  const otherDocuments = allDocuments.filter(doc => doc.id !== id)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{document.name}</h1>
            <p className="text-sm text-neutral-500">
              Last updated: {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <AddVideoDialog docId={id} categories={document.categories} />
        </div>

        {/* Video List */}
        <VideoLinkList
          docId={id}
          links={document.links}
          otherDocuments={otherDocuments}
          categories={document.categories}
        />
      </div>
    </div>
  )
}
