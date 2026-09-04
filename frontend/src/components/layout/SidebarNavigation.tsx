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

  const HeaderIcon = role === "admin" ? ShieldCheck : role === "teacher" ? Briefcase : GraduationCap
  const homeLink = role === "admin" ? "/admin/overview" : role === "teacher" ? "/teacher/attendance" : "/"

  return (
    <Sidebar variant="inset" className="scrollbar-hide">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={homeLink}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-[#241411] text-white border border-[#44251F] shadow-xs">
                  <svg className="size-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="8" cy="8" r="3.2" />
                    <circle cx="16" cy="8" r="3.2" />
                    <circle cx="8" cy="16" r="3.2" />
                    <circle cx="16" cy="16" r="3.2" />
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold tracking-tight font-serif text-neutral-900">Nexora</span>
                  <span className="truncate text-xs text-neutral-500 font-serif">{portalTitle}</span>
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

        {/* Titans EDU Reference: Library Space Card */}
        <div className="px-3 py-2 font-serif">
          <div className="rounded-2xl border border-[#F5D5E2] bg-[#FDF2F5] p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-serif">Library Space</span>
              <span className="inline-flex h-4 items-center rounded-full bg-emerald-500/10 px-1.5 text-[9px] font-semibold text-emerald-700">
                Hall 1
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight text-neutral-900 font-serif">Newly Arrived</p>
              <p className="text-[11px] text-neutral-600 line-clamp-1 mt-0.5 font-medium font-serif">Atomic Habits & Clean Code</p>
            </div>
            <NavLink 
              to="/courses/catalog"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] px-2.5 py-1.5 text-[11px] font-bold transition-colors shadow-xs font-serif"
            >
              Browse Library
            </NavLink>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}