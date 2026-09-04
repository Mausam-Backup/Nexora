import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePageLoading } from "@/hooks/use-page-loading"
import { GenericPageSkeleton } from "@/components/ui/page-skeleton"
import { Download, TrendingUp, Award, FileText, Clock, ShieldCheck, Printer, AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { SubjectDetailModal } from "@/components/marks/SubjectDetailModal"
import { coeService } from "@/services/coeService"
import { useERPData } from "@/hooks/useERPData"
import { useAuth } from "@/contexts/AuthContext"
import { exportToCSV, generatePrintableReport } from "@/utils/exportUtils"

export default function ViewMarks() {
  const isLoading = usePageLoading()
  const { user } = useAuth()
  const { getStudent, students } = useERPData()
  const student = getStudent(user?.id || '20CS001') || students[0]

  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isCoEPublished = coeService.isResultsPublished()

  if (isLoading) {
    return <GenericPageSkeleton />
  }

  const currentSemesterSubjects = Object.values(student.marks)
  const totalCredits = currentSemesterSubjects.reduce((acc, s) => acc + s.credits, 0)
  const currentSGPA = totalCredits > 0 
    ? Number((currentSemesterSubjects.reduce((acc, s) => acc + (s.gp * s.credits), 0) / totalCredits).toFixed(2))
    : student.cgpa

  const handleSubjectClick = (subject: any) => {
    // Generate detailed breakdown data
    const detailedSubject = {
      ...subject,
      internalBreakdown: {
        assignment1: Math.floor(subject.internal * 0.25),
        assignment2: Math.floor(subject.internal * 0.25),
        quiz1: Math.floor(subject.internal * 0.25),
        quiz2: subject.internal - (Math.floor(subject.internal * 0.25) * 3),
        attendance: 5
      },
      externalBreakdown: {
        midterm: Math.floor(subject.external * 0.43),
        endterm: subject.external - Math.floor(subject.external * 0.43)
      }
    }
    setSelectedSubject(detailedSubject)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubject(null)
  }

  const handleDownloadTranscript = () => {
    generatePrintableReport({
      title: "Official Academic Grade Transcript",
      subtitle: "Office of the Controller of Examinations • Autonomous Transcript Record",
      studentInfo: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester
      },
      statusBadge: {
        text: student.clearances.feeClearance ? "ACADEMIC CLEARANCE GRANTED" : "FINANCIAL HOLD ON RECORD",
        variant: student.clearances.feeClearance ? "success" : "danger"
      },
      columns: ["Subject Code", "Subject Name", "Credits", "Internal (30)", "External (70)", "Total (100)", "Grade", "Grade Points"],
      rows: currentSemesterSubjects.map(s => [
        s.subjectCode,
        s.subjectName,
        s.credits,
        s.internal,
        s.external,
        s.total,
        s.grade,
        s.gp
      ]),
      summaryStats: [
        { label: "Semester SGPA", value: currentSGPA },
        { label: "Cumulative CGPA", value: student.cgpa },
        { label: "Academic Standing", value: student.cgpa >= 8.5 ? "First Class with Distinction" : "First Class" }
      ]
    })
  }

  const handleExportCSV = () => {
    const headers = ["Subject Code", "Subject Name", "Credits", "Internal", "External", "Total", "Grade", "Grade Points"]
    const rows = currentSemesterSubjects.map(s => [
      s.subjectCode,
      s.subjectName,
      s.credits,
      s.internal,
      s.external,
      s.total,
      s.grade,
      s.gp
    ])
    exportToCSV(`${student.rollNumber}_Academic_Marks`, headers, rows)
  }

  const semesters = [
    {
      semester: `Semester ${student.semester} (Current)`,
      subjects: currentSemesterSubjects.map(s => ({
        code: s.subjectCode,
        name: s.subjectName,
        credits: s.credits,
        internal: s.internal,
        external: s.external,
        total: s.total,
        grade: s.grade,
        gp: s.gp
      })),
      sgpa: currentSGPA,
      status: "Current"
    },
    {
      semester: "5th Semester",
      subjects: [
        { code: "CS201", name: "Data Structures & Algorithms", credits: 4, internal: 26, external: 74, total: 100, grade: "A", gp: 9 },
        { code: "CS202", name: "Object Oriented Programming", credits: 4, internal: 28, external: 76, total: 104, grade: "A+", gp: 10 },
        { code: "CS203", name: "Computer Organization", credits: 3, internal: 24, external: 65, total: 89, grade: "B+", gp: 8 },
        { code: "CS204", name: "Discrete Mathematics", credits: 3, internal: 27, external: 70, total: 97, grade: "A", gp: 9 },
        { code: "CS205", name: "Digital Logic Design", credits: 3, internal: 25, external: 68, total: 93, grade: "A", gp: 9 },
      ],
      sgpa: 9.06,
      status: "Completed"
    }
  ]

  const overallStats = {
    cgpa: student.cgpa,
    totalCredits: 160,
    completedCredits: 128,
    rank: student.cgpa >= 9.0 ? 3 : student.cgpa >= 8.0 ? 12 : 38,
    totalStudents: students.length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mobile-heading-large font-bold tracking-tight">Academic Marks</h1>
          <p className="text-muted-foreground text-sm sm:text-base mobile-hide-description">
            View your semester-wise marks and performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button onClick={handleDownloadTranscript} className="flex-1 sm:flex-initial">
            <Printer className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Print / Save Transcript</span>
            <span className="sm:hidden">Transcript</span>
          </Button>
        </div>
      </div>

      {/* Academic Warning / Probation Banner if CGPA < 5.5 */}
      {student.cgpa < 5.5 && (
        <div className="p-4 rounded-xl border-2 border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="font-bold flex items-center gap-2">
              <span>Official Academic Warning: Remedial Mentorship Required</span>
              <Badge variant="destructive" className="text-[10px] uppercase">Probation Standing</Badge>
            </div>
            <p className="mt-1 text-xs text-foreground/80">
              Your cumulative CGPA ({student.cgpa.toFixed(2)}) is below the university minimum academic standard of 5.50. 
              Under statutory regulation Section 4.2, you have been assigned to mandatory faculty office hours with your department counselor.
            </p>
          </div>
        </div>
      )}

      {/* Overall Statistics */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs font-medium">CGPA</CardTitle>
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold text-primary">{overallStats.cgpa}/10</div>
            <p className="text-xs text-muted-foreground">
              Excellent
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs font-medium">Credits</CardTitle>
            <Award className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">{overallStats.completedCredits}</div>
            <div className="mt-1">
              <Progress value={(overallStats.completedCredits / overallStats.totalCredits) * 100} className="h-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              /{overallStats.totalCredits}
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs font-medium">Rank</CardTitle>
            <Award className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">#{overallStats.rank}</div>
            <p className="text-xs text-muted-foreground">
              /{overallStats.totalStudents}
            </p>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs font-medium">Grade</CardTitle>
            <FileText className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg font-bold">A</div>
            <p className="text-xs text-muted-foreground">
              Top 10%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Semester-wise Marks */}
      {semesters.map((semester) => (
        <Card key={semester.semester}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {semester.semester}
                  <Badge variant={semester.status === "Current" ? "default" : "secondary"}>
                    {semester.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  SGPA: <span className="font-semibold text-primary">{semester.sgpa}/10.0</span>
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {semester.status === "Current" && !isCoEPublished ? (
              <div className="py-10 px-4 text-center space-y-3 rounded-xl border border-dashed bg-muted/20">
                <Clock className="h-10 w-10 text-amber-500 mx-auto" />
                <div className="space-y-1">
                  <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-400 text-xs">
                    OFFICIAL EVALUATION IN PROGRESS
                  </Badge>
                  <h4 className="font-bold text-base">Results for 6th Semester Under CoE Moderation</h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Faculty grading and grace marks moderation are currently under review by the Controller of Examinations. Official marksheet will activate upon CoE publication.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block md:hidden space-y-3">
              {semester.subjects.map((subject) => (
                <div 
                  key={subject.code} 
                  className="bg-muted/50 rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{subject.code}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{subject.name}</p>
                    </div>
                    <Badge variant={subject.grade.includes('+') ? "default" : "secondary"} className="text-xs">
                      {subject.grade}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Credits:</span>
                      <span className="ml-1 font-medium">{subject.credits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <span className="ml-1 font-semibold">{subject.total}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GP:</span>
                      <span className="ml-1 font-semibold">{subject.gp}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Internal:</span>
                      <span className="ml-1">{subject.internal}/30</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">External:</span>
                      <span className="ml-1">{subject.external}/70</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    Tap for detailed breakdown
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Internal (30)</TableHead>
                    <TableHead>External (70)</TableHead>
                    <TableHead>Total (100)</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Grade Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semester.subjects.map((subject) => (
                    <TableRow 
                      key={subject.code} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSubjectClick(subject)}
                    >
                      <TableCell className="font-medium">{subject.code}</TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                      <TableCell>{subject.internal}</TableCell>
                      <TableCell>{subject.external}</TableCell>
                      <TableCell className="font-semibold">{subject.total}</TableCell>
                      <TableCell>
                        <Badge variant={subject.grade.includes('+') ? "default" : "secondary"}>
                          {subject.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{subject.gp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Subject Detail Modal */}
      <SubjectDetailModal
        subject={selectedSubject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}