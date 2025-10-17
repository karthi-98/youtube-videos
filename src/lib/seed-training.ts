import { db } from '@/firebase/config'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import calisthenicsData from '../../calisthenics-training.json'

interface ChecklistItem {
  text: string
  completed: boolean
}

interface DaySchedule {
  dayNumber: number
  dayName: string
  focus: string
  checklist: ChecklistItem[]
  note?: string
  completedAt?: string
}

interface Month {
  month: number
  phase: string
  goals: string[]
  weekly_schedule: {
    [key: string]: {
      focus: string
      exercises: string[]
    }
  }
}

function transformToDailySchedule(schedule: any): { [key: string]: DaySchedule } {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const dailySchedule: any = {}

  // Create 28 days (4 weeks)
  for (let dayNum = 1; dayNum <= 28; dayNum++) {
    const weekDay = (dayNum - 1) % 7 // 0-6
    const dayKey = days[weekDay]
    const dayData = schedule[dayKey]

    if (dayData) {
      dailySchedule[`day${dayNum}`] = {
        dayNumber: dayNum,
        dayName: dayNames[weekDay],
        focus: dayData.focus,
        checklist: dayData.exercises.map((item: string) => ({
          text: item,
          completed: false
        }))
      }
    }
  }

  return dailySchedule
}

export async function seedTrainingData() {
  try {
    console.log('Starting to seed training data...')

    const months = (calisthenicsData as any).months as Month[]

    for (const month of months) {
      const monthId = `month-${month.month}`
      const dailySchedule = transformToDailySchedule(month.weekly_schedule)

      const monthData = {
        month: month.month,
        phase: month.phase,
        goals: month.goals,
        days: dailySchedule,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      const docRef = doc(db, 'training', monthId)
      await setDoc(docRef, monthData)

      console.log(`Seeded month ${month.month}: ${month.phase} (28 days)`)
    }

    console.log('Training data seeded successfully!')
    return { success: true, message: `Seeded ${months.length} months with 28 days each` }
  } catch (error) {
    console.error('Error seeding training data:', error)
    return { success: false, error: 'Failed to seed training data' }
  }
}
