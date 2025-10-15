import { getTrainingMonth, getProgressStats } from '@/actions/training-actions'
import { DayCard } from '@/components/features/training/day-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Target, Trophy, Calendar } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ monthId: string }>
}

export default async function MonthDetailPage({ params }: PageProps) {
  const { monthId } = await params

  const result = await getTrainingMonth(monthId)
  const statsResult = await getProgressStats(monthId)

  if (!result.success || !result.month) {
    notFound()
  }

  const { month } = result
  const stats = statsResult.success ? statsResult.stats : null

  // Convert days object to array and sort by day number
  const daysArray = Object.entries(month.days)
    .map(([key, day]) => ({ key, ...day }))
    .sort((a, b) => a.dayNumber - b.dayNumber)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/training">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              </Link>
              <div>
                <div className="text-xs font-medium text-primary mb-0.5">
                  MONTH {month.month}
                </div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {month.phase}
                </h1>
              </div>
            </div>

            {/* Progress Stats */}
            {stats && (
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.completedDays}/{stats.totalDays}
                  </div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.completedTasks}/{stats.totalTasks}
                  </div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.progressPercentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Month Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Goals */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Monthly Goals</h3>
            </div>
            <ul className="space-y-2">
              {month.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bonus Skills & Milestones */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Bonus Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {month.bonus_skills_to_work.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {month.milestone_check.length > 0 && (
              <>
                <div className="border-t border-border/50 pt-3 mt-3">
                  <h4 className="text-xs font-semibold text-foreground mb-2">Milestone Checks</h4>
                  <ul className="space-y-1">
                    {month.milestone_check.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Overview - Mobile */}
        {stats && (
          <div className="md:hidden mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-xl font-bold text-foreground">
                {stats.completedDays}/{stats.totalDays}
              </div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-xl font-bold text-foreground">
                {stats.completedTasks}/{stats.totalTasks}
              </div>
              <div className="text-xs text-muted-foreground">Tasks</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-xl font-bold text-primary">
                {stats.progressPercentage}%
              </div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
          </div>
        )}

        {/* Daily Training */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">28-Day Training Schedule</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your daily progress throughout the month
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {daysArray.map((day) => (
            <DayCard
              key={day.key}
              day={day}
              dayNumber={day.dayNumber}
              monthId={monthId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
