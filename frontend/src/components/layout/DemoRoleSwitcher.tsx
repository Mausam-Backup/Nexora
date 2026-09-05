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
import { 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles,
  Layers,
  Gavel,
  ExternalLink,
  CheckCheck
} from 'lucide-react'
import { toast } from 'sonner'

interface DemoRoleSwitcherProps {
  customTrigger?: React.ReactNode
  hideBadges?: boolean
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ customTrigger, hideBadges = false }) => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const { students, resetToDefaultData, runIntegrityAudit, serverConnected } = useERPData()

  const issues = runIntegrityAudit()
  const isFullyReconciled = issues.length === 0

  const handleSwitchToJudge = () => {
    login({
      id: 'judge_master',
      name: 'Hackathon Senior Judge (Master Auditor)',
      email: 'judge.evaluator@hackathon.org',
      role: 'admin',
      collegeName: 'Nexora Evaluation Council'
    })
    toast.success("Logged in as Hackathon Judge Persona (Full Unrestricted Access)")
    navigate('/admin/overview')
  }

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
    navigate('/teacher')
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
    navigate('/student/dashboard')
  }

  const handleOpenSplitView = () => {
    // Open Teacher attendance and Student mark views side-by-side
    const teacherUrl = `${window.location.origin}/teacher/attendance`
    const studentUrl = `${window.location.origin}/view-marks`
    
    window.open(teacherUrl, 'TeacherPortal', 'width=700,height=800,left=50,top=50')
    setTimeout(() => {
      window.open(studentUrl, 'StudentPortal', 'width=700,height=800,left=760,top=50')
    }, 200)

    toast.info("Opening Split View (Dual Live Sync)", {
      description: "Window 1 (Faculty Attendance) & Window 2 (Student Portal). Modifying records in one updates the other instantly via BroadcastChannel!"
    })
  }

  const handleRunAudit = () => {
    const auditIssues = runIntegrityAudit()
    if (auditIssues.length === 0) {
      toast.success("Zero data anomalies found! All records, attendance, fees, and exam hall tickets are 100% reconciled.")
    } else {
      toast.warning(`Institutional Audit detected ${auditIssues.length} compliance anomalies!`, {
        description: auditIssues.map(i => i.description).join("; ")
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
    <div className="flex items-center gap-2">
      {!hideBadges && (
        <>
          {/* Backend Express REST Health Indicator */}
          <div 
            className={`hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border ${
              serverConnected
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                : 'bg-muted text-muted-foreground border-border'
            }`}
            title="Status of backend Express REST persistence service (http://localhost:5001/api/erp/health)"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${serverConnected ? 'bg-blue-500 animate-ping' : 'bg-muted-foreground'}`} />
            <span>{serverConnected ? 'REST: Synced' : 'REST: Offline Cache'}</span>
          </div>

          {/* Live Anti-Mismatch Reconciliation Status Badge */}
          <div 
            onClick={handleRunAudit}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
              isFullyReconciled 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
            }`}
            title="Click to execute real-time cross-module audit"
          >
            <span className={`w-2 h-2 rounded-full ${isFullyReconciled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isFullyReconciled ? 'Audit: 100% Reconciled' : `Audit: ${issues.length} Anomalies`}</span>
          </div>

          {/* Quick Judge Split View Launcher */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenSplitView}
            className="hidden md:flex items-center gap-1.5 h-9 text-xs border-primary/30 hover:bg-primary/10"
            title="Open dual browser windows to demonstrate real-time cross-module synchronization"
          >
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>Judge Split View</span>
          </Button>
        </>
      )}

      {/* Main Role Dropdown Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {customTrigger || (
            <Button variant="outline" size="sm" className="h-9 px-2.5 gap-2 border-primary/40 bg-background/80 backdrop-blur-sm shadow-sm hover:border-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="font-semibold text-xs hidden sm:inline">Role:</span>
              <Badge variant={getRoleBadgeVariant()} className="text-[10px] px-1.5 py-0 uppercase">
                {user?.role || 'student'}
              </Badge>
              <span className="text-xs font-medium max-w-[100px] truncate hidden md:inline">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-2">
          <DropdownMenuLabel className="flex items-center justify-between text-xs text-muted-foreground font-normal">
            <span>Hackathon Evaluation Hub</span>
            <span className="text-[10px] font-mono bg-muted px-1 rounded">PS-6 ERP</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Master Judge Mode */}
          <DropdownMenuItem onClick={handleSwitchToJudge} className="cursor-pointer py-2 px-2.5 rounded-md bg-primary/10 hover:bg-primary/20 mb-1 border border-primary/30">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-primary text-primary-foreground mt-0.5">
                <Gavel className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                  Login as Hackathon Judge
                  <Badge className="text-[9px] bg-primary text-primary-foreground">Super Access</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Full cross-portal oversight, audit tools & live split view</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Admin Option */}
          <DropdownMenuItem onClick={handleSwitchToAdmin} className="cursor-pointer py-2 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Admin (Dr. Sharma - Dean)
                  <Badge variant="outline" className="text-[9px] border-red-300 text-red-700">Dean</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Spreadsheet audit ledger, student registry, fees</p>
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
                <p className="text-[11px] text-muted-foreground">Class roll call attendance, marks entry, class schedule</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal py-1">
            Student Cross-Module Edge Cases:
          </DropdownMenuLabel>

          {/* Student 1: Cleared */}
          <DropdownMenuItem onClick={() => handleSwitchToStudent('20CS001', 'Fully Cleared')} className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Aarav Sharma (20CS001)
                  <Badge className="text-[9px] bg-emerald-600 text-white">All Clear</Badge>
                </div>
                <p className="text-[10.5px] text-muted-foreground">88.9% Attendance • ₹0 Due • Hall Ticket Released</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Student 2: Debarred */}
          <DropdownMenuItem onClick={() => handleSwitchToStudent('20CS003', 'Debarred')} className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Rahul Gupta (20CS003)
                  <Badge variant="destructive" className="text-[9px]">Debarred</Badge>
                </div>
                <p className="text-[10.5px] text-muted-foreground">64.1% Attendance (&lt;75%) • ₹7k Due • Hall Ticket Blocked</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Student 3: Financial Hold */}
          <DropdownMenuItem onClick={() => handleSwitchToStudent('20CS004', 'Fee Hold')} className="cursor-pointer py-1.5 px-2.5 rounded-md hover:bg-muted/80">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mt-0.5">
                <GraduationCap className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  Priya Singh (20CS004)
                  <Badge variant="outline" className="text-[9px] border-amber-400 text-amber-600">Fee Hold</Badge>
                </div>
                <p className="text-[10.5px] text-muted-foreground">92% Attendance • ₹37k Overdue • Transcript Held</p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Data Controls & Split View */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Button variant="ghost" size="sm" onClick={handleOpenSplitView} className="text-[11px] h-7 px-2 justify-start text-primary">
              <ExternalLink className="h-3 w-3 mr-1" />
              Split Demo View
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetData} className="text-[11px] h-7 px-2 justify-start text-muted-foreground hover:text-destructive">
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset DB
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

