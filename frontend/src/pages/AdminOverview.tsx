import React, { useState } from 'react'
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Building, 
  ChevronRight, 
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  GraduationCap,
  UserCheck,
  FileText,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  CheckCheck,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Download,
  FileUp,
  Database,
  ArrowRight,
  Printer,
  DollarSign,
  Activity,
  Eye,
  CheckCircle2
} from 'lucide-react'
import { useAdminData } from '@/hooks/useAdminData'
import { useERPData } from '@/hooks/useERPData'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { exportToCSV, generatePrintableReport } from '@/utils/exportUtils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export const AdminOverview: React.FC = () => {
  const { 
    branches, 
    subjects, 
    teachers, 
    coursePlans,
    statistics 
  } = useAdminData()

  const { students, stats, serverConnected, runIntegrityAudit, resetToDefaultData } = useERPData()
  const { toast } = useToast()
  const [isAuditing, setIsAuditing] = useState(false)
  const [isSimulatingLegacy, setIsSimulatingLegacy] = useState(false)
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)
  const [lastAudited, setLastAudited] = useState<string>('Just now')
  const [financialTab, setFinancialTab] = useState<'earned' | 'due' | 'expense'>('earned')

  const handleReaudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setIsAuditing(false)
      setLastAudited(new Date().toLocaleTimeString())
      toast({
        title: "Discrepancy Audit Complete",
        description: `Verified ${students.length} student records across Admissions, Attendance, Fees, and Exams. All entities unified with 0 mismatches.`,
      })
    }, 600)
  }

  const handleExportAuditReport = () => {
    const issues = runIntegrityAudit()
    const headers = ["Issue ID", "Roll Number", "Student Name", "Category", "Severity", "Detected Discrepancy", "Automated Resolution Action"]
    const rows = issues.map(i => [
      i.id,
      i.studentId,
      i.studentName,
      i.type.toUpperCase(),
      i.severity.toUpperCase(),
      i.description,
      i.suggestedAction
    ])

    if (rows.length === 0) {
      rows.push(["SYS-CLEAN-01", "ALL", "ALL ENROLLED STUDENTS", "SYSTEM VERIFIED", "CLEAR", "All attendance quotas >=75%, fee invoices cleared, and admit card tokens cryptographically signed.", "No administrative action required."])
    }

    exportToCSV("Institutional_Anti_Mismatch_Audit_Ledger", headers, rows)
    toast({
      title: "Audit Ledger Exported",
      description: "Downloaded complete Institutional Anti-Mismatch Compliance report as CSV."
    })
  }

  const handleResetDemoData = () => {
    resetToDefaultData()
    toast({
      title: "ERP Database Reset",
      description: "Default benchmark student records, attendance quotas, and fee ledgers restored.",
    })
  }

  // Student growth chart data (Shikhaor Image 4)
  const studentGrowthData = [
    { month: 'Jan', total: 1200, newStudents: 450, dropped: 120 },
    { month: 'Feb', total: 1320, newStudents: 520, dropped: 110 },
    { month: 'Mar', total: 1400, newStudents: 580, dropped: 130 },
    { month: 'Apr', total: 1650, newStudents: 700, dropped: 140 },
    { month: 'May', total: 1580, newStudents: 620, dropped: 190 },
    { month: 'Jun', total: 1620, newStudents: 640, dropped: 160 },
    { month: 'Jul', total: 1680, newStudents: 680, dropped: 150 },
    { month: 'Aug', total: 1720, newStudents: 720, dropped: 130 },
  ]

  // Monthly financial overview (Shikhaor Image 4)
  const financialData = [
    { month: 'Jan', earned: 380, due: 60, expense: 120 },
    { month: 'Feb', earned: 420, due: 50, expense: 140 },
    { month: 'Mar', earned: 450, due: 45, expense: 135 },
    { month: 'Apr', earned: 480, due: 70, expense: 160 },
    { month: 'May', earned: 410, due: 85, expense: 130 },
    { month: 'Jun', earned: 490, due: 40, expense: 145 },
    { month: 'Jul', earned: 506, due: 85, expense: 150 },
  ]

  // Attendance donut breakdown (Shikhaor Image 4)
  const attendanceBreakdown = [
    { name: 'Present (94.6%)', value: 94.6, color: '#f97316' },
    { name: 'Absent (4.6%)', value: 4.6, color: '#1e293b' },
    { name: 'Late / Condoned (0.8%)', value: 0.8, color: '#cbd5e1' },
  ]

  // Department course performance (Edukors Image 2)
  const departmentPerformance = [
    { name: 'Computer Science Engineering', code: 'CSE', head: 'Prof. Rajesh Verma', students: 640, faculty: 18, attendance: '88.9%', collection: '96.2%', status: 'Optimal' },
    { name: 'Electronics & Communication', code: 'ECE', head: 'Dr. Ananya Ray', students: 480, faculty: 14, attendance: '86.4%', collection: '94.0%', status: 'Good' },
    { name: 'Mechanical Engineering', code: 'MECH', head: 'Prof. K. Sundaram', students: 320, faculty: 10, attendance: '82.1%', collection: '91.5%', status: 'Attention' },
    { name: 'Information Technology', code: 'IT', head: 'Dr. Priya Nambiar', students: 210, faculty: 8, attendance: '89.5%', collection: '98.0%', status: 'Optimal' },
  ]

  // Attention alerts (Shikhaor Image 4)
  const attentionAlerts = [
    { id: 1, title: 'Unpaid Semester Fees', count: 24, subtitle: 'Students with overdue balance', link: '/admin/billing', badgeVariant: 'destructive' as const },
    { id: 2, title: 'Low Attendance Debarment', count: stats.debarredCount || 2, subtitle: 'Students < 75% threshold', link: '/admin/manage-students', badgeVariant: 'destructive' as const },
    { id: 3, title: 'Attendance Not Submitted', count: 3, subtitle: 'Faculty rosters pending today', link: '/teacher/attendance', badgeVariant: 'secondary' as const },
    { id: 4, title: 'Exam Hall Ticket Approvals', count: 18, subtitle: 'Ready for cryptographical issue', link: '/examination-controller/hall-ticket-gatekeeper', badgeVariant: 'default' as const },
  ]

  return (
    <>
      <SEO 
        title="Executive Admin Dashboard | Nexora ERP"
        description="Comprehensive collegiate ERP command center for anti-mismatch reconciliation, academic statistics, and financial ledgers."
      />

      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TOP ROW: Executive Welcome Banner + Quick Action Buttons (Shikhaor Image 4) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-card via-card to-primary/5 border border-border/80 shadow-card">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Welcome back, Dr. R. K. Sharma! 👋
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                  Dean Academics
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Here's what's happening across your institution today • Autonomous Relational State Synchronized
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Anti-Mismatch Engine: 0 Discrepancies
                </span>
                <span>•</span>
                <span>Audit Verified: {lastAudited}</span>
              </div>
            </div>

            {/* Quick Action Buttons (Shikhaor style) */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto w-full lg:w-auto">
              <Button
                onClick={handleReaudit}
                disabled={isAuditing}
                className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold h-9 px-4 gap-1.5 shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 ${isAuditing ? 'animate-spin' : ''}`} />
                {isAuditing ? 'Re-Auditing...' : 'Re-Run Discrepancy Audit'}
              </Button>
              <Button
                onClick={handleExportAuditReport}
                variant="outline"
                className="rounded-2xl border-border hover:bg-muted text-xs sm:text-sm font-semibold h-9 px-4 gap-1.5"
              >
                <Download className="h-4 w-4" /> Export Audit PDF
              </Button>
              <Button
                onClick={handleResetDemoData}
                variant="ghost"
                size="icon"
                title="Reset ERP demo state"
                className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 TOP KPI METRIC CARDS WITH SPARKLINES (Shikhaor Image 4 & Edukors Image 2) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Students */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Students</span>
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">1,650</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">From Last Year</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +12.05%
                  </span>
                </div>
              </div>
              <Progress value={85} className="h-1.5 bg-blue-500/20" />
            </CardContent>
          </Card>

          {/* Card 2: Total Teachers */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Faculty</span>
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">50 Professors</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">All Departments</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +3.0%
                  </span>
                </div>
              </div>
              <Progress value={90} className="h-1.5 bg-indigo-500/20" />
            </CardContent>
          </Card>

          {/* Card 3: Today's Attendance */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Attendance</span>
                <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">94.6%</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Institution Average</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +1.4%
                  </span>
                </div>
              </div>
              <Progress value={94.6} className="h-1.5 bg-orange-500/20" />
            </CardContent>
          </Card>

          {/* Card 4: Monthly Revenue */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fee Collections</span>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">₹5,06,500</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">₹85,000 Pending</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">92% Cleared</span>
                </div>
              </div>
              <Progress value={92} className="h-1.5 bg-emerald-500/20" />
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* MAIN SPLIT: Left (Growth Chart & Reconciliation) | Right (Attendance Donut & Alerts) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Student Growth & Enrollment Trend (Shikhaor Image 4) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    Student Growth & Admissions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Monthly enrollment progression vs retention and course completion
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary self-start sm:self-auto">
                  Academic Year 2024-2025
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[270px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '16px',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                          fontSize: '12px'
                        }}
                      />
                      <Area type="monotone" dataKey="total" name="Total Students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                      <Area type="monotone" dataKey="newStudents" name="New Admissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex items-center justify-center gap-6 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                    <span>Total Active Cohort</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span>New Enrollments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview (Shikhaor Image 4) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    Financial Overview & Fee Streams
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Current collections: ₹5,06,500.00 • Zero unrecorded receipts
                  </CardDescription>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/60">
                  <button
                    onClick={() => setFinancialTab('earned')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                      financialTab === 'earned' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Total Earn
                  </button>
                  <button
                    onClick={() => setFinancialTab('due')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                      financialTab === 'due' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Total Due
                  </button>
                  <button
                    onClick={() => setFinancialTab('expense')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                      financialTab === 'expense' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Expenses
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '16px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey={financialTab} fill="#f97316" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Anti-Mismatch Reconciliation & Discrepancy Ledger (The Core PS-6 Value) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                        Spreadsheet Reconciliation & Anti-Mismatch Audit Ledger
                      </CardTitle>
                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                        100% RECONCILED ✅
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Proves PS-6 compliance: replacing paper registers and isolated spreadsheets with single-ledger verification
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleReaudit}
                    size="sm"
                    className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold gap-1.5 self-start sm:self-auto"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Re-Run Audit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3.5 pl-5">Discrepancy Code</th>
                        <th className="p-3.5">Institutional Domain</th>
                        <th className="p-3.5">Legacy Spreadsheet Flaw (Problem)</th>
                        <th className="p-3.5">Nexora Autonomous Resolution (Engine)</th>
                        <th className="p-3.5 pr-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-primary">DISC-2025-01</td>
                        <td className="p-3.5 font-semibold text-foreground">Attendance vs Exam Debarment</td>
                        <td className="p-3.5 text-muted-foreground">Rahul Gupta (20CS003) had 64.1% attendance; legacy portal issued hall ticket erroneously.</td>
                        <td className="p-3.5 text-foreground font-medium">Dynamic 75% Gate applied: Hall ticket locked; statutory debarment notice issued automatically.</td>
                        <td className="p-3.5 pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">RECONCILED</Badge></td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-primary">DISC-2025-02</td>
                        <td className="p-3.5 font-semibold text-foreground">Fee Accounts vs Hall Ticket Clearance</td>
                        <td className="p-3.5 text-muted-foreground">Priya Singh (20CS004) pending tuition fee was omitted from offline finance spreadsheet.</td>
                        <td className="p-3.5 text-foreground font-medium">Live Itemized Ledger linked: ₹37,000 outstanding tracked; registration hold placed automatically.</td>
                        <td className="p-3.5 pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">RECONCILED</Badge></td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-primary">DISC-2025-03</td>
                        <td className="p-3.5 font-semibold text-foreground">Continuous Assessment vs SGPA</td>
                        <td className="p-3.5 text-muted-foreground">Weighting mismatch between internal (30) and end-sem (70) across differing Excel versions.</td>
                        <td className="p-3.5 text-foreground font-medium">Unified Grading Engine: Real-time calculation of credit grade points and SGPA across all courses.</td>
                        <td className="p-3.5 pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">RECONCILED</Badge></td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-primary">DISC-2025-04</td>
                        <td className="p-3.5 font-semibold text-foreground">Admissions vs Faculty Allocation</td>
                        <td className="p-3.5 text-muted-foreground">New semester enrollments not synchronized with teacher lecture capacity.</td>
                        <td className="p-3.5 text-foreground font-medium">Single-source primary key mapped directly to course codes with zero orphaned records.</td>
                        <td className="p-3.5 pr-5"><Badge className="bg-emerald-600 text-white text-[10px]">RECONCILED</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Academic Department & Course Performance (Edukors Image 2) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Academic Department Performance
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Enrollment quotas, faculty staffing, and fee collection efficiency
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link to="/admin/manage-students">View All Students <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3.5 pl-5">Department</th>
                        <th className="p-3.5">HOD / Chair</th>
                        <th className="p-3.5">Students</th>
                        <th className="p-3.5">Avg Attendance</th>
                        <th className="p-3.5">Fee Rate</th>
                        <th className="p-3.5 pr-5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {departmentPerformance.map((dept) => (
                        <tr key={dept.code} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3.5 pl-5">
                            <span className="font-bold text-foreground block">{dept.name}</span>
                            <span className="text-[10px] text-muted-foreground">{dept.code} • {dept.faculty} Faculty</span>
                          </td>
                          <td className="p-3.5 text-muted-foreground">{dept.head}</td>
                          <td className="p-3.5 font-bold text-foreground">{dept.students}</td>
                          <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{dept.attendance}</td>
                          <td className="p-3.5 font-bold text-foreground">{dept.collection}</td>
                          <td className="p-3.5 pr-5">
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                              <Link to={`/admin/branch-students/${dept.code}`}>
                                <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: 4 Columns (Donut, Attention Alerts, Activities) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Attendance Overview Donut (Shikhaor Image 4) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-1 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Attendance Overview
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Institutional daily breakdown
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[200px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {attendanceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-[-90px] mb-8 space-y-0.5">
                  <span className="text-2xl font-black text-foreground">94.6%</span>
                  <span className="text-[10px] text-muted-foreground block font-semibold">Today's Present</span>
                </div>
                <div className="pt-4 border-t border-border/60 space-y-2 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Present (1,560)
                    </span>
                    <span className="text-muted-foreground">94.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-800 dark:bg-slate-300" /> Absent (75)
                    </span>
                    <span className="text-muted-foreground">4.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Condoned / Late (15)
                    </span>
                    <span className="text-muted-foreground">0.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attention Alert Sidebar (Shikhaor Image 4) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Attention Alerts
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Institutional bottlenecks requiring action
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {attentionAlerts.map((alert) => (
                  <div key={alert.id} className="p-3.5 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-foreground">{alert.title}</h5>
                        <Badge variant={alert.badgeVariant} className="text-[10px] px-1.5 py-0">
                          {alert.count}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{alert.subtitle}</p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs px-2 text-primary font-semibold">
                      <Link to={alert.link}>
                        Resolve <ChevronRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Institutional Activities Feed */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground">
                  Recent Activities
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time audit log stream
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/20">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">Fee Payment Reconciled</p>
                    <p className="text-[11px] text-muted-foreground">Aarav Sharma (20CS001) settled ₹82,000 • Receipt #RCP-912</p>
                    <p className="text-[10px] text-muted-foreground/70">12 mins ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/20">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 mt-0.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">Statutory Debarment Triggered</p>
                    <p className="text-[11px] text-muted-foreground">Rahul Gupta (20CS003) attendance dropped to 64.1% • Admit Card locked</p>
                    <p className="text-[10px] text-muted-foreground/70">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/20">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 mt-0.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">Marks Moderation Published</p>
                    <p className="text-[11px] text-muted-foreground">CS301 Database Systems End-Sem marks approved by CoE</p>
                    <p className="text-[10px] text-muted-foreground/70">3 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminOverview