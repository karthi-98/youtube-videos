import { getTrainingMonths } from '@/actions/training-actions'
import { Card } from '@/components/ui/card'
import { Dumbbell, Calendar, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function TrainingPage() {
  const result = await getTrainingMonths()

  if (!result.success || !result.months) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <p className="text-destructive">Failed to load training program. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Dumbbell className="size-6 text-primary" />
              </div>
              <h1 className="text-4xl font-semibold text-foreground">
                15-Month Planche Mastery
              </h1>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Your comprehensive journey from beginner to full planche mastery.
              Track your daily progress, mark completed exercises, and add personal notes
              to document your transformation over 15 months.
            </p>
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span>6 Days/Week</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <span>Full Planche Goal</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span>Progressive Overload</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="max-w-6xl mx-auto px-8 py-6 border-b border-border/50">
        <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary"></span>
            Important Training Guidelines
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1.5 ml-4">
            <li>• Always warm up for 10-15 minutes before training</li>
            <li>• Focus on form over reps/time</li>
            <li>• If you feel pain (not fatigue), rest immediately</li>
            <li>• Sleep 7-9 hours per night for recovery</li>
            <li>• Stay hydrated and eat adequate protein</li>
          </ul>
        </div>
      </div>

      {/* Months Grid */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Training Months</h2>
          <p className="text-sm text-muted-foreground">
            Select a month to view and track your weekly training schedule
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.months.map((month) => (
            <Link key={month.id} href={`/training/${month.id}`}>
              <div className="group rounded-lg border border-border bg-card p-5 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-medium text-primary mb-1">
                      MONTH {month.month}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {month.phase}
                    </h3>
                  </div>
                  <div className="rounded-md bg-primary/10 p-2">
                    <Calendar className="size-4 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Goals:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {month.goals.slice(0, 2).map((goal, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                      {month.goals.length > 2 && (
                        <li className="text-primary text-xs">
                          +{month.goals.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {month.bonus_skills_to_work.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                    {month.bonus_skills_to_work.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
