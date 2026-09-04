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
                          ? "bg-[#5EA6EB]/10 text-[#5EA6EB] font-bold dark:bg-[#5EA6EB]/15 dark:text-[#5EA6EB]"
                          : "text-[#475467] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-[#F9FAFB]"
                      }
                    >
                      {item.icon && <item.icon className={`size-4 shrink-0 ${active ? 'text-[#5EA6EB]' : ''}`} />}
                      <span className="font-medium truncate flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className="shrink-0 whitespace-nowrap rounded bg-[#5EA6EB]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#5EA6EB]">
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
                        ? "bg-[#5EA6EB]/10 text-[#5EA6EB] font-bold dark:bg-[#5EA6EB]/15 dark:text-[#5EA6EB]"
                        : "text-[#475467] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-[#F9FAFB]"
                    }
                  >
                    <NavLink to={item.url} className="flex items-center gap-2 w-full min-w-0">
                      {item.icon && <item.icon className={`size-4 shrink-0 ${location.pathname === item.url ? 'text-[#5EA6EB]' : ''}`} />}
                      <span className="font-medium truncate flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className="shrink-0 whitespace-nowrap rounded bg-[#5EA6EB]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#5EA6EB]">
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
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : ""
                              }
                            >
                              <NavLink to={subItem.url}>
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
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