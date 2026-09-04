import { ChevronRight, type LucideIcon } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  label = "Core Features",
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: string
    items?: {
      title: string
      url: string
      badge?: string
    }[]
  }[]
  label?: string
}) {
  const location = useLocation()

  const isItemActive = (item: { url: string; items?: { url: string }[] }) => {
    if (location.pathname === item.url) return true
    if (item.items && item.items.some((sub) => location.pathname === sub.url)) return true
    return false
  }

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item)
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || active}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items && item.items.length > 0 ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-[#241411] text-white font-bold shadow-xs hover:bg-[#341B16] hover:text-white border border-[#44251F] font-serif"
                          : "text-neutral-700 hover:text-neutral-900 hover:bg-[#FDF2F5] font-serif"
                      }
                    >
                      {item.icon && <item.icon className={`size-4 shrink-0 ${active ? 'text-white' : ''}`} />}
                      <span className="font-medium truncate flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className={`shrink-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold font-serif ${
                          active 
                            ? "bg-white/15 text-white border border-white/20" 
                            : "bg-[#FDF2F5] text-neutral-800 border border-[#F5D5E2]"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="ml-1 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={
                      location.pathname === item.url
                        ? "bg-[#241411] text-white font-bold shadow-xs hover:bg-[#341B16] hover:text-white border border-[#44251F] font-serif"
                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[#FDF2F5] font-serif"
                    }
                  >
                    <NavLink to={item.url} className="flex items-center gap-2 w-full min-w-0">
                      {item.icon && <item.icon className={`size-4 shrink-0 ${location.pathname === item.url ? 'text-white' : ''}`} />}
                      <span className="font-medium truncate flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className={`shrink-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold font-serif ${
                          location.pathname === item.url
                            ? "bg-white/15 text-white border border-white/20"
                            : "bg-[#FDF2F5] text-neutral-800 border border-[#F5D5E2]"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                )}
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={
                                isSubActive
                                  ? "bg-[#241411] text-white font-bold border border-[#44251F]"
                                  : "hover:text-neutral-900 hover:bg-[#FDF2F5]"
                              }
                            >
                              <NavLink to={subItem.url}>
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <span className="ml-auto rounded bg-[#FDF2F5] text-neutral-800 border border-[#F5D5E2] px-1.5 py-0.5 text-[9px] font-semibold">
                                    {subItem.badge}
                                  </span>
                                )}
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}