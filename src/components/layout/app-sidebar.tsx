'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { VideoIcon, HomeIcon, PlaySquare, FolderOpen } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { VideoDocument } from '@/types'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
  documents: VideoDocument[]
}

export function AppSidebar({ documents }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 px-6 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
            <PlaySquare className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-foreground">Watch Later</h2>
            <p className="text-xs text-muted-foreground">YouTube Manager</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === '/'
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Link href="/" className="flex items-center gap-3">
                    <HomeIcon className="size-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <FolderOpen className="size-3.5" />
            Collections
            {documents.length > 0 && (
              <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-md">
                {documents.length}
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documents.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-xs text-muted-foreground">No collections yet</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/video/${doc.id}`}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === `/video/${doc.id}`
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Link href={`/video/${doc.id}`} className="flex items-center gap-3">
                        <div className="rounded bg-muted p-1">
                          <VideoIcon className="size-3.5" />
                        </div>
                        <span className="truncate">{doc.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 px-6 py-4">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-0.5">YouTube Watch Later</p>
          <p>Manage your videos efficiently</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
