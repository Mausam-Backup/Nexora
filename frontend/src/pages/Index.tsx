import React, { useState } from "react"
import { Navigate, Link } from "react-router-dom"
import { usePageLoading } from "@/hooks/use-page-loading"
import { IndexSkeleton } from "@/components/ui/page-skeleton"
import { SEO } from "@/components/SEO"
import { useAuth } from "@/contexts/AuthContext"
import { useERPData } from "@/hooks/useERPData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import lecturePreviewImg from "@/assets/bento/lecture-preview.jpg"
import studentHeroImg from "@/assets/bento/student-hero.jpg"
import { GoogleMeetClassroomCard } from "@/components/dashboard/GoogleMeetClassroomCard"
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
  Play,
  Pause,
  Volume2,
  Maximize2,
  Flame,
  Check,
  Search,
  SlidersHorizontal,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Plus,
  MoreHorizontal,
  RotateCcw,
  RotateCw
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { toast } from "sonner"

const Index = () => {
  const isLoading = usePageLoading()
  const { user } = useAuth()
  const { students, getStudent } = useERPData()
  const [selectedQuarter, setSelectedQuarter] = useState<'Quarter 1' | 'Quarter 2' | 'Mid-Sem' | 'Quarter 3' | 'Final'>('Quarter 3')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [playlistTab, setPlaylistTab] = useState<'files' | 'videos' | 'audio'>('videos')
  const [activeLectureId, setActiveLectureId] = useState(2)
  const [chatMessage, setChatMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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

  // Performance timeline data
  const performanceTrendData = [
    { period: 'Quarter 1', examScore: 68, attendance: 92 },
    { period: 'Quarter 2', examScore: 74, attendance: 89 },
    { period: 'Mid-Sem', examScore: isDebarred ? 58 : 84, attendance: isDebarred ? 64 : 88 },
    { period: 'Quarter 3', examScore: isDebarred ? 61 : 89, attendance: isDebarred ? 62 : 91 },
    { period: 'Final', examScore: isDebarred ? 64 : 94, attendance: isDebarred ? 65 : 92 },
  ]

  // Subjects breakdown
  const subjectsList = Object.values(student?.marks || {})

  // Class faculties
  const faculties = [
    { name: 'Dr. Sarah Johnson', role: 'Professor', subject: 'Database Management Systems', code: 'CS301', email: 's.johnson@college.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Prof. Michael Brown', role: 'Asst. Professor', subject: 'Software Engineering', code: 'CS302', email: 'm.brown@college.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Dr. Emily Davis', role: 'Associate Professor', subject: 'Computer Networks', code: 'CS303', email: 'e.davis@college.edu', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Prof. Robert Wilson', role: 'Head of Lab', subject: 'Operating Systems', code: 'CS304', email: 'r.wilson@college.edu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
  ]

  // Playlist items matching Reference Image 3
  const playlistLectures = [
    { id: 1, title: 'Relational Models & Normalization', duration: '15:48', type: 'video' },
    { id: 2, title: 'Perspective Basics: B-Tree & Indexing', duration: '23:28', type: 'video', active: true },
    { id: 3, title: 'Query Execution & Buffer Pools', duration: '12:16', type: 'video' },
    { id: 4, title: 'ACID Principles & Concurrency Control', duration: '18:45', type: 'video' },
  ]

  // Worksheets & Assignments
  const pendingWorksheets = [
    { id: 1, title: 'B-Tree & Indexing Relational Optimization', subject: 'CS301', points: 25, due: 'Tomorrow, 5:00 PM' },
    { id: 2, title: 'Agile Sprint Planning & Burndown Analysis', subject: 'CS302', points: 30, due: 'In 2 Days' },
    { id: 3, title: 'TCP Congestion Control Simulation', subject: 'CS303', points: 20, due: 'Friday' },
  ]

  // Today's schedule timeline
  const todayTimeline = [
    { time: '09:30 AM', subject: 'Database Management Systems', code: 'CS301', room: 'LH-101', faculty: 'Dr. Sarah Johnson', status: 'attended' },
    { time: '11:15 AM', subject: 'Software Engineering', code: 'CS302', room: 'LH-104', faculty: 'Prof. Michael Brown', status: 'attended' },
    { time: '01:30 PM', subject: 'Lunch & Campus Recess', code: 'BREAK', room: 'Student Center', faculty: 'Campus Lounge', status: 'recess' },
    { time: '02:30 PM', subject: 'Computer Networks Lab', code: 'CS303', room: 'Systems Lab 3', faculty: 'Dr. Emily Davis', status: 'upcoming' },
    { time: '04:00 PM', subject: 'Operating Systems Tutorial', code: 'CS304', room: 'LH-102', faculty: 'Prof. Robert Wilson', status: 'upcoming' },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    toast.success('Message sent to Course Discussion Channel', {
      description: `"${chatMessage}" posted to CS301 cohort.`
    })
    setChatMessage('')
  }

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
        description="Bento-grid student custom syllabus command center featuring live academic transcripts, lecture streams, statutory examination clearances, attendance tracking, and class schedules."
        keywords="student dashboard, bento grid, academic progress, hall ticket, custom syllabus, nexora erp"
      />

      <div className="space-y-6 pb-12 max-w-[1440px] mx-auto select-none" style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}>
        
        {/* ========================================================================= */}
        {/* MASTER BENTO GRID: Matching Reference Image 3 Layout                       */}
        {/* Left Column (4 cols): Custom Syllabus & Subject Navigator                  */}
        {/* Right Area (8 cols): Featured Lecture Player + Course Chat + Playlist     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT BENTO PANEL (4 cols): Custom Syllabus & Subject Navigator          */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Header Persona Block matching Image 3 with authentic photo avatar */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-[#F5B8CE] shadow-xs">
                    <AvatarImage src={studentHeroImg} alt={student?.name || 'Anna'} className="object-cover" />
                    <AvatarFallback className="rounded-2xl text-xs font-serif font-bold bg-[#241411] text-white border border-[#44251F]">AN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-xs text-neutral-500 font-serif">
                      Hello, {student?.name?.split(' ')[0] || 'Anna'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
                      Your Custom Syllabus
                    </h1>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer border border-[#F5D5E2]">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Search Bar matching Image 3 with round black search button */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics, lectures, or courses..."
                  className="w-full bg-white text-neutral-900 text-xs rounded-full pl-4 pr-11 py-2.5 outline-none border border-[#F5D5E2] focus:border-neutral-400 transition-all font-serif"
                />
                <button className="absolute right-1.5 w-7 h-7 rounded-full bg-[#241411] text-white flex items-center justify-center hover:bg-[#341B16] border border-[#44251F] transition-all shadow-xs cursor-pointer">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Filter Chips matching Image 3: [Filter] [Tag 1 ✕] [Tag 2 ✕] */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <button className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 cursor-pointer border border-[#F5D5E2]">
                  <SlidersHorizontal className="h-3 w-3" />
                </button>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif bg-white text-neutral-900 border border-[#F5D5E2]">
                  CS301 Relational <span className="text-[10px] text-neutral-500 cursor-pointer">✕</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif bg-white text-neutral-900 border border-[#F5D5E2]">
                  Sem {student?.semester} Core <span className="text-[10px] text-neutral-500 cursor-pointer">✕</span>
                </span>
              </div>
            </div>

            {/* Subject Focus Bento Card (Accent Bento Pink) */}
            <div className="bg-[#FCE4EC] rounded-[28px] p-5 border border-[#F5B8CE] text-neutral-900 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 font-serif">
                    Spatial Aptitude & Engineering
                  </h3>
                  <p className="text-xs text-neutral-600 font-serif leading-relaxed">
                    Visualization, transformation, and analysis of database algorithms and systems architecture.
                  </p>
                </div>
                <button className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer shrink-0 border border-[#F5B8CE]">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Stats Counters matching Image 3 */}
              <div className="grid grid-cols-3 gap-2 py-1 border-y border-[#F5B8CE]/60">
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 font-serif block">Credits</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">16</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 font-serif block">Subjects</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">{subjectsList.length || 4}</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 font-serif block">CGPA</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">{student?.cgpa.toFixed(2)}</span>
                </div>
              </div>

              {/* Subject Rows with clean monochrome icons */}
              <div className="space-y-2">
                {subjectsList.map((sub) => {
                  return (
                    <div
                      key={sub.subjectCode}
                      className="p-2.5 rounded-2xl bg-white hover:bg-neutral-50 transition-colors flex items-center justify-between gap-3 border border-[#F5B8CE] shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 bg-[#FDF2F5] border border-[#F5B8CE] text-neutral-800 font-serif font-bold">
                          {sub.subjectCode.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 truncate font-serif leading-snug">
                            {sub.subjectName}
                          </h5>
                          <p className="text-[10px] text-neutral-500 truncate font-serif">
                            {sub.subjectCode} • Internal {sub.internal}/30 • External {sub.external}/70
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold font-serif shrink-0 border-[#F5B8CE] bg-white text-neutral-900">
                        {sub.grade} ({sub.total}%)
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Examination Clearance Card */}
            <div className={`rounded-[28px] p-5 border shadow-sm transition-all ${
              isCleared 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : isDebarred
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-[#FDF2F5] border-[#F5D5E2] text-neutral-950'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-serif text-neutral-600">
                      Examination Clearance
                    </span>
                    {isCleared && <span className="text-xs">✅</span>}
                  </div>
                  <h4 className="text-base font-bold font-serif leading-tight text-neutral-900">
                    {isCleared ? '100% Cleared & Verified' : isDebarred ? 'Statutory Debarment Lock' : 'Pending Fee Hold'}
                  </h4>
                  <p className="text-xs text-neutral-600 font-serif">
                    {isCleared 
                      ? `Attendance is ${overallAttendance}% (cutoff 75%) and financial dues are ₹0.`
                      : isDebarred
                      ? `Attendance is ${overallAttendance}% (below statutory 75% gate cutoff).`
                      : `Outstanding semester dues: ₹${student?.fees?.outstanding.toLocaleString('en-IN')}`}
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <Button asChild className="w-full rounded-full bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] font-bold text-xs h-9 font-serif shadow-sm">
                  <Link to={isCleared ? "/schedule/exams" : isDebarred ? "/attendance/student" : "/billing-payments"}>
                    {isCleared ? (
                      <span className="flex items-center gap-1.5"><QrCode className="h-3.5 w-3.5" /> Download Hall Ticket</span>
                    ) : isDebarred ? (
                      <span className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> Inspect Shortages</span>
                    ) : (
                      <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Settle Dues</span>
                    )}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Cumulative Standing & Branch Rank */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-serif">Cumulative Standing</span>
                <Badge variant="outline" className="text-[10px] font-bold font-serif border-[#F5B8CE] bg-white text-neutral-900">Rank #3 in Branch</Badge>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-serif text-neutral-900">{student?.cgpa.toFixed(2)}</span>
                  <span className="text-xs text-neutral-500 font-serif">/ 10.0</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 font-serif">
                  <TrendingUp className="h-3 w-3" /> +0.21 vs Sem 5
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-neutral-500 font-serif">
                  <span>Credits Earned</span>
                  <span className="text-neutral-900 font-bold">118 / 160 Total (74%)</span>
                </div>
                <Progress value={74} className="h-1.5 bg-rose-100" />
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT BENTO AREA (8 cols): Video Player + Course Chat + Syllabus Playlist*/}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* TILE 1: ACTIVE GOOGLE MEET CLASSROOM CONSOLE (Requested by User) */}
            <GoogleMeetClassroomCard userRole="student" courseCode="CS301" />

            {/* ===================================================================== */}
            {/* ROW 2: COURSE CHAT (Left) + PLAYLIST (Right) (Faithful to Image 3)   */}
            {/* ===================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              
              {/* BOTTOM LEFT TILE: COURSE CHAT (Matching Image 3) */}
              <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-serif">
                      Course Chat
                    </h3>
                    <span className="text-xs text-neutral-500 font-serif">
                      24 members, 2 online
                    </span>
                  </div>
                  <button className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer border border-[#F5D5E2]">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Chat Stream Bubbles matching Image 3 */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[190px] pr-1">
                  {/* Message 1 (Instructor) */}
                  <div className="flex items-start gap-2.5">
                    <Avatar className="h-7 w-7 rounded-full ring-1 ring-[#F5B8CE] shrink-0">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
                      <AvatarFallback className="text-[10px]">SJ</AvatarFallback>
                    </Avatar>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-xs text-xs font-serif text-neutral-900 space-y-1 max-w-[85%] border border-[#F5D5E2]">
                      <p className="font-semibold text-[11px] text-neutral-900">Dr. Sarah Johnson</p>
                      <p>I fixed the one-point: I placed the vanishing point in the center, but the walls still look flat.</p>
                      <span className="text-[10px] text-neutral-500 block text-right">07:34 AM</span>
                    </div>
                  </div>

                  {/* Message 2 (Student Reply) */}
                  <div className="flex items-end justify-end gap-2">
                    <div className="bg-[#241411] text-white border border-[#44251F] p-3 rounded-2xl rounded-tr-xs text-xs font-serif max-w-[85%] space-y-0.5 shadow-xs">
                      <p>Check the horizontal scale on Slide 14, professor!</p>
                      <span className="text-[9px] opacity-75 block text-right">07:36 AM • Sent</span>
                    </div>
                  </div>
                </div>

                {/* Chat Input & Action Pills Container matching Image 3 */}
                <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-[#F5D5E2]">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type message..."
                      className="w-full bg-white text-neutral-900 text-xs rounded-full pl-4 pr-11 py-2.5 outline-none border border-[#F5D5E2] focus:border-neutral-400 transition-all font-serif"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 w-7 h-7 rounded-full bg-[#241411] text-white flex items-center justify-center hover:bg-[#341B16] transition-all shadow-xs cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Action Pills matching Image 3: [Files] [Images] [Audio] [+] */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toast.info('File attachment dialog opened')}
                      className="flex-1 py-1 px-2 rounded-full bg-white hover:bg-neutral-50 text-[11px] font-serif text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[#F5D5E2]"
                    >
                      <Paperclip className="h-3 w-3" /> Files
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('Image attachment dialog opened')}
                      className="flex-1 py-1 px-2 rounded-full bg-white hover:bg-neutral-50 text-[11px] font-serif text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[#F5D5E2]"
                    >
                      <ImageIcon className="h-3 w-3" /> Images
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('Voice recording started')}
                      className="flex-1 py-1 px-2 rounded-full bg-white hover:bg-neutral-50 text-[11px] font-serif text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[#F5D5E2]"
                    >
                      <Mic className="h-3 w-3" /> Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('More options menu opened')}
                      className="w-7 h-7 rounded-full bg-white hover:bg-neutral-50 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-[#F5D5E2]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* BOTTOM RIGHT TILE: SYLLABUS PLAYLIST (Matching Image 3) */}
              <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] text-neutral-900 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-serif">
                      Spatial Aptitude & Indexing
                    </h3>
                    <span className="text-xs text-neutral-500 font-serif">
                      Lecture 1 Curriculum
                    </span>
                  </div>
                  <button className="w-7 h-7 rounded-full bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer border border-[#F5D5E2]">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Pill Tabs: [Files] [Videos (active terracotta)] [Audio] */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlaylistTab('files')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                      playlistTab === 'files'
                        ? 'bg-[#241411] text-white shadow-xs'
                        : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#F5D5E2]'
                    }`}
                  >
                    Files
                  </button>
                  <button
                    onClick={() => setPlaylistTab('videos')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                      playlistTab === 'videos'
                        ? 'bg-[#241411] text-white shadow-xs'
                        : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#F5D5E2]'
                    }`}
                  >
                    Videos
                  </button>
                  <button
                    onClick={() => setPlaylistTab('audio')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                      playlistTab === 'audio'
                        ? 'bg-[#241411] text-white shadow-xs'
                        : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#F5D5E2]'
                    }`}
                  >
                    Audio
                  </button>
                </div>

                {/* Playlist Tracks matching Image 3 */}
                <div className="space-y-2 flex-1">
                  {playlistLectures.map((item) => {
                    const isActive = activeLectureId === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveLectureId(item.id)}
                        className={`w-full p-2.5 rounded-2xl transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-white shadow-xs border border-[#F5B8CE]'
                            : 'bg-white/70 hover:bg-white text-neutral-600 border border-[#F5D5E2]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            isActive ? 'bg-[#241411] text-white' : 'bg-rose-100 text-neutral-800'
                          }`}>
                            {isActive ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                          </div>
                          <div className="min-w-0">
                            <h5 className={`text-xs font-bold truncate font-serif leading-tight ${isActive ? 'text-neutral-900' : 'text-neutral-600'}`}>
                              {item.title}
                            </h5>
                            <span className="text-[10px] text-neutral-500 font-serif">CS301 Module Track</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold font-serif text-neutral-500 shrink-0">
                          {item.duration}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Link to all courses */}
                <div className="pt-2 border-t border-[#F5D5E2] text-center">
                  <Link to="/courses/my-courses" className="text-xs font-bold font-serif text-neutral-900 hover:underline inline-flex items-center gap-1">
                    Explore All Course Media <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOWER BENTO ROW: Schedule Timeline + Performance Trend + Worksheets      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Today's Schedule Timeline (4 cols) */}
          <div className="lg:col-span-4 bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Today's Class Schedule
                </h3>
                <span className="text-xs text-neutral-500 font-serif">
                  Verified lecture timeline & attendance
                </span>
              </div>
              <Badge variant="outline" className="text-xs font-serif border-[#F5B8CE] bg-white text-neutral-900">Today</Badge>
            </div>

            <div className="space-y-2.5">
              {todayTimeline.map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#F5D5E2]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="text-center shrink-0 w-14">
                      <span className="text-[11px] font-bold font-serif text-neutral-900 block">{slot.time}</span>
                      <span className="text-[10px] text-neutral-500 font-serif">{slot.room}</span>
                    </div>
                    <div className="h-6 w-0.5 bg-[#F5D5E2] shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-neutral-900 truncate font-serif">{slot.subject}</h5>
                      <p className="text-[10px] text-neutral-500 truncate font-serif">{slot.faculty}</p>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {slot.status === 'attended' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-serif border border-emerald-200">Attended</span>
                    ) : slot.status === 'recess' ? (
                      <span className="text-[10px] font-medium text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded-full font-serif">Recess</span>
                    ) : (
                      <span className="text-[10px] font-bold text-neutral-900 bg-white px-2 py-0.5 rounded-full font-serif border border-[#F5D5E2]">Upcoming</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trend Line Chart (5 cols) */}
          <div className="lg:col-span-5 bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Academic Performance Trend
                </h3>
                <span className="text-xs text-neutral-500 font-serif">
                  Multi-Quarter continuous assessment vs attendance
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['Quarter 1', 'Quarter 2', 'Mid-Sem', 'Quarter 3', 'Final'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(q)}
                    className={`px-2 py-0.5 text-[10px] font-bold font-serif rounded-lg transition-all cursor-pointer ${
                      selectedQuarter === q ? 'bg-[#241411] text-white' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[210px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="period" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#F5D5E2',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: '"Times New Roman", Times, Georgia, serif',
                      color: '#000000'
                    }}
                  />
                  <Line type="monotone" dataKey="attendance" name="Attendance (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="examScore" name="Exam Average (%)" stroke="#241411" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Worksheets & Tasks (3 cols) */}
          <div className="lg:col-span-3 bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Pending Worksheets
              </h3>
              <Badge variant="secondary" className="text-[10px] font-serif bg-white border border-[#F5B8CE] text-neutral-800">3 Pending</Badge>
            </div>

            <div className="space-y-2">
              {pendingWorksheets.map((item) => (
                <div key={item.id} className="p-2.5 rounded-2xl bg-white border border-[#F5D5E2] space-y-1">
                  <h5 className="text-xs font-bold text-neutral-900 truncate font-serif">{item.title}</h5>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-serif">
                    <span className="font-bold text-neutral-900">{item.subject} • {item.points} Pts</span>
                    <span className="text-rose-600 font-medium">{item.due}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button asChild className="w-full rounded-full bg-[#8F361E] hover:bg-[#772C17] text-white text-xs font-bold h-8 font-serif shadow-sm">
                <Link to="/courses/assignments">Open Assignments Hub</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Class Faculties Contacts Strip */}
        <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 font-serif">Assigned Subject Tutors & Office Hours</h3>
            <span className="text-xs text-neutral-500 font-serif">Institutional Faculty Register</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {faculties.map((f) => (
              <div key={f.code} className="p-3 rounded-2xl bg-white border border-[#F5D5E2] flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-9 w-9 rounded-full ring-1 ring-[#F5B8CE] shrink-0">
                    <AvatarImage src={f.avatar} />
                    <AvatarFallback className="text-xs font-serif bg-neutral-200 text-neutral-900">{f.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-neutral-900 truncate font-serif">{f.name}</h5>
                    <p className="text-[10px] text-neutral-500 truncate font-serif">{f.subject}</p>
                    <span className="text-[10px] font-bold text-black font-serif">{f.code}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild className="h-7 text-xs px-2.5 rounded-full font-serif shrink-0 border-[#F5B8CE] text-neutral-900 hover:bg-neutral-100">
                  <a href={`mailto:${f.email}`}><Mail className="h-3 w-3" /></a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
