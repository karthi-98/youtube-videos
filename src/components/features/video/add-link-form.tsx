'use client'

import { useState } from 'react'
import { addYouTubeLink } from '@/actions/video-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from 'lucide-react'

interface AddLinkFormProps {
  docId: string
}

export function AddLinkForm({ docId }: AddLinkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    if (!url || !title) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Basic YouTube URL validation
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL')
      setIsLoading(false)
      return
    }

    const result = await addYouTubeLink(docId, url, title)

    if (result.success) {
      setUrl('')
      setTitle('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to add video')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg border bg-card">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Video Title
        </label>
        <Input
          id="title"
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-2">
          YouTube URL
        </label>
        <Input
          id="url"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-destructive text-sm bg-destructive/10 p-2 rounded">{error}</p>
      )}

      {success && (
        <p className="text-primary text-sm bg-primary/10 p-2 rounded">Video added successfully!</p>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        <PlusIcon />
        {isLoading ? 'Adding...' : 'Add Video'}
      </Button>
    </form>
  )
}
