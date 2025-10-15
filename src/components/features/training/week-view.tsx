import { DayCard } from './day-card'
import type { TrainingMonth } from '@/types'

interface WeekViewProps {
  month: TrainingMonth & { id: string }
  monthId: string
  weekNumber: number
}

export function WeekView({ month, monthId, weekNumber }: WeekViewProps) {
  const weekKey = `week${weekNumber}` as 'week1' | 'week2' | 'week3' | 'week4'
  const weekData = month[weekKey]

  if (!weekData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Week data not found</p>
      </div>
    )
  }

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {days.map(({ key, label }) => {
        const dayData = weekData[key as keyof typeof weekData]
        if (!dayData) return null

        return (
          <DayCard
            key={key}
            day={dayData}
            dayName={label}
            monthId={monthId}
            weekNumber={weekNumber}
          />
        )
      })}
    </div>
  )
}
