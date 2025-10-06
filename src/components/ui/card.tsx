import Link from 'next/link'
import { cn } from '@/lib/utils'
import { VideoIcon } from 'lucide-react'

interface CardProps {
  title: string
  href: string
  subtitle?: string
  className?: string
}

export function Card({ title, href, subtitle, className }: CardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          'rounded-lg border border-border p-6 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer bg-card hover:bg-accent/50',
          className
        )}
      >
        <div className="flex items-start gap-3 mb-2">
          <VideoIcon className="size-5 text-primary mt-0.5" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground ml-8">{subtitle}</p>}
      </div>
    </Link>
  )
}
