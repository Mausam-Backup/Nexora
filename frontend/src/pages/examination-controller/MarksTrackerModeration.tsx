import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { SubjectMarksSubmissionStatus, ModerationRule } from '@/types/examination-controller';
import {
  BarChart3,
  Send,
  Scale,
  Sparkles,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  AlertTriangle,
  History,
  ShieldCheck,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

export default function MarksTrackerModeration() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<SubjectMarksSubmissionStatus[]>(coeService.getMarksSubmissions());
  const [moderationLogs, setModerationLogs] = useState<ModerationRule[]>(coeService.getModerationLogs());
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Moderation form
  const [ruleTitle, setRuleTitle] = useState('Autumn 2024 Borderline Moderation (+3 Marks)');
  const [maxGrace, setMaxGrace] = useState('3');
  const [minScore, setMinScore] = useState('37');
  const [passTarget, setPassTarget] = useState('40');

  const totalCourses = submissions.length;
  const completedCourses = submissions.filter((s) => s.isSubmitted).length;
  const completionRate = Math.round((completedCourses / totalCourses) * 100);

  const handleSendNudge = (sub: SubjectMarksSubmissionStatus) => {
    const msg = coeService.sendFacultyNudge(sub.courseCode);
    toast({
      title: 'Urgent Nudge Dispatched',
      description: msg,
    });
  };

  const handleApplyGraceMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const graceNum = parseInt(maxGrace, 10) || 3;
    const minNum = parseInt(minScore, 10) || 37;
    const passNum = parseInt(passTarget, 10) || 40;

    const res = coeService.applyGraceMarksModeration({
      title: ruleTitle,
      maxGraceMarks: graceNum,
      minThreshold: minNum,
      passThreshold: passNum,
      approvedBy: 'Dr. K. R. Ramanathan (CoE)',
    });

    setModerationLogs(coeService.getModerationLogs());
    setSubmissions(coeService.getMarksSubmissions());
    setIsModerationModalOpen(false);

    toast({
      title: 'Moderation Policy Applied',
      description: `Successfully awarded grace marks up to +${graceNum} to ${res.count} borderline passing candidates. Audit entry registered.`,
    });
  };

  const filteredSubmissions = submissions.filter((s) =>
    s.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO
        title="Marks Submission & Moderation Engine | CoE"
        description="Real-time faculty grading compliance tracker, nudge system, and grace marks moderation."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Marks Submission & Moderation Engine
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor faculty grading compliance, issue official deadline nudges, and apply statutory grace mark rules.
            </p>
          </div>

          <Button
            onClick={() => setIsModerationModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-sm"
          >
            <Scale className="mr-2 h-4 w-4" />
            Apply Grace Marks Moderation
          </Button>
        </div>

        {/* Progress Overview Card */}
        <Card className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/20 dark:via-background dark:to-purple-950/20 border-indigo-200/60 dark:border-indigo-900/60">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Overall Faculty Grading Completion
                </div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {completedCourses} of {totalCourses} Subjects Evaluated ({completionRate}%)
                </div>
              </div>
              <div className="w-full sm:w-64 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span>Compliance</span>
                  <span className="font-bold">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departmental Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold">Faculty Submission Tracker</CardTitle>
                <CardDescription className="text-xs">
                  Detailed status of internal, mid-term, and practical score submissions.
                </CardDescription>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subject or faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-semibold">Course Code</TableHead>
                    <TableHead className="font-semibold">Subject Title</TableHead>
                    <TableHead className="font-semibold">Faculty In-Charge</TableHead>
                    <TableHead className="font-semibold">Progress</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Moderation</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((sub) => (
                    <TableRow key={sub.courseCode}>
                      <TableCell className="font-mono font-bold text-xs">
                        {sub.courseCode}
                      </TableCell>
                      <TableCell className="font-medium text-xs">
                        <div>{sub.courseName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {sub.branch} • Sem {sub.semester}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-semibold">{sub.instructorName}</div>
                        <div className="text-[11px] text-muted-foreground">{sub.instructorEmail}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.round((sub.submittedCount / sub.totalStudents) * 100)}
                            className="h-1.5 w-16"
                          />
                          <span className="font-mono text-xs">
                            {sub.submittedCount}/{sub.totalStudents}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sub.isSubmitted ? (
                          <Badge className="bg-emerald-600 text-xs">Complete</Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300 text-xs">
                            Pending ({sub.totalStudents - sub.submittedCount} left)
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub.moderationApplied ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300 text-xs">
                            Grace Applied
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Raw Marks</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!sub.isSubmitted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNudge(sub)}
                            className="text-xs h-7 px-2 border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                          >
                            <Send className="mr-1 h-3 w-3" />
                            Send Nudge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Moderation Audit Log */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-500" />
              Statutory Moderation & Grace Marks Audit Log
            </CardTitle>
            <CardDescription className="text-xs">
              Every score adjustment executed by the Controller of Examinations is cryptographically logged with approval authority.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moderationLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-lg border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{log.title}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">{log.id}</Badge>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3">
                      <span>Max Grace: <strong>+{log.maxGraceMarks} Marks</strong></span>
                      <span>•</span>
                      <span>Range: {log.minThreshold} - {log.passThreshold - 1} Marks</span>
                      <span>•</span>
                      <span>Approved by: <strong className="text-foreground">{log.approvedBy}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="space-y-0.5">
                      <Badge className="bg-emerald-600 text-xs">
                        {log.appliedCount} Candidates Elevated
                      </Badge>
                      <div className="text-[10px] text-muted-foreground">
                        {log.appliedDate ? format(new Date(log.appliedDate), 'PPP p') : 'Pending execution'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Configuration Modal */}
      <Dialog open={isModerationModalOpen} onOpenChange={setIsModerationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              Apply Marks Moderation Policy
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure universal or subject-specific grace marks to assist borderline passing candidates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyGraceMarks} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Policy Title / Docket Order *</Label>
              <Input
                value={ruleTitle}
                onChange={(e) => setRuleTitle(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Max Grace Marks</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={maxGrace}
                  onChange={(e) => setMaxGrace(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Min Score</Label>
                <Input
                  type="number"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Pass Target</Label>
                <Input
                  type="number"
                  value={passTarget}
                  onChange={(e) => setPassTarget(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">Audit Preview:</div>
              <p>
                Candidates scoring between {minScore} and {parseInt(passTarget, 10) - 1} will receive up to +{maxGrace} marks to reach the passing standard of {passTarget}.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModerationModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Authorize Moderation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
