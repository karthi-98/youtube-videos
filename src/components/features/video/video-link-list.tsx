'use client'

import { useState, useMemo } from 'react'
import { YouTubeLink, VideoDocument } from '@/types'
import { VideoLinkItem } from './video-link-item'
import { addCategory, deleteCategory } from '@/actions/video-actions'
import { VideoIcon, TagIcon, PlusIcon, XIcon } from 'lucide-react'
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: links.length }
    categories.forEach(cat => {
      counts[cat] = links.filter(link => link.category === cat).length
    })
    counts['Uncategorized'] = links.filter(link => !link.category).length
    return counts
  }, [links, categories])

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

    if (selectedCategory === categoryName) {
      setSelectedCategory('All')
    }
  }

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
        <div className="rounded-full bg-neutral-100 p-6 mb-4">
          <VideoIcon className="size-10 text-neutral-400" />
        </div>
        <p className="text-neutral-500">
          No videos saved yet. Click "Add Video" to get started!
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Category Management */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TagIcon className="size-4 text-neutral-500" />
            <h4 className="text-sm font-medium text-black">Categories</h4>
          </div>
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-xl bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-all"
          >
            <PlusIcon className="size-3" />
            Add Category
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="mb-4 p-4 border border-neutral-200 rounded-xl bg-neutral-50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={isAddingCategory}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={isAddingCategory || !newCategoryName.trim()}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false)
                  setNewCategoryName('')
                }}
                disabled={isAddingCategory}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-neutral-200 text-neutral-600 hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
              selectedCategory === 'All'
                ? 'bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            )}
          >
            All
            <span className={cn(
              'px-1.5 py-0.5 rounded-md text-xs',
              selectedCategory === 'All' ? 'bg-white/20' : 'bg-neutral-200'
            )}>
              {categoryCounts.All}
            </span>
          </button>

          {categoryCounts['Uncategorized'] > 0 && (
            <button
              onClick={() => setSelectedCategory('Uncategorized')}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
                selectedCategory === 'Uncategorized'
                  ? 'bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              Uncategorized
              <span className={cn(
                'px-1.5 py-0.5 rounded-md text-xs',
                selectedCategory === 'Uncategorized' ? 'bg-white/20' : 'bg-neutral-200'
              )}>
                {categoryCounts['Uncategorized']}
              </span>
            </button>
          )}

          {categories.map((category) => (
            <div key={category} className="flex items-center gap-1">
              <button
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
                  selectedCategory === category
                    ? 'bg-[#1a1a1a] text-[#f5f5f0] shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                {category}
                <span className={cn(
                  'px-1.5 py-0.5 rounded-md text-xs',
                  selectedCategory === category ? 'bg-white/20' : 'bg-neutral-200'
                )}>
                  {categoryCounts[category] || 0}
                </span>
              </button>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="size-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete category"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Videos List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black flex items-center gap-3">
          <span className="bg-[#1a1a1a] text-[#f5f5f0] rounded-xl px-3 py-1.5 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
            {filteredLinks.length}
          </span>
          {selectedCategory === 'All' ? 'Saved Videos' : `${selectedCategory} Videos`}
        </h3>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
          <div className="rounded-full bg-neutral-100 p-6 mb-4">
            <TagIcon className="size-10 text-neutral-400" />
          </div>
          <p className="text-neutral-500">
            No videos in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
