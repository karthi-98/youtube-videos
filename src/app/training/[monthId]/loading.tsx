import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function MonthLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2" disabled>
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-7 w-64" />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-12 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>

        {/* Progress Mobile Skeleton */}
        <div className="md:hidden mb-6 grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Day Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card">
              <div className="p-6 pt-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="space-y-2.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-12 rounded-lg" />
                  ))}
                </div>
                <div className="border-t border-border/50 pt-4">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
