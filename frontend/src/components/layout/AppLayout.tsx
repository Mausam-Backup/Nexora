import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarNavigation } from './SidebarNavigation'
import { MainHeader } from './MainHeader'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F8F9FA]/60 dark:bg-[#0B0F19]/70 backdrop-blur-[2px] text-[#101828] dark:text-[#F9FAFB] transition-colors duration-200 shredder-bg">
        <SidebarNavigation />
        <main className="flex-1 overflow-hidden flex flex-col h-screen bg-transparent">
          <MainHeader />
          <div className="flex-1 overflow-y-auto space-y-4 p-4 md:p-8 pt-2">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}