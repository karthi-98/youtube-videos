'use client'

import { useState } from 'react'
import { DayTraining } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Edit2, Save, X, RotateCcw } from 'lucide-react'
import { updateDayChecklist, updateDayNote, resetDayProgress } from '@/actions/training-actions'
import { cn } from '@/lib/utils'

interface DayCardProps {
  day: DayTraining
  dayNumber: number
  monthId: string
}

export function DayCard({ day, dayNumber, monthId }: DayCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(day.note || '')
  const [isLoading, setIsLoading] = useState(false)

  const allCompleted = day.checklist.every(item => item.completed)
  const completedCount = day.checklist.filter(item => item.completed).length
  const progressPercentage = (completedCount / day.checklist.length) * 100

  const handleChecklistToggle = async (index: number, completed: boolean) => {
    setIsLoading(true)
    await updateDayChecklist(monthId, dayNumber, index, completed)
    setIsLoading(false)
  }

  const handleSaveNote = async () => {
    setIsLoading(true)
    await updateDayNote(monthId, dayNumber, noteValue)
    setIsEditingNote(false)
    setIsLoading(false)
  }

  const handleReset = async () => {
    if (confirm(`Reset all progress for Day ${dayNumber}?`)) {
      setIsLoading(true)
      await resetDayProgress(monthId, dayNumber)
      setNoteValue('')
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border transition-all duration-300',
        allCompleted
          ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
          : 'border-border bg-card hover:shadow-md'
      )}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-xl overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500',
            allCompleted ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="p-6 pt-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                DAY {dayNumber}
              </span>
              <span className="text-xs text-muted-foreground">
                {day.dayName}
              </span>
              {allCompleted && (
                <CheckCircle2 className="size-5 text-green-500" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-1">
              {day.focus}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>{completedCount} / {day.checklist.length} completed</span>
              <span>•</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          {allCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
        </div>

        {/* Checklist */}
        <div className="space-y-2.5 mb-4">
          {day.checklist.map((item, index) => (
            <label
              key={index}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all',
                'hover:bg-accent/50',
                item.completed
                  ? 'bg-muted/50'
                  : 'bg-background'
              )}
            >
              <div className="mt-0.5">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) =>
                    handleChecklistToggle(index, checked as boolean)
                  }
                  disabled={isLoading}
                  className="size-5"
                />
              </div>
              <span
                className={cn(
                  'text-sm flex-1 leading-relaxed',
                  item.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                )}
              >
                {item.text}
              </span>
            </label>
          ))}
        </div>

        {/* Notes Section */}
        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">Daily Note</h4>
            {!isEditingNote && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNote(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="size-3.5" />
              </Button>
            )}
          </div>
          {isEditingNote ? (
            <div className="space-y-2">
              <Textarea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="How did today's training feel? Any observations?"
                className="min-h-[80px] text-sm resize-none"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveNote}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Save className="size-3.5 mr-1.5" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditingNote(false)
                    setNoteValue(day.note || '')
                  }}
                  disabled={isLoading}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {day.note || (
                <span className="italic">No notes yet. Click edit to add one.</span>
              )}
            </div>
          )}
        </div>

        {/* Completion timestamp */}
        {day.completedAt && (
          <div className="mt-3 text-xs text-muted-foreground text-center py-2 bg-muted/50 rounded-md">
            Completed on {new Date(day.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  )
}
