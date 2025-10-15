'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Database, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSeed = async () => {
    setStatus('loading')
    setMessage('')

    try {
      const { seedTrainingData } = await import('@/lib/seed-training')
      const result = await seedTrainingData()

      if (result.success) {
        setStatus('success')
        setMessage(result.message || 'Data seeded successfully!')
      } else {
        setStatus('error')
        setMessage(result.error || 'Failed to seed data')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An unexpected error occurred')
      console.error('Seed error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
            <Database className="size-8 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Seed Training Data
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            This will populate your Firebase database with the 15-month planche training program.
          </p>

          <Button
            onClick={handleSeed}
            disabled={status === 'loading'}
            className="w-full mb-4"
            size="lg"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database className="size-4 mr-2" />
                Seed Database
              </>
            )}
          </Button>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-md">
              <CheckCircle2 className="size-4" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
              <XCircle className="size-4" />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                Data seeded successfully! You can now:
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <a href="/training">Go to Training</a>
                </Button>
                <Button variant="ghost" asChild>
                  <a href="/">Go Home</a>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>⚠️ Warning: This will overwrite existing training data</p>
        </div>
      </div>
    </div>
  )
}
