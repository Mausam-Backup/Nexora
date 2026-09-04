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
  FileText,
  Printer
} from 'lucide-react';
import { format, isToday, isFuture, differenceInDays } from 'date-fns';

interface StudentExamViewProps {
  studentId: string;
  studentSemester: number;
  studentBranch: string;
}

export default function StudentExamView({
  studentId,
  studentSemester,
  studentBranch,
}: StudentExamViewProps) {
  const { toast } = useToast();
  const [isPublished, setIsPublished] = useState(false);
  const [hallTicket, setHallTicket] = useState<ExamHallTicket | null>(null);
  const [seatingList, setSeatingList] = useState<ExamSeatingArrangement[]>([]);
  const [activeCycle] = useState(coeService.getCycles()[0]);

  // Revaluation modal
  const [isRevalModalOpen, setIsRevalModalOpen] = useState(false);
  const [selectedSubjectForReval, setSelectedSubjectForReval] = useState<any>(null);
  const [revalReason, setRevalReason] = useState('');

  useEffect(() => {
    setIsPublished(coeService.isResultsPublished());
    const ticket = coeService.getStudentHallTicket(studentId) || coeService.getStudentHallTicket('1');
    setHallTicket(ticket);
    const seatings = coeService.getSeatingArrangements();
    setSeatingList(seatings.filter((s) => s.studentId === studentId || s.studentId === '1'));
  }, [studentId]);

  // Student exams
  const [exams] = useState<Exam[]>([
    {
      id: '1',
      course: 'Data Structures and Algorithms',
      courseCode: 'CSE201',
      semester: studentSemester,
      branch: studentBranch,
      examType: 'midterm',
      date: '2024-11-22',
      time: '09:00',
      duration: 180,
      location: 'Hall LH-101',
      maxMarks: 100,
      instructor: 'Dr. Sarah Johnson',
      instructorId: 'T001',
      topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Binary Trees'],
      status: 'scheduled',
      createdAt: '2024-10-01',
      updatedAt: '2024-10-01',
      createdBy: 'coe_001',
    },
    {
      id: '2',
      course: 'Database Management Systems',
      courseCode: 'CSE301',
      semester: studentSemester,
      branch: studentBranch,
      examType: 'endterm',
      date: '2024-11-25',
      time: '14:00',
      duration: 180,
      location: 'Hall LH-102',
      maxMarks: 100,
      instructor: 'Dr. Sarah Johnson',
      instructorId: 'T001',
      topics: ['SQL Queries', 'Relational Algebra', 'Normalization', 'ACID Transactions'],
      status: 'scheduled',
      createdAt: '2024-10-01',
      updatedAt: '2024-10-01',
      createdBy: 'coe_001',
    },
    {
      id: '3',
      course: 'Operating Systems',
      courseCode: 'CS304',
      semester: studentSemester,
      branch: studentBranch,
      examType: 'endterm',
      date: '2024-11-28',
      time: '09:00',
      duration: 180,
      location: 'Hall LH-101',
      maxMarks: 100,
      instructor: 'Dr. Emily Davis',
      instructorId: 'T003',
      topics: ['CPU Scheduling', 'Deadlocks', 'Memory Management', 'File Systems'],
      status: 'scheduled',
      createdAt: '2024-10-01',
      updatedAt: '2024-10-01',
      createdBy: 'coe_001',
    },
  ]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Examinations & Marksheet</h1>
            <p className="text-sm text-muted-foreground">
              Semester {studentSemester} • {studentBranch} • Candidate Roll: <span className="font-mono font-semibold text-foreground">{hallTicket?.rollNumber || 'CS21001'}</span>
            </p>
          </div>
        </div>

        {hallTicket?.isEligible && (
          <Button onClick={handlePrintHallTicket} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-sm">
            <Printer className="mr-2 h-4 w-4" />
            Download Hall Ticket PDF
          </Button>
        )}
      </div>

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
          {hallTicket && !hallTicket.isEligible ? (
            /* Debarred Banner */
            <Card className="border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/60 flex items-center justify-center text-red-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <Badge variant="destructive" className="text-xs">
                    STATUTORY DEBARMENT ORDER
                  </Badge>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-200">
                    Hall Ticket Withheld / Ineligible
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-300 max-w-xl mx-auto">
                    Reason: <strong>{hallTicket.debarReason || 'Attendance below statutory requirement (75%)'}</strong>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-card border max-w-md mx-auto text-xs text-muted-foreground text-left space-y-1.5">
                  <div>Candidate Attendance: <strong className="text-red-600 font-mono">{hallTicket.attendancePercentage}%</strong> (Min required: 75.0%)</div>
                  <div>Tuition Fee Dues: <strong>{hallTicket.feeCleared ? 'Cleared' : 'Outstanding Payment'}</strong></div>
                  <div className="pt-2 border-t text-[11px] italic">
                    To appeal this debarment, submit formal petition to the Office of the Controller of Examinations (Admin Block 108).
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Digital Hall Ticket Pass */
            <Card className="border-2 border-indigo-300 dark:border-indigo-800 shadow-lg overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-5 text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono tracking-widest text-indigo-200 uppercase">
                    CampusSync Autonomous University
                  </div>
                  <h2 className="text-lg font-bold">OFFICIAL ADMIT CARD / HALL TICKET</h2>
                  <div className="text-xs text-indigo-200">
                    {activeCycle?.name || 'Autumn End-Semester Examination 2024-25'}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500 text-white font-mono text-[11px]">
                    VERIFIED PASS
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Student Info & QR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-2xl text-indigo-600 border shrink-0">
                      {hallTicket?.studentName ? hallTicket.studentName.charAt(0) : 'S'}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold">{hallTicket?.studentName || 'Demo User'}</h3>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                        <span>Roll: <strong className="text-foreground font-mono">{hallTicket?.rollNumber || 'CS21001'}</strong></span>
                        <span>•</span>
                        <span>Branch: <strong className="text-foreground">{studentBranch}</strong></span>
                        <span>•</span>
                        <span>Sem: <strong className="text-foreground">{studentSemester}</strong></span>
                      </div>
                      <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Attendance Cleared ({hallTicket?.attendancePercentage || 88.5}%) • Dues Cleared
                      </div>
                    </div>
                  </div>

                  {/* QR Code Pass */}
                  <div className="text-center p-3 rounded-xl bg-muted/40 border space-y-1 shrink-0">
                    <div className="w-24 h-24 bg-white p-2 rounded-lg mx-auto flex items-center justify-center shadow-xs border">
                      <QrCode className="w-full h-full text-indigo-950" />
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                      {hallTicket?.qrToken || 'HT-2024-VERIFIED'}
                    </div>
                  </div>
                </div>

                {/* Assigned Seat & Room Highlight */}
                {seatingList.length > 0 && (
                  <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                        DESIGNATED EXAMINATION HALL & DESK
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {seatingList[0].roomNumber || 'LH-101'} (Aryabhatta Lecture Hall Complex)
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-card border text-center font-mono">
                        <div className="text-[10px] text-muted-foreground">DESK CODE</div>
                        <div className="font-bold text-base text-indigo-600">{seatingList[0].seatCode}</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-card border text-center font-mono">
                        <div className="text-[10px] text-muted-foreground">BENCH NO.</div>
                        <div className="font-bold text-base text-indigo-600">{seatingList[0].benchNumber}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scheduled Papers Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Registered Subjects & Examination Timetable
                  </div>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="font-semibold text-xs">Paper Code</TableHead>
                          <TableHead className="font-semibold text-xs">Subject Title</TableHead>
                          <TableHead className="font-semibold text-xs">Date</TableHead>
                          <TableHead className="font-semibold text-xs">Timing</TableHead>
                          <TableHead className="font-semibold text-xs">Hall</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exams.map((ex) => (
                          <TableRow key={ex.id}>
                            <TableCell className="font-mono font-bold text-xs">{ex.courseCode}</TableCell>
                            <TableCell className="text-xs font-medium">{ex.course}</TableCell>
                            <TableCell className="text-xs">{format(new Date(ex.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-xs font-mono">{ex.time}</TableCell>
                            <TableCell className="text-xs">{ex.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Candidate Instructions & Stamp */}
                <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
                  <div className="space-y-0.5">
                    <p>• Candidates must arrive 15 minutes before reporting time.</p>
                    <p>• Digital smartwatches, phones & unauthorized study chits strictly prohibited.</p>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <div className="font-serif italic font-bold text-indigo-900 dark:text-indigo-300">
                      Dr. K. R. Ramanathan
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-t border-muted pt-0.5">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border">
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-muted-foreground font-semibold">SEMESTER SGPA</div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">9.32</div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-muted-foreground font-semibold">CUMULATIVE CGPA</div>
                    <div className="text-2xl font-bold text-emerald-600">8.65</div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-muted-foreground font-semibold">CREDITS EARNED</div>
                    <div className="text-2xl font-bold text-foreground">19 / 19</div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="text-[11px] text-muted-foreground font-semibold">ACADEMIC STANDING</div>
                    <div className="text-sm font-bold text-foreground pt-1">First Class with Distinction</div>
                  </div>
                </div>

                {/* Detailed Subject Marks Table */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="font-semibold text-xs">Code</TableHead>
                        <TableHead className="font-semibold text-xs">Course Name</TableHead>
                        <TableHead className="font-semibold text-xs">Credits</TableHead>
                        <TableHead className="font-semibold text-xs">Internal (/30)</TableHead>
                        <TableHead className="font-semibold text-xs">External (/70)</TableHead>
                        <TableHead className="font-semibold text-xs">Total (/100)</TableHead>
                        <TableHead className="font-semibold text-xs">Grade</TableHead>
                        <TableHead className="font-semibold text-xs">Grade Point</TableHead>
                        <TableHead className="text-right font-semibold text-xs">Re-evaluation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterMarks.map((sub) => (
                        <TableRow key={sub.code}>
                          <TableCell className="font-mono font-bold text-xs">{sub.code}</TableCell>
                          <TableCell className="text-xs font-medium">{sub.name}</TableCell>
                          <TableCell className="font-mono text-xs">{sub.credits}</TableCell>
                          <TableCell className="font-mono text-xs">{sub.internal}</TableCell>
                          <TableCell className="font-mono text-xs">{sub.external}</TableCell>
                          <TableCell className="font-mono font-bold text-xs">{sub.total}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-600 text-xs font-mono">{sub.grade}</Badge>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-xs">{sub.gp}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedSubjectForReval(sub);
                                setRevalReason('');
                                setIsRevalModalOpen(true);
                              }}
                              className="text-xs h-7 px-2 text-indigo-600 hover:text-indigo-700"
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
                <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>
                      Digitally signed and certified by the Office of the Controller of Examinations. Re-evaluation portal closes in <strong>7 days</strong>.
                    </span>
                  </div>

                  <div className="text-center sm:text-right font-serif italic text-foreground font-bold">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-indigo-600" />
              Apply for Paper Re-evaluation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Course: <strong>{selectedSubjectForReval?.name} ({selectedSubjectForReval?.code})</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyRevaluation} className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
              <div>Current External Marks: <strong>{selectedSubjectForReval?.external} / 70</strong></div>
              <div>Current Grade: <Badge variant="outline" className="text-xs">{selectedSubjectForReval?.grade}</Badge></div>
              <div className="text-[11px] text-muted-foreground pt-1">
                Re-evaluation fee: <strong>₹500 / subject</strong> (Refundable if mark increase &gt; 5%).
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Grounds / Justification for Re-evaluation *</Label>
              <Textarea
                value={revalReason}
                onChange={(e) => setRevalReason(e.target.value)}
                placeholder="Specify questions or discrepancies suspected in external evaluation..."
                className="text-xs min-h-[80px]"
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsRevalModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Submit Formal Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}