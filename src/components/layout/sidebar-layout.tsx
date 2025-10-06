'use client'

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { PageTransition } from './page-transition'
import { VideoDocument } from '@/types'
import { Separator } from '@/components/ui/separator'

interface SidebarLayoutProps {
  children: React.ReactNode
  documents: VideoDocument[]
}

export function SidebarLayout({ children, documents }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar documents={documents} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold">YouTube Watch Later</h1>
        </header>
        <div className="flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
