import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { useERPData } from '@/hooks/useERPData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DaySelectorPills } from '@/components/dashboard/DaySelectorPills'
import { GoogleMeetClassroomCard } from '@/components/dashboard/GoogleMeetClassroomCard'
import lecturePreviewImg from '@/assets/bento/lecture-preview.jpg'
import teacherHeroImg from '@/assets/bento/teacher-hero.jpg'
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  Send,
  ClipboardCheck,
  CheckCheck,
  ChevronRight,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Maximize2,
  Paperclip,
  ImageIcon,
  Mic,
  Plus,
  Radio,
  FileSpreadsheet
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { toast } from 'sonner'

export const TeacherDashboardOverview: React.FC = () => {
  const { user } = useAuth()
  const { students, subjects, recordClassAttendance, serverConnected } = useERPData()
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('CS301')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [playlistTab, setPlaylistTab] = useState<'files' | 'videos' | 'audio'>('videos')
  const [activeLectureId, setActiveLectureId] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQuarter, setSelectedQuarter] = useState<'Quarter 1' | 'Quarter 2' | 'Mid-Sem' | 'Quarter 3' | 'Final'>('Mid-Sem')

  const teacherName = user?.name || 'Prof. Rajesh Iyer'
  const department = user?.branch || 'Computer Science and Engineering'

  // Teacher's assigned courses
  const assignedCourses = [
    { code: 'CS301', name: 'Database Management Systems', credits: 4, enrolled: students.length || 64, avgAttendance: 84.2, gradeAvg: 'A' },
    { code: 'CS302', name: 'Software Engineering', credits: 4, enrolled: students.length || 64, avgAttendance: 86.8, gradeAvg: 'A-' },
    { code: 'CS304', name: 'Operating Systems Architecture', credits: 4, enrolled: students.length || 64, avgAttendance: 81.5, gradeAvg: 'B+' },
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

  // Sample multi-quarter performance trend
  const performanceTrendData = [
    { period: 'Q1', attendance: 86, classAverage: 78 },
    { period: 'Q2', attendance: 88, classAverage: 82 },
    { period: 'Mid-Sem', attendance: 84, classAverage: 85 },
    { period: 'Q3', attendance: 89, classAverage: 81 },
    { period: 'Final', attendance: 92, classAverage: 88 },
  ]

  // Syllabus playlist lectures
  const playlistLectures = [
    { id: 1, title: 'Perspective Basics: B-Tree & Indexing Optimization', duration: '23:28', status: 'live' },
    { id: 2, title: 'Multi-Level Indexing & Hash Buckets Architecture', duration: '18:45', status: 'ready' },
    { id: 3, title: 'Relational Query Execution Plans & Cost Tree', duration: '31:10', status: 'ready' },
    { id: 4, title: 'ACID Transactions & Two-Phase Locking Protocol', duration: '26:40', status: 'ready' },
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    toast.success('Announcement broadcasted to class forum', {
      description: `Sent to all enrolled students in ${selectedSubjectCode}.`
    })
    setChatMessage('')
  }

  return (
    <>
      <SEO 
        title="Faculty Command Center | Nexora ERP"
        description="Bento-grid faculty management console for lecture rosters, continuous assessment, and student attendance tracking."
        keywords="faculty dashboard, bento grid, attendance roster, marks upload, teacher erp"
      />

      <div className="space-y-6 pb-12 max-w-[1440px] mx-auto select-none" style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}>
        
        {/* ========================================================================= */}
        {/* MASTER BENTO GRID: Matching Reference Image 3 Layout                       */}
        {/* Left Column (4 cols): Faculty Syllabus & Cohort Navigation                 */}
        {/* Right Area (8 cols): Featured Lecture Player + Class Chat + Playlist      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT BENTO PANEL (4 cols): Faculty Syllabus & Cohort Lead               */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Header Persona Block matching Image 3 with authentic photo avatar */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-[#F5B8CE] shadow-xs">
                    <AvatarImage src={teacherHeroImg} alt={teacherName} className="object-cover" />
                    <AvatarFallback className="rounded-2xl text-xs font-serif font-bold bg-[#241411] text-white border border-[#44251F]">RI</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-xs text-neutral-500 font-serif block">
                      Welcome back,
                    </span>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-serif leading-snug">
                      {teacherName}
                    </h1>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer border border-[#F5D5E2]">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600 font-serif">
                <Badge variant="outline" className="text-xs font-serif font-bold border-[#F5B8CE] text-neutral-900 bg-white">HOD & Senior Faculty</Badge>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live 0ms Sync Bus
                </span>
              </div>

              {/* Search Bar matching Image 3 with round black search button */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, roll numbers, or lectures..."
                  className="w-full bg-white text-neutral-900 text-xs rounded-full pl-4 pr-11 py-2.5 outline-none border border-[#F5D5E2] focus:border-neutral-400 transition-all font-serif"
                />
                <button className="absolute right-1.5 w-7 h-7 rounded-full bg-[#241411] text-white flex items-center justify-center hover:bg-[#341B16] border border-[#44251F] transition-opacity cursor-pointer shadow-xs">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Filter Chips matching Image 3 */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <button className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center text-neutral-600 shrink-0 cursor-pointer border border-[#F5D5E2]">
                  <SlidersHorizontal className="h-3 w-3" />
                </button>
                {assignedCourses.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedSubjectCode(c.code)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
                      selectedSubjectCode === c.code
                        ? 'bg-[#241411] text-white border border-[#44251F] font-bold shadow-xs'
                        : 'bg-white text-neutral-800 border border-[#F5D5E2] hover:bg-rose-50'
                    }`}
                  >
                    {c.code} {selectedSubjectCode === c.code && <span className="text-[10px] text-white/70">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject / Course Focus Bento Card (matching Spatial Aptitude in Image 3 with soft pastel rose tone) */}
            <div className="bg-[#FCE4EC] rounded-[28px] p-5 border border-[#F5B8CE] text-neutral-900 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 font-serif">
                    Database Systems & Engineering
                  </h3>
                  <p className="text-xs text-neutral-700 font-serif leading-relaxed">
                    Active curriculum: B-Tree Indexing, Concurrency, and Distributed Transactions.
                  </p>
                </div>
                <button className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer shrink-0 border border-[#F5B8CE]">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Stats Counters matching Image 3 */}
              <div className="grid grid-cols-3 gap-2 py-1 border-y border-[#F5B8CE]">
                <div className="text-left">
                  <span className="text-[11px] text-neutral-600 font-serif block">Credits</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">12</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-neutral-600 font-serif block">Courses</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">{assignedCourses.length}</span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-neutral-600 font-serif block">Avg Attd</span>
                  <span className="text-xl font-bold text-neutral-900 font-serif">84.2%</span>
                </div>
              </div>

              {/* Assigned Course List matching Image 3 squircle list */}
              <div className="space-y-2">
                {assignedCourses.map((course) => (
                  <div
                    key={course.code}
                    onClick={() => setSelectedSubjectCode(course.code)}
                    className={`p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                      selectedSubjectCode === course.code
                        ? 'bg-white shadow-xs border-[#F5B8CE]'
                        : 'bg-white/80 hover:bg-white border-[#F5D5E2] text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] border border-[#F5B8CE] flex items-center justify-center text-xs font-bold font-serif text-neutral-900 shrink-0">
                        {course.code.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-neutral-900 truncate font-serif leading-snug">
                          {course.name}
                        </h5>
                        <p className="text-[10px] text-neutral-500 truncate font-serif">
                          {course.code} • {course.enrolled} Students • {course.credits} Credits
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold font-serif shrink-0 border-[#F5B8CE] bg-white text-neutral-900">
                      {course.avgAttendance}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Time Attendance Gatekeeper Console Card (Matching Image 3 Clearance Card) */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-serif text-neutral-600">
                      Attendance Gatekeeper Console
                    </span>
                    <span className="text-xs">⚡</span>
                  </div>
                  <h4 className="text-base font-bold font-serif leading-tight text-neutral-900">
                    Session: {selectedSubjectCode} (Section A)
                  </h4>
                  <p className="text-xs text-neutral-600 font-serif">
                    Statutory threshold &ge;75%. Quick 1-click batch actions broadcast across all student hall ticket gates immediately.
                  </p>
                </div>
              </div>

              {/* Batch Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={() => handleQuickBatchAttendance('present')}
                  className="flex-1 rounded-full bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] font-bold text-xs h-9 gap-1.5 shadow-xs cursor-pointer font-serif"
                >
                  <CheckCheck className="h-4 w-4" /> Mark All Present
                </Button>
                <Button
                  onClick={() => handleQuickBatchAttendance('absent')}
                  variant="outline"
                  className="flex-1 rounded-full border-[#F5D5E2] bg-white text-neutral-900 hover:bg-rose-50 font-bold text-xs h-9 gap-1.5 cursor-pointer font-serif"
                >
                  <AlertTriangle className="h-4 w-4 text-neutral-700" /> Mark All Absent
                </Button>
              </div>

              <div className="pt-1 border-t border-[#F5D5E2]">
                <Button asChild variant="ghost" className="w-full text-xs font-bold font-serif text-neutral-900 hover:underline justify-between p-0 h-7">
                  <Link to="/teacher/attendance" className="flex items-center justify-between w-full">
                    <span>Open Full Detailed Register</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Academic Standing & Faculty Metrics Card */}
            <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-serif">Faculty Standing</span>
                <Badge variant="outline" className="text-[10px] font-bold font-serif border-[#F5B8CE] bg-white text-neutral-900">Score 9.4 / 10</Badge>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-serif text-neutral-900">92.4%</span>
                  <span className="text-xs text-neutral-500 font-serif">Cohort Clearance</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 font-serif">
                  <TrendingUp className="h-3 w-3" /> +100% Synced
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-neutral-500 font-serif">
                  <span>Syllabus Covered</span>
                  <span className="text-neutral-900 font-bold">118 / 150 Hours (78%)</span>
                </div>
                <Progress value={78} className="h-1.5 bg-rose-100" />
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT BENTO AREA (8 cols): Google Meet Console + Course Chat + Playlist */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* TILE 1: ACTIVE GOOGLE MEET CLASSROOM CONSOLE (Requested by User) */}
            <GoogleMeetClassroomCard userRole="teacher" courseCode={selectedSubjectCode} />

            {/* ===================================================================== */}
            {/* ROW 2: COURSE CHAT (Left) + PLAYLIST (Right) (Faithful to Image 3)   */}
            {/* ===================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              
              {/* BOTTOM LEFT TILE: COURSE CHAT (Matching Image 3 in Pinkish Bento Tone) */}
              <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-serif">
                      Faculty & Course Chat
                    </h3>
                    <span className="text-xs text-neutral-500 font-serif">
                      {selectedSubjectCode} Roster • 64 students, 4 online
                    </span>
                  </div>
                  <button className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer border border-[#F5D5E2]">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Chat Stream Bubbles matching Image 3 */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[190px] pr-1">
                  {/* Message 1 (Instructor Prompt) */}
                  <div className="flex items-start gap-2.5">
                    <Avatar className="h-7 w-7 rounded-full ring-1 ring-[#F5B8CE] shrink-0">
                      <AvatarImage src={teacherHeroImg} />
                      <AvatarFallback className="text-[10px]">RI</AvatarFallback>
                    </Avatar>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-xs text-xs font-serif text-neutral-900 space-y-1 max-w-[85%] border border-[#F5D5E2]">
                      <p className="font-semibold text-[11px] text-neutral-900">{teacherName}</p>
                      <p>Reminder: Live Google Meet classroom discussion is open now. Please bring your B-Tree query plans.</p>
                      <span className="text-[10px] text-neutral-500 block text-right">07:34 AM</span>
                    </div>
                  </div>

                  {/* Message 2 (Student Reply) */}
                  <div className="flex items-end justify-end gap-2">
                    <div className="bg-[#241411] text-white border border-[#44251F] p-3 rounded-2xl rounded-tr-xs text-xs font-serif max-w-[85%] space-y-0.5 shadow-xs">
                      <p>Thank you Professor, joining the Google Meet classroom now!</p>
                      <span className="text-[9px] opacity-70 block text-right">07:36 AM • Sent</span>
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
                      placeholder="Broadcast announcement to class..."
                      className="w-full bg-white text-neutral-900 text-xs rounded-full pl-4 pr-11 py-2.5 outline-none border border-[#F5D5E2] focus:border-neutral-400 transition-all font-serif"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 w-7 h-7 rounded-full bg-[#241411] text-white flex items-center justify-center hover:bg-[#341B16] border border-[#44251F] transition-opacity cursor-pointer shadow-xs"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Action Pills matching Image 3: [Files] [Images] [Audio] [+] */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toast.info('Syllabus worksheet attached')}
                      className="flex-1 py-1 px-2 rounded-full bg-white hover:bg-rose-50 text-[11px] font-serif text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[#F5D5E2]"
                    >
                      <Paperclip className="h-3 w-3" /> Files
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('Lecture diagram uploaded')}
                      className="flex-1 py-1 px-2 rounded-full bg-white hover:bg-rose-50 text-[11px] font-serif text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[#F5D5E2]"
                    >
                      <ImageIcon className="h-3 w-3" /> Images
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('Voice announcement recorded')}
                      className="flex-1 py-1 px-2 rounded-full bg-white hover:bg-rose-50 text-[11px] font-serif text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[#F5D5E2]"
                    >
                      <Mic className="h-3 w-3" /> Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.info('Grading options opened')}
                      className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-[#F5D5E2]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* BOTTOM RIGHT TILE: SYLLABUS PLAYLIST (Matching Image 3 in Pinkish Bento Tone) */}
              <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] text-neutral-900 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-serif">
                      Lecture Modules & Syllabus Track
                    </h3>
                    <span className="text-xs text-neutral-500 font-serif">
                      {selectedSubjectCode} Curriculum Schedule
                    </span>
                  </div>
                  <button className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer border border-[#F5D5E2]">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Pill Tabs matching Image 3: [Files] [Videos (active dark)] [Audio] */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlaylistTab('files')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                      playlistTab === 'files'
                        ? 'bg-[#241411] text-white border border-[#44251F] shadow-xs'
                        : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#F5D5E2]'
                    }`}
                  >
                    Files
                  </button>
                  <button
                    onClick={() => setPlaylistTab('videos')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                      playlistTab === 'videos'
                        ? 'bg-[#241411] text-white border border-[#44251F] shadow-xs'
                        : 'bg-white text-neutral-600 hover:text-neutral-900 border border-[#F5D5E2]'
                    }`}
                  >
                    Videos
                  </button>
                  <button
                    onClick={() => setPlaylistTab('audio')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer ${
                      playlistTab === 'audio'
                        ? 'bg-[#241411] text-white border border-[#44251F] shadow-xs'
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
                            : 'bg-white/80 hover:bg-white text-neutral-700 border border-[#F5D5E2]'
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
                            <span className="text-[10px] text-neutral-500 font-serif">{selectedSubjectCode} Module Track</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold font-serif text-neutral-500 shrink-0">
                          {item.duration}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Link to class assignments / attendance */}
                <div className="pt-2 border-t border-[#F5D5E2] text-center">
                  <Link to="/teacher/attendance" className="text-xs font-bold font-serif text-neutral-900 hover:underline inline-flex items-center gap-1">
                    Manage Complete Course Register <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOWER BENTO ROW: Teaching Schedule + Performance Trend + Debarment List   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Today's Teaching Schedule (4 cols) */}
          <div className="lg:col-span-4 bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Today's Teaching Schedule
                </h3>
                <span className="text-xs text-neutral-500 font-serif">
                  Lecture slots & room allocations
                </span>
              </div>
              <Badge variant="outline" className="text-xs font-serif border-[#F5B8CE] bg-white text-neutral-900">Today</Badge>
            </div>

            <div className="space-y-2.5">
              {todayLectures.map((lec, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#F5D5E2]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="text-center shrink-0 w-16">
                      <span className="text-[11px] font-bold font-serif text-neutral-900 block">{lec.time.split(' - ')[0]}</span>
                      <span className="text-[10px] text-neutral-500 font-serif">{lec.room}</span>
                    </div>
                    <div className="h-6 w-0.5 bg-[#F5D5E2] shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-neutral-900 truncate font-serif">{lec.course}</h5>
                      <p className="text-[10px] text-neutral-500 truncate font-serif">{lec.code} • {lec.type}</p>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {lec.status === 'completed' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-serif border border-emerald-200">Completed ✅</span>
                    ) : (
                      <Button asChild size="sm" className="rounded-full h-7 text-xs font-bold bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] px-3 font-serif">
                        <Link to="/teacher/attendance">
                          Launch Register
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance & Attendance Trend (5 cols) */}
          <div className="lg:col-span-5 bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Cohort Attendance & Assessment Trend
                </h3>
                <span className="text-xs text-neutral-500 font-serif">
                  Multi-Quarter continuous evaluation tracking
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['Quarter 1', 'Quarter 2', 'Mid-Sem', 'Quarter 3', 'Final'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(q)}
                    className={`px-2 py-0.5 text-[10px] font-bold font-serif rounded-lg transition-all cursor-pointer ${
                      selectedQuarter === q ? 'bg-[#241411] text-white border border-[#44251F]' : 'text-neutral-600 hover:text-neutral-900'
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
                      borderColor: '#e5e7eb',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: '"Times New Roman", Times, Georgia, serif',
                      color: '#241411'
                    }}
                  />
                  <Line type="monotone" dataKey="attendance" name="Attendance (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="classAverage" name="Class Average (%)" stroke="#241411" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Debarment Watchlist (3 cols) */}
          <div className="lg:col-span-3 bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Debarment Watchlist
              </h3>
              <Badge variant="outline" className="text-[10px] font-serif border-[#F5B8CE] bg-white text-neutral-900">
                {atRiskStudents.length} &lt; 75%
              </Badge>
            </div>

            <div className="space-y-2">
              {atRiskStudents.length > 0 ? (
                atRiskStudents.slice(0, 3).map((s) => {
                  const rec = s.attendance[selectedSubjectCode]
                  const pct = rec ? rec.percentage : s.overallAttendance
                  return (
                    <div key={s.id} className="p-2.5 rounded-2xl bg-white border border-[#F5D5E2] space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-neutral-900 truncate font-serif">{s.name}</h5>
                        <span className="text-xs font-black text-neutral-900">{pct}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-serif">
                        <span>Roll: {s.rollNumber} • Sec {s.section}</span>
                        <button
                          onClick={() => handleRemedialLog(s.name)}
                          className="font-bold text-neutral-900 hover:underline cursor-pointer"
                        >
                          Log Remedial
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6 text-xs text-neutral-500 bg-white rounded-2xl border border-[#F5D5E2] font-serif">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1.5" />
                  All students compliant (&ge;75%)!
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button asChild className="w-full rounded-full bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] text-xs font-bold h-8 font-serif">
                <Link to="/teacher/attendance">Open Full Attendance Register</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Continuous Assessment Compilation Strip */}
        <div className="bg-[#FDF2F5] rounded-[28px] p-5 border border-[#F5D5E2] shadow-sm space-y-3 font-serif">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">Continuous Assessment Evaluations</h3>
            <Link to="/teacher/upload-marks" className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1">
              Open Assessment Engine <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {gradingProgress.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white border border-[#F5D5E2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 font-serif">{item.course}</span>
                  <Badge variant="outline" className="text-[10px] font-bold border-[#F5B8CE] bg-[#FDF2F5] text-neutral-900">{item.endSem}% Complete</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>Internal (30)</span>
                    <span className="text-emerald-700 font-bold">100% Submitted</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>End-Sem External (70)</span>
                    <span className="text-neutral-900 font-bold">{item.endSem}% Evaluated</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default TeacherDashboardOverview
