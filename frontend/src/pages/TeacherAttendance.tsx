import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherSubjectCard } from '@/components/attendance/teacher/TeacherSubjectCard';
import { AttendanceHistory } from '@/components/attendance/teacher/AttendanceHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  TrendingUp,
  History,
  Download,
  Printer
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { TeacherSubject } from '@/types/attendance';
import { toast } from 'sonner';
import { useERPData } from '@/hooks/useERPData';
import { exportToCSV, generatePrintableReport } from '@/utils/exportUtils';

const TeacherAttendance: React.FC = () => {
  const { user } = useAuth();
  const { students, subjects: erpSubjects, recordClassAttendance, stats } = useERPData();
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Map unified ERP students to teacher's enrolled student roster
    const enrolledStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      semester: s.semester,
      branch: s.department,
      rollNumber: s.rollNumber
    }));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const unifiedSubjects: TeacherSubject[] = erpSubjects.map((sub, idx) => ({
      id: `sub-${sub.code}`,
      name: sub.name,
      code: sub.code,
      semester: sub.semester,
      branch: sub.department,
      slots: [
        {
          id: `slot-${sub.code}-1`,
          day: days[idx % days.length],
          startTime: '09:00',
          endTime: '10:00',
          type: 'lecture'
        },
        {
          id: `slot-${sub.code}-2`,
          day: days[(idx + 2) % days.length],
          startTime: '11:00',
          endTime: '12:00',
          type: 'lecture'
        },
        {
          id: `slot-${sub.code}-3`,
          day: currentDayName, // Ensure at least one class shows in today's schedule for live demo!
          startTime: '14:00',
          endTime: '16:00',
          type: 'lab'
        }
      ],
      enrolledStudents
    }));

    setSubjects(unifiedSubjects);

    // Calculate today's classes
    const todaySlots = unifiedSubjects.flatMap(subject => 
      subject.slots
        .filter(slot => slot.day.toLowerCase() === currentDayName.toLowerCase())
        .map(slot => ({
          subject: subject.name,
          code: subject.code,
          time: `${slot.startTime} - ${slot.endTime}`,
          type: slot.type,
          students: subject.enrolledStudents.length
        }))
    );
    setTodayClasses(todaySlots);
    setLoading(false);
  }, [students, erpSubjects]);

  const handleAttendanceTaken = (subjectId: string, attendanceData: any[]) => {
    const subjectObj = subjects.find(s => s.id === subjectId);
    const subjectCode = subjectObj?.code || 'CS301';

    // Synchronize directly into unified institutional database!
    recordClassAttendance(subjectCode, attendanceData);

    // Record local session history
    const newRecord = {
      id: `record-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      slot: 'Current Session',
      attendanceData,
      timestamp: new Date().toISOString()
    };
    
    setAttendanceHistory(prev => ({
      ...prev,
      [subjectId]: [...(prev[subjectId] || []), newRecord]
    }));
    
    toast.success(`Attendance synchronized for ${attendanceData.length} students into ERP database!`);
  };

  const handleExportCSV = () => {
    const headers = ["Roll Number", "Student Name", "Department", "Semester", "Overall Attendance %", "Academic Clearance", "Debarred Hold"];
    const rows = students.map(s => {
      const records = Object.values(s.attendance);
      const totalAtt = records.reduce((acc, r) => acc + r.attended, 0);
      const totalSess = records.reduce((acc, r) => acc + r.total, 0);
      const pct = totalSess > 0 ? ((totalAtt / totalSess) * 100).toFixed(1) : '100';
      return [
        s.rollNumber,
        s.name,
        s.department,
        `Sem ${s.semester}`,
        `${pct}%`,
        s.clearances.attendanceClearance ? 'CLEARED' : 'DEBARRED (<75%)',
        s.clearances.admitCardIssued ? 'ALLOWED' : 'BLOCKED'
      ];
    });
    exportToCSV('ERP_Institutional_Attendance_Ledger', headers, rows);
    toast.success('Attendance ledger exported to CSV');
  };

  const handlePrintReport = () => {
    generatePrintableReport({
      title: "Official Institutional Attendance Ledger & Debarment Audit",
      subtitle: "Office of the Dean of Academic Affairs • Minimum 75% Attendance Compliance",
      columns: ["Roll No", "Student Name", "Semester", "Attended / Total", "Percentage", "Clearance Status"],
      rows: students.map(s => {
        const records = Object.values(s.attendance);
        const totalAtt = records.reduce((acc, r) => acc + r.attended, 0);
        const totalSess = records.reduce((acc, r) => acc + r.total, 0);
        const pct = totalSess > 0 ? ((totalAtt / totalSess) * 100).toFixed(1) : '100';
        return [
          s.rollNumber,
          s.name,
          `Sem ${s.semester}`,
          `${totalAtt} / ${totalSess}`,
          `${pct}%`,
          s.clearances.attendanceClearance ? "ACADEMICALLY CLEARED" : "DEBARRED (<75%)"
        ];
      }),
      summaryStats: [
        { label: "Total Students Audited", value: students.length },
        { label: "Debarred Under Shortage", value: stats.debarredCount },
        { label: "Compliance Rate", value: `${(((students.length - stats.debarredCount) / students.length) * 100).toFixed(1)}%` }
      ]
    });
  };

  const getTotalStudents = () => {
    const uniqueStudents = new Set();
    subjects.forEach(subject => {
      subject.enrolledStudents.forEach(student => {
        uniqueStudents.add(student.id);
      });
    });
    return uniqueStudents.size;
  };

  const getTotalSlots = () => {
    return subjects.reduce((total, subject) => total + subject.slots.length, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Teacher Attendance - CampusSync"
        description="Take attendance for your classes, manage student records, and track attendance analytics."
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Take Attendance</h1>
              <p className="text-muted-foreground hidden md:block">
                Manage attendance for your classes and track student participation
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
                <Download className="mr-2 h-4 w-4" />
                <span>Export CSV</span>
              </Button>
              <Button onClick={handlePrintReport} className="flex-1 sm:flex-initial">
                <Printer className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Print Attendance Register</span>
                <span className="sm:hidden">Print Ledger</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">{subjects.length}</p>
                    <p className="text-xs text-muted-foreground">Total Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">{getTotalStudents()}</p>
                    <p className="text-xs text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">{getTotalSlots()}</p>
                    <p className="text-xs text-muted-foreground">Weekly Slots</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">{todayClasses.length}</p>
                    <p className="text-xs text-muted-foreground">Today's Classes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          {todayClasses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today's Schedule</span>
                  <Badge variant="secondary">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {todayClasses.map((classItem, index) => (
                    <div key={index} className="p-3 sm:p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{classItem.subject}</h4>
                          <Badge variant="outline" className="text-xs self-start sm:self-center">{classItem.code}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{classItem.time}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <span>{classItem.students} students</span>
                          </div>
                          <Badge className="capitalize bg-green-100 text-green-800 text-xs self-start sm:self-center">
                            {classItem.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="subjects" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subjects" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Take Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Attendance History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Subjects</h2>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">View Overall Analytics</span>
                </Button>
              </div>
              
              {subjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {subjects.map((subject) => (
                    <TeacherSubjectCard
                      key={subject.id}
                      subject={subject}
                      onAttendanceTaken={handleAttendanceTaken}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center p-8">
                  <div className="space-y-3">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">No Subjects Assigned</h3>
                      <p className="text-muted-foreground">
                        You don't have any subjects assigned yet. Contact the admin to get subjects allocated.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {subjects.length > 0 ? (
                <div className="space-y-6">
                  {subjects.map((subject) => (
                    <AttendanceHistory
                      key={subject.id}
                      subjectId={subject.id}
                      subjectName={subject.name}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center p-8">
                  <div className="space-y-3">
                    <History className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">No History Available</h3>
                      <p className="text-muted-foreground">
                        Start taking attendance to view history records.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;