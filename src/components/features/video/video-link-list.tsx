'use client'

import { useState, useMemo } from 'react'
import { YouTubeLink, VideoDocument } from '@/types'
import { VideoLinkItem } from './video-link-item'
import { addCategory, deleteCategory } from '@/actions/video-actions'
import { VideoIcon, TagIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface VideoLinkListProps {
  docId: string
  links: YouTubeLink[]
  otherDocuments: VideoDocument[]
  categories: string[]
}

export function VideoLinkList({ docId, links, otherDocuments, categories }: VideoLinkListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: links.length }
    categories.forEach(cat => {
      counts[cat] = links.filter(link => link.category === cat).length
    })
    // Count uncategorized
    counts['Uncategorized'] = links.filter(link => !link.category).length
    return counts
  }, [links, categories])

  // Filter links based on selected category
  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'All') return links
    if (selectedCategory === 'Uncategorized') return links.filter(link => !link.category)
    return links.filter(link => link.category === selectedCategory)
  }, [links, selectedCategory])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setIsAddingCategory(true)
    const result = await addCategory(docId, newCategoryName.trim())

    if (result.success) {
      setNewCategoryName('')
      setShowAddCategory(false)
    } else {
      alert(result.error || 'Failed to add category')
    }
    setIsAddingCategory(false)
  }

  const handleDeleteCategory = async (categoryName: string) => {
    if (!confirm(`Delete category "${categoryName}"? This will remove the category from all videos.`)) return

    const result = await deleteCategory(docId, categoryName)

    if (!result.success) {
      alert(result.error || 'Failed to delete category')
    }

    // If the deleted category was selected, reset to All
    if (selectedCategory === categoryName) {
      setSelectedCategory('All')
    }
  }

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
      {/* Category Management */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TagIcon className="size-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Categories</h4>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="text-xs"
          >
            <PlusIcon className="size-3" />
            Add Category
          </Button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="mb-4 p-3 border rounded-lg bg-muted/50">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={isAddingCategory}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="sm" disabled={isAddingCategory || !newCategoryName.trim()}>
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddCategory(false)
                  setNewCategoryName('')
                }}
                disabled={isAddingCategory}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
            className="text-xs"
          >
            All
            <span className="ml-1.5 bg-background/20 px-1.5 py-0.5 rounded-md">
              {categoryCounts.All}
            </span>
          </Button>

          {categoryCounts['Uncategorized'] > 0 && (
            <Button
              variant={selectedCategory === 'Uncategorized' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('Uncategorized')}
              className="text-xs"
            >
              Uncategorized
              <span className="ml-1.5 bg-background/20 px-1.5 py-0.5 rounded-md">
                {categoryCounts['Uncategorized']}
              </span>
            </Button>
          )}

          {categories.map((category) => (
            <div key={category} className="flex items-center gap-1">
              <Button
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
                <span className="ml-1.5 bg-background/20 px-1.5 py-0.5 rounded-md">
                  {categoryCounts[category] || 0}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDeleteCategory(category)}
                className="size-7 text-destructive hover:text-destructive"
                title="Delete category"
              >
                <Trash2Icon className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Videos List */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-4 text-foreground flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-sm">
            {filteredLinks.length}
          </span>
          {selectedCategory === 'All' ? 'Saved Videos' : `${selectedCategory} Videos`}
        </h3>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
          <TagIcon className="size-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No videos in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLinks.map((link) => (
            <VideoLinkItem
              key={link.id}
              docId={docId}
              link={link}
              otherDocuments={otherDocuments}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  )
}
