import { getAllVideosWithDocInfo, getVideoDocuments } from '@/actions/video-actions'
import { HomePage } from '@/components/features/home/home-page'

export default async function Home() {
  const [videosResult, docsResult] = await Promise.all([
    getAllVideosWithDocInfo(),
    getVideoDocuments()
  ])

  if (!videosResult.success || !videosResult.videos) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-destructive">Failed to load videos. Please try again later.</p>
        </div>
      </div>
    )
  }

  const documents = docsResult.success && docsResult.documents ? docsResult.documents : []

  return <HomePage videos={videosResult.videos} documents={documents} />
}
