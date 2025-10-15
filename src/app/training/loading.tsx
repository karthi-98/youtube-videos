import { Skeleton } from '@/components/ui/skeleton'
import { Dumbbell } from 'lucide-react'

export default function TrainingLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2.5 animate-pulse">
                <Dumbbell className="size-6 text-primary" />
              </div>
              <Skeleton className="h-10 w-96" />
            </div>
            <Skeleton className="h-20 w-full mb-6" />
            <div className="flex items-center gap-5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes Skeleton */}
      <div className="max-w-6xl mx-auto px-8 py-6 border-b border-border/50">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      {/* Months Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="size-10 rounded-md" />
              </div>
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="flex gap-2 pt-3 border-t border-border/50">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
