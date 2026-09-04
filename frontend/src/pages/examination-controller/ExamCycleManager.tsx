import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { ExamCycle, TimetableConflict } from '@/types/examination-controller';
import {
  Calendar,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Sparkles,
  RefreshCw,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function ExamCycleManager() {
  const { toast } = useToast();
  const [cycles, setCycles] = useState<ExamCycle[]>(coeService.getCycles());
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<ExamCycle | null>(null);

  // Form state
  const [cycleName, setCycleName] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [term, setTerm] = useState('Odd Semester');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [marksDeadline, setMarksDeadline] = useState('');

  // Conflict state (mock exams to demonstrate conflict engine)
  const [sampleExams, setSampleExams] = useState([
    { id: 'ex_1', course: 'Operating Systems', courseCode: 'CS304', branch: 'CSE', semester: 6, date: '2024-11-28', time: '09:00 - 12:00' },
    { id: 'ex_2', course: 'Advanced Algorithms', courseCode: 'CS306', branch: 'CSE', semester: 6, date: '2024-11-28', time: '09:00 - 12:00' }, // Intentional clash
    { id: 'ex_3', course: 'Database Systems', courseCode: 'CS301', branch: 'CSE', semester: 6, date: '2024-11-30', time: '09:00 - 12:00' },
    { id: 'ex_4', course: 'Computer Networks', courseCode: 'CS303', branch: 'CSE', semester: 6, date: '2024-12-02', time: '09:00 - 12:00' },
  ]);

  const conflicts = useMemo(() => {
    return coeService.checkTimetableConflicts(sampleExams);
  }, [sampleExams]);

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cycleName || !startDate || !endDate || !marksDeadline) {
      toast({ title: 'Missing Details', description: 'Please fill in all mandatory cycle fields.', variant: 'destructive' });
      return;
    }

    const created = coeService.createCycle({
      name: cycleName,
      academicYear,
      term,
      startDate,
      endDate,
      marksSubmissionDeadline: `${marksDeadline}T23:59:59Z`,
      status: 'active',
    });

    setCycles(coeService.getCycles());
    setIsCreateModalOpen(false);
    // Reset form
    setCycleName('');
    setStartDate('');
    setEndDate('');
    setMarksDeadline('');

    toast({
      title: 'Exam Cycle Initialized',
      description: `Cycle ${created.name} is now active for examination scheduling.`,
    });
  };

  const handleEmergencyReschedule = (conflict: TimetableConflict) => {
    // Reschedule exam2 by 2 days
    setSampleExams(prev => prev.map(e => {
      if (e.id === conflict.exam2Code.toLowerCase() || e.courseCode === conflict.exam2Code) {
        return { ...e, date: '2024-12-04' };
      }
      return e;
    }));

    toast({
      title: 'Emergency Rescheduling Executed',
      description: `Exam ${conflict.exam2Course} (${conflict.exam2Code}) moved to 2024-12-04 to eliminate slot conflict.`,
    });
  };

  const filteredCycles = cycles.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.academicYear.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO 
        title="Exam Cycles & Timetable Master | CoE"
        description="Master timetable configuration, slot conflict detector, and exam cycle manager."
      />

      <div className="space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Exam Cycles & Timetable Master
            </h1>
            <p className="text-sm text-muted-foreground">
              Define academic cycles, configure evaluation terms, and run automated slot clash audits.
            </p>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Exam Cycle
          </Button>
        </div>

        {/* Master Conflict Detector Banner */}
        <Card className={`border-2 transition-colors ${
          conflicts.length > 0 
            ? 'border-amber-500/80 bg-amber-50/40 dark:bg-amber-950/20' 
            : 'border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/10'
        }`}>
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  conflicts.length > 0 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                }`}>
                  {conflicts.length > 0 ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">
                      Master Timetable Conflict Audit Engine
                    </h3>
                    <Badge variant={conflicts.length > 0 ? 'destructive' : 'outline'} className="text-xs">
                      {conflicts.length > 0 ? `${conflicts.length} Clash Detected` : 'Zero Conflicts'}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {conflicts.length > 0 
                      ? 'Automated scan identified simultaneous exams scheduled for the same branch and semester.'
                      : 'All scheduled branch/semester exam slots are orthogonal with 100% clash-free student timetables.'
                    }
                  </p>
                </div>
              </div>

              {conflicts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                    onClick={() => handleEmergencyReschedule(conflicts[0])}
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Auto-Resolve Clash
                  </Button>
                </div>
              )}
            </div>

            {/* Detailed Conflict Notice */}
            {conflicts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/40 space-y-2">
                {conflicts.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-card border border-amber-300 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Branch: {c.branch} (Sem {c.semester}) • Slot: {c.date} @ {c.slot}
                      </div>
                      <div className="text-muted-foreground">
                        Clashing papers: <strong className="text-foreground">{c.exam1Course} ({c.exam1Code})</strong> vs <strong className="text-foreground">{c.exam2Course} ({c.exam2Code})</strong>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEmergencyReschedule(c)}
                      className="border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950"
                    >
                      Reschedule {c.exam2Code} (+2 Days)
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cycles Table & Management */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold">Academic Examination Cycles</CardTitle>
                <CardDescription className="text-xs">
                  Review timelines, marks submission cutoff deadlines, and result statuses.
                </CardDescription>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cycles..."
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
                    <TableHead className="font-semibold">Cycle Name</TableHead>
                    <TableHead className="font-semibold">Term / Year</TableHead>
                    <TableHead className="font-semibold">Exam Window</TableHead>
                    <TableHead className="font-semibold">Faculty Cutoff</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCycles.map((cycle) => (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-bold text-sm text-foreground">{cycle.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{cycle.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold">{cycle.term}</div>
                        <div className="text-xs text-muted-foreground">{cycle.academicYear}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {format(new Date(cycle.startDate), 'MMM dd, yyyy')} - {format(new Date(cycle.endDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {format(new Date(cycle.marksSubmissionDeadline), 'MMM dd, hh:mm a')}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          cycle.status === 'published' ? 'bg-emerald-600' :
                          cycle.status === 'evaluation' ? 'bg-amber-600' :
                          cycle.status === 'active' ? 'bg-indigo-600' :
                          'bg-slate-600'
                        }>
                          {cycle.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCycle(cycle);
                            setIsRescheduleModalOpen(true);
                          }}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Modify Cutoff
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal: Create New Cycle */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Examination Cycle</DialogTitle>
            <DialogDescription>
              Set up a new semester examination cycle with dates and faculty submission cutoff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCycle} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cycleName" className="text-xs">Cycle Title *</Label>
              <Input
                id="cycleName"
                placeholder="e.g. Spring End-Semester Examination 2024-25"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Term</Label>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Odd Semester">Odd Semester</SelectItem>
                    <SelectItem value="Even Semester">Even Semester</SelectItem>
                    <SelectItem value="Supplementary">Supplementary Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-xs">Exam Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="text-xs">Exam End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="marksDeadline" className="text-xs">Faculty Marks Submission Cutoff *</Label>
              <Input
                id="marksDeadline"
                type="date"
                value={marksDeadline}
                onChange={(e) => setMarksDeadline(e.target.value)}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                After this date, teacher grading will lock unless granted extension by CoE.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Initialize Cycle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Modify Cutoff / Reschedule */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Grading Deadline</DialogTitle>
            <DialogDescription>
              Extend or update the marks submission cutoff for {selectedCycle?.name}.
            </DialogDescription>
          </DialogHeader>

          {selectedCycle && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-muted text-xs space-y-1">
                <div>Current Deadline: <strong>{format(new Date(selectedCycle.marksSubmissionDeadline), 'PPP')}</strong></div>
                <div>Status: <Badge variant="outline" className="text-xs">{selectedCycle.status}</Badge></div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Select Extension Option</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      const curr = new Date(selectedCycle.marksSubmissionDeadline);
                      curr.setDate(curr.getDate() + 3);
                      coeService.updateCycle(selectedCycle.id, {
                        marksSubmissionDeadline: curr.toISOString(),
                      });
                      setCycles(coeService.getCycles());
                      setIsRescheduleModalOpen(false);
                      toast({ title: 'Deadline Extended', description: '+3 Days granted for faculty submissions.' });
                    }}
                  >
                    +3 Days Extension
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      const curr = new Date(selectedCycle.marksSubmissionDeadline);
                      curr.setDate(curr.getDate() + 7);
                      coeService.updateCycle(selectedCycle.id, {
                        marksSubmissionDeadline: curr.toISOString(),
                      });
                      setCycles(coeService.getCycles());
                      setIsRescheduleModalOpen(false);
                      toast({ title: 'Deadline Extended', description: '+7 Days granted for faculty submissions.' });
                    }}
                  >
                    +7 Days Extension
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
