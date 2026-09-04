import React, { useState } from 'react';
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
import type { ExamInvigilator } from '@/types/examination-controller';
import {
  Users,
  Calendar,
  Clock,
  Building2,
  Plus,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Search,
  ShieldCheck
} from 'lucide-react';

export default function InvigilationRosterManager() {
  const { toast } = useToast();
  const [invigilators, setInvigilators] = useState<ExamInvigilator[]>(coeService.getInvigilators());
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New assignment form state
  const [teacherId, setTeacherId] = useState('T001');
  const [examCourse, setExamCourse] = useState('Operating Systems (CS304)');
  const [examDate, setExamDate] = useState('2024-11-28');
  const [examTime, setExamTime] = useState('09:00 AM - 12:00 PM');
  const [reportingTime, setReportingTime] = useState('08:30 AM');
  const [roomId, setRoomId] = useState('ROOM-LH101');
  const [notes, setNotes] = useState('Chief Invigilator');

  const availableTeachers = [
    { id: 'T001', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@college.edu', subjectTeaches: 'Data Structures' },
    { id: 'EMP-001', name: 'Prof. John Doe', email: 'john.doe@college.edu', subjectTeaches: 'Software Engineering' },
    { id: 'T002', name: 'Prof. Michael Brown', email: 'michael.brown@college.edu', subjectTeaches: 'Computer Networks' },
    { id: 'T003', name: 'Dr. Emily Davis', email: 'emily.davis@college.edu', subjectTeaches: 'Operating Systems' },
    { id: 'T004', name: 'Prof. Robert Wilson', email: 'robert.wilson@college.edu', subjectTeaches: 'Discrete Mathematics' },
  ];

  const handleAssignDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = availableTeachers.find((t) => t.id === teacherId);

    // Rule: Avoid assigning teacher to rooms testing their own subject
    if (examCourse.toLowerCase().includes(teacher?.subjectTeaches.toLowerCase() || 'xyz')) {
      toast({
        title: 'Integrity Rule Violation',
        description: `CoE Rule: ${teacher?.name} cannot invigilate ${examCourse} because they teach this subject!`,
        variant: 'destructive',
      });
      return;
    }

    const res = coeService.assignInvigilator({
      examId: '1',
      examCourse,
      examDate,
      examTime,
      teacherId,
      teacherName: teacher?.name,
      teacherEmail: teacher?.email,
      roomId,
      roomNumber: roomId === 'ROOM-LH101' ? 'LH-101' : 'LH-102',
      reportingTime,
      dutyStatus: 'assigned',
      notes,
    });

    if (!res.success) {
      toast({
        title: 'Duty Clash Detected',
        description: res.message,
        variant: 'destructive',
      });
      return;
    }

    setInvigilators(coeService.getInvigilators());
    setIsAssignModalOpen(false);
    toast({
      title: 'Duty Allocated Successfully',
      description: `Assigned ${teacher?.name} to room ${roomId} on ${examDate}.`,
    });
  };

  const handleSwapDuty = (dutyId: number | string) => {
    coeService.updateDutyStatus(dutyId, 'confirmed');
    setInvigilators(coeService.getInvigilators());
    toast({
      title: 'Duty Swap Approved',
      description: 'Exchange confirmed and schedule notified to faculty via notification.',
    });
  };

  const filteredInvigilators = invigilators.filter((inv) =>
    (inv.teacherName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.examCourse || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.roomNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO
        title="Faculty Invigilation Roster | CoE"
        description="Faculty examination duty roster, clash detector, and swap approval system."
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Faculty Invigilation Roster
            </h1>
            <p className="text-sm text-muted-foreground">
              Roster management with automated conflict prevention (disallows faculty invigilating own papers).
            </p>
          </div>

          <Button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Assign Invigilator
          </Button>
        </div>

        {/* Security / Conflict Principle Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 border border-indigo-200/70 dark:border-indigo-800/40 flex items-start gap-3.5 text-xs">
          <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground">CoE Statutory Rule (Regulation 14.B):</span>
            <p className="text-muted-foreground">
              Teachers are strictly prohibited from invigilating examination halls where their taught subjects are administered. System automatically evaluates faculty subject assignments and blocks conflicting schedules.
            </p>
          </div>
        </div>

        {/* Table of Duties */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold">Duty Allocation Schedule</CardTitle>
                <CardDescription className="text-xs">
                  Active roster for Autumn End-Semester Examinations 2024-25
                </CardDescription>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search faculty or course..."
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
                    <TableHead className="font-semibold">Faculty Member</TableHead>
                    <TableHead className="font-semibold">Assigned Paper</TableHead>
                    <TableHead className="font-semibold">Hall / Room</TableHead>
                    <TableHead className="font-semibold">Exam Timing</TableHead>
                    <TableHead className="font-semibold">Reporting Time</TableHead>
                    <TableHead className="font-semibold">Duty Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvigilators.map((duty) => (
                    <TableRow key={duty.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-bold text-sm text-foreground">{duty.teacherName}</div>
                          <div className="text-xs text-muted-foreground">{duty.teacherEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">{duty.examCourse}</div>
                        <div className="text-[11px] text-muted-foreground">{duty.notes}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {duty.roomNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{duty.examDate}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{duty.examTime}</div>
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {duty.reportingTime}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          duty.dutyStatus === 'confirmed' ? 'bg-emerald-600' :
                          duty.dutyStatus === 'swapped' ? 'bg-purple-600' :
                          'bg-amber-500'
                        }>
                          {duty.dutyStatus.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {duty.dutyStatus === 'assigned' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSwapDuty(duty.id)}
                            className="text-xs h-7 px-2"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                            Confirm
                          </Button>
                        )}
                        {duty.dutyStatus === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              coeService.updateDutyStatus(duty.id, 'swapped');
                              setInvigilators(coeService.getInvigilators());
                              toast({ title: 'Swap Enabled', description: 'Faculty may now request peer exchange.' });
                            }}
                            className="text-xs h-7 px-2"
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                            Swap Request
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

      {/* Assign Invigilator Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Faculty Examination Duty</DialogTitle>
            <DialogDescription className="text-xs">
              Allocate an invigilator. System blocks subject and slot overlap conflicts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignDuty} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Select Faculty Member *</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} (Teaches: {t.subjectTeaches})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Examination Course *</Label>
              <Select value={examCourse} onValueChange={setExamCourse}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Structures and Algorithms (CSE201)">
                    Data Structures and Algorithms (CSE201)
                  </SelectItem>
                  <SelectItem value="Database Management Systems (CSE301)">
                    Database Management Systems (CSE301)
                  </SelectItem>
                  <SelectItem value="Operating Systems (CS304)">
                    Operating Systems (CS304)
                  </SelectItem>
                  <SelectItem value="Computer Networks (CSE401)">
                    Computer Networks (CSE401)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Examination Date *</Label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Duty Reporting Time *</Label>
                <Input
                  value={reportingTime}
                  onChange={(e) => setReportingTime(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="08:30 AM"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Hall / Room *</Label>
                <Select value={roomId} onValueChange={setRoomId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOM-LH101">LH-101 (Lecture Hall Complex)</SelectItem>
                    <SelectItem value="ROOM-LH102">LH-102 (Lecture Hall Complex)</SelectItem>
                    <SelectItem value="ROOM-CSLAB1">CS-LAB-1 (Turing Center)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Designation / Role</Label>
                <Select value={notes} onValueChange={setNotes}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chief Invigilator">Chief Invigilator</SelectItem>
                    <SelectItem value="Assistant Invigilator">Assistant Invigilator</SelectItem>
                    <SelectItem value="Reliever Invigilator">Reliever Invigilator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Allocate Duty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
