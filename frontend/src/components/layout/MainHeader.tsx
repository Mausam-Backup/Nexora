import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { DemoRoleSwitcher } from './DemoRoleSwitcher'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Bell, 
  ArrowUpRight, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export const MainHeader: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const role = user?.role || 'student'

  // Dynamic role-based navigation links
  const navLinks = role === 'admin' 
    ? [
        { label: 'Overview', to: '/admin/overview' },
        { label: 'Students', to: '/admin/manage-students' },
        { label: 'Faculty', to: '/admin/manage-teachers' },
        { label: 'Billing', to: '/admin/billing' },
        { label: 'Subjects', to: '/admin/subjects' },
      ]
    : role === 'teacher'
    ? [
        { label: 'Overview', to: '/teacher' },
        { label: 'Attendance', to: '/teacher/attendance' },
        { label: 'Classes', to: '/teacher/my-classes' },
        { label: 'Marks', to: '/teacher/upload-marks' },
        { label: 'Timetable', to: '/teacher/timetable' },
      ]
    : [
        { label: 'Dashboard', to: '/' },
        { label: 'Academics', to: '/view-marks' },
        { label: 'Attendance', to: '/attendance/student' },
        { label: 'Exams', to: '/schedule/exams' },
        { label: 'Billing', to: '/billing-payments' },
      ]

  const notifications = [
    {
      id: '1',
      title: 'End-Sem Hall Tickets Live',
      desc: 'Eligible students can now generate official QR-verified admit cards.',
      time: '10m ago',
    },
    {
      id: '2',
      title: 'Statutory 75% Gate Active',
      desc: 'Automatic debarment locks active for attendance deficits.',
      time: '1h ago',
    },
    {
      id: '3',
      title: 'Ledger Audit Synchronized',
      desc: 'All accounts verified against autonomous ledger with 0 anomalies.',
      time: '3h ago',
    }
  ]

  const roleCapsuleLabel = role === 'admin' 
    ? 'Admin Console' 
    : role === 'teacher' 
    ? 'Faculty Portal' 
    : 'Student Portal'

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3 pb-2 select-none">
      {/* Floating Capsule Header Container (Faithful to Reference Image 1) */}
      <div className="mx-auto max-w-6xl w-full rounded-full bg-[#111111] text-white border border-neutral-800 shadow-2xl px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-4 transition-all">
        
        {/* Left: Brand Identity & Geometric Clover Logo (Exactly matching Reference Image 1) */}
        <Link 
          to={role === 'admin' ? '/admin/overview' : role === 'teacher' ? '/teacher' : '/'} 
          className="flex items-center gap-2.5 group shrink-0"
          title="Nexora ERP by Digion"
        >
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white flex items-center justify-center text-black shadow-sm group-hover:scale-105 transition-transform shrink-0">
            {/* Geometric 4-circle clover emblem matching Reference Image 1 */}
            <svg className="h-4 w-4 sm:h-4.5 sm:w-4.5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="8" r="3.2" />
              <circle cx="16" cy="8" r="3.2" />
              <circle cx="8" cy="16" r="3.2" />
              <circle cx="16" cy="16" r="3.2" />
            </svg>
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white font-serif">
            Digion
          </span>
        </Link>

        {/* Center: Perfectly Spaced Navigation Links (5 Items, Exactly matching Reference Image 1) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-xs sm:text-sm font-medium text-neutral-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`transition-colors hover:text-white py-1 relative whitespace-nowrap ${
                  isActive 
                    ? 'text-white font-bold after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-white' 
                    : 'text-neutral-400'
                }`}
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Right: Capsule Action Button "Contact Us ↗" Style + Quick Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sidebar Navigation Toggle Button */}
          <div className="[&_button]:h-8 [&_button]:w-8 [&_button]:rounded-full [&_button]:bg-neutral-900/80 [&_button]:border [&_button]:border-neutral-800 [&_button]:text-neutral-400 hover:[&_button]:text-white hover:[&_button]:bg-neutral-800">
            <SidebarTrigger title="Toggle Navigation Sidebar" />
          </div>

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative h-8 w-8 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center transition-colors"
                title="Institutional Notifications"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#111111] animate-pulse" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-neutral-800 bg-[#111111] text-white">
              <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-bold font-serif">Notifications</span>
                <Badge variant="outline" className="text-[10px] border-neutral-700 text-neutral-300">3 Unread</Badge>
              </div>
              <div className="divide-y divide-neutral-800/80 max-h-72 overflow-y-auto text-xs">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-neutral-900/60 transition-colors space-y-0.5">
                    <p className="font-bold text-white leading-tight">{n.title}</p>
                    <p className="text-[11px] text-neutral-400 leading-snug">{n.desc}</p>
                    <p className="text-[10px] text-neutral-500 pt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Toggle in dark pill */}
          <div className="[&_button]:h-8 [&_button]:w-8 [&_button]:rounded-full [&_button]:bg-neutral-900/80 [&_button]:border [&_button]:border-neutral-800 [&_button]:text-neutral-400 hover:[&_button]:text-white hover:[&_button]:bg-neutral-800">
            <ThemeToggle />
          </div>

          {/* Reference Image 1 Capsule Button: "Contact Us ↗" Style */}
          <DemoRoleSwitcher
            hideBadges={true}
            customTrigger={
              <button
                type="button"
                className="rounded-full bg-[#242424] hover:bg-[#2e2e2e] text-white border border-neutral-700/80 pl-3.5 sm:pl-4 pr-1.5 py-1 flex items-center gap-2 sm:gap-2.5 text-xs font-semibold transition-all shadow-md group hover:border-neutral-500 cursor-pointer shrink-0"
              >
                <span className="whitespace-nowrap font-medium tracking-tight">
                  {roleCapsuleLabel}
                </span>
                <span className="h-6 w-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </button>
            }
          />

          {/* Mobile Navigation Toggle (for screens < lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Zero overflow) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-auto max-w-6xl w-full rounded-2xl bg-[#111111] border border-neutral-800 shadow-2xl p-4 space-y-2 text-xs font-semibold animate-in fade-in-50 duration-200">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider px-2 font-serif">Quick Navigation</div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-xl transition-colors ${
                  location.pathname === link.to ? 'bg-white/15 text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default MainHeader