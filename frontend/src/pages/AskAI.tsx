import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, ShieldAlert, CreditCard, Award, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useERPData } from '@/hooks/useERPData'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface SuggestionCard {
  title: string
  subtitle: string
  icon: React.ReactNode
  prompt: string
}

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

  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return
      // Calculate only the actual overlap caused by the keyboard
      const vv = window.visualViewport
      const overlap = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
      setKeyboardHeight(overlap > 80 ? overlap : 0) // threshold to avoid tiny UI chrome shifts
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
      title: "Academic Transcript",
      subtitle: "GPA & Subject Performance",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      prompt: "Can you summarize my current CGPA, SGPA, and subject marks?"
    }
  ]

  // Local ERP Rule-based Copilot response generator (Zero-token, offline-ready)
  const generateLocalERPResponse = (query: string): string | null => {
    const q = query.toLowerCase()
    const s = currentStudent

    if (!s) return null

    // Creator query
    if (q.includes('mausam') || q.includes('creator') || q.includes('who made') || q.includes('who created')) {
      return `About the Creator:\n\nMausam Kar is a Computer Science and Engineering student specializing in Artificial Intelligence and Full-Stack Systems. He engineered CampusSync / Nexora to solve ERP fragmentation in collegiate education.`
    }

    // Exam Eligibility query
    if (q.includes('exam') || q.includes('eligible') || q.includes('admit') || q.includes('hall ticket') || q.includes('debar')) {
      const isDebarred = s.examDebarred
      const attendanceLow = s.overallAttendance < 75
      const feesUnpaid = !s.feeClearance || s.totalDue > 0

      let reply = `Exam Eligibility Assessment for ${s.name} (${s.id}):\n\n`
      if (isDebarred) {
        reply += `Status: DEBARRED / NOT ELIGIBLE ❌\n`
        reply += `Reason: ${s.debarReason || 'Statutory clearance criteria not met.'}\n\n`
      } else {
        reply += `Status: CLEARED FOR EXAMS ✅\n`
        reply += `All academic and financial prerequisites are satisfied.\n\n`
      }

      reply += `Cross-Module Audit Gate:\n`
      reply += `• Attendance Gate (≥75%): ${s.overallAttendance}% ${attendanceLow ? '⚠️ SHORTAGE DETECTED (Debarred)' : '✅ Cleared'}\n`
      reply += `• Financial Clearance Gate: ₹${s.totalDue.toLocaleString('en-IN')} outstanding ${feesUnpaid ? '⚠️ DUES PENDING' : '✅ Cleared'}\n`
      reply += `• Hall Ticket Access: ${isDebarred ? 'LOCKED until clearance is resolved.' : 'UNLOCKED and available for download in Exams portal.'}`
      return reply
    }

    // Fees / Dues query
    if (q.includes('fee') || q.includes('due') || q.includes('bill') || q.includes('payment') || q.includes('clearance') || q.includes('tuition')) {
      let reply = `Financial Clearance & Billing Summary for ${s.name} (${s.id}):\n\n`
      reply += `• Overall Financial Clearance: ${s.feeClearance ? 'CLEARED ✅' : 'ON HOLD ⚠️'}\n`
      reply += `• Total Outstanding Balance: ₹${s.totalDue.toLocaleString('en-IN')}\n\n`
      reply += `Itemized Bill Ledger:\n`
      s.feeBills.forEach(b => {
        reply += `• ${b.title}: ₹${b.amount.toLocaleString('en-IN')} — Status: ${b.status.toUpperCase()} (Due: ${b.dueDate})\n`
      })
      if (s.totalDue > 0) {
        reply += `\nAction Required: Settle outstanding dues via the Student Billing module to remove any registration or exam holds.`
      } else {
        reply += `\nNo pending dues detected. All fee obligations are satisfied for this academic cycle.`
      }
      return reply
    }

    // Attendance query
    if (q.includes('attendance') || q.includes('present') || q.includes('absent') || q.includes('shortage') || q.includes('class')) {
      let reply = `Official Attendance Standing for ${s.name} (${s.id}):\n\n`
      reply += `• Overall Cumulative Attendance: ${s.overallAttendance}% ${s.overallAttendance < 75 ? '⚠️ (CRITICAL SHORTAGE — Below 75%)' : '✅ (Meets minimum 75% standard)'}\n\n`
      reply += `Course-by-Course Attendance Ledger:\n`
      s.attendanceRecords.forEach(r => {
        const flag = r.percentage < 75 ? '⚠️ SHORTAGE' : '✅ Good'
        reply += `• ${r.courseName} (${r.courseId}): ${r.attendedClasses}/${r.totalClasses} classes (${r.percentage}%) — ${flag}\n`
      })
      if (s.overallAttendance < 75) {
        reply += `\nWarning: University regulations require a mandatory minimum of 75% attendance to avoid debarment.`
      }
      return reply
    }

    // Marks / CGPA / SGPA / Performance query
    if (q.includes('mark') || q.includes('grade') || q.includes('cgpa') || q.includes('sgpa') || q.includes('result') || q.includes('transcript') || q.includes('score')) {
      let reply = `Academic Transcript & Grading Summary for ${s.name} (${s.id}):\n\n`
      reply += `• Cumulative GPA (CGPA): ${s.cgpa.toFixed(2)}\n`
      reply += `• Semester GPA (SGPA): ${s.sgpa.toFixed(2)}\n`
      reply += `• Total Earned Credits: ${s.totalCredits}\n\n`
      reply += `Subject-wise Assessment Record:\n`
      s.marks.forEach(m => {
        reply += `• ${m.courseName} (${m.courseCode}): Internal ${m.internalMarks}/30 | Mid-Sem ${m.midSemMarks}/30 | End-Sem ${m.endSemMarks}/40 ➔ Total: ${m.totalMarks}/100 [Grade: ${m.grade}, Points: ${m.gradePoint}]\n`
      })
      return reply
    }

    // Profile or General ERP Status query
    if (q.includes('profile') || q.includes('who am i') || q.includes('status') || q.includes('standing') || q.includes('overview') || q.includes('summary')) {
      let reply = `Integrated Student Profile Overview for ${s.name} (${s.id}):\n\n`
      reply += `• Department: ${s.department} (Semester ${s.semester})\n`
      reply += `• Attendance: ${s.overallAttendance}% (${s.overallAttendance >= 75 ? 'Cleared' : 'Shortage ⚠️'})\n`
      reply += `• CGPA: ${s.cgpa.toFixed(2)} | SGPA: ${s.sgpa.toFixed(2)}\n`
      reply += `• Fee Dues: ₹${s.totalDue.toLocaleString('en-IN')} (${s.feeClearance ? 'Cleared' : 'Pending Hold ⚠️'})\n`
      reply += `• Exam Status: ${s.examDebarred ? 'Debarred ❌' : 'Eligible ✅'}\n`
      return reply
    }

    return null
  }

  // Function to generate system prompt with creator information and live ERP context
  const getSystemPrompt = (message: string): string => {
    const s = currentStudent
    const erpContext = s ? `
LIVE STUDENT ERP CONTEXT (REAL-TIME DATABASE):
• Student ID: ${s.id}
• Full Name: ${s.name}
• Department: ${s.department}, Semester: ${s.semester}
• Overall Attendance: ${s.overallAttendance}% (University Gate: >= 75%)
• Fee Clearance: ${s.feeClearance ? 'CLEARED' : 'PENDING'} (Total Due: ₹${s.totalDue})
• Exam Debarred: ${s.examDebarred ? `YES - ${s.debarReason}` : 'NO - ELIGIBLE'}
• CGPA: ${s.cgpa}, SGPA: ${s.sgpa}, Credits: ${s.totalCredits}
• Subject Marks: ${s.marks.map(m => `${m.courseName}: ${m.totalMarks}/100 (${m.grade})`).join(', ')}
• Course Attendance: ${s.attendanceRecords.map(a => `${a.courseName}: ${a.percentage}%`).join(', ')}
` : ''

    return `You are CampusSync ERP AI, an intelligent integrated assistant for student academic and administrative inquiries.
${erpContext}

Always utilize the student's live ERP data above to answer questions concerning grades, fee balances, exam hall ticket clearance, or attendance.
Provide well-structured answers using clear bullet points and headings. Avoid excessive asterisks.

Question: ${message}`
  }

  // Function to clean and format AI response
  const formatAIResponse = (response: string): string => {
    return response
      .replace(/\*\*\*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\* \*/g, '• ')
      .replace(/^\* /gm, '• ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageContent: string = input) => {
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Check if query can be answered directly by the ERP engine
    const localERPAnswer = generateLocalERPResponse(messageContent)
    if (localERPAnswer) {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: localERPAnswer,
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
      }, 350)
      return
    }

    try {
      // Use environment variable for API key
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
      
      // If API key is not configured, give a helpful fallback response with student context
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        setTimeout(() => {
          const fallbackResponse = `I'm CampusSync ERP AI. For questions about your attendance, fees, marks, or exam hall tickets, ask me directly (e.g. "Am I eligible for exams?").\n\nFor general open-ended queries beyond your ERP records, connect a Gemini API key in .env.local (VITE_GEMINI_API_KEY).`
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: fallbackResponse,
            role: 'assistant',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, assistantMessage])
          setIsLoading(false)
        }, 300)
        return
      }
      
      // Call Gemini API directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: getSystemPrompt(messageContent)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error response:', errorText)
        throw new Error(`Failed to get response from Gemini API. Status: ${response.status}. ${errorText}`)
      }

      const data = await response.json()
      let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
      
      aiResponse = formatAIResponse(aiResponse)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className="h-screen max-w-4xl mx-auto flex flex-col relative">
      {/* Messages Area - Takes remaining space above input */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-8 p-6 pb-20">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground">
                  Hi, {currentStudent ? currentStudent.name.split(' ')[0] : 'Student'}! 👋
                </h1>
                <p className="text-xl text-foreground/80">
                  How can I assist your academic journey today?
                </p>
                <p className="hidden sm:block text-sm text-muted-foreground max-w-md mx-auto">
                  Integrated CampusSync ERP Copilot • Live Attendance &bull; Exam Eligibility Gate &bull; Fee Status &bull; Transcripts
                </p>
              </div>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {suggestions.map((suggestion, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                    index === 3 ? 'hidden md:block' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {suggestion.icon}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
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
          <div className="h-full overflow-y-auto space-y-4 p-4 pb-20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className={`text-sm whitespace-pre-wrap leading-relaxed ${
                    message.role === 'assistant' ? 'space-y-2' : ''
                  }`}>
                    {message.content.split('\n').map((line, index) => {
                      if (line.trim().startsWith('•')) {
                        return (
                          <div key={index} className="flex items-start space-x-2 my-1">
                            <span className="text-primary mt-1">•</span>
                            <span className="flex-1">{line.replace('•', '').trim()}</span>
                          </div>
                        )
                      }
                      return line.trim() ? (
                        <p key={index} className="mb-2 last:mb-0">{line}</p>
                      ) : (
                        <div key={index} className="h-2"></div>
                      )
                    })}
                  </div>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
        className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm p-4 z-50 max-w-4xl mx-auto"
        style={{ 
          bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px',
          transition: 'bottom 0.2s ease-out'
        }}
      >
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 text-base md:text-sm"
            style={{ fontSize: '16px' }} // Prevent zoom on iOS
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AskAI