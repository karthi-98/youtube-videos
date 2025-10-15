'use client'

import { useState, useRef, useEffect } from 'react'
import { addYouTubeLink } from '@/actions/video-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusIcon, TagIcon } from 'lucide-react'
import gsap from 'gsap'

interface AddVideoDialogProps {
  docId: string
  categories: string[]
}

export function AddVideoDialog({ docId, categories }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (open && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      )
    }
  }, [open])

  const handleClose = async () => {
    if (formRef.current) {
      await gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.35,
        ease: 'power2.in',
      })
    }
    setOpen(false)
    setUrl('')
    setTitle('')
    setCategory('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
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

    const result = await addYouTubeLink(docId, url, title, category || undefined)

    if (result.success) {
      await handleClose()
    } else {
      setError(result.error || 'Failed to add video')
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Add a YouTube video to your watch later collection
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              autoFocus
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

          {categories.length > 0 && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <TagIcon className="size-4" />
                Category (optional)
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="text-destructive text-sm bg-destructive/10 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Video'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
