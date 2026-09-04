import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
  label = "Tools & Resources",
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  label?: string
}) {
  const { isMobile } = useSidebar()
  const location = useLocation()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={
                location.pathname === item.url
                  ? "bg-[#241411] text-white font-bold shadow-xs hover:bg-[#341B16] hover:text-white border border-[#44251F] font-serif"
                  : "text-neutral-700 hover:text-neutral-900 hover:bg-[#FDF2F5] font-serif"
              }
            >
              <NavLink to={item.url} className="flex items-center gap-2">
                <item.icon className="size-4 shrink-0" />
                <span className="font-serif">{item.name}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}