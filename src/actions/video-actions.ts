'use server'

import { db } from '@/firebase/config'
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'
import type { VideoDocument, YouTubeLink } from '@/types'

export async function getVideoDocuments() {
  try {
    const querySnapshot = await getDocs(collection(db, 'youtube'))
    const documents: VideoDocument[] = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || doc.id,
        createdAt: (data.createdAt?.toDate() || new Date()).toISOString(),
        updatedAt: (data.updatedAt?.toDate() || new Date()).toISOString(),
        categories: data.categories || [],
      }
    })

    return { success: true, documents }
  } catch (error) {
    console.error('Error fetching video documents:', error)
    return { success: false, error: 'Failed to fetch video documents' }
  }
}

export async function getVideoDocumentById(docId: string) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const links: YouTubeLink[] = (data.links || []).map((link: any) => ({
      id: link.id,
      url: link.url,
      title: link.title,
      addedAt: (link.addedAt?.toDate() || new Date()).toISOString(),
      watched: link.watched || false,
      category: link.category,
    }))

    const document = {
      id: docSnap.id,
      name: data.name || docSnap.id,
      createdAt: (data.createdAt?.toDate() || new Date()).toISOString(),
      updatedAt: (data.updatedAt?.toDate() || new Date()).toISOString(),
      categories: data.categories || [],
      links,
    }

    return { success: true, document }
  } catch (error) {
    console.error('Error fetching video document:', error)
    return { success: false, error: 'Failed to fetch video document' }
  }
}

export async function addYouTubeLink(docId: string, url: string, title: string, category?: string) {
  try {
    const docRef = doc(db, 'youtube', docId)

    const newLink: any = {
      id: crypto.randomUUID(),
      url,
      title,
      addedAt: Timestamp.now(),
      watched: false,
    }

    // Only add category if it has a value (Firestore doesn't support undefined)
    if (category) {
      newLink.category = category
    }

    await updateDoc(docRef, {
      links: arrayUnion(newLink),
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true, link: newLink }
  } catch (error) {
    console.error('Error adding YouTube link:', error)
    return { success: false, error: 'Failed to add YouTube link' }
  }
}

export async function deleteYouTubeLink(docId: string, linkId: string) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const links = data.links || []
    const updatedLinks = links.filter((link: any) => link.id !== linkId)

    await updateDoc(docRef, {
      links: updatedLinks,
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting YouTube link:', error)
    return { success: false, error: 'Failed to delete YouTube link' }
  }
}

export async function moveYouTubeLink(fromDocId: string, toDocId: string, linkId: string) {
  try {
    // Get source document
    const fromDocRef = doc(db, 'youtube', fromDocId)
    const fromDocSnap = await getDoc(fromDocRef)

    if (!fromDocSnap.exists()) {
      return { success: false, error: 'Source document not found' }
    }

    // Get destination document
    const toDocRef = doc(db, 'youtube', toDocId)
    const toDocSnap = await getDoc(toDocRef)

    if (!toDocSnap.exists()) {
      return { success: false, error: 'Destination document not found' }
    }

    // Find the link to move
    const fromData = fromDocSnap.data()
    const fromLinks = fromData.links || []
    const linkToMove = fromLinks.find((link: any) => link.id === linkId)

    if (!linkToMove) {
      return { success: false, error: 'Link not found' }
    }

    // Remove from source
    const updatedFromLinks = fromLinks.filter((link: any) => link.id !== linkId)

    // Add to destination
    const toData = toDocSnap.data()
    const toLinks = toData.links || []
    const updatedToLinks = [...toLinks, linkToMove]

    // Update both documents
    await updateDoc(fromDocRef, {
      links: updatedFromLinks,
      updatedAt: Timestamp.now(),
    })

    await updateDoc(toDocRef, {
      links: updatedToLinks,
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${fromDocId}`)
    revalidatePath(`/video/${toDocId}`)
    return { success: true }
  } catch (error) {
    console.error('Error moving YouTube link:', error)
    return { success: false, error: 'Failed to move YouTube link' }
  }
}

export async function updateYouTubeLinkCategory(docId: string, linkId: string, category: string) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const links = data.links || []
    const updatedLinks = links.map((link: any) => {
      if (link.id === linkId) {
        // If category is empty, remove the category field entirely
        if (!category) {
          const { category: _, ...linkWithoutCategory } = link
          return linkWithoutCategory
        }
        return { ...link, category }
      }
      return link
    })

    await updateDoc(docRef, {
      links: updatedLinks,
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating YouTube link category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function addCategory(docId: string, categoryName: string) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const categories = data.categories || []

    // Check if category already exists
    if (categories.includes(categoryName)) {
      return { success: false, error: 'Category already exists' }
    }

    await updateDoc(docRef, {
      categories: arrayUnion(categoryName),
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error adding category:', error)
    return { success: false, error: 'Failed to add category' }
  }
}

export async function deleteCategory(docId: string, categoryName: string) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const links = data.links || []

    // Remove category from all links that have it by removing the category field
    const updatedLinks = links.map((link: any) => {
      if (link.category === categoryName) {
        const { category: _, ...linkWithoutCategory } = link
        return linkWithoutCategory
      }
      return link
    })

    await updateDoc(docRef, {
      categories: arrayRemove(categoryName),
      links: updatedLinks,
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

export async function editCategory(docId: string, oldName: string, newName: string) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const categories = data.categories || []
    const links = data.links || []

    // Check if new name already exists
    if (categories.includes(newName)) {
      return { success: false, error: 'Category with this name already exists' }
    }

    // Update categories array
    const updatedCategories = categories.map((cat: string) =>
      cat === oldName ? newName : cat
    )

    // Update all links that have the old category name
    const updatedLinks = links.map((link: any) => {
      if (link.category === oldName) {
        return { ...link, category: newName }
      }
      return link
    })

    await updateDoc(docRef, {
      categories: updatedCategories,
      links: updatedLinks,
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error editing category:', error)
    return { success: false, error: 'Failed to edit category' }
  }
}

export async function toggleVideoWatched(docId: string, linkId: string, watched: boolean) {
  try {
    const docRef = doc(db, 'youtube', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' }
    }

    const data = docSnap.data()
    const links = data.links || []
    const updatedLinks = links.map((link: any) =>
      link.id === linkId ? { ...link, watched } : link
    )

    await updateDoc(docRef, {
      links: updatedLinks,
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error toggling video watched status:', error)
    return { success: false, error: 'Failed to update video status' }
  }
}

export async function getAllVideosWithDocInfo() {
  try {
    const querySnapshot = await getDocs(collection(db, 'youtube'))
    const allVideos: Array<{
      docId: string
      docName: string
      link: {
        id: string
        url: string
        title: string
        addedAt: string
        watched: boolean
        category?: string
      }
    }> = []

    querySnapshot.docs.forEach(docSnap => {
      const data = docSnap.data()
      const links = data.links || []

      links.forEach((link: any) => {
        allVideos.push({
          docId: docSnap.id,
          docName: data.name || docSnap.id,
          link: {
            id: link.id,
            url: link.url,
            title: link.title,
            addedAt: (link.addedAt?.toDate() || new Date()).toISOString(),
            watched: link.watched || false,
            category: link.category,
          }
        })
      })
    })

    return { success: true, videos: allVideos }
  } catch (error) {
    console.error('Error fetching all videos:', error)
    return { success: false, error: 'Failed to fetch videos' }
  }
}

export async function migrateExistingVideosToUnknownCategory() {
  try {
    const querySnapshot = await getDocs(collection(db, 'youtube'))
    let totalUpdated = 0

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data()
      const links = data.links || []
      const categories = data.categories || []

      // Check if any links need updating (don't have a category)
      const hasUncategorizedLinks = links.some((link: any) => !link.category)

      if (hasUncategorizedLinks) {
        // Update links without category to have 'unknown'
        const updatedLinks = links.map((link: any) => {
          if (!link.category) {
            return { ...link, category: 'unknown' }
          }
          return link
        })

        // Add 'unknown' to categories if not present
        const updatedCategories = categories.includes('unknown')
          ? categories
          : [...categories, 'unknown']

        const docRef = doc(db, 'youtube', docSnap.id)
        await updateDoc(docRef, {
          links: updatedLinks,
          categories: updatedCategories,
          updatedAt: Timestamp.now(),
        })

        totalUpdated += updatedLinks.filter((l: any) => l.category === 'unknown').length -
                        links.filter((l: any) => l.category === 'unknown').length
      }
    }

    revalidatePath('/')
    return { success: true, message: `Migration complete. Updated ${totalUpdated} videos to 'unknown' category.` }
  } catch (error) {
    console.error('Error migrating videos:', error)
    return { success: false, error: 'Failed to migrate videos' }
  }
}
