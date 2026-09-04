import React from 'react'
import { NavLink } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { GraduationCap, ShieldCheck, Briefcase } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getRoleNavigation } from './navigationData'

export const SidebarNavigation: React.FC = () => {
  const { user } = useAuth()
  
  const role = user?.role ?? "student"
  const { primary, secondary, portalTitle, groupLabel } = getRoleNavigation(role)

  const defaultRoleName = role === "admin" ? "Administrator" : role === "teacher" ? "Faculty Member" : "Student"
  const userData = {
    name: user?.name || defaultRoleName,
    email: user?.email || `${role}@university.edu`, 
    avatar: "/placeholder.svg",
  }

  // Header icon reflecting user role
  const HeaderIcon = role === "admin" ? ShieldCheck : role === "teacher" ? Briefcase : GraduationCap
  const homeLink = role === "admin" ? "/admin/overview" : "/"

  return (
    <Sidebar variant="inset" className="scrollbar-hide">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={homeLink}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <HeaderIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">CampusSync</span>
                  <span className="truncate text-xs text-muted-foreground">{portalTitle}</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-hide">
        {/* Impressive, high-value core features always on top */}
        <NavMain items={primary} label={groupLabel} />

        {/* Secondary productivity & wellness tools neatly organized below */}
        {secondary && secondary.length > 0 && (
          <NavProjects projects={secondary} label="Tools & Utilities" />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}