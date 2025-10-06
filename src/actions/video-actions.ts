'use server'

import { db } from '@/firebase/config'
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore'
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
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
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
      addedAt: link.addedAt?.toDate() || new Date(),
      watched: link.watched || false,
    }))

    const document = {
      id: docSnap.id,
      name: data.name || docSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      links,
    }

    return { success: true, document }
  } catch (error) {
    console.error('Error fetching video document:', error)
    return { success: false, error: 'Failed to fetch video document' }
  }
}

export async function addYouTubeLink(docId: string, url: string, title: string) {
  try {
    const docRef = doc(db, 'youtube', docId)

    const newLink = {
      id: crypto.randomUUID(),
      url,
      title,
      addedAt: Timestamp.now(),
      watched: false,
    }

    await updateDoc(docRef, {
      links: arrayUnion(newLink),
      updatedAt: Timestamp.now(),
    })

    revalidatePath(`/video/${docId}`)
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
