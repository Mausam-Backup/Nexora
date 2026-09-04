import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { useERPData } from '@/hooks/useERPData'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  Sparkles,
  ArrowRight,
  Send,
  Zap,
  ShieldAlert,
  ClipboardCheck,
  CheckCheck,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export const TeacherDashboardOverview: React.FC = () => {
  const { user } = useAuth()
  const { students, subjects, recordClassAttendance, serverConnected } = useERPData()
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('CS301')

  const teacherName = user?.name || 'Prof. Rajesh Verma'
  const department = user?.branch || 'Computer Science and Engineering'

  // Teacher's assigned courses
  const assignedCourses = [
    { code: 'CS301', name: 'Database Management Systems', credits: 4, enrolled: students.length, avgAttendance: 84.2 },
    { code: 'CS302', name: 'Software Engineering', credits: 4, enrolled: students.length, avgAttendance: 86.8 },
    { code: 'CS304', name: 'Operating Systems', credits: 4, enrolled: students.length, avgAttendance: 81.5 },
  ]

  // Find students in current courses with attendance below 75%
  const atRiskStudents = useMemo(() => {
    return students.filter(s => {
      const record = s.attendance[selectedSubjectCode]
      const pct = record ? record.percentage : s.overallAttendance
      return pct < 75
    })
  }, [students, selectedSubjectCode])

  // Grading progress tracking
  const gradingProgress = [
    { course: 'CS301 DBMS', internal: 100, midSem: 100, endSem: 85 },
    { course: 'CS302 Software Eng', internal: 100, midSem: 90, endSem: 70 },
    { course: 'CS304 Operating Systems', internal: 95, midSem: 85, endSem: 60 },
  ]

  // Today's lectures timeline
  const todayLectures = [
    { time: '09:30 AM - 10:30 AM', course: 'Database Management Systems', code: 'CS301', room: 'LH-101', type: 'Lecture', status: 'completed' },
    { time: '11:15 AM - 12:15 PM', course: 'Software Engineering', code: 'CS302', room: 'LH-104', type: 'Lecture', status: 'completed' },
    { time: '02:30 PM - 04:30 PM', course: 'Advanced Systems Lab', code: 'CS301', room: 'Lab 3', type: 'Lab Session', status: 'upcoming' },
  ]

  // Quick 1-click batch attendance execution with 0ms BroadcastChannel sync
  const handleQuickBatchAttendance = (status: 'present' | 'absent') => {
    const today = new Date().toISOString().split('T')[0]
    const studentRecords = students.map(s => ({
      studentId: s.id,
      status
    }))

    recordClassAttendance(selectedSubjectCode, today, '10:00 AM', studentRecords)
    toast.success(
      `Marked all students ${status.toUpperCase()} in ${selectedSubjectCode}`,
      {
        description: `Instant BroadcastChannel sync triggered across all student portals and Express server.`
      }
    )
  }

  const handleRemedialLog = (studentName: string) => {
    toast.success(`Logged remedial counseling session for ${studentName}`, {
      description: `Attendance condonation ticket created for CoE academic review.`
    })
  }

  return (
    <>
      <SEO 
        title="Faculty Command Center | Nexora ERP"
        description="Faculty management console for lecture rosters, continuous assessment, and student attendance tracking."
      />

      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TOP ROW: Faculty Header Banner + Quick Action Strip */}
        {/* ========================================================================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-card via-card to-primary/5 border border-border/80 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl ring-4 ring-primary/20 shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(teacherName)}`} />
                <AvatarFallback className="rounded-2xl text-lg font-bold bg-primary text-primary-foreground">
                  {teacherName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    Welcome, {teacherName}
                  </h1>
                  <Badge variant="outline" className="hidden sm:inline-flex text-xs font-bold border-primary/40 text-primary bg-primary/5">
                    HOD & Senior Faculty
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {department} • Academic Session 2024-2025
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                    {assignedCourses.length} Assigned Subjects
                  </Badge>
                  <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                    Live Broadcast Bus: Connected
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto w-full md:w-auto">
              <Button asChild className="rounded-2xl bg-primary text-primary-foreground gap-2 font-semibold shadow-sm text-xs sm:text-sm">
                <Link to="/teacher/attendance">
                  <ClipboardCheck className="h-4 w-4" /> Open Full Attendance Register
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl border-border hover:bg-muted text-xs sm:text-sm">
                <Link to="/teacher/upload-marks">
                  <Award className="h-4 w-4 mr-1.5" /> Grade Marks
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 TOP KPI CARDS (Matching Edukors & Shikhaor style) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Assigned Courses */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Courses</span>
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">{assignedCourses.length} Courses</div>
                <p className="text-xs text-muted-foreground">CS301, CS302, CS304 Core</p>
              </div>
              <Progress value={100} className="h-1.5 bg-blue-500/20" />
            </CardContent>
          </Card>

          {/* Card 2: Total Enrolled Students */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enrolled Students</span>
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">{students.length * 20}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Active Roster</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +100% Synced
                  </span>
                </div>
              </div>
              <Progress value={92} className="h-1.5 bg-indigo-500/20" />
            </CardContent>
          </Card>

          {/* Card 3: Today's Lectures */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Lectures</span>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">3 Sessions</div>
                <p className="text-xs text-muted-foreground">2 Completed • 1 Upcoming Lab</p>
              </div>
              <Progress value={66} className="h-1.5 bg-amber-500/20" />
            </CardContent>
          </Card>

          {/* Card 4: Average Attendance */}
          <Card className="rounded-3xl border-border/80 shadow-card shadow-card-hover bg-card">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cohort Attendance</span>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-foreground">84.2%</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Statutory 75% Gate</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Compliant</span>
                </div>
              </div>
              <Progress value={84.2} className="h-1.5 bg-emerald-500/20" />
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* QUICK 1-CLICK BATCH ATTENDANCE CONSOLE (Instant 0ms Sync Highlight) */}
        {/* ========================================================================= */}
        <Card className="rounded-3xl border-border/80 shadow-card bg-gradient-to-r from-card via-card to-primary/5">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                  Quick Batch Attendance Console
                </CardTitle>
                <Badge className="bg-primary text-primary-foreground text-[10px]">
                  0ms BroadcastChannel Bus
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Instantly broadcast bulk attendance records across student portals in real-time
              </CardDescription>
            </div>

            {/* Course Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/60">
              {assignedCourses.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedSubjectCode(c.code)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                    selectedSubjectCode === c.code
                      ? 'bg-background text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Session: <span className="text-primary font-bold">{selectedSubjectCode}</span> • Today's Lecture (Section A)
                </p>
                <p className="text-xs text-muted-foreground">
                  Action cascades automatically to exam admit card gatekeeper without page refresh.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <Button
                  onClick={() => handleQuickBatchAttendance('present')}
                  className="flex-1 md:flex-none rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-sm"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark All Present
                </Button>
                <Button
                  onClick={() => handleQuickBatchAttendance('absent')}
                  variant="outline"
                  className="flex-1 md:flex-none rounded-2xl border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold text-xs h-9 px-4 gap-1.5"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Mark All Absent
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-2xl text-xs h-9 px-3 text-muted-foreground hover:text-foreground"
                >
                  <Link to="/teacher/attendance">
                    Detailed Roster <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* MAIN SPLIT: Left (At-Risk Students & Today's Schedule) | Right (Grading Progress) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Student Debarment & At-Risk Watchlist (Anti-Mismatch Monitor) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-foreground">
                      Attendance Shortage & Debarment Watchlist
                    </CardTitle>
                    <Badge variant="destructive" className="text-[10px]">
                      {atRiskStudents.length} Students &lt; 75%
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Students currently debarred from exam hall ticket issuance in {selectedSubjectCode}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {atRiskStudents.length > 0 ? (
                  atRiskStudents.map((s) => {
                    const rec = s.attendance[selectedSubjectCode]
                    const pct = rec ? rec.percentage : s.overallAttendance
                    return (
                      <div key={s.id} className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-full ring-2 ring-rose-500/30">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback className="text-xs font-bold text-rose-600 bg-rose-100">
                              {s.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-foreground">{s.name}</h5>
                            <p className="text-[11px] text-muted-foreground">Roll: {s.rollNumber} • Sec {s.section}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-xs font-black text-rose-600 dark:text-rose-400 block">{pct}%</span>
                            <span className="text-[10px] text-muted-foreground block">Shortage: {rec?.attended || 0}/{rec?.total || 0}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRemedialLog(s.name)}
                            className="rounded-xl h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-2.5"
                          >
                            Log Remedial
                          </Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    All students currently meet the mandatory 75% attendance threshold in {selectedSubjectCode}!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Teaching Schedule Timeline (Titans EDU & Tablet Image 5) */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Today's Teaching Schedule
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Classrooms, lecture slots, and attendance verification
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Today
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayLectures.map((lec, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{lec.code}</span>
                        <Badge variant="secondary" className="text-[10px]">{lec.type}</Badge>
                      </div>
                      <h5 className="text-xs font-semibold text-foreground">{lec.course}</h5>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {lec.time} • Room: {lec.room}
                      </p>
                    </div>

                    <div>
                      {lec.status === 'completed' ? (
                        <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                          Completed ✅
                        </Badge>
                      ) : (
                        <Button asChild size="sm" className="rounded-xl h-7 text-xs font-semibold bg-primary text-primary-foreground px-2.5">
                          <Link to="/teacher/attendance">
                            Launch Register
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: 5 Columns (Grading Progress & Notices) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Continuous Assessment & Grading Progress */}
            <Card className="rounded-3xl border-border/80 shadow-card bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Grading & Evaluation Status
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Continuous assessment submissions for Term End
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-xs text-primary">
                  <Link to="/teacher/upload-marks">Grade <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {gradingProgress.map((g, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-border/60 bg-muted/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-foreground">{g.course}</h5>
                      <Badge variant="outline" className="text-[10px]">
                        Overall: {Math.round((g.internal + g.midSem + g.endSem) / 3)}%
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Internal Assessment (Max 30)</span>
                        <span className="font-semibold text-foreground">{g.internal}% Graded</span>
                      </div>
                      <Progress value={g.internal} className="h-1.5 bg-emerald-500/20" />

                      <div className="flex justify-between text-muted-foreground pt-1">
                        <span>Mid-Semester Exam (Max 30)</span>
                        <span className="font-semibold text-foreground">{g.midSem}% Graded</span>
                      </div>
                      <Progress value={g.midSem} className="h-1.5 bg-blue-500/20" />

                      <div className="flex justify-between text-muted-foreground pt-1">
                        <span>End-Semester Lab / Viva (Max 40)</span>
                        <span className="font-semibold text-foreground">{g.endSem}% Graded</span>
                      </div>
                      <Progress value={g.endSem} className="h-1.5 bg-amber-500/20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Statutory Reminder (PS-6 Compliance) */}
            <div className="rounded-3xl p-5 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 shadow-card space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Statutory University Guideline
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Faculty marks entry triggers automatic computation of Credit Grade Points and SGPA in real time. Debarred students with &lt;75% attendance are automatically blocked from hall ticket printing until condonation approval.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold border-primary/30 text-primary">
                <Link to="/teacher/attendance">
                  Open Attendance Register
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TeacherDashboardOverview
