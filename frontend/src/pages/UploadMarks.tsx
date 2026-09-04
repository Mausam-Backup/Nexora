import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Save, BookOpen, Clock, ArrowLeft, Hash, Users, Edit3, Mail, BarChart3, FileUp, Download, Settings, Printer } from "lucide-react"
import { GenericPageSkeleton } from "@/components/ui/page-skeleton"
import { usePageLoading } from "@/hooks/use-page-loading"
import { useIsMobile } from "@/hooks/use-mobile"
import { SEO } from "@/components/SEO"
import { DetailedMarksDialog } from "@/components/marks/DetailedMarksDialog"
import { ClassStatistics } from "@/components/marks/ClassStatistics"
import { BulkUploadDialog } from "@/components/marks/BulkUploadDialog"
import { useERPData } from "@/hooks/useERPData"
import { exportToCSV, generatePrintableReport } from "@/utils/exportUtils"

interface MarkEntry {
  id: string
  studentId: string
  studentName: string
  internal: number
  external: number
  total: number
  grade: string
  gp: number
  createdAt: string
}

interface SlotData {
  id: string
  subject: string
  code: string
  time: string
  day: string
  room: string
  semester: string
  credits: number
  studentCount: number
}

interface Student {
  id: string
  name: string
  email: string
  semester: string
  section: string
}

export default function UploadMarks() {
  const isLoading = usePageLoading()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotData[]>([])
  const [marksData, setMarksData] = useState<{ [key: string]: MarkEntry[] }>({})
  const [studentsData, setStudentsData] = useState<{ [key: string]: Student[] }>({})
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailedDialogOpen, setDetailedDialogOpen] = useState(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [markFilter, setMarkFilter] = useState<'all' | 'eligible' | 'debarred'>('all')
  const [form, setForm] = useState({ internal: '', external: '' })

  const { students: erpStudents, updateStudentMarks } = useERPData()

  useEffect(() => {
    // Sample slots data
    const sampleSlots: SlotData[] = [
      { 
        id: 'CS301-MON-10', 
        subject: 'Database Management Systems', 
        code: 'CS301',
        time: '10:00 AM - 11:00 AM', 
        day: 'Monday', 
        room: 'Lab-A',
        semester: '6th Semester',
        credits: 4,
        studentCount: erpStudents.length 
      },
      { 
        id: 'CS302-TUE-2', 
        subject: 'Software Engineering', 
        code: 'CS302',
        time: '2:00 PM - 3:00 PM', 
        day: 'Tuesday', 
        room: 'Room-101',
        semester: '6th Semester',
        credits: 4,
        studentCount: erpStudents.length 
      },
      { 
        id: 'CS303-WED-11', 
        subject: 'Computer Networks', 
        code: 'CS303',
        time: '11:00 AM - 12:00 PM', 
        day: 'Wednesday', 
        room: 'Room-205',
        semester: '6th Semester',
        credits: 4,
        studentCount: erpStudents.length 
      },
      { 
        id: 'CS304-THU-3', 
        subject: 'Operating Systems', 
        code: 'CS304',
        time: '3:00 PM - 4:00 PM', 
        day: 'Thursday', 
        room: 'Lab-B',
        semester: '6th Semester',
        credits: 4,
        studentCount: erpStudents.length 
      }
    ]
    
    // Connect unified ERP students to slots
    const unifiedRoster = erpStudents.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      semester: String(s.semester),
      section: s.section
    }))

    const slotStudentsMap: Record<string, Student[]> = {}
    const slotMarksMap: Record<string, MarkEntry[]> = {}

    sampleSlots.forEach(slot => {
      slotStudentsMap[slot.id] = unifiedRoster
      slotMarksMap[slot.id] = erpStudents
        .filter(s => s.marks && s.marks[slot.code])
        .map(s => {
          const m = s.marks[slot.code]
          return {
            id: s.id,
            studentId: s.id,
            studentName: s.name,
            internal: m.internal,
            external: m.external,
            total: m.total,
            grade: m.grade,
            gp: m.gp,
            createdAt: new Date().toISOString()
          }
        })
    })
    
    setSlots(sampleSlots)
    setStudentsData(slotStudentsMap)
    setMarksData(slotMarksMap)
  }, [erpStudents])

  const calculateGrade = (total: number): { grade: string, gp: number } => {
    if (total >= 90) return { grade: 'A+', gp: 10 }
    if (total >= 80) return { grade: 'A', gp: 9 }
    if (total >= 70) return { grade: 'B+', gp: 8 }
    if (total >= 60) return { grade: 'B', gp: 7 }
    if (total >= 50) return { grade: 'C+', gp: 6 }
    if (total >= 40) return { grade: 'C', gp: 5 }
    return { grade: 'F', gp: 0 }
  }

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student)
    
    // Pre-fill form with existing marks if available
    const existingMark = currentMarks.find(m => m.studentId === student.id)
    if (existingMark) {
      setForm({
        internal: existingMark.internal.toString(),
        external: existingMark.external.toString()
      })
    } else {
      setForm({ internal: '', external: '' })
    }
    
    setDialogOpen(true)
  }

  const handleSaveMarks = () => {
    if (!selectedStudent || !selectedSlot) return
    
    const internal = Number(form.internal) || 0
    const external = Number(form.external) || 0
    const total = internal + external
    const { grade, gp } = calculateGrade(total)
    
    const newEntry: MarkEntry = {
      id: crypto.randomUUID(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      internal,
      external,
      total,
      grade,
      gp,
      createdAt: new Date().toISOString(),
    }
    
    // Remove existing entry for this student if any
    const filteredMarks = (marksData[selectedSlot] || []).filter(m => m.studentId !== selectedStudent.id)
    
    const updatedMarksData = {
      ...marksData,
      [selectedSlot]: [newEntry, ...filteredMarks]
    }
    
    // Persist to unified ERP Data
    const slotCode = currentSlot?.code || selectedSlot.split('-')[0]
    updateStudentMarks(selectedStudent.id, slotCode, internal, external)
    
    setMarksData(updatedMarksData)
    setForm({ internal: '', external: '' })
    setDialogOpen(false)
    setSelectedStudent(null)
    toast({ title: 'Marks saved to Unified ERP', description: `${selectedStudent.name} - ${grade} in ${slotCode}` })
  }

  const handleDetailedMarksClick = (student: Student) => {
    setSelectedStudent(student)
    setDetailedDialogOpen(true)
  }

  const handleSaveDetailedMarks = (detailedMarks: any) => {
    if (!selectedStudent || !selectedSlot) return

    const internal = (Object.values(detailedMarks.internal) as number[]).reduce((sum, mark) => sum + mark, 0)
    const external = (Object.values(detailedMarks.external) as number[]).reduce((sum, mark) => sum + mark, 0)
    const total = internal + external
    const { grade, gp } = calculateGrade(total)
    
    const newEntry: MarkEntry = {
      id: crypto.randomUUID(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      internal,
      external,
      total,
      grade,
      gp,
      createdAt: new Date().toISOString(),
    }
    
    // Remove existing entry for this student if any
    const filteredMarks = (marksData[selectedSlot] || []).filter(m => m.studentId !== selectedStudent.id)
    
    const updatedMarksData = {
      ...marksData,
      [selectedSlot]: [newEntry, ...filteredMarks]
    }
    
    // Persist to unified ERP Data
    const slotCode = currentSlot?.code || selectedSlot.split('-')[0]
    updateStudentMarks(selectedStudent.id, slotCode, internal, external)

    setMarksData(updatedMarksData)
    setSelectedStudent(null)
    toast({ title: 'Detailed marks saved to Unified ERP', description: `${selectedStudent.name} - ${grade}` })
  }

  const handleBulkUpload = (bulkMarks: any[]) => {
    if (!selectedSlot) return

    const newEntries = bulkMarks.map(mark => ({
      id: crypto.randomUUID(),
      studentId: mark.studentId,
      studentName: studentsData[selectedSlot]?.find(s => s.id === mark.studentId)?.name || 'Unknown',
      internal: mark.internal,
      external: mark.external,
      total: mark.total,
      grade: mark.grade,
      gp: mark.gp,
      createdAt: new Date().toISOString(),
    }))

    // Remove existing entries for uploaded students
    const existingMarks = marksData[selectedSlot] || []
    const uploadedStudentIds = bulkMarks.map(m => m.studentId)
    const filteredMarks = existingMarks.filter(m => !uploadedStudentIds.includes(m.studentId))
    
    const updatedMarksData = {
      ...marksData,
      [selectedSlot]: [...newEntries, ...filteredMarks]
    }
    
    // Persist to unified ERP Data
    const slotCode = currentSlot?.code || selectedSlot.split('-')[0]
    bulkMarks.forEach(m => {
      updateStudentMarks(m.studentId, slotCode, Number(m.internal), Number(m.external))
    })

    setMarksData(updatedMarksData)
    toast({ 
      title: 'Bulk upload synced to Unified ERP', 
      description: `Uploaded marks for ${bulkMarks.length} students` 
    })
  }

  const exportMarks = () => {
    if (!selectedSlot || !currentSlot) return

    const headers = ['StudentID', 'Name', 'Internal', 'External', 'Total', 'Grade', 'GP']
    const rows = currentMarks.map(mark => [
      mark.studentId,
      mark.studentName,
      mark.internal,
      mark.external,
      mark.total,
      mark.grade,
      mark.gp
    ])

    exportToCSV(`${currentSlot.code}_Grade_Ledger`, headers, rows)
    toast({ title: 'Export successful', description: 'Marks data downloaded as CSV' })
  }

  const printMarksLedger = () => {
    if (!selectedSlot || !currentSlot) return
    generatePrintableReport({
      title: `Official Grade Ledger: ${currentSlot.subject} (${currentSlot.code})`,
      subtitle: `Academic Session 2024-25 • Department of Computer Science • Semester 6`,
      metaDetails: {
        'Subject Name': currentSlot.subject,
        'Subject Code': currentSlot.code,
        'Total Enrolled': currentStudents.length,
        'Graded Count': currentMarks.length,
        'Department': 'Computer Science Engineering'
      },
      columns: ['Roll Number', 'Student Name', 'Internal (30)', 'External (70)', 'Total (100)', 'Grade', 'GP'],
      rows: currentStudents.map(s => {
        const mark = getStudentMark(s.id)
        return [
          s.id,
          s.name,
          mark ? mark.internal : '-',
          mark ? mark.external : '-',
          mark ? mark.total : '-',
          mark ? mark.grade : 'Pending',
          mark ? mark.gp : '-'
        ]
      }),
      summaryStats: [
        { label: 'Total Students', value: currentStudents.length },
        { label: 'Evaluated', value: currentMarks.length },
        { label: 'Pass Rate', value: `${currentMarks.length > 0 ? ((currentMarks.filter(m => m.grade !== 'F').length / currentMarks.length) * 100).toFixed(0) : 0}%` }
      ]
    })
  }

  const currentMarks = selectedSlot ? marksData[selectedSlot] || [] : []
  const currentStudents = selectedSlot ? studentsData[selectedSlot] || [] : []
  const currentSlot = slots.find(s => s.id === selectedSlot)

  const getStudentMark = (studentId: string) => {
    return currentMarks.find(m => m.studentId === studentId)
  }

  if (isLoading) return <GenericPageSkeleton />

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <SEO title="Upload Marks" description="Upload internal and external marks for your students" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {selectedSlot && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedSlot(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Subjects
            </Button>
          )}
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              {selectedSlot ? 'Upload Marks' : 'My Teaching Subjects'}
            </h1>
            <p className="text-muted-foreground text-sm hidden sm:block">
              {selectedSlot ? 'Record internal and external scores' : 'Select a subject to upload marks'}
            </p>
          </div>
        </div>
      </div>

      {!selectedSlot ? (
        // Slots View
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <Card 
              key={slot.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSlot(slot.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {slot.code}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {marksData[slot.id]?.length || 0} Marks
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {slot.subject}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{slot.day} • {slot.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span>{slot.room} • {slot.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{slot.studentCount} Students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Students List View for Selected Slot
        <div className="space-y-6">
          {/* Subject Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" />
                    {currentSlot?.subject}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {currentSlot?.code} • {currentSlot?.day} • {currentSlot?.time} • {currentSlot?.room}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Badge variant="outline">
                    {currentSlot?.credits} Credits
                  </Badge>
                  <Badge variant="secondary">
                    {currentMarks.length}/{currentStudents.length} Updated
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={() => setBulkUploadOpen(true)}
              className="flex items-center gap-2"
            >
              <FileUp className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              onClick={exportMarks}
              variant="outline"
              disabled={currentMarks.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={printMarksLedger}
              variant="outline"
              disabled={currentMarks.length === 0}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>

          {/* Class Statistics */}
          <ClassStatistics 
            marks={currentMarks} 
            totalStudents={currentStudents.length}
            subjectName={currentSlot?.subject}
          />

          {/* Students List */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Enrolled Students ({currentStudents.length})
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Enter internal (max 30) and external (max 70) marks. Debarred students are locked from external entry.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={markFilter === 'all' ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    onClick={() => setMarkFilter('all')}
                  >
                    All ({currentStudents.length})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={markFilter === 'eligible' ? 'default' : 'outline'}
                    className="h-8 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-300"
                    onClick={() => setMarkFilter('eligible')}
                  >
                    Cleared for Exam
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={markFilter === 'debarred' ? 'default' : 'outline'}
                    className="h-8 text-xs text-red-700 dark:text-red-400 border-red-300"
                    onClick={() => setMarkFilter('debarred')}
                  >
                    Debarred
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Attendance Status</TableHead>
                      <TableHead>Evaluation</TableHead>
                      <TableHead>Total / Grade</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStudents
                      .filter(student => {
                        const erpObj = erpStudents.find(s => s.id === student.id || s.rollNumber === student.id)
                        const isDebarred = erpObj ? !erpObj.clearances.attendanceClearance : false
                        if (markFilter === 'eligible') return !isDebarred
                        if (markFilter === 'debarred') return isDebarred
                        return true
                      })
                      .map((student) => {
                        const studentMark = getStudentMark(student.id)
                        const erpObj = erpStudents.find(s => s.id === student.id || s.rollNumber === student.id)
                        const isDebarred = erpObj ? !erpObj.clearances.attendanceClearance : false

                        return (
                          <TableRow key={student.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleStudentClick(student)}>
                            <TableCell className="font-mono font-semibold">{student.id}</TableCell>
                            <TableCell>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{student.email}</div>
                            </TableCell>
                            <TableCell>
                              {isDebarred ? (
                                <Badge variant="destructive" className="text-[11px] gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Debarred (&lt;75%)</span>
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[11px] border-emerald-400 text-emerald-700 dark:text-emerald-400">
                                  Cleared (≥75%)
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={studentMark ? "default" : "outline"}>
                                {studentMark ? "Graded" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {studentMark ? (
                                <div className="space-y-0.5">
                                  <span className="font-bold text-sm">{studentMark.total}/100</span>
                                  <div>
                                    <Badge variant={studentMark.grade.includes('+') ? "default" : "secondary"} className="text-xs">
                                      Grade: {studentMark.grade}
                                    </Badge>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">Not Evaluated</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStudentClick(student);
                                  }}
                                  title="Quick Entry"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDetailedMarksClick(student);
                                  }}
                                  title="Detailed Entry"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {currentStudents.map((student) => {
                  const studentMark = getStudentMark(student.id)
                  return (
                    <Card 
                      key={student.id} 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleStudentClick(student)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-mono font-bold text-sm">{student.id}</div>
                            <div className="font-semibold">{student.name}</div>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={studentMark ? "default" : "outline"} className="text-xs">
                              {studentMark ? "Graded" : "Pending"}
                            </Badge>
                            {studentMark && (
                              <div>
                                <Badge variant={studentMark.grade.includes('+') ? "default" : "secondary"} className="text-xs">
                                  {studentMark.grade}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {student.email}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground">Sec {student.section}</span>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStudentClick(student);
                              }}
                              title="Quick Entry"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDetailedMarksClick(student);
                              }}
                              title="Detailed Entry"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
                {currentStudents.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No students in this slot
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Marks Entry Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Update Marks
                </DialogTitle>
                <DialogDescription>
                  {selectedStudent && (
                    <>
                      <div className="font-mono font-semibold">{selectedStudent.id}</div>
                      <div>{selectedStudent.name}</div>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="internal">Internal Marks (Max: 30)</Label>
                  <Input
                    id="internal"
                    type="number"
                    placeholder="Enter internal marks"
                    value={form.internal}
                    onChange={(e) => setForm({ ...form, internal: e.target.value })}
                    max="30"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="external">External Marks (Max: 70)</Label>
                  <Input
                    id="external"
                    type="number"
                    placeholder="Enter external marks"
                    value={form.external}
                    onChange={(e) => setForm({ ...form, external: e.target.value })}
                    max="70"
                    className="h-11"
                  />
                </div>
                {form.internal && form.external && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-semibold">{Number(form.internal) + Number(form.external)}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade:</span>
                      <span className="font-semibold">{calculateGrade(Number(form.internal) + Number(form.external)).grade}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveMarks} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Marks
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Detailed Marks Dialog */}
          <DetailedMarksDialog
            student={selectedStudent}
            isOpen={detailedDialogOpen}
            onClose={() => setDetailedDialogOpen(false)}
            onSave={handleSaveDetailedMarks}
          />

          {/* Bulk Upload Dialog */}
          <BulkUploadDialog
            isOpen={bulkUploadOpen}
            onClose={() => setBulkUploadOpen(false)}
            onUpload={handleBulkUpload}
            students={currentStudents}
            subjectName={currentSlot?.subject}
          />
        </div>
      )}
    </div>
  )
}
