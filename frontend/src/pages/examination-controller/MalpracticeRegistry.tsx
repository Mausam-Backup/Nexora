import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { ExamMalpractice, ExamRevaluation } from '@/types/examination-controller';
import {
  ShieldAlert,
  Plus,
  Scale,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Paperclip
} from 'lucide-react';
import { format } from 'date-fns';

export default function MalpracticeRegistry() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'malpractice' | 'revaluation'>('malpractice');
  const [malpractices, setMalpractices] = useState<ExamMalpractice[]>(coeService.getMalpractices());
  const [revaluations, setRevaluations] = useState<ExamRevaluation[]>(coeService.getRevaluations());
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isVerdictModalOpen, setIsVerdictModalOpen] = useState(false);
  const [isResolveRevalModalOpen, setIsResolveRevalModalOpen] = useState(false);

  const [selectedMalpractice, setSelectedMalpractice] = useState<ExamMalpractice | null>(null);
  const [selectedReval, setSelectedReval] = useState<ExamRevaluation | null>(null);

  // New incident form
  const [studentId, setStudentId] = useState('20CS001');
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [rollNumber, setRollNumber] = useState('20CS001');
  const [examCourse, setExamCourse] = useState('Operating Systems (CS304)');
  const [reportedBy, setReportedBy] = useState('Dr. Sarah Johnson');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [evidenceAttachment, setEvidenceAttachment] = useState('');

  // Verdict form
  const [verdictStatus, setVerdictStatus] = useState<ExamMalpractice['status']>('penalized');
  const [verdictText, setVerdictText] = useState('');

  // Revaluation resolve form
  const [revisedMarks, setRevisedMarks] = useState('');
  const [revalRemarks, setRevalRemarks] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDescription) {
      toast({ title: 'Missing details', description: 'Please provide incident notes.', variant: 'destructive' });
      return;
    }

    const newCase = coeService.reportMalpractice({
      examId: '1',
      examCourse,
      studentId,
      studentName,
      rollNumber,
      reportedBy: 'T001',
      reporterName: reportedBy,
      incidentDescription,
      evidenceAttachment: evidenceAttachment || 'incident_evidence_01.pdf',
    });

    setMalpractices(coeService.getMalpractices());
    setIsReportModalOpen(false);
    setIncidentDescription('');
    toast({
      title: 'Incident Docket Created',
      description: `Case registered for candidate ${studentName} (${rollNumber}) and referred to Disciplinary Committee.`,
    });
  };

  const handleUpdateVerdict = () => {
    if (!selectedMalpractice) return;
    coeService.updateMalpracticeVerdict(selectedMalpractice.id, verdictStatus, verdictText);
    setMalpractices(coeService.getMalpractices());
    setIsVerdictModalOpen(false);
    toast({
      title: 'Disciplinary Verdict Recorded',
      description: `Case updated to ${verdictStatus.toUpperCase()}. Notice logged with candidate profile.`,
    });
  };

  const handleResolveReval = () => {
    if (!selectedReval) return;
    const revNum = parseFloat(revisedMarks) || selectedReval.originalMarks;
    coeService.resolveRevaluation(selectedReval.id, 'resolved', revNum, revalRemarks);
    setRevaluations(coeService.getRevaluations());
    setIsResolveRevalModalOpen(false);
    toast({
      title: 'Revaluation Resolved',
      description: `Revised score of ${revNum} recorded for candidate ${selectedReval.studentName}. Marksheet updated.`,
    });
  };

  return (
    <>
      <SEO
        title="Malpractice (UFM) & Revaluation Registry | CoE"
        description="Examination malpractice incident desk, invigilator evidence notes, disciplinary committee verdicts, and revaluation handling."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Malpractice (UFM) & Revaluation Desk
            </h1>
            <p className="text-sm text-muted-foreground">
              Unfair Means (UFM) disciplinary docket and post-publication re-evaluation governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              File UFM Incident Report
            </Button>
          </div>
        </div>

        {/* Tab Selection */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full sm:w-80 grid-cols-2">
            <TabsTrigger value="malpractice" className="text-xs">
              <ShieldAlert className="mr-1.5 h-3.5 w-3.5 text-red-500" />
              UFM Malpractices ({malpractices.length})
            </TabsTrigger>
            <TabsTrigger value="revaluation" className="text-xs">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
              Revaluations ({revaluations.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Malpractice Incidents */}
          <TabsContent value="malpractice" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">
                  Reported Unfair Means (UFM) Cases
                </CardTitle>
                <CardDescription className="text-xs">
                  Incidents documented by invigilators during examination sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {malpractices.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border bg-card space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{c.studentName}</span>
                            <Badge variant="outline" className="font-mono text-xs">{c.rollNumber}</Badge>
                            <span className="text-xs text-muted-foreground">• {c.examCourse}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Reported by <strong>{c.reporterName}</strong> on {format(new Date(c.createdAt), 'PPP p')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={
                            c.status === 'penalized' ? 'bg-red-600' :
                            c.status === 'exonerated' ? 'bg-emerald-600' :
                            'bg-amber-500'
                          }>
                            {c.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMalpractice(c);
                              setVerdictStatus(c.status);
                              setVerdictText(c.verdict || '');
                              setIsVerdictModalOpen(true);
                            }}
                            className="text-xs h-7 px-2.5"
                          >
                            <Scale className="mr-1 h-3 w-3" />
                            Record Verdict
                          </Button>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground border">
                        <strong className="text-foreground">Incident Description:</strong> {c.incidentDescription}
                        {c.evidenceAttachment && (
                          <div className="mt-2 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                            <Paperclip className="h-3 w-3" />
                            <span>Attachment: {c.evidenceAttachment}</span>
                          </div>
                        )}
                      </div>

                      {c.verdict && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs">
                          <span className="font-bold text-red-900 dark:text-red-200">Disciplinary Committee Order:</span>
                          <p className="text-red-800 dark:text-red-300 mt-0.5">{c.verdict}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Revaluation Requests */}
          <TabsContent value="revaluation" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">
                  Post-Publication Re-evaluation Desk
                </CardTitle>
                <CardDescription className="text-xs">
                  Candidate grievance applications for paper re-checking and score verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="font-semibold">Candidate</TableHead>
                        <TableHead className="font-semibold">Course Code</TableHead>
                        <TableHead className="font-semibold">Original Score</TableHead>
                        <TableHead className="font-semibold">Revised Score</TableHead>
                        <TableHead className="font-semibold">Evaluator</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revaluations.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">
                            <div className="font-bold text-xs">{r.studentName}</div>
                            <div className="text-[11px] font-mono text-muted-foreground">{r.rollNumber}</div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="font-mono font-bold">{r.courseCode}</div>
                            <div className="text-[11px] text-muted-foreground">{r.courseName}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {r.originalMarks} / 100
                          </TableCell>
                          <TableCell className="font-mono text-xs font-bold text-emerald-600">
                            {r.revisedMarks ? `${r.revisedMarks} / 100` : 'Pending'}
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.evaluatorName || 'Senior Board'}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              r.status === 'resolved' ? 'bg-emerald-600' :
                              r.status === 'rejected' ? 'bg-red-600' :
                              'bg-amber-500'
                            }>
                              {r.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {r.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedReval(r);
                                  setRevisedMarks(String(r.originalMarks));
                                  setRevalRemarks('');
                                  setIsResolveRevalModalOpen(true);
                                }}
                                className="text-xs h-7 px-2"
                              >
                                Resolve Request
                              </Button>
                            )}
                            {r.status === 'resolved' && (
                              <span className="text-xs text-muted-foreground italic">Closed</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal: New Malpractice Report */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              File Unfair Means (UFM) Incident Report
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log invigilator observation and seize evidence for committee review.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateReport} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Candidate Roll No. *</Label>
                <Input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="text-xs font-mono"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Candidate Name *</Label>
                <Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Examination Course *</Label>
              <Input
                value={examCourse}
                onChange={(e) => setExamCourse(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Reporting Invigilator *</Label>
              <Input
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Incident Description & Evidence Found *</Label>
              <Textarea
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                placeholder="Describe material seized, location in hall, candidate statement, etc."
                className="text-xs min-h-[80px]"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsReportModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Submit Formal Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Record Disciplinary Committee Verdict */}
      <Dialog open={isVerdictModalOpen} onOpenChange={setIsVerdictModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              Disciplinary Committee Hearing & Verdict
            </DialogTitle>
            <DialogDescription className="text-xs">
              Candidate: <strong>{selectedMalpractice?.studentName}</strong> ({selectedMalpractice?.rollNumber})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Disciplinary Committee Decision *</Label>
              <Select value={verdictStatus} onValueChange={(v: any) => setVerdictStatus(v)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="penalized">Penalize (Course Cancellation / Suspension)</SelectItem>
                  <SelectItem value="exonerated">Exonerate (No Malpractice Found / Acquitted)</SelectItem>
                  <SelectItem value="under_investigation">Hold Under Active Hearing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Official Written Verdict Order *</Label>
              <Textarea
                value={verdictText}
                onChange={(e) => setVerdictText(e.target.value)}
                placeholder="Detail committee findings, sanctions applied, or terms of exoneration..."
                className="text-xs min-h-[80px]"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsVerdictModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleUpdateVerdict}>
              Execute Committee Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Resolve Revaluation */}
      <Dialog open={isResolveRevalModalOpen} onOpenChange={setIsResolveRevalModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-indigo-600" />
              Resolve Revaluation Application
            </DialogTitle>
            <DialogDescription className="text-xs">
              Candidate: <strong>{selectedReval?.studentName}</strong> • Original Score: <strong>{selectedReval?.originalMarks}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Revised Evaluation Score (/100) *</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={revisedMarks}
                onChange={(e) => setRevisedMarks(e.target.value)}
                className="text-xs font-mono font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Senior Evaluator Remarks *</Label>
              <Textarea
                value={revalRemarks}
                onChange={(e) => setRevalRemarks(e.target.value)}
                placeholder="Justify recalculation changes or confirmed total..."
                className="text-xs"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsResolveRevalModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={handleResolveReval}>
              Apply & Update Transcript
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
