import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExamDetailDialog } from './ExamDetailDialog';
import { StudentListDialog } from './StudentListDialog';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isFuture, isPast } from 'date-fns';
import type { Exam } from '@/types/exam';
import { coeService } from '@/services/coeService';
import type { ExamInvigilator } from '@/types/examination-controller';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  Eye,
  ShieldCheck,
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Lock,
  Building2
} from 'lucide-react';

interface TeacherExamViewProps {
  teacherId: string;
  teacherSubjects: string[];
}

export const TeacherExamView: React.FC<TeacherExamViewProps> = ({
  teacherId,
  teacherSubjects,
}) => {
  const { toast } = useToast();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);
  const [invigilatorDuties, setInvigilatorDuties] = useState<ExamInvigilator[]>(
    coeService.getInvigilators(teacherId)
  );

  const activeCycle = coeService.getCycles()[0];

  // Mock data - replace with actual API calls filtered by teacher
  const [exams] = useState<Exam[]>([
    {
      id: '1',
      course: 'Data Structures and Algorithms',
      courseCode: 'CSE201',
      semester: 3,
      branch: 'CSE',
      examType: 'midterm',
      date: '2024-11-22',
      time: '09:00',
      duration: 180,
      location: 'Hall LH-101',
      maxMarks: 100,
      instructor: 'Dr. Sarah Johnson',
      instructorId: teacherId,
      topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
      status: 'scheduled',
      createdAt: '2024-07-01',
      updatedAt: '2024-07-01',
      createdBy: 'admin_001',
    },
    {
      id: '2',
      course: 'Database Management Systems',
      courseCode: 'CSE301',
      semester: 5,
      branch: 'CSE',
      examType: 'endterm',
      date: '2024-11-25',
      time: '14:00',
      duration: 180,
      location: 'Hall LH-102',
      maxMarks: 100,
      instructor: 'Dr. Sarah Johnson',
      instructorId: teacherId,
      topics: ['SQL', 'Normalization', 'Transactions', 'Indexing'],
      status: 'scheduled',
      createdAt: '2024-07-01',
      updatedAt: '2024-07-01',
      createdBy: 'admin_001',
    },
  ]);

  const upcomingExams = useMemo(
    () =>
      exams
        .filter((exam) => isFuture(new Date(exam.date)) || isToday(new Date(exam.date)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [exams]
  );

  const handleSwapRequest = (duty: ExamInvigilator) => {
    coeService.updateDutyStatus(duty.id, 'swapped');
    setInvigilatorDuties(coeService.getInvigilators(teacherId));
    toast({
      title: 'Duty Swap Request Logged',
      description: `CoE notified of request to swap ${duty.roomNumber} duty on ${duty.examDate}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Faculty Examination Hub</h1>
            <p className="text-muted-foreground">Manage your assigned papers, invigilation duties, and CoE grading deadlines</p>
          </div>
        </div>
      </div>

      {/* CoE Marks Submission Deadline Notice */}
      {activeCycle && (
        <Card className="border-amber-300 dark:border-amber-800/80 bg-gradient-to-r from-amber-50/70 via-white to-orange-50/40 dark:from-amber-950/20 dark:via-background dark:to-orange-950/20">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    CoE Grading Cutoff: {activeCycle.name}
                  </span>
                  <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300 text-xs">
                    Statutory Deadline
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Final deadline to submit internal & external marks: <strong>{format(new Date(activeCycle.marksSubmissionDeadline), 'PPP p')}</strong>. Marks will lock automatically after cutoff.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => window.location.href = '/teacher/upload-marks'}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-xs"
            >
              Upload Pending Marks
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="invigilation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="invigilation" className="text-xs font-serif">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-neutral-900" />
            My Invigilation Duties ({invigilatorDuties.length})
          </TabsTrigger>
          <TabsTrigger value="papers" className="text-xs font-serif">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            My Taught Papers ({exams.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Invigilation Duties */}
        <TabsContent value="invigilation" className="space-y-4">
          {invigilatorDuties.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No invigilation duties assigned</p>
                <p className="text-xs">Check back when the CoE issues the semester roster.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {invigilatorDuties.map((duty) => (
                <Card key={duty.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-neutral-900 font-serif">{duty.examCourse}</h3>
                          <Badge className="bg-[#241411] text-white border border-[#44251F] text-xs font-serif">
                            {duty.notes || 'Invigilator'}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs border-neutral-300">
                            {duty.roomNumber}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 font-serif">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-neutral-700" />
                            <span>Date: <strong>{duty.examDate}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-700" />
                            <span>Reporting Time: <strong className="font-mono text-neutral-900">{duty.reportingTime}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-neutral-700" />
                            <span>Exam Timing: {duty.examTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={duty.dutyStatus === 'confirmed' ? 'default' : 'secondary'} className="text-xs capitalize">
                          {duty.dutyStatus}
                        </Badge>
                        {duty.dutyStatus !== 'swapped' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSwapRequest(duty)}
                            className="text-xs h-8"
                          >
                            <ArrowLeftRight className="mr-1 h-3 w-3" />
                            Request Swap
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: Taught Papers */}
        <TabsContent value="papers" className="space-y-4">
          <div className="grid gap-4">
            {upcomingExams.map((exam) => (
              <Card key={exam.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{exam.course}</h3>
                        <Badge variant="outline" className="font-mono text-xs">{exam.courseCode}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{format(new Date(exam.date), 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span>{exam.time}</span>
                        <span>•</span>
                        <span>{exam.location}</span>
                        <span>•</span>
                        <span>Semester {exam.semester} ({exam.branch})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedExam(exam);
                          setIsDetailDialogOpen(true);
                        }}
                        className="text-xs h-8"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedExam(exam);
                          setIsStudentListOpen(true);
                        }}
                        className="text-xs h-8"
                      >
                        <Users className="mr-1 h-3.5 w-3.5" />
                        Student List
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail & Student List Dialogs */}
      {selectedExam && (
        <>
          <ExamDetailDialog
            exam={selectedExam}
            isOpen={isDetailDialogOpen}
            onClose={() => {
              setIsDetailDialogOpen(false);
              setSelectedExam(null);
            }}
          />
          <StudentListDialog
            exam={selectedExam}
            isOpen={isStudentListOpen}
            onClose={() => {
              setIsStudentListOpen(false);
              setSelectedExam(null);
            }}
          />
        </>
      )}
    </div>
  );
};