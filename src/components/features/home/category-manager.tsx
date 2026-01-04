'use client'

import { useState, useRef, useEffect } from 'react'
import { addCategory, editCategory, deleteCategory } from '@/actions/video-actions'
import { TagIcon, PlusIcon, XIcon, PencilIcon, TrashIcon, CheckIcon } from 'lucide-react'
import gsap from 'gsap'

interface CategoryManagerProps {
  docId: string
  categories: string[]
}

export function CategoryManager({ docId, categories: initialCategories }: CategoryManagerProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const newCategoryInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      }
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
        )
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (editingCategory && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingCategory])

  const handleClose = async () => {
    if (dialogRef.current && overlayRef.current) {
      await Promise.all([
        gsap.to(dialogRef.current, { opacity: 0, y: -20, scale: 0.95, duration: 0.25, ease: 'power2.in' }),
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 })
      ])
    }
    setOpen(false)
    setNewCategoryName('')
    setEditingCategory(null)
    setEditValue('')
    setError('')
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsAdding(true)
    setError('')
    const result = await addCategory(docId, newCategoryName.trim())

    if (result.success) {
      setCategories([...categories, newCategoryName.trim()])
      setNewCategoryName('')
    } else {
      setError(result.error || 'Failed to add category')
    }
    setIsAdding(false)
  }

  const handleStartEdit = (category: string) => {
    setEditingCategory(category)
    setEditValue(category)
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditValue('')
  }

  const handleSaveEdit = async () => {
    if (!editingCategory || !editValue.trim()) return
    if (editValue.trim() === editingCategory) {
      setEditingCategory(null)
      return
    }

    setIsEditing(true)
    setError('')
    const result = await editCategory(docId, editingCategory, editValue.trim())

    if (result.success) {
      setCategories(categories.map(cat => cat === editingCategory ? editValue.trim() : cat))
      setEditingCategory(null)
      setEditValue('')
    } else {
      setError(result.error || 'Failed to edit category')
    }
    setIsEditing(false)
  }

  const handleDeleteCategory = async (categoryName: string) => {
    setDeletingCategory(categoryName)
    setError('')
    const result = await deleteCategory(docId, categoryName)

    if (result.success) {
      setCategories(categories.filter(cat => cat !== categoryName))
    } else {
      setError(result.error || 'Failed to delete category')
    }
    setDeletingCategory(null)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-3 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black transition-all duration-200 hover:cursor-pointer"
        title="Manage categories"
      >
        <TagIcon className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <XIcon className="size-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black">Manage Categories</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Add, edit, or delete categories for this collection
              </p>
            </div>

            {/* Add new category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Add New Category
              </label>
              <div className="flex gap-2">
                <input
                  ref={newCategoryInputRef}
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCategory()
                    }
                  }}
                  disabled={isAdding}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={isAdding || !newCategoryName.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#1a1a1a] text-[#f5f5f0] text-sm font-medium hover:bg-black disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="size-4" />
                  {isAdding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-4">
                {error}
              </p>
            )}

            {/* Categories list */}
            <div className="flex-1 overflow-y-auto">
              <label className="block text-sm font-medium text-black mb-2">
                Categories ({categories.length})
              </label>
              {categories.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">
                  No categories yet. Add one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200"
                    >
                      {editingCategory === category ? (
                        <>
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSaveEdit()
                              } else if (e.key === 'Escape') {
                                handleCancelEdit()
                              }
                            }}
                            disabled={isEditing}
                            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                          />
                          <button
                            onClick={handleSaveEdit}
                            disabled={isEditing || !editValue.trim()}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <CheckIcon className="size-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isEditing}
                            className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                            title="Cancel"
                          >
                            <XIcon className="size-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm font-medium text-black">
                            {category}
                          </span>
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors"
                            title="Edit category"
                          >
                            <PencilIcon className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            disabled={deletingCategory === category}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                            title="Delete category"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <button
                onClick={handleClose}
                className="w-full px-5 py-3.5 rounded-2xl bg-neutral-100 text-neutral-600 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
