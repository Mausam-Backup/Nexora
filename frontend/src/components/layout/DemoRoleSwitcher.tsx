import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useERPData } from '@/hooks/useERPData'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, GraduationCap, UserCheck, AlertCircle, RefreshCw, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export const DemoRoleSwitcher: React.FC = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const { students, resetToDefaultData, runIntegrityAudit } = useERPData()

  const handleSwitchToAdmin = () => {
    login({
      id: 'admin_001',
      name: 'Dr. R. K. Sharma (Dean Academics)',
      email: 'dean.academics@college.edu',
      role: 'admin',
      collegeName: 'Autonomous Institute of Technology'
    })
    toast.success("Switched to Administrator Persona (Dr. R. K. Sharma)")
    navigate('/admin/overview')
  }

  const handleSwitchToTeacher = () => {
    login({
      id: 'teacher_001',
      name: 'Prof. Rajesh Verma (HOD CSE)',
      email: 'r.verma@college.edu',
      role: 'teacher',
      branch: 'Computer Science and Engineering',
      subjects: ['CS301', 'CS302', 'CS304']
    })
    toast.success("Switched to Faculty Persona (Prof. Rajesh Verma)")
    navigate('/teacher/attendance')
  }

  const handleSwitchToStudent = (studentId: string, label: string) => {
    const s = students.find(item => item.id === studentId || item.rollNumber === studentId) || students[0]
    login({
      id: s.id,
      name: s.name,
      email: s.email,
      role: 'student',
      semester: s.semester,
      branch: s.department
    })
    toast.success(`Switched to Student Persona: ${s.name} (${label})`)
    navigate('/')
  }

  const handleRunAudit = () => {
    const issues = runIntegrityAudit()
    if (issues.length === 0) {
      toast.success("Zero data anomalies found! All records, attendance, fees, and exam hall tickets are 100% reconciled.")
    } else {
      toast.warning(`Institutional Audit detected ${issues.length} compliance anomalies!`, {
        description: issues.map(i => i.description).join("; ")
      })
    }
  }

  const handleResetData = () => {
    resetToDefaultData()
    toast.success("ERP institutional database reset to factory seed data.")
  }

  const getRoleBadgeVariant = () => {
    if (user?.role === 'admin') return 'destructive'
    if (user?.role === 'teacher') return 'default'
    return 'secondary'
  }

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-2.5 gap-2 border-primary/40 bg-background/80 backdrop-blur-sm shadow-sm hover:border-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="font-semibold text-xs hidden sm:inline">Role Switcher:</span>
            <Badge variant={getRoleBadgeVariant()} className="text-[10px] px-1.5 py-0 uppercase">
              {user?.role || 'student'}
            </Badge>
            <span className="text-xs font-medium max-w-[100px] truncate hidden md:inline">
              {user?.name?.split(' ')[0]}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-2">
          <DropdownMenuLabel className="flex items-center justify-between text-xs text-muted-foreground font-normal">
            <span>Hackathon Demo Switcher</span>
            <span className="text-[10px] font-mono bg-muted px-1 rounded">PS-6 ERP</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Admin Option */}
          <DropdownMenuItem onClick={handleSwitchToAdmin} className="cursor-pointer py-2 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Admin (Dr. Sharma - Dean)
                  <Badge variant="outline" className="text-[9px] border-red-300 text-red-700">Full Access</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Manage students, institutional fees, exam schedules</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Faculty Option */}
          <DropdownMenuItem onClick={handleSwitchToTeacher} className="cursor-pointer py-2 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-0.5">
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Faculty (Prof. Rajesh Verma)
                  <Badge variant="outline" className="text-[9px] border-blue-300 text-blue-700">Faculty</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Take class attendance, upload marks, view roster</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal py-1">
            Student Persona Scenarios (Cross-Module Demos):
          </DropdownMenuLabel>

          {/* Student 1: Cleared */}
          <DropdownMenuItem onClick={() => handleSwitchToStudent('20CS001', 'Fully Cleared')} className="cursor-pointer py-2 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Aarav Sharma (20CS001)
                  <Badge className="text-[9px] bg-emerald-600 text-white">All Clear</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">88.9% Attendance • ₹0 Due • Hall Ticket Active</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Student 2: Debarred */}
          <DropdownMenuItem onClick={() => handleSwitchToStudent('20CS003', 'Debarred')} className="cursor-pointer py-2 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mt-0.5">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Rahul Gupta (20CS003)
                  <Badge variant="destructive" className="text-[9px]">Debarred</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">64.1% Attendance (&lt;75%) • ₹7,000 Due • Hall Ticket Locked</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Student 3: Financial Hold */}
          <DropdownMenuItem onClick={() => handleSwitchToStudent('20CS004', 'Fee Hold')} className="cursor-pointer py-2 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 mt-0.5">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Priya Singh (20CS004)
                  <Badge variant="outline" className="text-[9px] border-rose-400 text-rose-600">Fee Hold</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">92% Attendance • ₹37,000 Overdue • Admit Card Blocked</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Data Controls */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Button variant="ghost" size="sm" onClick={handleRunAudit} className="text-[11px] h-7 px-2 justify-start">
              <ShieldCheck className="h-3 w-3 mr-1 text-primary" />
              Audit Integrity
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetData} className="text-[11px] h-7 px-2 justify-start text-muted-foreground hover:text-destructive">
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset Data
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
