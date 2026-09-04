import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useERPData } from '@/hooks/useERPData';
import { exportToCSV, generatePrintableReport } from '@/utils/exportUtils';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import { SemesterSelector } from '@/components/attendance/student/SemesterSelector';
import { SubjectAttendanceCard } from '@/components/attendance/student/SubjectAttendanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, TrendingUp, Download, Printer, AlertTriangle, CheckCircle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { StudentAttendanceData, AttendanceStats as AttendanceStatsType } from '@/types/attendance';
import { toast } from 'sonner';

const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const { getStudent, students } = useERPData();
  const student = getStudent(user?.id || '20CS001') || students[0];

  const [selectedSemester, setSelectedSemester] = useState<number | null>(student.semester);
  const [selectedBranch, setSelectedBranch] = useState<string>(student.department);

  const mockSemesters = [
    {
      semester: student.semester,
      branch: student.department,
      totalSubjects: Object.keys(student.attendance).length,
      attendancePercentage: Number(
        (Object.values(student.attendance).reduce((sum, s) => sum + s.attended, 0) /
        Math.max(1, Object.values(student.attendance).reduce((sum, s) => sum + s.total, 0)) * 100).toFixed(1)
      )
    },
    {
      semester: Math.max(1, student.semester - 1),
      branch: student.department,
      totalSubjects: 5,
      attendancePercentage: 88.5
    }
  ];

  // Map unified ERP student attendance to component schema
  const attendanceData: StudentAttendanceData = useMemo(() => {
    const subjectList = Object.values(student.attendance);
    
    // Generate synthetic timeline from student's recorded attendance for the UI cards
    const attendanceEvents: any[] = [];
    subjectList.forEach((sub, subIdx) => {
      // Use existing history if present, else synthesize matching the exact attended/total ratio
      if (sub.history && sub.history.length > 0) {
        sub.history.forEach((h, hIdx) => {
          attendanceEvents.push({
            id: `att-${sub.subjectCode}-${hIdx}`,
            studentId: student.id,
            studentName: student.name,
            subjectId: `sub-${sub.subjectCode}`,
            subjectName: sub.subjectName,
            date: h.date,
            slot: h.slot,
            status: h.status,
            markedBy: 'Faculty in Charge',
            markedAt: `${h.date}T10:00:00Z`
          });
        });
      } else {
        for (let i = 0; i < sub.total; i++) {
          const isAttended = i < sub.attended;
          attendanceEvents.push({
            id: `att-${sub.subjectCode}-${i}`,
            studentId: student.id,
            studentName: student.name,
            subjectId: `sub-${sub.subjectCode}`,
            subjectName: sub.subjectName,
            date: new Date(Date.now() - (i * 2 * 86400000)).toISOString().split('T')[0],
            slot: '09:00 - 10:00 AM',
            status: isAttended ? 'present' : 'absent',
            markedBy: 'Faculty in Charge',
            markedAt: new Date(Date.now() - (i * 2 * 86400000)).toISOString()
          });
        }
      }
    });

    return {
      studentId: student.id,
      semester: selectedSemester || student.semester,
      branch: student.department,
      subjects: subjectList.map((sub, idx) => ({
        id: `sub-${sub.subjectCode}`,
        name: sub.subjectName,
        code: sub.subjectCode,
        semester: student.semester,
        branch: student.department,
        totalClasses: sub.total,
        slots: [
          {
            id: `slot-${sub.subjectCode}-1`,
            day: 'Monday',
            startTime: '09:00',
            endTime: '10:00',
            type: 'lecture' as const
          },
          {
            id: `slot-${sub.subjectCode}-2`,
            day: 'Wednesday',
            startTime: '11:00',
            endTime: '12:00',
            type: 'lecture' as const
          }
        ]
      })),
      attendance: attendanceEvents
    };
  }, [student, selectedSemester]);

  const overallStats: AttendanceStatsType = useMemo(() => {
    const subjectList = Object.values(student.attendance);
    const totalClasses = subjectList.reduce((sum, s) => sum + s.total, 0);
    const classesAttended = subjectList.reduce((sum, s) => sum + s.attended, 0);
    const attendancePercentage = totalClasses > 0 ? Number(((classesAttended / totalClasses) * 100).toFixed(1)) : 100;

    let status: 'good' | 'warning' | 'critical' = 'good';
    if (attendancePercentage < 75) status = 'critical';
    else if (attendancePercentage < 80) status = 'warning';

    return {
      totalClasses,
      classesAttended,
      attendancePercentage,
      status
    };
  }, [student]);

  const handleExportCSV = () => {
    const headers = ["Subject Code", "Subject Name", "Classes Attended", "Total Classes", "Attendance %", "Status"];
    const rows = Object.values(student.attendance).map(s => [
      s.subjectCode,
      s.subjectName,
      s.attended,
      s.total,
      `${s.percentage}%`,
      s.percentage >= 75 ? 'ELIGIBLE' : 'SHORTAGE (<75%)'
    ]);
    exportToCSV(`${student.rollNumber}_Attendance_Ledger`, headers, rows);
    toast.success('Attendance report exported to CSV');
  };

  const handlePrintReport = () => {
    generatePrintableReport({
      title: "Student Cumulative Attendance & Debarment Clearance",
      subtitle: "Office of the Dean of Academic Affairs • Minimum 75% Attendance Required",
      studentInfo: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester
      },
      statusBadge: {
        text: student.clearances.attendanceClearance ? "ACADEMICALLY CLEARED" : "DEBARRED (<75% SHORTAGE)",
        variant: student.clearances.attendanceClearance ? "success" : "danger"
      },
      columns: ["Subject Code", "Subject Name", "Attended", "Total", "Percentage", "Clearance Status"],
      rows: Object.values(student.attendance).map(s => [
        s.subjectCode,
        s.subjectName,
        s.attended,
        s.total,
        `${s.percentage}%`,
        s.percentage >= 75 ? "CLEAR" : "SHORTAGE"
      ]),
      summaryStats: [
        { label: "Total Sessions", value: overallStats.totalClasses },
        { label: "Sessions Attended", value: overallStats.classesAttended },
        { label: "Overall Attendance", value: `${overallStats.attendancePercentage}%` },
        { label: "Exam Eligibility", value: student.clearances.attendanceClearance ? "Eligible" : "Debarred" }
      ]
    });
  };

  if (!selectedSemester) {
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title="Student Attendance - CampusSync"
          description="View your attendance records, track progress across subjects, and monitor your academic performance."
        />
        
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <SemesterSelector
              semesters={mockSemesters}
              selectedSemester={selectedSemester}
              onSemesterSelect={(sem, br) => {
                setSelectedSemester(sem);
                setSelectedBranch(br);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`Semester ${selectedSemester} Attendance - CampusSync`}
        description={`View attendance records for Semester ${selectedSemester} in ${selectedBranch}`}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedSemester(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Semester {selectedSemester} Attendance
                </h1>
                <p className="text-muted-foreground text-sm">{student.name} • {student.rollNumber} • {selectedBranch}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
                <Download className="mr-2 h-4 w-4" />
                <span>Export CSV</span>
              </Button>
              <Button size="sm" onClick={handlePrintReport} className="flex-1 sm:flex-initial">
                <Printer className="mr-2 h-4 w-4" />
                <span>Print Attendance Record</span>
              </Button>
            </div>
          </div>

          {/* Cross-Module Debarment Shortage Alert */}
          {!student.clearances.attendanceClearance ? (
            <Card className="border-destructive/40 bg-destructive/10 text-destructive">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-destructive" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">ATTENDANCE SHORTAGE: DEBARRED FROM EXAMINATIONS</p>
                  <p className="text-xs">
                    Your current cumulative attendance is <strong>{overallStats.attendancePercentage}%</strong>, which fails to meet the minimum regulatory threshold of <strong>75.0%</strong>. Hall Ticket issuance is blocked across the institution until condonation approval is granted by the Academic Council.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
              <CardContent className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Academic Attendance Clearance: <strong>ELIGIBLE ({overallStats.attendancePercentage}%)</strong></span>
                </div>
                <Badge variant="outline" className="border-emerald-500 text-emerald-600">Good Standing</Badge>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Stats */}
              <div className="lg:col-span-1 space-y-4">
                <AttendanceStats stats={overallStats} />
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Subjects</span>
                      </div>
                      <span className="font-semibold">{attendanceData?.subjects.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Classes</span>
                      </div>
                      <span className="font-semibold">{overallStats.totalClasses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Avg. Attendance</span>
                      </div>
                      <span className="font-semibold">{overallStats.attendancePercentage.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject Cards */}
              <div className="lg:col-span-3 space-y-4">
                {attendanceData?.subjects.map((subject) => (
                  <SubjectAttendanceCard
                    key={subject.id}
                    subject={subject}
                    attendance={attendanceData.attendance}
                  />
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;