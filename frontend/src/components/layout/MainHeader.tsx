import React, { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { DemoRoleSwitcher } from './DemoRoleSwitcher'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Bell, Sparkles, Command, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export const MainHeader: React.FC = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const notifications = [
    {
      id: '1',
      title: 'End-Sem Hall Tickets Live',
      desc: 'Eligible students can now generate official QR-verified admit cards.',
      time: '10m ago',
      unread: true
    },
    {
      id: '2',
      title: 'Statutory 75% Gate Active',
      desc: 'Automatic debarment locks active for attendance deficits.',
      time: '1h ago',
      unread: true
    },
    {
      id: '3',
      title: 'Fee Reconciliation Re-run',
      desc: 'All accounts verified against autonomous ledger.',
      time: '3h ago',
      unread: false
    }
  ]

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur-md px-4 sm:px-6 shadow-sm">
      {/* Left: Sidebar Trigger & Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        
        {/* Search Bar - Matching Titans EDU & Shikhaor style */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, exams, roll numbers, faculty..."
            className="w-full h-9 pl-9 pr-14 text-xs sm:text-sm rounded-full bg-muted/50 border border-border/80 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/70"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>

        {/* Academic Session Badge - Matching Titans EDU Header */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>Spring 2025 • End-Term Examination Phase</span>
        </div>
      </div>

      {/* Right: Quick Tools, Notifications, Persona & Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-border">
            <div className="p-3 border-b flex items-center justify-between">
              <span className="text-xs font-semibold">Institutional Notifications</span>
              <Badge variant="secondary" className="text-[10px] px-1.5">3 New</Badge>
            </div>
            <div className="divide-y max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 text-xs hover:bg-muted/50 transition-colors flex gap-2.5">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold leading-tight text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">{n.desc}</p>
                    <p className="text-[10px] text-muted-foreground/70 pt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Demo Role Switcher (PS-6 Evaluation tool) */}
        <DemoRoleSwitcher />

        {/* User Profile Chip - Matching Reference Images */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border/80">
          <Avatar className="h-8 w-8 rounded-full ring-2 ring-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`} />
            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:grid text-left text-xs leading-tight">
            <span className="font-semibold text-foreground truncate max-w-[120px]">{user?.name || 'User'}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{user?.role || 'student'}</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}