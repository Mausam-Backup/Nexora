import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { ExamCycle } from '@/types/examination-controller';
import {
  Award,
  Calendar,
  Clock,
  Users,
  Building2,
  FileSpreadsheet,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Send,
  Zap,
  Scale
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

export default function CoEDashboardOverview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cycles, setCycles] = useState<ExamCycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<ExamCycle | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [submissions, setSubmissions] = useState(coeService.getMarksSubmissions());
  const [malpractices, setMalpractices] = useState(coeService.getMalpractices());
  const [hallTickets, setHallTickets] = useState(coeService.getHallTickets());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const loadedCycles = coeService.getCycles();
    setCycles(loadedCycles);
    const active = loadedCycles.find(c => c.status === 'evaluation' || c.status === 'active') || loadedCycles[0];
    setActiveCycle(active || null);
    setIsPublished(coeService.isResultsPublished());

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute metrics
  const totalSubmissions = submissions.length;
  const completedSubmissions = submissions.filter(s => s.isSubmitted).length;
  const facultySubmissionProgress = totalSubmissions > 0 
    ? Math.round((completedSubmissions / totalSubmissions) * 100) 
    : 0;

  const totalStudentsAppearing = 1248;
  const pendingMalpractices = malpractices.filter(m => m.status === 'under_investigation').length;
  const eligibleTickets = hallTickets.filter(h => h.isEligible).length;

  const formatCountdown = (targetDateStr?: string) => {
    if (!targetDateStr) return 'N/A';
    const target = new Date(targetDateStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return 'Deadline Passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      <SEO 
        title="Examination Controller Portal" 
        description="Office of the Controller of Examinations (CoE) executive operations and exam administration."
      />

      <div className="space-y-6">
        {/* Banner / Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-indigo-200 border border-white/10">
                <Award className="h-3.5 w-3.5 text-amber-300" />
                Office of the Controller of Examinations (CoE)
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Master Examination Command Center
              </h1>
              <p className="text-indigo-200 text-sm sm:text-base max-w-2xl">
                Real-time oversight across timetable conflicts, anti-cheating seating plans, faculty grading compliance, and sovereign 1-click result publication.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button 
                onClick={() => navigate('/examination-controller/publish')}
                className="bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold shadow-lg transition-transform hover:scale-105"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                1-Click Result Publish
              </Button>
              <Button 
                onClick={() => navigate('/examination-controller/cycles')}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Manage Cycles
              </Button>
            </div>
          </div>
          
          {/* Subtle decorative glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        </div>

        {/* Live Active Cycle & Cutoff Countdown */}
        {activeCycle && (
          <Card className="border-indigo-200/60 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/20 dark:via-background dark:to-purple-950/10 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold border-indigo-200 dark:border-indigo-800">
                      CURRENT ACTIVE CYCLE
                    </Badge>
                    <Badge className={
                      activeCycle.status === 'published' ? 'bg-emerald-600' :
                      activeCycle.status === 'evaluation' ? 'bg-amber-600' :
                      'bg-indigo-600'
                    }>
                      {activeCycle.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {activeCycle.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Term: <strong className="text-foreground">{activeCycle.term} ({activeCycle.academicYear})</strong>
                    <span className="text-muted-foreground/50">•</span>
                    Window: {format(new Date(activeCycle.startDate), 'MMM dd')} - {format(new Date(activeCycle.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:w-auto">
                  <div className="p-3.5 rounded-xl bg-card border shadow-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      FACULTY GRADING DEADLINE
                    </div>
                    <div className="font-mono text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                      {formatCountdown(activeCycle.marksSubmissionDeadline)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Cutoff: {format(new Date(activeCycle.marksSubmissionDeadline), 'MMM dd, hh:mm a')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border shadow-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-indigo-500" />
                      RESULTS PUBLICATION
                    </div>
                    <div className="font-mono text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {isPublished ? 'OFFICIALLY PUBLISHED' : formatCountdown(activeCycle.resultsPublishDate)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Status: {isPublished ? 'Live on Student & Parent Portals' : 'Under CoE Review & Moderation'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5 Core Metric Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Students */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Users className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                  Enrolled
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{totalStudentsAppearing}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Students Appearing</p>
              </div>
            </CardContent>
          </Card>

          {/* Hall Tickets Gatekeeper */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                  75% Rule
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{eligibleTickets} / {hallTickets.length}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Eligible Hall Tickets</p>
              </div>
            </CardContent>
          </Card>

          {/* Marks Submission Progress */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-600">{facultySubmissionProgress}%</span>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="text-2xl font-bold">{completedSubmissions}/{totalSubmissions}</div>
                <Progress value={facultySubmissionProgress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">Faculty Marks In</p>
              </div>
            </CardContent>
          </Card>

          {/* Malpractice Cases */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                {pendingMalpractices > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    Action Needed
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{pendingMalpractices}</div>
                <p className="text-xs text-muted-foreground mt-0.5">UFM Cases Pending</p>
              </div>
            </CardContent>
          </Card>

          {/* Result Status */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <Award className="h-5 w-5" />
                </div>
                <Badge className={isPublished ? 'bg-emerald-600' : 'bg-amber-500'}>
                  {isPublished ? 'Published' : 'Draft Mode'}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-lg font-bold truncate">
                  {isPublished ? 'All Grades Live' : 'Pre-Publishing'}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Official SGPA Engine</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Executive Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/examination-controller/cycles')}
              className="p-4 rounded-xl border bg-card text-left hover:border-indigo-400 hover:shadow-md transition-all group flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Create Exam Cycle
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define dates, terms & cutoff deadlines
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/examination-controller/seating')}
              className="p-4 rounded-xl border bg-card text-left hover:border-purple-400 hover:shadow-md transition-all group flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 group-hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Auto-Generate Seating
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Anti-cheating interleaved bench allocation
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/examination-controller/hall-tickets')}
              className="p-4 rounded-xl border bg-card text-left hover:border-emerald-400 hover:shadow-md transition-all group flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Issue Hall Tickets
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Filter attendance & generate QR passes
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/examination-controller/publish')}
              className="p-4 rounded-xl border bg-card text-left hover:border-amber-400 hover:shadow-md transition-all group flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  1-Click Result Publish
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recalculate SGPA & broadcast marksheets
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Operational Modules Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faculty Grading Tracker Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
                  Departmental Grading Compliance
                </CardTitle>
                <CardDescription className="text-xs">
                  Pending faculty grade uploads requiring CoE follow-up
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/examination-controller/moderation')}
                className="text-xs"
              >
                View Tracker <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {submissions.slice(0, 4).map((sub) => (
                <div key={sub.courseCode} className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-muted">
                        {sub.courseCode}
                      </span>
                      <span className="font-medium text-sm truncate">{sub.courseName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>Faculty: {sub.instructorName}</span>
                      <span>•</span>
                      <span>{sub.submittedCount}/{sub.totalStudents} graded</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sub.isSubmitted ? (
                      <Badge className="bg-emerald-600 text-white text-xs">Submitted</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2.5 border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                        onClick={() => {
                          const msg = coeService.sendFacultyNudge(sub.courseCode);
                          toast({ title: 'Faculty Nudge Sent', description: msg });
                        }}
                      >
                        <Send className="mr-1 h-3 w-3" />
                        Nudge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Malpractice & Disciplinary Case Desk */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  Unfair Means (UFM) Disciplinary Desk
                </CardTitle>
                <CardDescription className="text-xs">
                  Invigilator incident reports & disciplinary status
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/examination-controller/malpractice')}
                className="text-xs"
              >
                Open Registry <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {malpractices.map((caseItem) => (
                <div key={caseItem.id} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{caseItem.studentName}</span>
                      <span className="font-mono text-xs text-muted-foreground">({caseItem.rollNumber})</span>
                    </div>
                    <Badge variant={caseItem.status === 'penalized' ? 'destructive' : 'secondary'} className="text-xs capitalize">
                      {caseItem.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {caseItem.incidentDescription}
                  </p>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1 border-t">
                    <span>Reported by: {caseItem.reporterName}</span>
                    <span>Exam: {caseItem.examCourse}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
