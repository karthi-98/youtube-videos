'use server'

import { db } from '@/firebase/config'
import { collection, getDocs, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'
import type { TrainingMonth } from '@/types'

export async function getTrainingMonths() {
  try {
    const querySnapshot = await getDocs(collection(db, 'training'))
    const months: (TrainingMonth & { id: string })[] = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        month: data.month,
        phase: data.phase,
        goals: data.goals || [],
        bonus_skills_to_work: data.bonus_skills_to_work || [],
        days: data.days || {},
        milestone_check: data.milestone_check || [],
      }
    }).sort((a, b) => a.month - b.month)

    return { success: true, months }
  } catch (error) {
    console.error('Error fetching training months:', error)
    return { success: false, error: 'Failed to fetch training months' }
  }
}

export async function getTrainingMonth(monthId: string) {
  try {
    const docRef = doc(db, 'training', monthId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Month not found' }
    }

    const data = docSnap.data()
    const month: TrainingMonth & { id: string } = {
      id: docSnap.id,
      month: data.month,
      phase: data.phase,
      goals: data.goals || [],
      bonus_skills_to_work: data.bonus_skills_to_work || [],
      days: data.days || {},
      milestone_check: data.milestone_check || [],
    }

    return { success: true, month }
  } catch (error) {
    console.error('Error fetching training month:', error)
    return { success: false, error: 'Failed to fetch training month' }
  }
}

export async function updateDayChecklist(
  monthId: string,
  dayNumber: number,
  checklistIndex: number,
  completed: boolean
) {
  try {
    const docRef = doc(db, 'training', monthId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Month not found' }
    }

    const data = docSnap.data()
    const dayKey = `day${dayNumber}`
    const day = data.days[dayKey]

    if (!day || !day.checklist[checklistIndex]) {
      return { success: false, error: 'Checklist item not found' }
    }

    day.checklist[checklistIndex].completed = completed

    // Check if all items are completed
    const allCompleted = day.checklist.every((item: any) => item.completed)
    if (allCompleted && !day.completedAt) {
      day.completedAt = new Date().toISOString()
    } else if (!allCompleted && day.completedAt) {
      delete day.completedAt
    }

    await updateDoc(docRef, {
      [`days.${dayKey}`]: day,
      updatedAt: Timestamp.now(),
    })

    revalidatePath('/training')
    revalidatePath(`/training/${monthId}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating checklist:', error)
    return { success: false, error: 'Failed to update checklist' }
  }
}

export async function updateDayNote(monthId: string, dayNumber: number, note: string) {
  try {
    const docRef = doc(db, 'training', monthId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Month not found' }
    }

    const dayKey = `day${dayNumber}`

    await updateDoc(docRef, {
      [`days.${dayKey}.note`]: note,
      updatedAt: Timestamp.now(),
    })

    revalidatePath('/training')
    revalidatePath(`/training/${monthId}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating note:', error)
    return { success: false, error: 'Failed to update note' }
  }
}

export async function resetDayProgress(monthId: string, dayNumber: number) {
  try {
    const docRef = doc(db, 'training', monthId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Month not found' }
    }

    const data = docSnap.data()
    const dayKey = `day${dayNumber}`
    const day = data.days[dayKey]

    if (!day) {
      return { success: false, error: 'Day not found' }
    }

    // Reset all checklist items
    day.checklist = day.checklist.map((item: any) => ({
      ...item,
      completed: false
    }))
    delete day.completedAt
    delete day.note

    await updateDoc(docRef, {
      [`days.${dayKey}`]: day,
      updatedAt: Timestamp.now(),
    })

    revalidatePath('/training')
    revalidatePath(`/training/${monthId}`)
    return { success: true }
  } catch (error) {
    console.error('Error resetting day:', error)
    return { success: false, error: 'Failed to reset day' }
  }
}

export async function getProgressStats(monthId: string) {
  try {
    const docRef = doc(db, 'training', monthId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Month not found' }
    }

    const data = docSnap.data()
    const days = data.days || {}

    let totalTasks = 0
    let completedTasks = 0
    let completedDays = 0
    const totalDays = 28

    Object.values(days).forEach((day: any) => {
      if (day && day.checklist) {
        totalTasks += day.checklist.length
        completedTasks += day.checklist.filter((item: any) => item.completed).length
        if (day.completedAt) {
          completedDays++
        }
      }
    })

    return {
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        completedDays,
        totalDays,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        daysProgressPercentage: Math.round((completedDays / totalDays) * 100)
      }
    }
  } catch (error) {
    console.error('Error getting progress stats:', error)
    return { success: false, error: 'Failed to get progress stats' }
  }
}
