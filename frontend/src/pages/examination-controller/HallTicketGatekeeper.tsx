import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { coeService } from '@/services/coeService';
import type { ExamHallTicket } from '@/types/examination-controller';
import {
  QrCode,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  Send,
  Sparkles,
  Filter,
  UserX,
  UserCheck
} from 'lucide-react';

export default function HallTicketGatekeeper() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<ExamHallTicket[]>(coeService.getHallTickets());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'eligible' | 'debarred'>('all');
  
  const [selectedTicket, setSelectedTicket] = useState<ExamHallTicket | null>(null);
  const [debarReason, setDebarReason] = useState('');

  // Hardware Scanner Simulation State
  const [scannedRollNumber, setScannedRollNumber] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'granted' | 'denied' | 'idle';
    student?: ExamHallTicket;
    reason?: string;
  }>({ status: 'idle' });

  const handleSimulateScan = (roll: string) => {
    setScannedRollNumber(roll);
    const candidate = tickets.find(t => t.rollNumber.toLowerCase() === roll.toLowerCase() || t.id.toLowerCase() === roll.toLowerCase());
    
    if (!candidate) {
      setScanResult({
        status: 'denied',
        reason: 'UNREGISTERED CANDIDATE: Roll Number not found in institutional exam cycle.'
      });
      return;
    }

    if (!candidate.isEligible) {
      setScanResult({
        status: 'denied',
        student: candidate,
        reason: candidate.debarReason || 'STATUTORY DEBARMENT: Attendance shortage (<75%) or unpaid fee hold.'
      });
    } else {
      setScanResult({
        status: 'granted',
        student: candidate
      });
    }
  };

  const [isDebarModalOpen, setIsDebarModalOpen] = useState(false);

  const eligibleCount = tickets.filter((t) => t.isEligible).length;
  const debarredCount = tickets.filter((t) => !t.isEligible).length;

  const handleBulkRelease = () => {
    const res = coeService.bulkReleaseHallTickets('CYCLE-2024-ODD');
    setTickets(coeService.getHallTickets());
    toast({
      title: 'Bulk Hall Tickets Issued',
      description: `Released verified QR passes to ${res.released} eligible students. ${res.debarred} students blocked under statutory rules.`,
    });
  };

  const handleOpenDebarModal = (ticket: ExamHallTicket) => {
    setSelectedTicket(ticket);
    setDebarReason(ticket.debarReason || 'Administrative Debarment by Controller of Examinations order');
    setIsDebarModalOpen(true);
  };

  const handleConfirmDebar = () => {
    if (!selectedTicket) return;
    coeService.toggleDebarStudent(selectedTicket.id, true, debarReason);
    setTickets(coeService.getHallTickets());
    setIsDebarModalOpen(false);
    toast({
      title: 'Candidate Debarred',
      description: `${selectedTicket.studentName} (${selectedTicket.rollNumber}) debarred from current exam cycle.`,
      variant: 'destructive',
    });
  };

  const handleReinstate = (ticket: ExamHallTicket) => {
    coeService.toggleDebarStudent(ticket.id, false);
    setTickets(coeService.getHallTickets());
    toast({
      title: 'Candidate Reinstated',
      description: `${ticket.studentName} is now cleared and hall ticket QR has been generated.`,
    });
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.branch.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'eligible') return t.isEligible;
      if (selectedFilter === 'debarred') return !t.isEligible;
      return true;
    });
  }, [tickets, searchQuery, selectedFilter]);

  return (
    <>
      <SEO
        title="Hall Ticket & Eligibility Gatekeeper | CoE"
        description="Statutory 75% attendance gatekeeper, fee clearance filter, and bulk hall ticket release."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hall Ticket & Eligibility Gatekeeper
            </h1>
            <p className="text-sm text-muted-foreground">
              Automated gatekeeper applying UGC/AICTE 75% minimum attendance rule and financial clearance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleBulkRelease}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Bulk Release Eligible Hall Tickets
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{tickets.length}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Total Registered Candidates</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <QrCode className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{eligibleCount}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Cleared & Issued Hall Tickets</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{debarredCount}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Debarred Candidates</p>
              </div>
              <div className="p-2.5 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Physical Exam Hall Entry Scanner Console */}
        <Card className="border-primary/30 bg-card/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <span>Physical Exam Hall Entry Gate Scanner (Real-Time QR Verification)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Simulates door security scanner at examination hall. Verifies dynamic eligibility tokens and halts debarred entries on the spot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Scan or enter Candidate Roll Number (e.g. 20CS001, 20CS003, 20CS004)..."
                  value={scannedRollNumber}
                  onChange={(e) => handleSimulateScan(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSimulateScan('20CS001')} 
                  className="text-xs h-9 border-emerald-300 text-emerald-700 dark:text-emerald-400"
                >
                  Test: 20CS001 (Eligible)
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSimulateScan('20CS003')} 
                  className="text-xs h-9 border-red-300 text-red-700 dark:text-red-400"
                >
                  Test: 20CS003 (Debarred)
                </Button>
              </div>
            </div>

            {scanResult.status !== 'idle' && (
              <div className={`p-3.5 rounded-lg border flex items-start gap-3 transition-all ${
                scanResult.status === 'granted' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
              }`}>
                {scanResult.status === 'granted' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-sm">
                    {scanResult.status === 'granted' 
                      ? `✅ ENTRY PERMITTED: ${scanResult.student?.studentName} (${scanResult.student?.rollNumber})` 
                      : `❌ ENTRY DENIED: EXAMINATION ACCESS BLOCKED`}
                  </div>
                  {scanResult.status === 'granted' ? (
                    <p>Verified QR Token: <code className="bg-emerald-500/20 px-1 py-0.5 rounded font-mono">{scanResult.student?.qrToken}</code> • Assigned Desk: <strong>Hall A - Bench 12</strong></p>
                  ) : (
                    <p className="font-medium text-destructive">{scanResult.reason}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Clearance Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold">Candidate Eligibility Registry</CardTitle>
                <CardDescription className="text-xs">
                  Filter by clearance criteria or manually debar students with logged justification.
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Tabs value={selectedFilter} onValueChange={(v: any) => setSelectedFilter(v)}>
                  <TabsList className="h-9">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="eligible" className="text-xs">Eligible ({eligibleCount})</TabsTrigger>
                    <TabsTrigger value="debarred" className="text-xs">Debarred ({debarredCount})</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-semibold">Candidate</TableHead>
                    <TableHead className="font-semibold">Branch / Sem</TableHead>
                    <TableHead className="font-semibold">Attendance %</TableHead>
                    <TableHead className="font-semibold">Fee Clearance</TableHead>
                    <TableHead className="font-semibold">Hall Ticket Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-bold text-sm text-foreground">{t.studentName}</div>
                          <div className="text-xs text-muted-foreground font-mono">{t.rollNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">{t.branch}</div>
                        <div className="text-xs text-muted-foreground">Semester {t.semester}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold ${
                            t.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {t.attendancePercentage}%
                          </span>
                          {t.attendancePercentage < 75 && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                              Below 75%
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {t.feeCleared ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 text-xs">
                            No Dues
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Dues Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {t.isEligible ? (
                          <div className="space-y-0.5">
                            <Badge className="bg-emerald-600 text-xs">
                              QR Ticket Released
                            </Badge>
                            <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]">
                              {t.qrToken}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <Badge variant="destructive" className="text-xs">
                              Debarred
                            </Badge>
                            <div className="text-[11px] text-red-600 dark:text-red-400 truncate max-w-[180px]" title={t.debarReason}>
                              {t.debarReason}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {t.isEligible ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDebarModal(t)}
                            className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950 border-red-200"
                          >
                            <UserX className="mr-1 h-3.5 w-3.5" />
                            Debar Candidate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReinstate(t)}
                            className="text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 border-emerald-200"
                          >
                            <UserCheck className="mr-1 h-3.5 w-3.5" />
                            Clear & Reinstate
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
      </div>

      {/* Debar Justification Modal */}
      <Dialog open={isDebarModalOpen} onOpenChange={setIsDebarModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Debar Candidate from Examination
            </DialogTitle>
            <DialogDescription className="text-xs">
              Candidate: <strong>{selectedTicket?.studentName}</strong> ({selectedTicket?.rollNumber})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Official Statutory Debarment Reason *</Label>
              <Input
                value={debarReason}
                onChange={(e) => setDebarReason(e.target.value)}
                placeholder="e.g. Low attendance (62.4%), Disciplinary Committee order, etc."
                className="text-xs"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                This explanation will be permanently printed on the student's digital hall ticket view.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDebarModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDebar}>
              Confirm Debarment Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
