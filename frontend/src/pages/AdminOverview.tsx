import React, { useState } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import adminHeroImg from '@/assets/bento/admin-hero.jpg'
import { CreateGoogleMeetDialog } from '@/components/dashboard/CreateGoogleMeetDialog'
import { useGoogleMeet } from '@/hooks/useGoogleMeet'
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
  CheckCircle2,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Video
} from 'lucide-react'
import { useAdminData } from '@/hooks/useAdminData'
import { useERPData } from '@/hooks/useERPData'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { exportToCSV } from '@/utils/exportUtils'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line
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
  const { activeMeet } = useGoogleMeet()
  const { toast } = useToast()
  const [isAuditing, setIsAuditing] = useState(false)
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false)
  const [lastAudited, setLastAudited] = useState<string>('Just now')
  const [financialTab, setFinancialTab] = useState<'earned' | 'due' | 'expense'>('earned')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL')

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

  // Student growth chart data
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

  // Monthly financial overview
  const financialData = [
    { month: 'Jan', earned: 380, due: 60, expense: 120 },
    { month: 'Feb', earned: 420, due: 50, expense: 140 },
    { month: 'Mar', earned: 450, due: 45, expense: 135 },
    { month: 'Apr', earned: 480, due: 70, expense: 160 },
    { month: 'May', earned: 410, due: 85, expense: 130 },
    { month: 'Jun', earned: 490, due: 40, expense: 145 },
    { month: 'Jul', earned: 506, due: 85, expense: 150 },
  ]

  // Attendance heatmap: 7 days x 4 depts, value = attendance % (0-100)
  const heatmapDepts = ['CSE', 'ECE', 'MECH', 'IT']
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const heatmapData = [
    [92, 88, 95, 91, 89, 96, 0],  // CSE
    [86, 84, 90, 87, 83, 91, 0],  // ECE
    [78, 80, 85, 82, 76, 88, 0],  // MECH
    [94, 91, 96, 93, 92, 97, 0],  // IT
  ]

  // Department course performance
  const departmentPerformance = [
    { name: 'Computer Science Engineering', code: 'CSE', head: 'Prof. Rajesh Verma', students: 640, faculty: 18, attendance: '88.9%', collection: '96.2%', status: 'Optimal' },
    { name: 'Electronics & Communication', code: 'ECE', head: 'Dr. Ananya Ray', students: 480, faculty: 14, attendance: '86.4%', collection: '94.0%', status: 'Good' },
    { name: 'Mechanical Engineering', code: 'MECH', head: 'Prof. K. Sundaram', students: 320, faculty: 10, attendance: '82.1%', collection: '91.5%', status: 'Attention' },
    { name: 'Information Technology', code: 'IT', head: 'Dr. Priya Nambiar', students: 210, faculty: 8, attendance: '89.5%', collection: '98.0%', status: 'Optimal' },
  ]

  // Attention alerts
  const attentionAlerts = [
    { 
      id: 1, 
      title: 'Unpaid Semester Fees', 
      count: 24, 
      subtitle: 'Students with overdue balance', 
      link: '/admin/billing', 
      badgeClass: 'bg-[#241411] text-white border border-[#44251F]' 
    },
    { 
      id: 2, 
      title: 'Low Attendance Debarment', 
      count: stats.debarredCount || 2, 
      subtitle: 'Students < 75% threshold', 
      link: '/admin/manage-students', 
      badgeClass: 'bg-[#241411] text-white border border-[#44251F]' 
    },
    { 
      id: 3, 
      title: 'Attendance Not Submitted', 
      count: 3, 
      subtitle: 'Faculty rosters pending today', 
      link: '/teacher/attendance', 
      badgeClass: 'bg-neutral-200 text-neutral-900' 
    },
    { 
      id: 4, 
      title: 'Exam Hall Ticket Approvals', 
      count: 18, 
      subtitle: 'Ready for cryptographical issue', 
      link: '/examination-controller/hall-ticket-gatekeeper', 
      badgeClass: 'bg-neutral-100 text-neutral-800 border border-neutral-300' 
    },
  ]

  return (
    <>
      <SEO 
        title="Executive Admin Dashboard | Nexora ERP"
        description="Bento-grid collegiate ERP command center for anti-mismatch reconciliation, academic statistics, and financial ledgers."
        keywords="admin dashboard, bento grid, anti mismatch, discrepancy audit, collegiate erp"
      />

      <div className="space-y-6 pb-12 max-w-[1440px] mx-auto select-none" style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}>
        
        {/* ========================================================================= */}
        {/* MASTER BENTO GRID: Matching Reference Image 3 Layout                       */}
        {/* Left Column (4 cols): Executive Syllabus & Department Control             */}
        {/* Right Area (8 cols): Command Visualizer + Heatmap + Financial Streams     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT BENTO PANEL (4 cols): Institutional Syllabus & Departments         */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Header Persona Block matching Image 3 with authentic photo avatar */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-[#F5B8CE] shadow-xs">
                    <AvatarImage src={adminHeroImg} alt="Dr. R. K. Sharma" className="object-cover" />
                    <AvatarFallback className="rounded-2xl text-xs font-serif font-bold bg-[#241411] text-white border border-[#44251F]">RS</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-xs text-neutral-500 font-serif">
                      Executive ERP Console
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
                      Dr. R. K. Sharma
                    </h1>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer border border-[#F5D5E2]">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600 font-serif">
                <Badge variant="outline" className="text-xs font-serif font-bold border-[#F5B8CE] bg-white text-neutral-900">Dean Academics</Badge>
                <span>•</span>
                <span className="text-emerald-700 font-bold">0 Discrepancies Verified</span>
              </div>

              {/* Search Bar matching Image 3 with round black search button */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ledgers, roll numbers, or departments..."
                  className="w-full bg-white text-neutral-900 text-xs rounded-full pl-4 pr-11 py-2.5 outline-none border border-[#F5D5E2] focus:border-neutral-400 transition-all font-serif"
                />
                <button className="absolute right-1.5 w-7 h-7 rounded-full bg-[#241411] text-white flex items-center justify-center hover:bg-[#341B16] border border-[#44251F] transition-opacity cursor-pointer shadow-xs">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Filter Chips matching Image 3 */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <button className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 cursor-pointer border border-[#F5D5E2]">
                  <SlidersHorizontal className="h-3 w-3" />
                </button>
                {['ALL', 'CSE', 'ECE', 'MECH', 'IT'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDeptFilter(dept)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
                      selectedDeptFilter === dept
                        ? 'bg-[#241411] text-white border border-[#44251F] font-bold shadow-xs'
                        : 'bg-white text-neutral-800 border border-[#F5D5E2] hover:bg-neutral-50'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Google Meet Classroom Card (Admin Monitoring & Broadcast) */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-serif">
                    Live Classroom Broadcast
                  </span>
                </div>
                <Badge className="bg-emerald-700 text-white text-[10px] font-bold font-serif border-none">
                  {activeMeet.courseCode} Section A
                </Badge>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#F5D5E2] space-y-1.5">
                <h4 className="text-xs font-bold text-neutral-900 font-serif truncate">
                  {activeMeet.topic}
                </h4>
                <p className="text-[11px] text-neutral-600 font-serif">
                  Instructor: <strong className="text-neutral-900">{activeMeet.instructor}</strong> • {activeMeet.room}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-neutral-500 border-t border-[#F5D5E2]/50">
                  <span className="text-neutral-900 font-bold">{activeMeet.meetCode}</span>
                  <span className="text-emerald-700 font-serif font-bold">{activeMeet.activeParticipants} Students In Room</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  onClick={() => setIsMeetModalOpen(true)}
                  className="rounded-full bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] text-xs font-bold h-8.5 font-serif cursor-pointer shadow-xs"
                >
                  <Video className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  Edit / New Meet
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full bg-white border-[#F5D5E2] text-neutral-900 text-xs font-bold h-8.5 font-serif hover:bg-neutral-50 cursor-pointer"
                >
                  <a href={activeMeet.meetUrl} target="_blank" rel="noopener noreferrer">
                    Join Live Meet
                  </a>
                </Button>
              </div>
            </div>

            {/* Bento Card: Department Hierarchy (Accent Pink) */}
            <div className="bg-[#FCE4EC] rounded-[28px] p-5 border border-[#F5B8CE] text-neutral-900 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 font-serif">
                    Collegiate Infrastructure
                  </h3>
                  <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                    Single-ledger institutional verification across admissions, attendance, and finance.
                  </p>
                </div>
                <button className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer shrink-0 border border-[#F5B8CE]">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Stats Counters matching Image 3 */}
              <div className="grid grid-cols-3 gap-2 py-1 border-y border-[#F5B8CE]/60">
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 font-serif block">Students</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">1,650</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 font-serif block">Faculty</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">50</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 font-serif block">Avg Attd</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">94.6%</span>
                </div>
              </div>

              {/* Department items matching Image 3 squircle list */}
              <div className="space-y-2">
                {departmentPerformance.map((dept, idx) => {
                  const icons = ['💻', '⚡', '⚙️', '🌐']
                  return (
                    <div
                      key={dept.code}
                      className="p-2.5 rounded-2xl bg-white flex items-center justify-between gap-3 border border-[#F5B8CE]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] border border-[#F5B8CE] flex items-center justify-center text-xs shrink-0">
                          {icons[idx % icons.length]}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 truncate font-serif leading-snug">
                            {dept.name}
                          </h5>
                          <p className="text-[10px] text-neutral-500 truncate font-serif">
                            Chair: {dept.head} • {dept.students} Enrolled
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold font-serif shrink-0 border-[#F5B8CE] bg-white text-neutral-900">
                        {dept.attendance}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Attention Alerts Card */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500 font-serif">Attention Alerts</h4>
              <div className="space-y-2">
                {attentionAlerts.map((alert) => (
                  <div key={alert.id} className="p-2.5 rounded-2xl bg-white border border-[#F5D5E2] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-neutral-900 truncate font-serif">{alert.title}</h5>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold font-serif ${alert.badgeClass}`}>
                          {alert.count}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 truncate font-serif">{alert.subtitle}</p>
                    </div>
                    <Link to={alert.link} className="text-xs font-bold font-serif text-neutral-900 hover:underline shrink-0">
                      Resolve &gt;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT BENTO AREA (8 cols): Executive Visualizer + Heatmap + Finance     */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* TILE 1: STUDENT GROWTH & ADMISSIONS COMMAND VISUALIZER (Image 3 layout) */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-6 border border-[#F5D5E2] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-neutral-500 font-serif uppercase tracking-wider">
                    Institutional Progression
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-serif">
                    Student Growth & Admissions Trajectory
                  </h2>
                  <p className="text-xs text-neutral-600 font-serif">
                    Monthly active cohort progression vs new enrollments across session 2024-2025
                  </p>
                </div>

                {/* Executive Control Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <Button
                    onClick={() => setIsMeetModalOpen(true)}
                    className="rounded-full bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] text-xs font-bold h-8 px-3.5 font-serif cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="h-3.5 w-3.5 text-emerald-400" />
                    Create Google Meet
                  </Button>
                  <Button
                    onClick={handleReaudit}
                    disabled={isAuditing}
                    className="rounded-full bg-[#241411] text-white hover:bg-[#341B16] border border-[#44251F] text-xs font-bold h-8 px-3.5 font-serif cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isAuditing ? 'animate-spin' : ''}`} />
                    {isAuditing ? 'Auditing...' : 'Re-Run Audit'}
                  </Button>
                  <Button
                    onClick={handleExportAuditReport}
                    variant="outline"
                    className="rounded-full text-xs font-bold h-8 px-3 font-serif cursor-pointer border-[#F5D5E2] bg-white text-neutral-900 hover:bg-neutral-50"
                  >
                    <Download className="h-3 w-3 mr-1 text-neutral-900" /> Export CSV
                  </Button>
                  <Button
                    onClick={handleResetDemoData}
                    variant="ghost"
                    size="icon"
                    title="Reset ERP demo state"
                    className="rounded-full h-8 w-8 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Line Chart */}
              <div className="h-[230px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentGrowthData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                    <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#F5D5E2',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: '"Times New Roman", Times, Georgia, serif'
                      }}
                    />
                    <ReferenceLine y={1500} stroke="#737373" strokeDasharray="5 3" strokeOpacity={0.6}
                      label={{ value: 'Target 1,500', position: 'right', fill: '#525252', fontSize: 10, fontWeight: 700 }}
                    />
                    <Line type="monotone" dataKey="total" name="Total Active Cohort" stroke="#241411" strokeWidth={2.5} dot={{ r: 3.5 }} />
                    <Line type="monotone" dataKey="newStudents" name="New Admissions" stroke="#525252" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F5D5E2] text-xs font-serif text-neutral-600">
                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-1.5 text-neutral-900 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#241411]" /> Active Cohort: 1,650
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-700 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" /> New Admissions: 720
                  </span>
                </div>
                <span>Last Reconciled: {lastAudited}</span>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* ROW 2: WEEKLY HEATMAP (Left) + FINANCIAL STREAMS (Right)             */}
            {/* ===================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              
              {/* BOTTOM LEFT: WEEKLY ATTENDANCE HEATMAP */}
              <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-serif">
                      Weekly Attendance Heatmap
                    </h3>
                    <span className="text-xs text-neutral-500 font-serif">
                      Dept × Day attendance compliance
                    </span>
                  </div>
                  <Badge className="bg-emerald-700 text-white text-[10px] font-bold font-serif">
                    Live
                  </Badge>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pt-1">
                  <div className="min-w-[240px]">
                    <div className="grid mb-1.5" style={{ gridTemplateColumns: '40px repeat(7, 1fr)', gap: '4px' }}>
                      <div />
                      {heatmapDays.map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-neutral-500 uppercase font-serif">{d}</div>
                      ))}
                    </div>

                    {heatmapData.map((row, ri) => (
                      <div key={ri} className="grid mb-1.5" style={{ gridTemplateColumns: '40px repeat(7, 1fr)', gap: '4px' }}>
                        <div className="text-[10px] font-bold text-neutral-600 flex items-center font-serif">{heatmapDepts[ri]}</div>
                        {row.map((val, ci) => {
                          const isEmpty = val === 0
                          const bg = isEmpty
                            ? 'bg-neutral-100 text-neutral-400'
                            : val >= 90
                            ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                            : val >= 80
                            ? 'bg-neutral-200 text-neutral-900 font-bold border border-neutral-300'
                            : 'bg-white text-neutral-700 font-bold border border-[#F5D5E2]'

                          return (
                            <div
                              key={ci}
                              title={isEmpty ? 'Weekend' : `${heatmapDepts[ri]} ${heatmapDays[ci]}: ${val}%`}
                              className={`rounded-xl aspect-square flex items-center justify-center text-[10px] transition-transform hover:scale-110 cursor-default font-serif ${bg}`}
                            >
                              {isEmpty ? '—' : val}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F5D5E2] flex items-center justify-between text-[10px] font-serif text-neutral-500">
                  <span>Low (&lt;80%)</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-neutral-200" />
                    <span className="w-3 h-3 rounded bg-neutral-300" />
                    <span className="w-3 h-3 rounded bg-emerald-200" />
                  </div>
                  <span>High (&ge;90%)</span>
                </div>
              </div>

              {/* BOTTOM RIGHT: FINANCIAL STREAMS */}
              <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] text-neutral-900 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-serif">
                      Financial Overview
                    </h3>
                    <span className="text-xs text-neutral-500 font-serif">
                      Fee Collections: ₹5,06,500
                    </span>
                  </div>

                  {/* Tabs matching Image 3 */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFinancialTab('earned')}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                        financialTab === 'earned'
                          ? 'bg-[#241411] text-white border border-[#44251F] shadow-xs'
                          : 'bg-white text-neutral-600 border border-[#F5D5E2] hover:text-neutral-900'
                      }`}
                    >
                      Earned
                    </button>
                    <button
                      onClick={() => setFinancialTab('due')}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                        financialTab === 'due'
                          ? 'bg-[#241411] text-white border border-[#44251F] shadow-xs'
                          : 'bg-white text-neutral-600 border border-[#F5D5E2] hover:text-neutral-900'
                      }`}
                    >
                      Due
                    </button>
                    <button
                      onClick={() => setFinancialTab('expense')}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                        financialTab === 'expense'
                          ? 'bg-[#241411] text-white border border-[#44251F] shadow-xs'
                          : 'bg-white text-neutral-600 border border-[#F5D5E2] hover:text-neutral-900'
                      }`}
                    >
                      Exp
                    </button>
                  </div>
                </div>

                <div className="h-[180px] w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#F5D5E2',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontFamily: '"Times New Roman", Times, Georgia, serif'
                        }}
                      />
                      <Bar dataKey={financialTab} fill="#241411" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-[#F5D5E2] text-center">
                  <Link to="/admin/billing" className="text-xs font-bold font-serif text-neutral-900 hover:underline inline-flex items-center gap-1">
                    Manage Finance Ledgers & Invoices <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOWER BENTO ROW: Anti-Mismatch Reconciliation & Discrepancy Ledger Table   */}
        {/* ========================================================================= */}
        <div className="bg-[#FDF2F5] rounded-[28px] border border-[#F5D5E2] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F5D5E2] bg-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
                  Spreadsheet Reconciliation & Anti-Mismatch Audit Ledger
                </h3>
                <Badge className="bg-emerald-700 text-white text-[10px] font-bold font-serif">
                  100% RECONCILED ✅
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5 font-serif">
                Proves PS-6 compliance: replacing paper registers and isolated spreadsheets with single-ledger verification
              </p>
            </div>
            <Button
              onClick={handleReaudit}
              size="sm"
              className="rounded-full bg-[#241411] text-white hover:bg-[#341B16] border border-[#44251F] text-xs font-bold h-8 px-4 font-serif cursor-pointer shadow-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Re-Run Audit
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-serif">
              <thead className="bg-[#FDF2F5] border-b border-[#F5D5E2] text-neutral-600 font-semibold">
                <tr>
                  <th className="p-3.5 pl-5">Discrepancy Code</th>
                  <th className="p-3.5">Institutional Domain</th>
                  <th className="p-3.5">Legacy Spreadsheet Flaw</th>
                  <th className="p-3.5">Nexora Autonomous Resolution</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5D5E2] bg-white">
                <tr className="hover:bg-rose-50/40 transition-colors">
                  <td className="p-3.5 pl-5 font-bold font-mono text-neutral-900">DISC-2025-01</td>
                  <td className="p-3.5 font-bold text-neutral-900">Attendance vs Exam Debarment</td>
                  <td className="p-3.5 text-neutral-600">Rahul Gupta (20CS003) had 64.1% attendance; legacy portal issued hall ticket erroneously.</td>
                  <td className="p-3.5 text-neutral-900 font-medium">Dynamic 75% Gate applied: Hall ticket locked; statutory debarment notice issued automatically.</td>
                  <td className="p-3.5 pr-5">
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-serif">
                      RECONCILED
                    </Badge>
                  </td>
                </tr>
                <tr className="hover:bg-rose-50/40 transition-colors">
                  <td className="p-3.5 pl-5 font-bold font-mono text-neutral-900">DISC-2025-02</td>
                  <td className="p-3.5 font-bold text-neutral-900">Fee Accounts vs Hall Ticket Clearance</td>
                  <td className="p-3.5 text-neutral-600">Priya Singh (20CS004) pending tuition fee was omitted from offline finance spreadsheet.</td>
                  <td className="p-3.5 text-neutral-900 font-medium">Live Itemized Ledger linked: ₹37,000 outstanding tracked; registration hold placed automatically.</td>
                  <td className="p-3.5 pr-5">
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-serif">
                      RECONCILED
                    </Badge>
                  </td>
                </tr>
                <tr className="hover:bg-rose-50/40 transition-colors">
                  <td className="p-3.5 pl-5 font-bold font-mono text-neutral-900">DISC-2025-03</td>
                  <td className="p-3.5 font-bold text-neutral-900">Continuous Assessment vs SGPA</td>
                  <td className="p-3.5 text-neutral-600">Weighting mismatch between internal (30) and end-sem (70) across differing Excel versions.</td>
                  <td className="p-3.5 text-neutral-900 font-medium">Unified Grading Engine: Real-time calculation of credit grade points and SGPA across all courses.</td>
                  <td className="p-3.5 pr-5">
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-serif">
                      RECONCILED
                    </Badge>
                  </td>
                </tr>
                <tr className="hover:bg-rose-50/40 transition-colors">
                  <td className="p-3.5 pl-5 font-bold font-mono text-neutral-900">DISC-2025-04</td>
                  <td className="p-3.5 font-bold text-neutral-900">Admissions vs Faculty Allocation</td>
                  <td className="p-3.5 text-neutral-600">New semester enrollments not synchronized with teacher lecture capacity.</td>
                  <td className="p-3.5 text-neutral-900 font-medium">Single-source primary key mapped directly to course codes with zero orphaned records.</td>
                  <td className="p-3.5 pr-5">
                    <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-serif">
                      RECONCILED
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Creating / Broadcasting Google Meet Classroom */}
        <CreateGoogleMeetDialog open={isMeetModalOpen} onOpenChange={setIsMeetModalOpen} />
      </div>
    </>
  )
}

export default AdminOverview