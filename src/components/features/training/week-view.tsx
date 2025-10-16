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
    { key: 'monday' as const },
    { key: 'tuesday' as const },
    { key: 'wednesday' as const },
    { key: 'thursday' as const },
    { key: 'friday' as const },
    { key: 'saturday' as const },
    { key: 'sunday' as const },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {days.map(({ key }) => {
        const dayData = weekData[key]
        if (!dayData) return null

        return (
          <DayCard
            key={key}
            day={dayData}
            dayNumber={dayData.dayNumber}
            monthId={monthId}
          />
        )
      })}
    </div>
  )
}
