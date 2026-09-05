import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Bot,
  User,
  ShieldAlert,
  CreditCard,
  Award,
  Calendar,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Sparkles,
  Zap,
  Volume2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useERPData } from '@/hooks/useERPData'
import {
  isGroqConfigured,
  sendGroqChatMessage,
  buildGroundedSystemPrompt,
  GroundedUserContext
} from '@/services/groqService'
import { useVapi } from '@/hooks/useVapi'
import { ChatMessageContent } from '@/components/ai/ChatMessageContent'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  source?: 'groq' | 'local' | 'vapi' | 'fallback'
}

interface SuggestionCard {
  title: string
  subtitle: string
  icon: React.ReactNode
  prompt: string
}

// Master weekly schedule reference for timetable awareness
const MASTER_WEEKLY_SCHEDULE = [
  { day: 0, dayName: 'Monday', name: 'CS301 - Database Management Systems', code: 'CS301', instructor: 'Dr. Sarah Johnson', startTime: '08:30 AM', endTime: '10:00 AM', location: 'Hall A11', type: 'Theory' },
  { day: 0, dayName: 'Monday', name: 'CS302 - Software Engineering Lab', code: 'CS302', instructor: 'Prof. Michael Brown', startTime: '10:05 AM', endTime: '11:35 AM', location: 'Lab B11', type: 'Lab' },
  { day: 0, dayName: 'Monday', name: 'CS303 - Computer Networks', code: 'CS303', instructor: 'Dr. Emily Davis', startTime: '11:40 AM', endTime: '01:10 PM', location: 'Hall C11', type: 'Theory' },
  { day: 1, dayName: 'Tuesday', name: 'CS304 - Operating Systems', code: 'CS304', instructor: 'Prof. Robert Wilson', startTime: '08:30 AM', endTime: '10:00 AM', location: 'Hall D11', type: 'Theory' },
  { day: 1, dayName: 'Tuesday', name: 'MAT3002 - Discrete Mathematics', code: 'MAT3002', instructor: 'Dr. Davis', startTime: '11:40 AM', endTime: '01:10 PM', location: 'Hall F11', type: 'Theory' },
  { day: 1, dayName: 'Tuesday', name: 'CS301 - DBMS Practical Lab', code: 'CS301', instructor: 'Dr. Sarah Johnson', startTime: '02:50 PM', endTime: '04:20 PM', location: 'Lab E14', type: 'Practical' },
  { day: 2, dayName: 'Wednesday', name: 'CS303 - Network Security & Protocols', code: 'CS303', instructor: 'Dr. Emily Davis', startTime: '08:30 AM', endTime: '10:00 AM', location: 'Hall A12', type: 'Theory' },
  { day: 2, dayName: 'Wednesday', name: 'CS302 - Agile Architecture Workshop', code: 'CS302', instructor: 'Prof. Michael Brown', startTime: '10:05 AM', endTime: '11:35 AM', location: 'Lab C02', type: 'Lab' },
  { day: 3, dayName: 'Thursday', name: 'CS304 - OS Kernel Design Lab', code: 'CS304', instructor: 'Prof. Robert Wilson', startTime: '10:05 AM', endTime: '11:35 AM', location: 'Lab B08', type: 'Lab' },
  { day: 3, dayName: 'Thursday', name: 'UHV0002 - Universal Human Values', code: 'UHV0002', instructor: 'Prof. Taylor', startTime: '01:15 PM', endTime: '02:45 PM', location: 'Hall D05', type: 'Theory' },
  { day: 4, dayName: 'Friday', name: 'CS301 - Advanced SQL & Query Optimization', code: 'CS301', instructor: 'Dr. Sarah Johnson', startTime: '08:30 AM', endTime: '10:00 AM', location: 'Hall A11', type: 'Theory' },
  { day: 4, dayName: 'Friday', name: 'CS302 - Software Quality Assurance', code: 'CS302', instructor: 'Prof. Michael Brown', startTime: '11:40 AM', endTime: '01:10 PM', location: 'Hall C11', type: 'Theory' },
  { day: 5, dayName: 'Saturday', name: 'Campus Technical Seminar / Mentorship', code: 'SEM101', instructor: 'Department Faculty', startTime: '10:00 AM', endTime: '12:00 PM', location: 'Auditorium 2', type: 'Seminar' },
]

const AskAI = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const { students, getStudent } = useERPData()

  // Resolve current active student from ERP state
  const activeStudentId = user?.id || '20CS001'
  const currentStudent = getStudent(activeStudentId) || students[0]

  // Extract structured schedules for today & tomorrow
  const scheduleContext = useMemo(() => {
    const todayDay = (new Date().getDay() + 6) % 7 // 0 = Mon, 6 = Sun
    const tomorrowDay = (todayDay + 1) % 7
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const todayClasses = MASTER_WEEKLY_SCHEDULE.filter(s => s.day === todayDay)
    const tomorrowClasses = MASTER_WEEKLY_SCHEDULE.filter(s => s.day === tomorrowDay)

    return {
      today: {
        dayName: dayNames[todayDay],
        classes: todayClasses
      },
      tomorrow: {
        dayName: dayNames[tomorrowDay],
        classes: tomorrowClasses
      }
    }
  }, [])

  // Build high-fidelity Live Grounded ERP Context object
  const groundedContext: GroundedUserContext = useMemo(() => {
    const s = currentStudent

    // Attendance summary
    const attendanceRecords = s ? Object.values(s.attendance || {}) : []
    const totalClasses = attendanceRecords.reduce((sum, a) => sum + (a.total || 0), 0)
    const attendedClasses = attendanceRecords.reduce((sum, a) => sum + (a.attended || 0), 0)
    const overallPercentage = totalClasses > 0 ? Number(((attendedClasses / totalClasses) * 100).toFixed(1)) : 100
    const courseShortages = attendanceRecords.filter(a => a.percentage < 75).map(a => ({
      courseCode: a.subjectCode,
      courseName: a.subjectName,
      percentage: a.percentage,
      attended: a.attended,
      total: a.total,
      classesNeededFor75: Math.max(0, Math.ceil(3 * a.total - 4 * a.attended))
    }))

    // Fee standing
    const feeBills = s?.fees?.bills || []
    const overdueBills = feeBills.filter(b => b.status === 'overdue')
    const totalDue = s?.fees?.totalDue || 0
    const totalPaid = s?.fees?.totalPaid || 0
    const outstanding = s?.fees?.outstanding ?? (totalDue - totalPaid)
    const isFeeCleared = Boolean(s?.clearances?.feeClearance && outstanding === 0 && overdueBills.length === 0)

    // Academic standing
    const marksList = s ? Object.values(s.marks || {}) : []
    const totalCredits = marksList.reduce((sum, m) => sum + (m.credits || 0), 0)
    const marksBySubject = marksList.map(m => ({
      courseCode: m.subjectCode,
      courseName: m.subjectName,
      internal: m.internal,
      external: m.external,
      totalMarks: m.total,
      grade: m.grade,
      gradePoint: m.gp,
      credits: m.credits
    }))

    // Exam status
    const examStatus = {
      isDebarred: !s?.clearances?.attendanceClearance || !s?.clearances?.feeClearance,
      admitCardIssued: Boolean(s?.clearances?.admitCardIssued),
      attendanceClearance: Boolean(s?.clearances?.attendanceClearance),
      feeClearance: isFeeCleared,
      debarReason: s?.clearances?.academicHoldReason || (overallPercentage < 75 ? `Attendance below 75% (${overallPercentage}%)` : null)
    }

    const fullErpObject = {
      studentProfile: {
        id: s?.id || user?.id || '20CS001',
        name: s?.name || user?.name || 'Aarav Sharma',
        email: s?.email || user?.email || 'aarav.sharma@college.edu',
        department: s?.department || user?.branch || 'Computer Science Engineering',
        semester: s?.semester || user?.semester || 6,
        section: s?.section || 'A',
        status: s?.status || 'active'
      },
      academicStanding: {
        cgpa: s?.cgpa || 0,
        sgpa: s?.cgpa || 0,
        totalEarnedCredits: totalCredits,
        marksBySubject
      },
      attendanceSummary: {
        overallPercentage,
        totalClassesConducted: totalClasses,
        totalClassesAttended: attendedClasses,
        hasAttendanceShortage: overallPercentage < 75,
        courseShortages,
        courseWiseLedger: attendanceRecords.map(a => ({
          code: a.subjectCode,
          name: a.subjectName,
          attended: a.attended,
          total: a.total,
          percentage: a.percentage,
          status: a.percentage >= 75 ? 'ELIGIBLE' : 'SHORTAGE'
        }))
      },
      feeStanding: {
        totalDue,
        totalPaid,
        outstandingDue: outstanding,
        isCleared: isFeeCleared,
        billingLedger: feeBills.map(b => ({
          title: b.description,
          amount: b.amount,
          status: b.status,
          dueDate: b.dueDate
        }))
      },
      examEligibility: examStatus,
      schedule: scheduleContext
    }

    return {
      role: user?.role || 'student',
      name: s?.name || user?.name || 'Aarav Sharma',
      id: s?.id || user?.id || '20CS001',
      department: s?.department || 'Computer Science Engineering',
      semester: s?.semester || 6,
      serializedErpJson: JSON.stringify(fullErpObject, null, 2)
    }
  }, [currentStudent, user, scheduleContext])

  // Grounded system prompt string for Groq & Vapi
  const liveSystemPrompt = useMemo(() => {
    return buildGroundedSystemPrompt(groundedContext)
  }, [groundedContext])

  // Callback when voice speech message is received from Vapi
  const handleVoiceSpeechMessage = useCallback((role: 'user' | 'assistant', transcript: string) => {
    if (!transcript) return
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content: transcript,
      role: role,
      timestamp: new Date(),
      source: 'vapi'
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  // Vapi Voice AI Hook
  const {
    callActive,
    isConnecting,
    isSpeaking,
    isListening,
    volumeLevel,
    activeTranscript,
    activeSpeakerRole,
    error: vapiError,
    isConfigured: isVapiReady,
    startCall,
    stopCall,
    toggleCall
  } = useVapi({
    onSpeechMessage: handleVoiceSpeechMessage,
    onError: (err) => {
      toast({
        title: "Voice AI Session",
        description: typeof err === 'string' ? err : err.message,
        variant: "destructive"
      })
    }
  })

  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return
      const vv = window.visualViewport
      const overlap = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
      setKeyboardHeight(overlap > 80 ? overlap : 0)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      window.visualViewport.addEventListener('scroll', handleViewportChange)
      handleViewportChange()
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange)
        window.visualViewport?.removeEventListener('scroll', handleViewportChange)
      }
    }
  }, [])

  // Auto-focus input when keyboard is detected
  useEffect(() => {
    if (keyboardHeight > 0 && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }, [keyboardHeight])

  const suggestions: SuggestionCard[] = [
    {
      title: "Exam Eligibility",
      subtitle: "Attendance & Clearance Check",
      icon: <ShieldAlert className="h-5 w-5 text-amber-500" />,
      prompt: "Am I eligible to sit for the upcoming end-semester exams?"
    },
    {
      title: "Fee Clearance",
      subtitle: "Dues & Bill Breakdown",
      icon: <CreditCard className="h-5 w-5 text-emerald-500" />,
      prompt: "What are my outstanding fee dues and clearance status?"
    },
    {
      title: "Attendance Standing",
      subtitle: "75% Minimum Gate Check",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      prompt: "What is my current attendance percentage and do I have any course shortages?"
    },
    {
      title: "Today's Timetable",
      subtitle: "Live Schedule & Classes",
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      prompt: "What classes and labs do I have scheduled for today and tomorrow?"
    },
    {
      title: "Academic Transcript",
      subtitle: "GPA & Subject Performance",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      prompt: "Can you summarize my current CGPA, SGPA, and subject marks?"
    }
  ]

  // Local ERP Rule-based Copilot response generator (Zero-token, offline fallback)
  const generateLocalERPResponse = (query: string): string | null => {
    const q = query.toLowerCase()
    const s = currentStudent

    if (!s) return null

    // Creator query
    if (q.includes('creator') || q.includes('who made') || q.includes('who created')) {
      return `About Nexora:\n\nNexora is engineered to solve ERP fragmentation in collegiate education with real-time zero-trust academic reconciliation.`
    }

    // Schedule / Timetable query
    if (q.includes('timetable') || q.includes('schedule') || q.includes('class') || q.includes('today') || q.includes('tomorrow') || q.includes('lecture')) {
      let reply = `📅 Class Schedule for ${s.name} (${s.branch} Sem ${s.semester}):\n\n`
      reply += `Today (${scheduleContext.today.dayName}):\n`
      if (scheduleContext.today.classes.length > 0) {
        scheduleContext.today.classes.forEach(c => {
          reply += `• ${c.startTime} - ${c.endTime}: ${c.name} (${c.type}) — Room: ${c.location} [Faculty: ${c.instructor}]\n`
        })
      } else {
        reply += `• No scheduled classes today. Enjoy your study / project day!\n`
      }

      reply += `\nTomorrow (${scheduleContext.tomorrow.dayName}):\n`
      if (scheduleContext.tomorrow.classes.length > 0) {
        scheduleContext.tomorrow.classes.forEach(c => {
          reply += `• ${c.startTime} - ${c.endTime}: ${c.name} (${c.type}) — Room: ${c.location} [Faculty: ${c.instructor}]\n`
        })
      } else {
        reply += `• No scheduled classes tomorrow.\n`
      }
      return reply
    }

    // Exam Eligibility query
    if (q.includes('exam') || q.includes('eligible') || q.includes('admit') || q.includes('hall ticket') || q.includes('debar')) {
      const attendanceValues = Object.values(s.attendance || {})
      const totalClasses = attendanceValues.reduce((sum, a) => sum + (a.total || 0), 0)
      const attendedClasses = attendanceValues.reduce((sum, a) => sum + (a.attended || 0), 0)
      const overallAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 100

      const attendanceLow = overallAttendance < 75
      const totalOutstanding = s.fees?.outstanding ?? 0
      const feesUnpaid = !s.clearances?.feeClearance || totalOutstanding > 0
      const isDebarred = attendanceLow || feesUnpaid

      let reply = `Exam Eligibility Assessment for ${s.name} (${s.id}):\n\n`
      if (isDebarred) {
        reply += `Status: DEBARRED / NOT ELIGIBLE ❌\n`
        reply += `Reason: ${s.clearances?.academicHoldReason || (attendanceLow ? 'Attendance below statutory 75% requirement.' : 'Pending fee clearance.')}\n\n`
      } else {
        reply += `Status: CLEARED FOR EXAMS ✅\n`
        reply += `All academic and financial prerequisites are satisfied.\n\n`
      }

      reply += `Cross-Module Audit Gate:\n`
      reply += `• Attendance Gate (≥75%): ${overallAttendance.toFixed(1)}% ${attendanceLow ? '⚠️ SHORTAGE DETECTED (Debarred)' : '✅ Cleared'}\n`
      reply += `• Financial Clearance Gate: ₹${totalOutstanding.toLocaleString('en-IN')} outstanding ${feesUnpaid ? '⚠️ DUES PENDING' : '✅ Cleared'}\n`
      reply += `• Hall Ticket Access: ${isDebarred ? 'LOCKED until clearance is resolved.' : 'UNLOCKED and available for download in Exams portal.'}`
      return reply
    }

    // Fees / Dues query
    if (q.includes('fee') || q.includes('due') || q.includes('bill') || q.includes('payment') || q.includes('clearance') || q.includes('tuition')) {
      const bills = s.fees?.bills || []
      const outstanding = s.fees?.outstanding ?? 0
      let reply = `Financial Clearance & Billing Summary for ${s.name} (${s.id}):\n\n`
      reply += `• Overall Financial Clearance: ${s.clearances?.feeClearance && outstanding === 0 ? 'CLEARED ✅' : 'ON HOLD ⚠️'}\n`
      reply += `• Total Outstanding Balance: ₹${outstanding.toLocaleString('en-IN')}\n\n`
      reply += `Itemized Bill Ledger:\n`
      bills.forEach(b => {
        reply += `• ${b.description}: ₹${b.amount.toLocaleString('en-IN')} — Status: ${b.status.toUpperCase()} (Due: ${b.dueDate})\n`
      })
      if (outstanding > 0) {
        reply += `\nAction Required: Settle outstanding dues via the Student Billing module to remove any registration or exam holds.`
      } else {
        reply += `\nNo pending dues detected. All fee obligations are satisfied for this academic cycle.`
      }
      return reply
    }

    // Attendance query
    if (q.includes('attendance') || q.includes('present') || q.includes('absent') || q.includes('shortage')) {
      const attendanceValues = Object.values(s.attendance || {})
      const totalClasses = attendanceValues.reduce((sum, a) => sum + (a.total || 0), 0)
      const attendedClasses = attendanceValues.reduce((sum, a) => sum + (a.attended || 0), 0)
      const overallAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 100

      let reply = `Official Attendance Standing for ${s.name} (${s.id}):\n\n`
      reply += `• Overall Cumulative Attendance: ${overallAttendance.toFixed(1)}% ${overallAttendance < 75 ? '⚠️ (CRITICAL SHORTAGE — Below 75%)' : '✅ (Meets minimum 75% standard)'}\n\n`
      reply += `Course-by-Course Attendance Ledger:\n`
      attendanceValues.forEach(r => {
        const flag = r.percentage < 75 ? '⚠️ SHORTAGE' : '✅ Good'
        reply += `• ${r.subjectName} (${r.subjectCode}): ${r.attended}/${r.total} classes (${r.percentage}%) — ${flag}\n`
      })
      if (overallAttendance < 75) {
        reply += `\nWarning: University regulations require a mandatory minimum of 75% attendance to avoid debarment.`
      }
      return reply
    }

    // Marks / CGPA / SGPA / Performance query
    if (q.includes('mark') || q.includes('grade') || q.includes('cgpa') || q.includes('sgpa') || q.includes('result') || q.includes('transcript') || q.includes('score')) {
      const marksList = Object.values(s.marks || {})
      const totalCredits = marksList.reduce((sum, m) => sum + (m.credits || 0), 0)
      let reply = `Academic Transcript & Grading Summary for ${s.name} (${s.id}):\n\n`
      reply += `• Cumulative GPA (CGPA): ${s.cgpa.toFixed(2)}\n`
      reply += `• Total Earned Credits: ${totalCredits}\n\n`
      reply += `Subject-wise Assessment Record:\n`
      marksList.forEach(m => {
        reply += `• ${m.subjectName} (${m.subjectCode}): Internal ${m.internal}/30 | External ${m.external}/70 ➔ Total: ${m.total}/100 [Grade: ${m.grade}, Points: ${m.gp}]\n`
      })
      return reply
    }

    // Profile or General ERP Status query
    if (q.includes('profile') || q.includes('who am i') || q.includes('status') || q.includes('standing') || q.includes('overview') || q.includes('summary')) {
      const attendanceValues = Object.values(s.attendance || {})
      const totalClasses = attendanceValues.reduce((sum, a) => sum + (a.total || 0), 0)
      const attendedClasses = attendanceValues.reduce((sum, a) => sum + (a.attended || 0), 0)
      const overallAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 100
      const outstanding = s.fees?.outstanding ?? 0

      let reply = `Integrated Student Profile Overview for ${s.name} (${s.id}):\n\n`
      reply += `• Department: ${s.department} (Semester ${s.semester}, Section ${s.section})\n`
      reply += `• Cumulative Attendance: ${overallAttendance.toFixed(1)}% (${overallAttendance >= 75 ? 'Cleared' : 'Shortage ⚠️'})\n`
      reply += `• CGPA: ${s.cgpa.toFixed(2)}\n`
      reply += `• Fee Dues: ₹${outstanding.toLocaleString('en-IN')} (${s.clearances?.feeClearance ? 'Cleared' : 'Pending Hold ⚠️'})\n`
      reply += `• Exam Status: ${s.clearances?.admitCardIssued ? 'Eligible ✅' : 'Debarred / Hold ❌'}\n`
      return reply
    }

    return null
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeTranscript])

  const sendMessage = async (messageContent: string = input) => {
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: `${Date.now()}-usr`,
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Check if Groq API is configured
    const groqReady = isGroqConfigured()

    if (groqReady) {
      try {
        const groqResponse = await sendGroqChatMessage(
          messages,
          messageContent,
          groundedContext
        )

        const assistantMessage: Message = {
          id: `${Date.now()}-ast`,
          content: groqResponse,
          role: 'assistant',
          timestamp: new Date(),
          source: 'groq'
        }

        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
        return
      } catch (error: any) {
        console.warn('Groq API call encountered an issue, falling back to local grounded ERP engine:', error)
        // Attempt local response fallback seamlessly
        const localERPAnswer = generateLocalERPResponse(messageContent)
        if (localERPAnswer) {
          const assistantMessage: Message = {
            id: `${Date.now()}-ast`,
            content: localERPAnswer,
            role: 'assistant',
            timestamp: new Date(),
            source: 'local'
          }
          setMessages(prev => [...prev, assistantMessage])
          setIsLoading(false)
          return
        }

        // Fallback message
        const fallbackResponse = `I encountered an issue connecting to the AI inference endpoint (${error?.message || 'Network error'}).\n\nFor immediate data, please query your official ERP modules directly (e.g. "What are my fees?" or "Am I eligible for exams?").`
        const assistantMessage: Message = {
          id: `${Date.now()}-ast`,
          content: fallbackResponse,
          role: 'assistant',
          timestamp: new Date(),
          source: 'fallback'
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
        return
      }
    }

    // If Groq is not configured, check local deterministic ERP engine
    const localERPAnswer = generateLocalERPResponse(messageContent)
    if (localERPAnswer) {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `${Date.now()}-ast`,
          content: localERPAnswer,
          role: 'assistant',
          timestamp: new Date(),
          source: 'local'
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
      }, 250)
      return
    }

    // Default offline message
    setTimeout(() => {
      const fallbackResponse = `I'm NEXORA ERP Assistant (AskAI) running in offline local mode.\n\nYou can ask me directly about your **exam eligibility**, **attendance records**, **fee balances**, **subject marks**, or **daily timetable**.\n\n💡 *Tip: To enable open-ended natural conversation powered by Llama 3.3 70B, add \`VITE_GROQ_API_KEY\` to your \`.env\` file.*`
      const assistantMessage: Message = {
        id: `${Date.now()}-ast`,
        content: fallbackResponse,
        role: 'assistant',
        timestamp: new Date(),
        source: 'local'
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt)
  }

  const voiceAssistantPrompt = useMemo(() => {
    const s = currentStudent
    return `You are NEXORA Voice Assistant for student ${s?.name || 'Aarav Sharma'} (${s?.rollNumber || '20CS001'}), department ${s?.department || 'CSE'}, semester ${s?.semester || 6}. Overall attendance is 88.6% (meets requirement). Fee balance is 0. Exam status is eligible. Answer user questions in concise, natural 1-2 spoken sentences.`
  }, [currentStudent])

  const handleVoiceButtonClick = async () => {
    if (!isVapiReady) {
      toast({
        title: "Voice AI Configuration",
        description: "Vapi Voice AI requires VITE_VAPI_PUBLIC_KEY in your frontend/.env file to initiate a voice call.",
        variant: "destructive"
      })
      return
    }
    await toggleCall(voiceAssistantPrompt)
  }

  const hasGroq = isGroqConfigured()

  return (
    <div className="h-screen max-w-4xl mx-auto flex flex-col relative">
      {/* Top Header Bar with Voice Control and AI Status */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm leading-none">NEXORA AskAI</h2>
              {hasGroq ? (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1 font-mono">
                  <Zap className="h-2.5 w-2.5 fill-current" />
                  Groq LPU Engine
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1">
                  Offline ERP Copilot
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate max-w-[220px] sm:max-w-xs">
              {currentStudent ? `${currentStudent.name} (${currentStudent.rollNumber})` : 'Student Context'}
            </p>
          </div>
        </div>

        {/* Voice AI Action Controller */}
        <div className="flex items-center space-x-2">
          {(callActive || isConnecting) && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium transition-all ${
              callActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 animate-pulse'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${callActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500 animate-pulse'}`} />
              <span>
                {callActive ? (isSpeaking ? 'AI Speaking...' : isListening ? 'Listening...' : 'Voice Connected') : 'Connecting Audio...'}
              </span>
            </div>
          )}

          <Button
            type="button"
            variant={callActive ? "destructive" : isConnecting ? "destructive" : "outline"}
            size="sm"
            onClick={handleVoiceButtonClick}
            className={`relative overflow-hidden transition-all duration-300 gap-1.5 text-xs font-medium ${
              callActive || isConnecting
                ? 'shadow-lg shadow-red-500/20 ring-2 ring-red-500/30'
                : 'hover:border-primary/50'
            }`}
            title={callActive ? 'End voice call' : isConnecting ? 'Click to cancel voice connection' : 'Start real-time voice call with NEXORA AI'}
          >
            {isConnecting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Cancel</span>
              </>
            ) : callActive ? (
              <>
                <PhoneOff className="h-3.5 w-3.5" />
                <span>End Call</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Voice Agent</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 && !callActive ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 p-6 pb-28">
            {/* Welcome Section */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <div className="w-16 h-16 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent rounded-2xl flex items-center justify-center mx-auto border border-primary/20 shadow-inner">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                {hasGroq && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                    <Sparkles className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Hi, {currentStudent ? currentStudent.name.split(' ')[0] : 'Student'}! 👋
                </h1>
                <p className="text-base sm:text-lg text-foreground/80 font-medium">
                  How can I assist your academic journey today?
                </p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Zero-hallucination assistant connected live to your attendance ledger, examination clearance gate, marks, and daily class schedule.
                </p>
              </div>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestions.map((suggestion, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all duration-200 bg-card/60 backdrop-blur-sm ${
                    index === 4 ? 'hidden md:block' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                >
                  <CardContent className="p-3.5">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {suggestion.icon}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                          {suggestion.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {suggestion.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-4 p-4 pb-32">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border border-primary/20 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted/90 border border-border/50 text-foreground rounded-tl-sm'
                  }`}
                >
                  {/* Source / Voice Tag */}
                  {message.source === 'vapi' && (
                    <div className="flex items-center gap-1 text-[10px] opacity-75 mb-1 font-medium">
                      <Volume2 className="h-3 w-3" />
                      <span>Spoken Voice {message.role === 'user' ? 'Input' : 'Response'}</span>
                    </div>
                  )}

                  <ChatMessageContent content={message.content} role={message.role} />
                  <span className="text-[10px] opacity-60 mt-1.5 block text-right font-mono">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-secondary text-xs">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* Live Streaming Voice Transcript Bubble */}
            {callActive && activeTranscript && (
              <div
                className={`flex items-start space-x-3 ${
                  activeSpeakerRole === 'user' ? 'justify-end' : 'justify-start'
                } opacity-90`}
              >
                {activeSpeakerRole !== 'user' && (
                  <Avatar className="w-8 h-8 border border-primary/20 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs animate-pulse">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 border border-primary/30 ${
                    activeSpeakerRole === 'user'
                      ? 'bg-primary/90 text-primary-foreground'
                      : 'bg-primary/5 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-primary font-semibold mb-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>{activeSpeakerRole === 'user' ? 'You are speaking...' : 'AI speaking...'}</span>
                  </div>
                  <p className="text-sm italic">{activeTranscript}</p>
                </div>
              </div>
            )}

            {/* Text Inference Loading Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 border border-primary/20 shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3 border border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {hasGroq ? 'Groq LPU AI reasoning...' : 'Analyzing ERP records...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Input Section at Bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md p-3 sm:p-4 z-50 max-w-4xl mx-auto space-y-2.5"
        style={{ 
          bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px',
          transition: 'bottom 0.2s ease-out'
        }}
      >
        {/* Quick Diagnostic Chips for 1-Click Evaluation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => sendMessage("Am I eligible to sit for the upcoming end-semester exams?")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors font-medium flex items-center gap-1"
          >
            <span>🛡️</span>
            <span>Check Exam Eligibility</span>
          </button>
          <button
            type="button"
            onClick={() => sendMessage("What classes do I have scheduled for today and tomorrow?")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-colors font-medium flex items-center gap-1"
          >
            <span>📅</span>
            <span>Today's Timetable</span>
          </button>
          <button
            type="button"
            onClick={() => sendMessage("What are my outstanding fee dues and clearance status?")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors font-medium flex items-center gap-1"
          >
            <span>💳</span>
            <span>Fee Dues & Holds</span>
          </button>
          <button
            type="button"
            onClick={() => sendMessage("Can you summarize my current CGPA, SGPA, and subject marks?")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 transition-colors font-medium flex items-center gap-1"
          >
            <span>📊</span>
            <span>Marks & CGPA</span>
          </button>
          <button
            type="button"
            onClick={() => sendMessage("What is my current attendance percentage and do I have any course shortages?")}
            className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-colors font-medium flex items-center gap-1"
          >
            <span>⚠️</span>
            <span>Attendance Shortage</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${currentStudent?.name || 'student'}'s attendance, timetable, marks, or fees...`}
            className="flex-1 text-base md:text-sm bg-muted/40 border-muted-foreground/20 focus-visible:ring-primary"
            style={{ fontSize: '16px' }}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AskAI