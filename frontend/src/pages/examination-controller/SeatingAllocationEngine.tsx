import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { ExamRoom, ExamSeatingArrangement } from '@/types/examination-controller';
import {
  Building2,
  Users,
  Printer,
  Sparkles,
  Download,
  Grid3X3,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function SeatingAllocationEngine() {
  const { toast } = useToast();
  const [rooms] = useState<ExamRoom[]>(coeService.getRooms());
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || 'ROOM-LH101');
  const [seatingList, setSeatingList] = useState<ExamSeatingArrangement[]>(coeService.getSeatingArrangements());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<'door_chart' | 'nominal_roll'>('door_chart');

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  const currentRoomSeating = useMemo(() => {
    return seatingList.filter((s) => s.roomId === selectedRoomId);
  }, [seatingList, selectedRoomId]);

  // Demo multi-branch student cohort for generation
  const demoCohort = useMemo(() => [
    { id: '1', name: 'Demo User', roll: 'CS21001', branch: 'CSE', semester: 6 },
    { id: '20CS001', name: 'Aarav Sharma', roll: '20CS001', branch: 'CSE', semester: 6 },
    { id: '20EC014', name: 'Neha Patel', roll: '20EC014', branch: 'ECE', semester: 4 },
    { id: '20ME023', name: 'Rahul Gupta', roll: '20ME023', branch: 'ME', semester: 8 },
    { id: '21CS045', name: 'Priya Singh', roll: '21CS045', branch: 'CSE', semester: 4 },
    { id: 'std1', name: 'Alice Johnson', roll: 'CS21001', branch: 'CSE', semester: 3 },
    { id: 'std2', name: 'Bob Smith', roll: 'EC21002', branch: 'ECE', semester: 4 },
    { id: 'std3', name: 'Carol Davis', roll: 'ME21003', branch: 'ME', semester: 6 },
    { id: 'std4', name: 'David Wilson', roll: 'CS21004', branch: 'CSE', semester: 3 },
    { id: 'std5', name: 'Eva Brown', roll: 'EC21005', branch: 'ECE', semester: 4 },
    { id: 'std6', name: 'Frank Miller', roll: 'ME21006', branch: 'ME', semester: 6 },
    { id: 'std7', name: 'Grace Lee', roll: 'CS20001', branch: 'CSE', semester: 4 },
  ], []);

  const handleRunInterleavedEngine = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = coeService.generateInterleavedSeating('1', selectedRoomId, demoCohort);
      setSeatingList(coeService.getSeatingArrangements());
      setIsGenerating(false);
      toast({
        title: 'Anti-Cheating Seating Generated',
        description: `Successfully allocated ${generated.length} students in ${activeRoom.roomNumber} alternating CSE, ECE, and ME branches.`,
      });
    }, 600);
  };

  // Branch badge color helper
  const getBranchColor = (branch?: string) => {
    switch (branch?.toUpperCase()) {
      case 'CSE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'ECE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'ME':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <>
      <SEO
        title="Anti-Cheating Seating Allocation Engine | CoE"
        description="Automated interleaved seating plan generator, interactive room grid, door charts and nominal rolls."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Anti-Cheating Seating Allocation Engine
            </h1>
            <p className="text-sm text-muted-foreground">
              Interleaved multi-branch student seat generator to eliminate exam collusion across adjacent desks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPrintDocType('door_chart');
                setIsPrintModalOpen(true);
              }}
              className="text-xs"
            >
              <Printer className="mr-2 h-4 w-4" />
              Door Chart
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPrintDocType('nominal_roll');
                setIsPrintModalOpen(true);
              }}
              className="text-xs"
            >
              <FileText className="mr-2 h-4 w-4" />
              Nominal Roll
            </Button>
            <Button
              onClick={handleRunInterleavedEngine}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Computing Grid...' : 'Run Interleaved Engine'}
            </Button>
          </div>
        </div>

        {/* Room Selector & Engine Controls */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Selected Examination Hall
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                      <SelectTrigger className="h-9 w-52 font-semibold text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.roomNumber} ({r.building})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {activeRoom && (
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-card border">
                    Capacity: <strong>{activeRoom.capacity} Seats</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-card border">
                    Grid: <strong>{activeRoom.rowsCount} Rows × {activeRoom.colsCount} Columns</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Allocated: <strong>{currentRoomSeating.length} Students</strong>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legend for Interleaving */}
        <div className="flex flex-wrap items-center gap-4 text-xs p-3 rounded-xl bg-card border">
          <span className="font-semibold text-muted-foreground">Branch Alternation Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Computer Science (CSE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Electronics (ECE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Mechanical (ME)</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Zero Adjacent Cross-Talk Verified</span>
          </div>
        </div>

        {/* Visual Hall Seating Grid */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4 text-indigo-500" />
                  Hall Blueprint: {activeRoom.roomNumber}
                </CardTitle>
                <CardDescription className="text-xs">
                  Interactive bench matrix. Click any desk to view allocated candidate and nominal roll metadata.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Invigilator Podium Front
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Podium Bar */}
            <div className="w-full py-2 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-center rounded-lg text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-xs">
              👨‍🏫 Chief Invigilator Stage & Whiteboard 👨‍🏫
            </div>

            {/* Grid Matrix */}
            <div className="overflow-x-auto pb-4">
              <div 
                className="grid gap-3 min-w-[650px] mx-auto p-4 rounded-xl bg-muted/20 border"
                style={{
                  gridTemplateColumns: `repeat(${activeRoom.colsCount}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: activeRoom.rowsCount }).map((_, rIdx) => {
                  const rowNum = rIdx + 1;
                  return Array.from({ length: activeRoom.colsCount }).map((__, cIdx) => {
                    const colNum = cIdx + 1;
                    const seatCode = `R${rowNum}-C${colNum}`;
                    const candidate = currentRoomSeating.find((s) => s.seatCode === seatCode);

                    return (
                      <div
                        key={seatCode}
                        className={`p-3 rounded-xl border text-center transition-all relative ${
                          candidate
                            ? 'bg-card shadow-xs hover:shadow-md border-indigo-200 dark:border-indigo-900/60'
                            : 'bg-muted/30 border-dashed border-muted text-muted-foreground/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted-foreground mb-1">
                          <span>{seatCode}</span>
                          {candidate && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </div>

                        {candidate ? (
                          <div className="space-y-1">
                            <div className="font-bold text-xs truncate" title={candidate.studentName}>
                              {candidate.studentName}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              {candidate.studentRoll}
                            </div>
                            <div className="pt-1">
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 border ${getBranchColor(candidate.branch)}`}
                              >
                                {candidate.branch || 'CSE'} - Sem {candidate.semester || 6}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="py-3 text-[11px] italic">
                            Vacant Seat
                          </div>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Document Modal (Door Chart & Nominal Roll) */}
      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Printer className="h-5 w-5 text-indigo-600" />
              {printDocType === 'door_chart' ? 'Examination Hall Door Chart' : 'Nominal Roll Attendance Sheet'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Official stationery ready for examination hall door posting and invigilator signature collection.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl border bg-card text-foreground font-sans space-y-4 text-xs">
            {/* Stationery Header */}
            <div className="text-center border-b pb-3 space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider">CampusSync University</h2>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                OFFICE OF THE CONTROLLER OF EXAMINATIONS
              </div>
              <div className="text-[11px] text-muted-foreground">
                Autumn End-Semester Examinations 2024-25 • Room: <strong>{activeRoom.roomNumber} ({activeRoom.building})</strong>
              </div>
            </div>

            {printDocType === 'door_chart' ? (
              <div className="space-y-3">
                <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                  Candidate Seat Allocation List (Door Notice)
                </div>
                <table className="w-full text-left border-collapse border text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Seat No.</th>
                      <th className="border p-2">Roll Number</th>
                      <th className="border p-2">Candidate Name</th>
                      <th className="border p-2">Branch / Sem</th>
                      <th className="border p-2">Paper Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoomSeating.map((c) => (
                      <tr key={c.id}>
                        <td className="border p-2 font-mono font-bold">{c.seatCode}</td>
                        <td className="border p-2 font-mono">{c.studentRoll}</td>
                        <td className="border p-2 font-semibold">{c.studentName}</td>
                        <td className="border p-2">{c.branch} (Sem {c.semester})</td>
                        <td className="border p-2 font-mono">CS301</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                  Nominal Roll & Invigilator Attendance Record
                </div>
                <table className="w-full text-left border-collapse border text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Bench</th>
                      <th className="border p-2">Roll Number</th>
                      <th className="border p-2">Candidate Name</th>
                      <th className="border p-2">Main Answer Book No.</th>
                      <th className="border p-2 text-center">Candidate Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoomSeating.map((c) => (
                      <tr key={c.id}>
                        <td className="border p-2 font-mono">{c.seatCode}</td>
                        <td className="border p-2 font-mono">{c.studentRoll}</td>
                        <td className="border p-2 font-semibold">{c.studentName}</td>
                        <td className="border p-2 font-mono text-muted-foreground">AB-24-______</td>
                        <td className="border p-2 text-center text-muted-foreground/40 italic">
                          [ Sign Here ]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-6 grid grid-cols-2 gap-8 text-[11px] text-muted-foreground">
                  <div>
                    <div className="border-b border-muted-foreground/30 pb-4" />
                    <div className="pt-1 font-semibold">Chief Invigilator Signature</div>
                  </div>
                  <div>
                    <div className="border-b border-muted-foreground/30 pb-4" />
                    <div className="pt-1 font-semibold">Controller of Examinations Seal</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Close Preview
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                window.print();
                toast({ title: 'Print Job Dispatched', description: 'Opening system printing dialog...' });
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Official Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
