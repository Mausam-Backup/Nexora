import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  ShieldAlert,
  FileCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';

export default function ResultPublishingEngine() {
  const { toast } = useToast();
  const [isPublished, setIsPublished] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUnpublishModalOpen, setIsUnpublishModalOpen] = useState(false);
  const [activeCycleId] = useState('CYCLE-2024-ODD');

  useEffect(() => {
    setIsPublished(coeService.isResultsPublished());
  }, []);

  // Demo cohort result preview with SGPA/CGPA calculations
  const [cohortResults] = useState([
    { roll: 'CS21001', name: 'Demo User', branch: 'CSE', semester: 6, credits: 20, rawSgpa: 8.45, moderatedSgpa: 8.65, cgpa: 8.65, standing: 'Distinction' },
    { roll: '20CS001', name: 'Aarav Sharma', branch: 'CSE', semester: 6, credits: 20, rawSgpa: 8.80, moderatedSgpa: 8.90, cgpa: 8.85, standing: 'First Class with Distinction' },
    { roll: '20CS014', name: 'Neha Patel', branch: 'CSE', semester: 6, credits: 20, rawSgpa: 9.15, moderatedSgpa: 9.15, cgpa: 9.10, standing: 'University Honors' },
    { roll: '20ME023', name: 'Rahul Gupta', branch: 'ME', semester: 8, credits: 22, rawSgpa: 7.70, moderatedSgpa: 7.80, cgpa: 7.80, standing: 'First Class' },
    { roll: '21CS045', name: 'Priya Singh', branch: 'CSE', semester: 4, credits: 20, rawSgpa: 8.70, moderatedSgpa: 8.90, cgpa: 8.90, standing: 'First Class with Distinction' },
    { roll: 'std1', name: 'Alice Johnson', branch: 'CSE', semester: 3, credits: 18, rawSgpa: 8.60, moderatedSgpa: 8.70, cgpa: 8.70, standing: 'First Class with Distinction' },
  ]);

  const handlePublishResults = () => {
    coeService.publishOfficialResults(activeCycleId);
    setIsPublished(true);
    setIsConfirmModalOpen(false);
    toast({
      title: 'OFFICIAL RESULTS PUBLISHED',
      description: 'Examination grades, SGPA, and digital marksheet transcripts are now active across all student and parent portals.',
    });
  };

  const handleUnpublishResults = () => {
    coeService.unpublishResults(activeCycleId);
    setIsPublished(false);
    setIsUnpublishModalOpen(false);
    toast({
      title: 'Publication Rolled Back',
      description: 'Results retracted to draft mode for administrative moderation.',
    });
  };

  return (
    <>
      <SEO
        title="Result Processing & 1-Click Publishing Engine | CoE"
        description="Sovereign official examination result publication, SGPA calculation preview, and transcript release."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Result Processing & 1-Click Publishing Engine
            </h1>
            <p className="text-sm text-muted-foreground">
              Final pre-publication grade audit, SGPA/CGPA verification, and sovereign public broadcast.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPublished ? (
              <Button
                variant="outline"
                onClick={() => setIsUnpublishModalOpen(true)}
                className="text-xs border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retract to Draft Mode
              </Button>
            ) : (
              <Button
                onClick={() => setIsConfirmModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                PUBLISH OFFICIAL RESULTS
              </Button>
            )}
          </div>
        </div>

        {/* Sovereign Status Card */}
        <Card className={`border-2 ${
          isPublished 
            ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20' 
            : 'border-indigo-300 bg-indigo-50/20 dark:bg-indigo-950/20'
        }`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge className={isPublished ? 'bg-emerald-600' : 'bg-amber-500'}>
                    {isPublished ? 'LIVE ON ALL PORTALS' : 'PRE-PUBLICATION DRAFT'}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    Cycle: {activeCycleId}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {isPublished ? 'Results Released to Student Marksheets' : 'Results Ready for Sovereign Release'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isPublished
                    ? 'Official SGPA and verified grade point transcripts are accessible by students, parents, and recruiters.'
                    : '100% faculty scores and grace marks have been cross-verified. Clicking "Publish" makes scores immediately visible to students.'
                  }
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="p-4 rounded-xl bg-card border text-center space-y-0.5">
                  <div className="text-xs font-semibold text-muted-foreground">CANDIDATES GRADED</div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">1,248</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% Verified</div>
                </div>

                <div className="p-4 rounded-xl bg-card border text-center space-y-0.5">
                  <div className="text-xs font-semibold text-muted-foreground">MEAN BATCH SGPA</div>
                  <div className="text-2xl font-bold text-emerald-600">8.42</div>
                  <div className="text-[10px] text-muted-foreground">Above Target</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-publication Cohort Grade Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-indigo-600" />
                  Cohort Grade & SGPA Recalculation Audit Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  Review calculated SGPA with moderation deltas before activating student marksheets.
                </CardDescription>
              </div>

              <Badge variant="outline" className="text-xs">
                Audited by CoE Office
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-semibold">Candidate</TableHead>
                    <TableHead className="font-semibold">Branch / Sem</TableHead>
                    <TableHead className="font-semibold">Credits</TableHead>
                    <TableHead className="font-semibold">Raw SGPA</TableHead>
                    <TableHead className="font-semibold">Moderated SGPA</TableHead>
                    <TableHead className="font-semibold">Cumulative CGPA</TableHead>
                    <TableHead className="font-semibold">Academic Standing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohortResults.map((c) => (
                    <TableRow key={c.roll}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-bold text-sm text-foreground">{c.name}</div>
                          <div className="text-xs font-mono text-muted-foreground">{c.roll}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {c.branch} (Semester {c.semester})
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {c.credits}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {c.rawSgpa.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {c.moderatedSgpa.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-emerald-600">
                        {c.cgpa.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-muted/40">
                          {c.standing}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal: Publish Official Results */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <Award className="h-5 w-5" />
              Publish Official University Results
            </DialogTitle>
            <DialogDescription className="text-xs">
              This action will release official grade cards, SGPA recalculations, and transcript downloads to all students.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-muted/40 text-xs space-y-2">
            <div className="font-semibold text-foreground">CoE Statutory Checklist:</div>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              <li>100% internal and external evaluations submitted.</li>
              <li>Academic grace mark moderation applied and logged.</li>
              <li>All malpractice cases disposed by Disciplinary Committee.</li>
              <li>Official CoE digital signature stamp attached to transcripts.</li>
            </ul>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={handlePublishResults}>
              Authorize & Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal: Retract Results */}
      <Dialog open={isUnpublishModalOpen} onOpenChange={setIsUnpublishModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <RotateCcw className="h-5 w-5" />
              Retract Examination Results
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to revert results to pre-publication draft mode? Students will see an evaluation in-progress notice.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsUnpublishModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleUnpublishResults}>
              Confirm Retraction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
