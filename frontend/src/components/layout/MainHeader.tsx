import React from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { DemoRoleSwitcher } from './DemoRoleSwitcher'

export const MainHeader: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="ml-auto flex items-center gap-3">
        <DemoRoleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}