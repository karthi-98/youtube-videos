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
          'group rounded-lg border border-border bg-card p-5 transition-all duration-200 cursor-pointer hover:shadow-sm hover:border-border/80',
          className
        )}
      >
        <div className="flex items-start gap-3 mb-2">
          <div className="rounded-md bg-primary/10 p-2 mt-0.5">
            <VideoIcon className="size-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-0.5 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
