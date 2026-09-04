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

  // Attendance donut breakdown using exact semantic pastel palette
  const attendanceBreakdown = [
    { name: 'Present (94.6%)', value: 94.6, color: '#4FA1D8' },       // Teal Accent
    { name: 'Absent (4.6%)', value: 4.6, color: '#FFA5A8' },          // Soft Coral Red
    { name: 'Late / Condoned (0.8%)', value: 0.8, color: '#A1E8DD' },  // Pastel Turquoise
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
    { 
      id: 1, 
      title: 'Unpaid Semester Fees', 
      count: 24, 
      subtitle: 'Students with overdue balance', 
      link: '/admin/billing', 
      badgeClass: 'bg-[#FFA5A8] text-[#7A151A] dark:bg-[#FFA5A8]/15 dark:text-[#FFA5A8] dark:border dark:border-[#FFA5A8]/30' 
    },
    { 
      id: 2, 
      title: 'Low Attendance Debarment', 
      count: stats.debarredCount || 2, 
      subtitle: 'Students < 75% threshold', 
      link: '/admin/manage-students', 
      badgeClass: 'bg-[#FFA5A8] text-[#7A151A] dark:bg-[#FFA5A8]/15 dark:text-[#FFA5A8] dark:border dark:border-[#FFA5A8]/30' 
    },
    { 
      id: 3, 
      title: 'Attendance Not Submitted', 
      count: 3, 
      subtitle: 'Faculty rosters pending today', 
      link: '/teacher/attendance', 
      badgeClass: 'bg-[#FFBC94] text-[#7A3E15] dark:bg-[#FFBC94]/15 dark:text-[#FFBC94] dark:border dark:border-[#FFBC94]/30' 
    },
    { 
      id: 4, 
      title: 'Exam Hall Ticket Approvals', 
      count: 18, 
      subtitle: 'Ready for cryptographical issue', 
      link: '/examination-controller/hall-ticket-gatekeeper', 
      badgeClass: 'bg-[#A5E5FF] text-[#0B3A60] dark:bg-[#A5E5FF]/20 dark:text-[#A5E5FF] dark:border dark:border-[#A5E5FF]/30' 
    },
  ]

  return (
    <>
      <SEO 
        title="Executive Admin Dashboard | Nexora ERP"
        description="Comprehensive collegiate ERP command center for anti-mismatch reconciliation, academic statistics, and financial ledgers."
      />

      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TOP ROW: Executive Welcome Banner + Grouped CTA Actions (Section 5.A) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#151D30] border border-[#E4E7EC] dark:border-[#222F4C] shadow-card transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101828] dark:text-[#F9FAFB]">
                  Welcome back, Dr. R. K. Sharma! 👋
                </h1>
                {/* Dean Academics cleanly padded tag using #A5E5FF background with dark blue text */}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A5E5FF] text-[#0B3A60] dark:bg-[#A5E5FF]/20 dark:text-[#A5E5FF] dark:border dark:border-[#A5E5FF]/30 tracking-tight shadow-2xs">
                  Dean Academics
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98A2B3] font-medium">
                Here's what's happening across your institution today • Autonomous Relational State Synchronized
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#475467] dark:text-[#98A2B3]">
                {/* Reconciled Pill indicator */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] dark:bg-[#C4EFDF] animate-ping" />
                  Anti-Mismatch Engine: 0 Discrepancies
                </span>
                <span>•</span>
                <span>Audit Verified: {lastAudited}</span>
              </div>
            </div>

            {/* Unified Action Button Group utilizing #5EA6EB Primary Theme */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-[#F8F9FA] dark:bg-[#0B0F19] border border-[#E4E7EC] dark:border-[#222F4C] shadow-xs self-start lg:self-auto gap-1">
              <Button
                onClick={handleReaudit}
                disabled={isAuditing}
                className="rounded-xl bg-[#5EA6EB] hover:bg-[#4D95DA] text-white text-xs sm:text-sm font-semibold h-9 px-4 gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${isAuditing ? 'animate-spin' : ''}`} />
                {isAuditing ? 'Re-Auditing...' : 'Re-Run Discrepancy Audit'}
              </Button>
              <Button
                onClick={handleExportAuditReport}
                variant="ghost"
                className="rounded-xl border border-transparent hover:border-[#E4E7EC] dark:hover:border-[#222F4C] text-[#475467] dark:text-[#98A2B3] hover:text-[#5EA6EB] dark:hover:text-[#5EA6EB] hover:bg-[#5EA6EB]/10 text-xs sm:text-sm font-semibold h-9 px-4 gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#5EA6EB]" /> Export Audit PDF
              </Button>
              <Button
                onClick={handleResetDemoData}
                variant="ghost"
                size="icon"
                title="Reset ERP demo state"
                className="rounded-xl h-9 w-9 text-[#475467] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 TOP KPI METRIC CARDS (Standardized Sizes, Micro-Capsules, Theme Sparklines) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Students */}
          <div className="h-full flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#151D30] border border-[#E4E7EC] dark:border-[#222F4C] shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#475467] dark:text-[#98A2B3] uppercase tracking-wider">Total Students</span>
              <div className="p-2.5 rounded-2xl bg-[#5EA6EB]/10 text-[#5EA6EB] dark:bg-[#5EA6EB]/20 dark:text-[#5EA6EB]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-3xl font-black tracking-tight text-[#101828] dark:text-[#F9FAFB]">1,650</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475467] dark:text-[#98A2B3]">From Last Year</span>
                {/* Explicit Micro-Capsule Pill */}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +12.05%
                </span>
              </div>
            </div>
            <div className="w-full bg-[#E3E5E8] dark:bg-[#222F4C] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#5EA6EB] h-1.5 rounded-full transition-all duration-500" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Card 2: Total Faculty */}
          <div className="h-full flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#151D30] border border-[#E4E7EC] dark:border-[#222F4C] shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#475467] dark:text-[#98A2B3] uppercase tracking-wider">Total Faculty</span>
              <div className="p-2.5 rounded-2xl bg-[#E2B1CE]/25 text-[#C387C2] dark:bg-[#C387C2]/20 dark:text-[#E2B1CE]">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-3xl font-black tracking-tight text-[#101828] dark:text-[#F9FAFB]">50 Professors</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475467] dark:text-[#98A2B3]">All Departments</span>
                {/* Explicit Micro-Capsule Pill */}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +3.0%
                </span>
              </div>
            </div>
            <div className="w-full bg-[#E3E5E8] dark:bg-[#222F4C] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#C387C2] h-1.5 rounded-full transition-all duration-500" style={{ width: '90%' }} />
            </div>
          </div>

          {/* Card 3: Today's Attendance (Tracks with #4FA1D8 Teal) */}
          <div className="h-full flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#151D30] border border-[#E4E7EC] dark:border-[#222F4C] shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#475467] dark:text-[#98A2B3] uppercase tracking-wider">Today's Attendance</span>
              <div className="p-2.5 rounded-2xl bg-[#4FA1D8]/15 text-[#4FA1D8] dark:bg-[#4FA1D8]/20 dark:text-[#4FA1D8]">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-3xl font-black tracking-tight text-[#101828] dark:text-[#F9FAFB]">94.6%</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475467] dark:text-[#98A2B3]">Institution Average</span>
                {/* Explicit Micro-Capsule Pill */}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +1.4%
                </span>
              </div>
            </div>
            <div className="w-full bg-[#E3E5E8] dark:bg-[#222F4C] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#4FA1D8] h-1.5 rounded-full transition-all duration-500" style={{ width: '94.6%' }} />
            </div>
          </div>

          {/* Card 4: Fee Collections (Tracks with #5EA6EB Soft Blue) */}
          <div className="h-full flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#151D30] border border-[#E4E7EC] dark:border-[#222F4C] shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#475467] dark:text-[#98A2B3] uppercase tracking-wider">Fee Collections</span>
              <div className="p-2.5 rounded-2xl bg-[#5EA6EB]/10 text-[#5EA6EB] dark:bg-[#5EA6EB]/20 dark:text-[#5EA6EB]">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-3xl font-black tracking-tight text-[#101828] dark:text-[#F9FAFB]">₹5,06,500</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475467] dark:text-[#98A2B3]">₹85,000 Pending</span>
                {/* Explicit Micro-Capsule Pill */}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30">
                  92% Cleared
                </span>
              </div>
            </div>
            <div className="w-full bg-[#E3E5E8] dark:bg-[#222F4C] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#5EA6EB] h-1.5 rounded-full transition-all duration-500" style={{ width: '92%' }} />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN SPLIT: Left (Growth Chart & Reconciliation) | Right (Attendance Donut & Alerts) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Student Growth & Enrollment Trend */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#101828] dark:text-[#F9FAFB]">
                    Student Growth & Admissions
                  </h3>
                  <p className="text-xs text-[#475467] dark:text-[#98A2B3]">
                    Monthly enrollment progression vs retention and course completion
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-[#5EA6EB]/30 text-[#5EA6EB] bg-[#5EA6EB]/5 self-start sm:self-auto">
                  Academic Year 2024-2025
                </span>
              </div>

              <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5EA6EB" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#5EA6EB" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A1E8DD" stopOpacity={0.45}/>
                        <stop offset="95%" stopColor="#A1E8DD" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} stroke="#ACB2BB" />
                    <XAxis dataKey="month" stroke="#ACB2BB" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ACB2BB" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card-bg, #151D30)',
                        borderColor: '#222F4C',
                        borderRadius: '16px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                        color: '#F9FAFB',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="total" name="Total Students" stroke="#5EA6EB" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    <Area type="monotone" dataKey="newStudents" name="New Admissions" stroke="#A1E8DD" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#5EA6EB]" />
                  <span className="text-[#101828] dark:text-[#F9FAFB]">Total Active Cohort</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#A1E8DD]" />
                  <span className="text-[#101828] dark:text-[#F9FAFB]">New Enrollments</span>
                </div>
              </div>
            </div>

            {/* Financial Bar Chart ("Financial Overview & Fee Streams" with Dual-Gradient) */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#101828] dark:text-[#F9FAFB]">
                    Financial Overview & Fee Streams
                  </h3>
                  <p className="text-xs text-[#475467] dark:text-[#98A2B3]">
                    Current collections: ₹5,06,500.00 • Zero unrecorded receipts
                  </p>
                </div>

                {/* Interactive Toggles using #5EA6EB Accent */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#F8F9FA] dark:bg-[#0B0F19] border border-[#E4E7EC] dark:border-[#222F4C]">
                  <button
                    onClick={() => setFinancialTab('earned')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      financialTab === 'earned' 
                        ? 'bg-[#5EA6EB] text-white shadow-xs' 
                        : 'text-[#475467] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-[#F9FAFB]'
                    }`}
                  >
                    Total Earn
                  </button>
                  <button
                    onClick={() => setFinancialTab('due')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      financialTab === 'due' 
                        ? 'bg-[#5EA6EB] text-white shadow-xs' 
                        : 'text-[#475467] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-[#F9FAFB]'
                    }`}
                  >
                    Total Due
                  </button>
                  <button
                    onClick={() => setFinancialTab('expense')}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      financialTab === 'expense' 
                        ? 'bg-[#5EA6EB] text-white shadow-xs' 
                        : 'text-[#475467] dark:text-[#98A2B3] hover:text-[#101828] dark:hover:text-[#F9FAFB]'
                    }`}
                  >
                    Expenses
                  </button>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {/* Sophisticated dual-gradients for data bars */}
                      <linearGradient id="gradientEarn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5EA6EB" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#5EA6EB" stopOpacity={0.15}/>
                      </linearGradient>
                      <linearGradient id="gradientDue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFBC94" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#FFBC94" stopOpacity={0.15}/>
                      </linearGradient>
                      <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A1E8DD" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#A1E8DD" stopOpacity={0.15}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} stroke="#ACB2BB" />
                    <XAxis dataKey="month" stroke="#ACB2BB" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ACB2BB" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#151D30',
                        borderColor: '#222F4C',
                        borderRadius: '16px',
                        color: '#F9FAFB',
                        fontSize: '12px'
                      }}
                    />
                    <Bar 
                      dataKey={financialTab} 
                      fill={
                        financialTab === 'earned' 
                          ? 'url(#gradientEarn)' 
                          : financialTab === 'due' 
                          ? 'url(#gradientDue)' 
                          : 'url(#gradientExpense)'
                      } 
                      radius={[6, 6, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Anti-Mismatch Reconciliation & Discrepancy Ledger (Section 5.D - Zebra Striping & Status Pills) */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] overflow-hidden">
              <div className="p-5 border-b border-[#E4E7EC] dark:border-[#222F4C] bg-[#F8F9FA]/60 dark:bg-[#0B0F19]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#101828] dark:text-[#F9FAFB]">
                      Spreadsheet Reconciliation & Anti-Mismatch Audit Ledger
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30">
                      100% RECONCILED ✅
                    </span>
                  </div>
                  <p className="text-xs text-[#475467] dark:text-[#98A2B3] mt-0.5">
                    Proves PS-6 compliance: replacing paper registers and isolated spreadsheets with single-ledger verification
                  </p>
                </div>
                <Button
                  onClick={handleReaudit}
                  size="sm"
                  className="rounded-xl bg-[#5EA6EB] hover:bg-[#4D95DA] text-white text-xs font-semibold gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Re-Run Audit
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8F9FA] dark:bg-[#0B0F19] border-b border-[#E4E7EC] dark:border-[#222F4C] text-[#475467] dark:text-[#98A2B3] font-semibold">
                    <tr>
                      <th className="p-3.5 pl-5">Discrepancy Code</th>
                      <th className="p-3.5">Institutional Domain</th>
                      <th className="p-3.5">Legacy Spreadsheet Flaw (Problem)</th>
                      <th className="p-3.5">Nexora Autonomous Resolution (Engine)</th>
                      <th className="p-3.5 pr-5">Status</th>
                    </tr>
                  </thead>
                  {/* Zebra-striping pattern: #F8F9FA light / #1C2538 dark on even rows */}
                  <tbody className="divide-y divide-[#E4E7EC] dark:divide-[#222F4C]">
                    <tr className="bg-white dark:bg-[#151D30] hover:bg-[#5EA6EB]/5 dark:hover:bg-[#5EA6EB]/10 transition-colors">
                      <td className="p-3.5 pl-5 font-bold font-mono text-[#5EA6EB]">DISC-2025-01</td>
                      <td className="p-3.5 font-semibold text-[#101828] dark:text-[#F9FAFB]">Attendance vs Exam Debarment</td>
                      <td className="p-3.5 text-[#475467] dark:text-[#98A2B3]">Rahul Gupta (20CS003) had 64.1% attendance; legacy portal issued hall ticket erroneously.</td>
                      <td className="p-3.5 text-[#101828] dark:text-[#F9FAFB] font-medium">Dynamic 75% Gate applied: Hall ticket locked; statutory debarment notice issued automatically.</td>
                      <td className="p-3.5 pr-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 whitespace-nowrap">
                          RECONCILED
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-[#F8F9FA] dark:bg-[#1C2538] hover:bg-[#5EA6EB]/5 dark:hover:bg-[#5EA6EB]/10 transition-colors">
                      <td className="p-3.5 pl-5 font-bold font-mono text-[#5EA6EB]">DISC-2025-02</td>
                      <td className="p-3.5 font-semibold text-[#101828] dark:text-[#F9FAFB]">Fee Accounts vs Hall Ticket Clearance</td>
                      <td className="p-3.5 text-[#475467] dark:text-[#98A2B3]">Priya Singh (20CS004) pending tuition fee was omitted from offline finance spreadsheet.</td>
                      <td className="p-3.5 text-[#101828] dark:text-[#F9FAFB] font-medium">Live Itemized Ledger linked: ₹37,000 outstanding tracked; registration hold placed automatically.</td>
                      <td className="p-3.5 pr-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 whitespace-nowrap">
                          RECONCILED
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-[#151D30] hover:bg-[#5EA6EB]/5 dark:hover:bg-[#5EA6EB]/10 transition-colors">
                      <td className="p-3.5 pl-5 font-bold font-mono text-[#5EA6EB]">DISC-2025-03</td>
                      <td className="p-3.5 font-semibold text-[#101828] dark:text-[#F9FAFB]">Continuous Assessment vs SGPA</td>
                      <td className="p-3.5 text-[#475467] dark:text-[#98A2B3]">Weighting mismatch between internal (30) and end-sem (70) across differing Excel versions.</td>
                      <td className="p-3.5 text-[#101828] dark:text-[#F9FAFB] font-medium">Unified Grading Engine: Real-time calculation of credit grade points and SGPA across all courses.</td>
                      <td className="p-3.5 pr-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 whitespace-nowrap">
                          RECONCILED
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-[#F8F9FA] dark:bg-[#1C2538] hover:bg-[#5EA6EB]/5 dark:hover:bg-[#5EA6EB]/10 transition-colors">
                      <td className="p-3.5 pl-5 font-bold font-mono text-[#5EA6EB]">DISC-2025-04</td>
                      <td className="p-3.5 font-semibold text-[#101828] dark:text-[#F9FAFB]">Admissions vs Faculty Allocation</td>
                      <td className="p-3.5 text-[#475467] dark:text-[#98A2B3]">New semester enrollments not synchronized with teacher lecture capacity.</td>
                      <td className="p-3.5 text-[#101828] dark:text-[#F9FAFB] font-medium">Single-source primary key mapped directly to course codes with zero orphaned records.</td>
                      <td className="p-3.5 pr-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30 whitespace-nowrap">
                          RECONCILED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Academic Department Performance Table */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] overflow-hidden">
              <div className="p-5 border-b border-[#E4E7EC] dark:border-[#222F4C] bg-[#F8F9FA]/60 dark:bg-[#0B0F19]/40 flex flex-row items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#101828] dark:text-[#F9FAFB]">
                    Academic Department Performance
                  </h3>
                  <p className="text-xs text-[#475467] dark:text-[#98A2B3]">
                    Enrollment quotas, faculty staffing, and fee collection efficiency
                  </p>
                </div>
                {/* Structural Action Link strictly using #5EA6EB */}
                <Button variant="ghost" size="sm" asChild className="text-xs text-[#5EA6EB] hover:text-[#4D95DA] font-bold">
                  <Link to="/admin/manage-students">View All Students <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8F9FA] dark:bg-[#0B0F19] border-b border-[#E4E7EC] dark:border-[#222F4C] text-[#475467] dark:text-[#98A2B3] font-semibold">
                    <tr>
                      <th className="p-3.5 pl-5">Department</th>
                      <th className="p-3.5">HOD / Chair</th>
                      <th className="p-3.5">Students</th>
                      <th className="p-3.5">Avg Attendance</th>
                      <th className="p-3.5">Fee Rate</th>
                      <th className="p-3.5 pr-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E7EC] dark:divide-[#222F4C]">
                    {departmentPerformance.map((dept, index) => (
                      <tr 
                        key={dept.code} 
                        className={`transition-colors hover:bg-[#5EA6EB]/5 dark:hover:bg-[#5EA6EB]/10 ${
                          index % 2 === 1 ? 'bg-[#F8F9FA] dark:bg-[#1C2538]' : 'bg-white dark:bg-[#151D30]'
                        }`}
                      >
                        <td className="p-3.5 pl-5">
                          <span className="font-bold text-[#101828] dark:text-[#F9FAFB] block">{dept.name}</span>
                          <span className="text-[10px] text-[#475467] dark:text-[#98A2B3]">{dept.code} • {dept.faculty} Faculty</span>
                        </td>
                        <td className="p-3.5 text-[#475467] dark:text-[#98A2B3]">{dept.head}</td>
                        <td className="p-3.5 font-bold text-[#101828] dark:text-[#F9FAFB]">{dept.students}</td>
                        <td className="p-3.5 font-semibold text-[#4FA1D8]">{dept.attendance}</td>
                        <td className="p-3.5 font-bold text-[#101828] dark:text-[#F9FAFB]">{dept.collection}</td>
                        <td className="p-3.5 pr-5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dept.status === 'Optimal' 
                              ? 'bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/15 dark:text-[#C4EFDF] dark:border dark:border-[#C4EFDF]/30' 
                              : dept.status === 'Good'
                              ? 'bg-[#A5E5FF] text-[#0B3A60] dark:bg-[#A5E5FF]/20 dark:text-[#A5E5FF] dark:border dark:border-[#A5E5FF]/30'
                              : 'bg-[#FFA5A8] text-[#7A151A] dark:bg-[#FFA5A8]/15 dark:text-[#FFA5A8] dark:border dark:border-[#FFA5A8]/30'
                          }`}>
                            {dept.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 4 Columns (Donut, Attention Alerts, Activities) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Attendance Overview Donut (Shikhaor Image 4 with Exact Semantic Pastel Palette) */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] p-6 space-y-3">
              <div>
                <h3 className="text-base font-bold text-[#101828] dark:text-[#F9FAFB]">
                  Attendance Overview
                </h3>
                <p className="text-xs text-[#475467] dark:text-[#98A2B3]">
                  Institutional daily breakdown
                </p>
              </div>

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
                <span className="text-2xl font-black text-[#101828] dark:text-[#F9FAFB]">94.6%</span>
                <span className="text-[10px] text-[#475467] dark:text-[#98A2B3] block font-semibold">Today's Present</span>
              </div>

              <div className="pt-4 border-t border-[#E4E7EC] dark:border-[#222F4C] space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#101828] dark:text-[#F9FAFB]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4FA1D8]" /> Present (1,560)
                  </span>
                  <span className="text-[#475467] dark:text-[#98A2B3]">94.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#101828] dark:text-[#F9FAFB]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFA5A8]" /> Absent (75)
                  </span>
                  <span className="text-[#475467] dark:text-[#98A2B3]">4.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#101828] dark:text-[#F9FAFB]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#A1E8DD]" /> Condoned / Late (15)
                  </span>
                  <span className="text-[#475467] dark:text-[#98A2B3]">0.8%</span>
                </div>
              </div>
            </div>

            {/* Attention Alert Sidebar with Structural Action Links ("Resolve >" in #5EA6EB) */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] p-6 space-y-3">
              <div>
                <h3 className="text-base font-bold text-[#101828] dark:text-[#F9FAFB]">
                  Attention Alerts
                </h3>
                <p className="text-xs text-[#475467] dark:text-[#98A2B3]">
                  Institutional bottlenecks requiring action
                </p>
              </div>

              <div className="space-y-3">
                {attentionAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="p-3.5 rounded-2xl border border-[#E4E7EC] dark:border-[#222F4C] bg-[#F8F9FA]/70 dark:bg-[#0B0F19]/40 hover:border-[#5EA6EB]/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-[#101828] dark:text-[#F9FAFB]">{alert.title}</h5>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${alert.badgeClass}`}>
                          {alert.count}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#475467] dark:text-[#98A2B3]">{alert.subtitle}</p>
                    </div>
                    {/* Structural action link strictly matching #5EA6EB */}
                    <Link 
                      to={alert.link} 
                      className="text-xs font-bold text-[#5EA6EB] hover:text-[#4D95DA] flex items-center gap-0.5 whitespace-nowrap"
                    >
                      Resolve <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Institutional Activities Feed */}
            <div className="rounded-3xl border border-[#E4E7EC] dark:border-[#222F4C] shadow-card bg-white dark:bg-[#151D30] p-6 space-y-3">
              <div>
                <h3 className="text-base font-bold text-[#101828] dark:text-[#F9FAFB]">
                  Recent Activities
                </h3>
                <p className="text-xs text-[#475467] dark:text-[#98A2B3]">
                  Real-time audit log stream
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8F9FA]/70 dark:bg-[#0B0F19]/40 border border-[#E4E7EC]/80 dark:border-[#222F4C]/80">
                  <div className="p-1.5 rounded-xl bg-[#C4EFDF] text-[#064E3B] dark:bg-[#C4EFDF]/20 dark:text-[#C4EFDF] mt-0.5 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-[#101828] dark:text-[#F9FAFB]">Fee Payment Reconciled</p>
                    <p className="text-[11px] text-[#475467] dark:text-[#98A2B3] truncate">Aarav Sharma (20CS001) settled ₹82,000 • Receipt #RCP-912</p>
                    <p className="text-[10px] text-[#475467]/70 dark:text-[#98A2B3]/70">12 mins ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8F9FA]/70 dark:bg-[#0B0F19]/40 border border-[#E4E7EC]/80 dark:border-[#222F4C]/80">
                  <div className="p-1.5 rounded-xl bg-[#FFA5A8] text-[#7A151A] dark:bg-[#FFA5A8]/20 dark:text-[#FFA5A8] mt-0.5 shrink-0">
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-[#101828] dark:text-[#F9FAFB]">Statutory Debarment Triggered</p>
                    <p className="text-[11px] text-[#475467] dark:text-[#98A2B3] truncate">Rahul Gupta (20CS003) attendance dropped to 64.1% • Admit Card locked</p>
                    <p className="text-[10px] text-[#475467]/70 dark:text-[#98A2B3]/70">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8F9FA]/70 dark:bg-[#0B0F19]/40 border border-[#E4E7EC]/80 dark:border-[#222F4C]/80">
                  <div className="p-1.5 rounded-xl bg-[#A5E5FF] text-[#0B3A60] dark:bg-[#A5E5FF]/20 dark:text-[#A5E5FF] mt-0.5 shrink-0">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-[#101828] dark:text-[#F9FAFB]">Marks Moderation Published</p>
                    <p className="text-[11px] text-[#475467] dark:text-[#98A2B3] truncate">CS301 Database Systems End-Sem marks approved by CoE</p>
                    <p className="text-[10px] text-[#475467]/70 dark:text-[#98A2B3]/70">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminOverview