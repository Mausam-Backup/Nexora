import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { Exam } from '@/types/exam';
import type { ExamHallTicket, ExamSeatingArrangement } from '@/types/examination-controller';
import { useERPData } from '@/hooks/useERPData';
import { exportToCSV, generatePrintableReport } from '@/utils/exportUtils';
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Target,
  AlertTriangle,
  QrCode,
  Download,
  Award,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  CheckCircle,
  FileText,
  Printer,
  Lock
} from 'lucide-react';
import { format, isToday, isFuture, differenceInDays } from 'date-fns';

interface StudentExamViewProps {
  studentId: string;
  studentSemester: number;
  studentBranch: string;
}

export function StudentExamView({
  studentId,
  studentSemester,
  studentBranch,
}: StudentExamViewProps) {
  const { toast } = useToast();
  const { getStudent, students } = useERPData();
  const student = getStudent(studentId || '20CS001') || students[0];

  const [isPublished, setIsPublished] = useState(false);
  const [hallTicket, setHallTicket] = useState<ExamHallTicket | null>(null);
  const [seatingList, setSeatingList] = useState<ExamSeatingArrangement[]>([]);
  const [activeCycle] = useState(coeService.getCycles()[0]);

  // Revaluation modal
  const [isRevalModalOpen, setIsRevalModalOpen] = useState(false);
  const [selectedSubjectForReval, setSelectedSubjectForReval] = useState<any>(null);
  const [revalReason, setRevalReason] = useState('');

  // Calculate live cumulative attendance percentage
  const totalAttended = Object.values(student.attendance).reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = Object.values(student.attendance).reduce((acc, curr) => acc + curr.total, 0);
  const liveAttendancePct = totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 85.0;

  useEffect(() => {
    setIsPublished(coeService.isResultsPublished());
    const ticket = coeService.getStudentHallTicket(student.rollNumber) || coeService.getStudentHallTicket(studentId) || coeService.getStudentHallTicket('1');
    setHallTicket(ticket);
    const seatings = coeService.getSeatingArrangements();
    setSeatingList(seatings.filter((s) => s.studentId === student.rollNumber || s.studentId === studentId || s.studentId === '1'));
  }, [studentId, student]);

  // Derive exams from student's curriculum subjects
  const exams: Exam[] = useMemo(() => {
    const subjects = Object.values(student.marks);
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 7);

    return subjects.map((sub, idx) => {
      const examDate = new Date(baseDate);
      examDate.setDate(baseDate.getDate() + (idx * 3));
      const dateStr = examDate.toISOString().split('T')[0];

      return {
        id: `exam-${sub.subjectCode}`,
        course: sub.subjectName,
        courseCode: sub.subjectCode,
        semester: student.semester,
        branch: student.department,
        examType: 'endterm' as const,
        date: dateStr,
        time: idx % 2 === 0 ? '09:30' : '14:00',
        duration: 180,
        location: idx % 2 === 0 ? 'Hall LH-101 (Aryabhatta Complex)' : 'Hall LH-102 (Science Block)',
        maxMarks: 100,
        instructor: 'Dr. Sarah Johnson',
        instructorId: 'T001',
        topics: ['Complete Curriculum (Units I - V)'],
        status: 'scheduled' as const,
        createdAt: '2024-10-01',
        updatedAt: '2024-10-01',
        createdBy: 'coe_001'
      };
    });
  }, [student]);

  // Semester results for published view
  const semesterMarks = [
    { code: 'CS301', name: 'Database Management Systems', credits: 4, internal: 28, external: 75, total: 103, grade: 'A+', gp: 10 },
    { code: 'CS302', name: 'Software Engineering', credits: 4, internal: 25, external: 70, total: 95, grade: 'A', gp: 9 },
    { code: 'CS303', name: 'Computer Networks', credits: 4, internal: 30, external: 68, total: 98, grade: 'A', gp: 9 },
    { code: 'CS304', name: 'Operating Systems', credits: 4, internal: 27, external: 72, total: 99, grade: 'A', gp: 9 },
    { code: 'CS305', name: 'Web Technologies', credits: 3, internal: 29, external: 78, total: 107, grade: 'A+', gp: 10 },
  ];

  const handleApplyRevaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectForReval) return;

    coeService.applyRevaluation({
      studentId: hallTicket?.studentId || '1',
      studentName: hallTicket?.studentName || 'Demo User',
      rollNumber: hallTicket?.rollNumber || 'CS21001',
      courseCode: selectedSubjectForReval.code,
      courseName: selectedSubjectForReval.name,
      originalMarks: selectedSubjectForReval.external,
      remarks: revalReason,
    });

    setIsRevalModalOpen(false);
    toast({
      title: 'Re-evaluation Application Submitted',
      description: `Docket registered for ${selectedSubjectForReval.name} (${selectedSubjectForReval.code}). Assigned to senior evaluator.`,
    });
  };

  const handlePrintHallTicket = () => {
    window.print();
    toast({ title: 'Downloading PDF', description: 'Preparing official Hall Ticket print pass...' });
  };

  const handleDownloadAdmitCard = () => {
    if (!student.clearances.admitCardIssued) {
      const reasons = [];
      if (!student.clearances.attendanceClearance) reasons.push("Attendance below 75% threshold (Debarred)");
      if (!student.clearances.feeClearance) reasons.push(`Overdue fee balance of ₹${student.fees.outstanding.toLocaleString('en-IN')}`);
      
      toast.error(`Admit Card Locked: ${reasons.join(" • ")}`);
      return;
    }

    generatePrintableReport({
      title: "End-Semester Examination Hall Ticket / Admit Card",
      subtitle: "Office of the Controller of Examinations • Official Autonomous Verification",
      studentInfo: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester
      },
      statusBadge: {
        text: "OFFICIALLY CLEARED & ADMITTED",
        variant: "success"
      },
      columns: ["Course Code", "Course Name", "Exam Date", "Session Time", "Venue Hall", "Max Marks", "Invigilator Sign"],
      rows: exams.map(e => [
        e.courseCode,
        e.course,
        e.date,
        e.time,
        e.location,
        `${e.maxMarks} Marks`,
        "__________________"
      ]),
      summaryStats: [
        { 
          label: "Cumulative Attendance", 
          value: `${(Object.values(student.attendance).reduce((sum, s) => sum + s.attended, 0) / Math.max(1, Object.values(student.attendance).reduce((sum, s) => sum + s.total, 0)) * 100).toFixed(1)}% (Eligible)` 
        },
        { label: "Financial Clearance", value: "No Outstanding Dues" },
        { label: "Controller Seal", value: "AUTHENTICATED" }
      ]
    });
    toast.success("Hall ticket generated successfully!");
  };

  const handleExportScheduleCSV = () => {
    const headers = ["Course Code", "Course Name", "Semester", "Exam Date", "Exam Time", "Venue Hall", "Max Marks"];
    const rows = exams.map(e => [
      e.courseCode,
      e.course,
      `Sem ${e.semester}`,
      e.date,
      e.time,
      e.location,
      e.maxMarks
    ]);
    exportToCSV(`${student.rollNumber}_Exam_Schedule`, headers, rows);
    toast.success("Exported examination schedule to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header with Admit Card & CSV Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-foreground border border-neutral-200 dark:border-neutral-800">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Examinations & Marksheet</h1>
            <p className="text-sm text-muted-foreground">
              {student.name} • <span className="font-mono font-semibold text-foreground">{student.rollNumber}</span> • Sem {student.semester} • {student.department}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportScheduleCSV} className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleDownloadAdmitCard}
            className={`flex-1 sm:flex-initial font-bold ${!student.clearances.admitCardIssued ? 'border border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20' : 'bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] shadow-xs'}`}
          >
            {!student.clearances.admitCardIssued ? (
              <>
                <Lock className="mr-2 h-4 w-4 text-destructive" />
                <span>Hall Ticket Locked</span>
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print Official Admit Card</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cross-Module Debarment / Financial Hold Alert */}
      {!student.clearances.admitCardIssued ? (
        <Card className="border-destructive/50 bg-destructive/10 text-destructive">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>EXAMINATION HALL TICKET ISSUANCE WITHHELD</span>
            </div>
            <div className="text-xs space-y-1 pl-7">
              {!student.clearances.attendanceClearance && (
                <p>• <strong>Attendance Debarment:</strong> Cumulative attendance is {liveAttendancePct}% (below mandatory 75.0% statutory threshold). You are debarred from end-semester examinations.</p>
              )}
              {!student.clearances.feeClearance && (
                <p>• <strong>Financial Hold:</strong> You have an overdue balance of ₹{student.fees.outstanding.toLocaleString('en-IN')}. Outstanding bills must be cleared before the hall ticket is unlocked.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
          <CardContent className="p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Institutional Clearance Granted: <strong>Attendance ({liveAttendancePct}%) & Fees Verified (Hall Ticket Available)</strong></span>
            </div>
            <Badge variant="outline" className="border-emerald-500 text-emerald-600">Verified & Approved</Badge>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="hall-ticket" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="hall-ticket" className="text-xs">
            <QrCode className="mr-1.5 h-3.5 w-3.5" />
            Digital Hall Ticket
          </TabsTrigger>
          <TabsTrigger value="timetable" className="text-xs">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            Exam Schedule ({exams.length})
          </TabsTrigger>
          <TabsTrigger value="results" className="text-xs">
            <Award className="mr-1.5 h-3.5 w-3.5" />
            Official Results
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Digital Hall Ticket */}
        <TabsContent value="hall-ticket" className="mt-4 space-y-4">
          {!student.clearances.admitCardIssued || (hallTicket && !hallTicket.isEligible) ? (
            /* Debarred Banner */
            <Card className="rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-card to-card shadow-card glow-rose">
              <CardContent className="p-6 sm:p-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-md animate-pulse">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                  <Badge variant="destructive" className="text-xs uppercase font-extrabold px-3 py-1">
                    STATUTORY DEBARMENT ORDER • UNIVERSITY REGULATION 14.B
                  </Badge>
                  <h3 className="text-2xl font-black text-foreground">
                    Examination Hall Ticket Withheld & Locked
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                    Candidate <strong className="text-foreground">{student.name} ({student.rollNumber})</strong> does not meet the minimum statutory criteria for examination appearance.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 max-w-md mx-auto text-xs text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cumulative Attendance:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">{liveAttendancePct}% (Required: ≥75.0%)</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Financial Ledger Status:</span>
                    <strong className={student.clearances.feeClearance ? 'text-emerald-600' : 'text-rose-600'}>
                      {student.clearances.feeClearance ? 'Cleared (₹0)' : `Pending Dues (₹${student.fees.outstanding.toLocaleString('en-IN')})`}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground italic">
                    To petition for conditional condonation, submit a formal appeal endorsed by your Head of Department to the Office of the Controller of Examinations.
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Digital Hall Ticket Pass */
            <Card className="rounded-3xl border-2 border-neutral-300 shadow-2xl overflow-hidden max-w-3xl mx-auto bg-white font-serif">
              <div className="bg-[#241411] p-6 text-white flex items-center justify-between border-b border-[#44251F]">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                    Nexora Autonomous Collegiate ERP
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">OFFICIAL ADMIT CARD & HALL TICKET</h2>
                  <div className="text-xs text-neutral-300 font-medium">
                    {activeCycle?.name || 'Autumn End-Semester Examination 2024-25'}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold px-2.5 py-1 shadow-sm">
                    VERIFIED PASS ✅
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Student Info & QR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-200">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-2xl text-black border border-neutral-300 shrink-0">
                      {student.name ? student.name.charAt(0) : 'S'}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-neutral-900">{student.name}</h3>
                      <div className="text-xs text-neutral-600 flex flex-wrap gap-2">
                        <span>Roll: <strong className="text-neutral-900 font-mono">{student.rollNumber}</strong></span>
                        <span>•</span>
                        <span>Branch: <strong className="text-neutral-900">{student.department}</strong></span>
                        <span>•</span>
                        <span>Sem: <strong className="text-neutral-900">{student.semester}</strong></span>
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Attendance Cleared ({liveAttendancePct}%) • Dues Cleared
                      </div>
                    </div>
                  </div>

                  {/* QR Code Pass */}
                  <div className="text-center p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1 shrink-0">
                    <div className="w-24 h-24 bg-white p-2 rounded-lg mx-auto flex items-center justify-center shadow-xs border border-neutral-200">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500 tracking-widest">
                      {hallTicket?.qrToken || `HT-2024-${student.rollNumber}`}
                    </div>
                  </div>
                </div>

                {/* Assigned Seat & Room Highlight */}
                {seatingList.length > 0 && (
                  <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                        DESIGNATED EXAMINATION HALL & DESK
                      </div>
                      <div className="text-sm font-bold text-neutral-900">
                        {seatingList[0].roomNumber || 'LH-101'} (Aryabhatta Lecture Hall Complex)
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-center font-mono">
                        <div className="text-[10px] text-neutral-500">DESK CODE</div>
                        <div className="font-bold text-base text-neutral-900">{seatingList[0].seatCode}</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-center font-mono">
                        <div className="text-[10px] text-neutral-500">BENCH NO.</div>
                        <div className="font-bold text-base text-neutral-900">{seatingList[0].benchNumber}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scheduled Papers Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Registered Subjects & Examination Timetable
                  </div>
                  <div className="rounded-lg border border-neutral-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-neutral-50">
                        <TableRow>
                          <TableHead className="font-semibold text-xs text-neutral-900">Paper Code</TableHead>
                          <TableHead className="font-semibold text-xs text-neutral-900">Subject Title</TableHead>
                          <TableHead className="font-semibold text-xs text-neutral-900">Date</TableHead>
                          <TableHead className="font-semibold text-xs text-neutral-900">Time</TableHead>
                          <TableHead className="font-semibold text-xs text-neutral-900">Hall</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exams.map((paper) => (
                          <TableRow key={paper.id} className="hover:bg-neutral-50">
                            <TableCell className="font-mono font-bold text-xs text-neutral-900">{paper.courseCode}</TableCell>
                            <TableCell className="font-semibold text-xs text-neutral-900">{paper.course}</TableCell>
                            <TableCell className="text-xs text-neutral-700">{format(new Date(paper.date), 'dd MMM yyyy')}</TableCell>
                            <TableCell className="text-xs font-mono text-neutral-700">{paper.time}</TableCell>
                            <TableCell className="text-xs text-neutral-700">{paper.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Candidate Instructions & Stamp */}
                <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-600">
                  <div className="space-y-0.5">
                    <p>• Candidates must arrive 15 minutes before reporting time.</p>
                    <p>• Digital smartwatches, phones & unauthorized study chits strictly prohibited.</p>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <div className="font-serif italic font-bold text-neutral-900">
                      Dr. K. R. Ramanathan
                    </div>
                    <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest border-t border-neutral-200 pt-0.5">
                      Controller of Examinations
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: Exam Timetable */}
        <TabsContent value="timetable" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {exams.map((exam) => (
              <Card key={exam.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{exam.course}</h3>
                        <Badge variant="outline" className="font-mono text-xs">{exam.courseCode}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(new Date(exam.date), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{exam.time} ({exam.duration} mins)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{exam.location}</span>
                        </div>
                      </div>

                      {exam.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {exam.topics.map((t, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs text-muted-foreground">Max Marks</div>
                      <div className="text-xl font-bold">{exam.maxMarks}</div>
                      <div className="text-xs text-muted-foreground">Evaluator: {exam.instructor}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: Official Results & Revaluation */}
        <TabsContent value="results" className="mt-4 space-y-4">
          {!isPublished ? (
            /* Results Under Evaluation Placeholder */
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs border-amber-400 text-amber-700 dark:text-amber-400">
                    EVALUATION & MODERATION IN PROGRESS
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">
                    Official Results Under CoE Evaluation
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Examination scores for <strong>{activeCycle?.name || 'Autumn End-Semester 2024-25'}</strong> are currently undergoing academic moderation and SGPA verification.
                  </p>
                  <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground font-mono inline-block">
                    Official Scheduled Release: {activeCycle?.resultsPublishDate ? format(new Date(activeCycle.resultsPublishDate), 'PPP') : 'Scheduled Shortly'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Official Published Marksheet */
            <Card className="border-2 border-emerald-300 dark:border-emerald-800 shadow-md">
              <CardHeader className="pb-3 border-b bg-emerald-50/30 dark:bg-emerald-950/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-xs">OFFICIALLY PUBLISHED</Badge>
                      <span className="text-xs text-muted-foreground font-mono">Cycle: {activeCycle?.id}</span>
                    </div>
                    <CardTitle className="text-xl font-bold mt-1">
                      Statement of Grades & Official Marksheet
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Verified by the Controller of Examinations with sovereign digital seal.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handlePrintHallTicket} className="text-xs">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download Official Transcript
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* GPA Summary Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-neutral-500 font-semibold">SEMESTER SGPA</div>
                    <div className="text-2xl font-bold text-neutral-900">9.32</div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-neutral-500 font-semibold">CUMULATIVE CGPA</div>
                    <div className="text-2xl font-bold text-emerald-700">8.65</div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-neutral-500 font-semibold">CREDITS EARNED</div>
                    <div className="text-2xl font-bold text-neutral-900">19 / 19</div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-neutral-500 font-semibold">ACADEMIC STANDING</div>
                    <div className="text-sm font-bold text-neutral-900 pt-1">First Class with Distinction</div>
                  </div>
                </div>

                {/* Detailed Subject Marks Table */}
                <div className="rounded-lg border border-neutral-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-neutral-50">
                      <TableRow>
                        <TableHead className="font-semibold text-xs text-neutral-900">Code</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">Course Name</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">Credits</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">Internal (/30)</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">External (/70)</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">Total (/100)</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">Grade</TableHead>
                        <TableHead className="font-semibold text-xs text-neutral-900">Grade Point</TableHead>
                        <TableHead className="text-right font-semibold text-xs text-neutral-900">Re-evaluation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterMarks.map((sub) => (
                        <TableRow key={sub.code} className="hover:bg-neutral-50">
                          <TableCell className="font-mono font-bold text-xs text-neutral-900">{sub.code}</TableCell>
                          <TableCell className="text-xs font-medium text-neutral-900">{sub.name}</TableCell>
                          <TableCell className="font-mono text-xs text-neutral-700">{sub.credits}</TableCell>
                          <TableCell className="font-mono text-xs text-neutral-700">{sub.internal}</TableCell>
                          <TableCell className="font-mono text-xs text-neutral-700">{sub.external}</TableCell>
                          <TableCell className="font-mono font-bold text-xs text-neutral-900">{sub.total}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-700 text-white text-xs font-mono">{sub.grade}</Badge>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-xs text-neutral-900">{sub.gp}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedSubjectForReval(sub);
                                setRevalReason('');
                                setIsRevalModalOpen(true);
                              }}
                              className="text-xs h-7 px-2 text-neutral-900 hover:text-neutral-700 cursor-pointer"
                            >
                              <RotateCcw className="mr-1 h-3 w-3" />
                              Apply
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Digital Stamp & Notice */}
                <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                    <span>
                      Digitally signed and certified by the Office of the Controller of Examinations. Re-evaluation portal closes in <strong>7 days</strong>.
                    </span>
                  </div>

                  <div className="text-center sm:text-right font-serif italic text-neutral-900 font-bold">
                    [ CoE Digital Signature Stamp Verified ]
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Revaluation Application Modal */}
      <Dialog open={isRevalModalOpen} onOpenChange={setIsRevalModalOpen}>
        <DialogContent className="sm:max-w-md font-serif">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neutral-900">
              <RotateCcw className="h-5 w-5 text-neutral-900" />
              Apply for Paper Re-evaluation
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Course: <strong>{selectedSubjectForReval?.name} ({selectedSubjectForReval?.code})</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyRevaluation} className="space-y-4">
            <div className="p-3 rounded-lg bg-neutral-100 text-xs space-y-1 border border-neutral-200 text-neutral-800">
              <div>Current External Marks: <strong>{selectedSubjectForReval?.external} / 70</strong></div>
              <div>Current Grade: <Badge variant="outline" className="text-xs border-neutral-300">{selectedSubjectForReval?.grade}</Badge></div>
              <div className="text-[11px] text-neutral-500 pt-1">
                Re-evaluation fee: <strong>₹500 / subject</strong> (Refundable if mark increase &gt; 5%).
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-700">Grounds / Justification for Re-evaluation *</Label>
              <Textarea
                value={revalReason}
                onChange={(e) => setRevalReason(e.target.value)}
                placeholder="Specify questions or discrepancies suspected in external evaluation..."
                className="text-xs min-h-[80px] bg-white border-neutral-200"
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsRevalModalOpen(false)} className="border-neutral-300">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#241411] hover:bg-[#341B16] text-white border border-[#44251F] font-serif cursor-pointer shadow-xs">
                Submit Formal Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentExamView;