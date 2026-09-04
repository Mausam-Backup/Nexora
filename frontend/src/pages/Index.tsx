import React, { useState, useMemo } from "react"
import { Navigate, Link } from "react-router-dom"
import { usePageLoading } from "@/hooks/use-page-loading"
import { IndexSkeleton } from "@/components/ui/page-skeleton"
import { SEO } from "@/components/SEO"
import { useAuth } from "@/contexts/AuthContext"
import { useERPData } from "@/hooks/useERPData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  GraduationCap,
  TrendingUp,
  Award,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  FileText,
  CheckCheck,
  QrCode,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Zap,
  CreditCard,
  Target,
  Send,
  BookMarked
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const Index = () => {
  const isLoading = usePageLoading()
  const { user } = useAuth()
  const { students, getStudent } = useERPData()
  const [selectedQuarter, setSelectedQuarter] = useState<'Quarter 1' | 'Quarter 2' | 'Mid-Sem' | 'Quarter 3' | 'Final'>('Quarter 3')

  // Resolve active student from unified ERP state
  const activeStudentId = user?.id || '20CS001'
  const student = getStudent(activeStudentId) || students.find(s => s.id === '20CS001') || students[0]

  // Calculate live cumulative statistics
  const attendanceValues = Object.values(student?.attendance || {})
  const totalClasses = attendanceValues.reduce((sum, a) => sum + a.total, 0)
  const attendedClasses = attendanceValues.reduce((sum, a) => sum + a.attended, 0)
  const overallAttendance = totalClasses > 0 ? Number(((attendedClasses / totalClasses) * 100).toFixed(1)) : 88.0

  const isDebarred = overallAttendance < 75 || student?.status === 'debarred'
  const isFeePending = student?.fees?.outstanding > 0
  const isCleared = !isDebarred && !isFeePending

  // Performance timeline data matching Titans EDU (Image 1)
  const performanceTrendData = [
    { period: 'Quarter 1', examScore: 68, attendance: 92 },
    { period: 'Quarter 2', examScore: 74, attendance: 89 },
    { period: 'Mid-Sem', examScore: isDebarred ? 58 : 84, attendance: isDebarred ? 64 : 88 },
    { period: 'Quarter 3', examScore: isDebarred ? 61 : 89, attendance: isDebarred ? 62 : 91 },
    { period: 'Final', examScore: isDebarred ? 64 : 94, attendance: isDebarred ? 65 : 92 },
  ]

  // Subjects breakdown
  const subjectsList = Object.values(student?.marks || {})

  // Class faculties (matching Titans EDU Image 1)
  const faculties = [
    { name: 'Dr. Sarah Johnson', role: 'Professor', subject: 'Database Management Systems', code: 'CS301', email: 's.johnson@college.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Prof. Michael Brown', role: 'Asst. Professor', subject: 'Software Engineering', code: 'CS302', email: 'm.brown@college.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Dr. Emily Davis', role: 'Associate Professor', subject: 'Computer Networks', code: 'CS303', email: 'e.davis@college.edu', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Prof. Robert Wilson', role: 'Head of Lab', subject: 'Operating Systems', code: 'CS304', email: 'r.wilson@college.edu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
  ]

  // Worksheets & Assignments (matching Learnology Image 3)
  const pendingWorksheets = [
    { id: 1, title: 'B-Tree & Indexing Relational Optimization', subject: 'CS301', points: 25, due: 'Tomorrow, 5:00 PM' },
    { id: 2, title: 'Agile Sprint Planning & Burndown Analysis', subject: 'CS302', points: 30, due: 'In 2 Days' },
    { id: 3, title: 'TCP Congestion Control Simulation', subject: 'CS303', points: 20, due: 'Friday' },
  ]

  const recentSubmissions = [
    { id: 101, title: 'Process Scheduling Algorithm Simulator', subject: 'CS304', points: 30, status: 'Checked (28/30)' },
    { id: 102, title: 'SQL Joins & Transaction Isolation Levels', subject: 'CS301', points: 20, status: 'Checked (20/20)' },
    { id: 103, title: 'Software Requirement Specification (SRS)', subject: 'CS302', points: 25, status: 'Pending Review' },
  ]

  // Today's schedule timeline (matching Titans EDU Image 1 & Tablet Image 5)
  const todayTimeline = [
    { time: '09:30 AM', subject: 'Database Management Systems', code: 'CS301', room: 'LH-101', faculty: 'Dr. Sarah Johnson', status: 'attended' },
    { time: '11:15 AM', subject: 'Software Engineering', code: 'CS302', room: 'LH-104', faculty: 'Prof. Michael Brown', status: 'attended' },
    { time: '01:30 PM', subject: 'Lunch & Campus Recess', code: 'BREAK', room: 'Student Center', faculty: 'Campus Lounge', status: 'recess' },
    { time: '02:30 PM', subject: 'Computer Networks Lab', code: 'CS303', room: 'Systems Lab 3', faculty: 'Dr. Emily Davis', status: 'upcoming' },
    { time: '04:00 PM', subject: 'Operating Systems Tutorial', code: 'CS304', room: 'LH-102', faculty: 'Prof. Robert Wilson', status: 'upcoming' },
  ]

  if (isLoading) {
    return <IndexSkeleton />
  }

  // Proper role-based redirection from root dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/overview" replace />
  }

  if (user?.role === 'teacher') {
    return <Navigate to="/teacher" replace />
  }

  return (
    <>
      <SEO 
        title="Student Portal Dashboard | Nexora ERP"
        description="Comprehensive student command center featuring live academic transcripts, statutory examination clearances, attendance tracking, and class schedules."
        keywords="student dashboard, academic progress, hall ticket, attendance gate, nexora erp"
      />

      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TOP ROW: Welcome Persona Banner + Academic Standing Speedometer */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* Welcome Card (8 cols) - Matching Learnology & Tablet references */}
          <div className="lg:col-span-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-card via-card to-primary/5 border border-border/80 shadow-card flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl ring-4 ring-primary/20 shadow-md">
                  <AvatarImage src={student?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student?.name || 'Aarav')}`} />
                  <AvatarFallback className="rounded-2xl text-lg font-bold bg-primary text-primary-foreground">
                    {student?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      Welcome back, {student?.name?.split(' ')[0]}! 👋
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {student?.department} • Semester {student?.semester} (Sec {student?.section})
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-primary/30 text-primary bg-primary/5">
                      Roll No: {student?.rollNumber}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                      Batch {student?.admissionYear}-2025
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Academic Status
                </span>
                {isCleared ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1 gap-1.5 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Good Standing
                  </Badge>
                ) : isDebarred ? (
                  <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-3 py-1 gap-1.5 shadow-sm animate-pulse">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Debarred (&lt;75%)
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1 gap-1.5 shadow-sm">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Fee Hold
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Quote / Motivation Strip (Titans EDU style) */}
            <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="italic">
                "Continuous learning is the minimum requirement for success in engineering."
              </span>
              <span className="text-[11px] font-semibold text-primary flex items-center gap-1 shrink-0">
                <Sparkles className="h-3.5 w-3.5" /> Autonomous State Reconciled
              </span>
            </div>
          </div>

          {/* Academic Standing & Speedometer Gauge (4 cols) - Learnology Image 3 */}
          <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cumulative Standing
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold border-primary/40 text-primary">
                Rank #3 in Branch
              </Badge>
            </div>

            <div className="my-4 text-center space-y-1">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                  {student?.cgpa.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground font-semibold">/ 10.0</span>
              </div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +0.21 Grade Points vs Sem 5
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Credits Earned</span>
                <span className="text-foreground">118 / 160 Total</span>
              </div>
              <Progress value={74} className="h-2 bg-primary/15" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATUTORY GATE HERO: Cleared vs Debarred Showcase (The PS-6 Highlight) */}
        {/* ========================================================================= */}
        {isCleared ? (
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/30 shadow-card glow-emerald">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md">
                  <CheckCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Examination Clearance: 100% Cleared & Verified ✅
                    </h3>
                    <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-bold">
                      Admit Card Active
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    All statutory conditions satisfied: Cumulative Attendance is <strong className="text-foreground">{overallAttendance}%</strong> (exceeds 75% cutoff) and financial balance is <strong className="text-foreground">₹0 (Cleared)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <Button asChild className="w-full md:w-auto rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-sm">
                  <Link to="/schedule/exams">
                    <QrCode className="h-4 w-4" />
                    Download Official Hall Ticket
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : isDebarred ? (
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-amber-500/10 border-2 border-rose-500/40 shadow-card glow-rose">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-md animate-pulse">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400">
                      ⚠️ STATUTORY DEBARMENT NOTICE: Hall Ticket Locked
                    </h3>
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold">
                      Debarred (Reg. 14.B)
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-2xl">
                    Attendance Shortage Detected: Cumulative Attendance is <strong className="text-rose-600 dark:text-rose-400">{overallAttendance}%</strong>, which is below the statutory <strong className="text-foreground">75.0% institutional minimum</strong>.
                    {isFeePending && ` Furthermore, ₹${student?.fees?.outstanding.toLocaleString('en-IN')} in overdue semester fees remains uncollected.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <Button asChild variant="outline" className="w-full sm:w-auto rounded-2xl border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-2 font-semibold">
                  <Link to="/attendance/student">
                    <CalendarIcon className="h-4 w-4" />
                    Inspect Course Shortages
                  </Link>
                </Button>
                <Button asChild className="w-full sm:w-auto rounded-2xl bg-rose-600 hover:bg-rose-700 text-white gap-2 font-semibold">
                  <Link to="/schedule/exams">
                    <Lock className="h-4 w-4" />
                    Review Debarment Audit
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-orange-500/10 border-2 border-amber-500/40 shadow-card glow-amber">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">
                      ⚠️ REGISTRATION & EXAM HOLD: Pending Financial Clearance
                    </h3>
                    <Badge className="bg-amber-600 text-white text-[10px] uppercase font-bold">
                      Fee Hold
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-2xl">
                    Attendance is cleared at <strong className="text-emerald-600 dark:text-emerald-400">{overallAttendance}%</strong>, but an outstanding balance of <strong className="text-amber-600 dark:text-amber-400">₹{student?.fees?.outstanding.toLocaleString('en-IN')}</strong> must be reconciled to release the admit card.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <Button asChild className="w-full md:w-auto rounded-2xl bg-amber-600 hover:bg-amber-700 text-white gap-2 font-semibold">
                  <Link to="/billing-payments">
                    <CreditCard className="h-4 w-4" />
                    Settle Dues & Unlock Admit Card
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4 TOP KPI CARDS (Matching Edukors & Shikhaor style) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: CGPA */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current CGPA</span>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">{student?.cgpa.toFixed(2)}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Semester 6 SGPA</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +4.2%
                  </span>
                </div>
              </div>
              <Progress value={Math.min(100, (student?.cgpa / 10) * 100)} className="h-1.5 bg-amber-500/20" />
            </CardContent>
          </Card>

          {/* Card 2: Cumulative Attendance */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance Rate</span>
                <div className={`p-2.5 rounded-2xl ${isDebarred ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                  <CalendarIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black tracking-tight text-foreground">{overallAttendance}%</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDebarred ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                    {isDebarred ? '< 75% Gate' : '≥ 75% Gate'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {attendedClasses} attended of {totalClasses} classes
                </p>
              </div>
              <Progress value={overallAttendance} className={`h-1.5 ${isDebarred ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`} />
            </CardContent>
          </Card>

          {/* Card 3: Enrolled Courses */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enrolled Courses</span>
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">
                  {subjectsList.length} Subjects
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Core Curriculum</span>
                  <span className="font-semibold text-primary">16 Credits</span>
                </div>
              </div>
              <Progress value={85} className="h-1.5 bg-blue-500/20" />
            </CardContent>
          </Card>

          {/* Card 4: Financial Balance */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fee Clearance</span>
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">
                  ₹{student?.fees?.outstanding.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Outstanding Dues</span>
                  <span className={`font-semibold ${isFeePending ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isFeePending ? 'Overdue' : 'All Cleared'}
                  </span>
                </div>
              </div>
              <Progress value={isFeePending ? 35 : 100} className="h-1.5 bg-purple-500/20" />
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* MAIN SPLIT: Left (Scores & Overall Performance) | Right (Schedule & Faculty) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Detail Scores & Subject Progress Rings (Titans EDU Image 1 & Learnology Image 3) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    Curriculum Detail Scores & Continuous Assessment
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Continuous evaluation (Internal 30 + External 70 = 100) across semester subjects
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link to="/view-marks">View Transcript <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {subjectsList.map((sub) => {
                    const pct = sub.total
                    const badgeVariant = pct >= 80 ? 'default' : pct >= 65 ? 'secondary' : 'destructive'
                    return (
                      <div key={sub.subjectCode} className="p-4 rounded-2xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-primary">{sub.subjectCode}</span>
                            <h4 className="text-xs font-semibold text-foreground truncate max-w-[170px]">{sub.subjectName}</h4>
                          </div>
                          <Badge variant={badgeVariant} className="text-xs font-black px-2 py-0.5">
                            Grade: {sub.grade} ({sub.gp} GP)
                          </Badge>
                        </div>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="text-muted-foreground">Internal: {sub.internal}/30 • External: {sub.external}/70</span>
                          <span className="font-extrabold text-foreground">{sub.total}%</span>
                        </div>
                        <Progress value={sub.total} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Overall Performance Multi-Quarter Curve (Titans EDU Image 1) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    Overall Performance Trend
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Academic performance vs lecture attendance across session milestones
                  </CardDescription>
                </div>
                
                {/* Period Pills - Matching Titans EDU Header */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/60 self-start sm:self-auto">
                  {(['Quarter 1', 'Quarter 2', 'Mid-Sem', 'Quarter 3', 'Final'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQuarter(q)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-xl transition-all ${
                        selectedQuarter === q
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis dataKey="period" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '16px',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                          fontSize: '12px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        name="Attendance Rate"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#10b981' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="examScore"
                        name="Exam Average"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#6366f1' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex items-center justify-center gap-6 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span>Attendance Standing (%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-indigo-500" />
                    <span>Exam Score Average (%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Worksheets & Submissions (Learnology Image 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pending Worksheets */}
              <Card className="rounded-3xl border-border/80 shadow-card bg-card">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Pending Worksheets
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px]">3 Pending</Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {pendingWorksheets.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-bold text-primary">{item.subject}</span>
                          <span>•</span>
                          <span>{item.points} Points</span>
                          <span>•</span>
                          <span className="text-rose-600 dark:text-rose-400 font-medium">{item.due}</span>
                        </div>
                      </div>
                      <Button size="sm" className="h-7 text-xs rounded-xl px-2.5 bg-primary text-primary-foreground font-semibold shrink-0">
                        Start
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Submissions */}
              <Card className="rounded-3xl border-border/80 shadow-card bg-card">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckCheck className="h-4 w-4 text-emerald-500" />
                    Recent Submissions
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-[11px] h-6 p-0 text-muted-foreground">
                    <Link to="/courses/assignments">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {recentSubmissions.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-bold text-primary">{item.subject}</span>
                          <span>•</span>
                          <span>{item.points} Points</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN: 4 Columns (Schedule, Motivational Note, Faculty Contacts) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Today's Schedule Timeline (Titans EDU & Tablet Image 5) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Today's Class Schedule
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Verified live lecture timeline
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Today
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayTimeline.map((slot, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-muted/40 transition-colors">
                    <div className="text-center shrink-0 w-16 pt-0.5">
                      <span className="text-[11px] font-bold text-foreground block">{slot.time}</span>
                      <span className="text-[10px] text-muted-foreground block">{slot.room}</span>
                    </div>
                    <div className="h-9 w-0.5 bg-border shrink-0 self-center" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-foreground truncate">{slot.subject}</h5>
                      <p className="text-[11px] text-muted-foreground truncate">{slot.faculty}</p>
                    </div>
                    <div>
                      {slot.status === 'attended' ? (
                        <span className="inline-flex p-1 rounded-full bg-emerald-500/10 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                      ) : slot.status === 'recess' ? (
                        <span className="inline-flex p-1 rounded-full bg-muted text-muted-foreground">
                          ☕
                        </span>
                      ) : (
                        <span className="inline-flex p-1 rounded-full bg-blue-500/10 text-blue-600">
                          <Clock className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Motivational Card + Ask AI Copilot (Titans EDU & Tablet Image 5) */}
            <div className="rounded-3xl p-5 bg-gradient-to-br from-indigo-600 to-primary text-white shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Daily Motivation
                </span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <blockquote className="text-sm font-semibold leading-relaxed">
                "Small daily improvements over time lead to stunning long-term results."
              </blockquote>
              <div className="flex items-center gap-2 text-[11px] font-medium text-white/80">
                <span>#Disciplined</span>
                <span>•</span>
                <span>#EngineeredForExcellence</span>
              </div>
              <div className="pt-2 border-t border-white/20">
                <Link
                  to="/ask-ai"
                  className="flex items-center justify-between text-xs font-bold text-white bg-white/15 hover:bg-white/25 px-3 py-2 rounded-2xl transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Ask ERP AI Copilot
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Class Faculties (Titans EDU Image 1) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Class Faculties
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Assigned subject tutors & office hours
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {faculties.map((f) => (
                  <div key={f.code} className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-full ring-1 ring-border">
                        <AvatarImage src={f.avatar} />
                        <AvatarFallback className="text-xs font-bold">{f.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-foreground leading-tight">{f.name}</h5>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{f.subject}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-7 text-xs px-2.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <a href={`mailto:${f.email}`}>
                        <Mail className="h-3 w-3 mr-1" /> Email
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
