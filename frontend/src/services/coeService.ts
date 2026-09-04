import type {
  ExamCycle,
  ExamRoom,
  ExamSeatingArrangement,
  ExamInvigilator,
  ExamHallTicket,
  ExamMalpractice,
  ExamRevaluation,
  SubjectMarksSubmissionStatus,
  ModerationRule,
  TimetableConflict,
} from '@/types/examination-controller';

const STORAGE_KEYS = {
  CYCLES: 'campussync_coe_cycles',
  ROOMS: 'campussync_coe_rooms',
  SEATING: 'campussync_coe_seating',
  INVIGILATORS: 'campussync_coe_invigilators',
  HALL_TICKETS: 'campussync_coe_hall_tickets',
  MALPRACTICES: 'campussync_coe_malpractices',
  REVALUATIONS: 'campussync_coe_revaluations',
  MODERATION_LOGS: 'campussync_coe_moderation_logs',
  RESULTS_PUBLISHED: 'campussync_coe_results_published',
};

// Initial Mock Seed Data
const initialCycles: ExamCycle[] = [
  {
    id: 'CYCLE-2024-ODD',
    name: 'Autumn End-Semester Examination 2024-25',
    academicYear: '2024-2025',
    term: 'Odd Semester',
    startDate: '2024-11-20',
    endDate: '2024-12-05',
    marksSubmissionDeadline: '2024-12-18T23:59:59Z',
    resultsPublishDate: '2024-12-24T10:00:00Z',
    status: 'evaluation',
    createdAt: '2024-10-01T08:00:00Z',
  },
  {
    id: 'CYCLE-2025-EVEN',
    name: 'Spring Mid-Semester Examination 2024-25',
    academicYear: '2024-2025',
    term: 'Even Semester',
    startDate: '2025-03-10',
    endDate: '2025-03-22',
    marksSubmissionDeadline: '2025-03-30T23:59:59Z',
    resultsPublishDate: '2025-04-05T12:00:00Z',
    status: 'active',
    createdAt: '2025-01-15T09:00:00Z',
  },
];

const initialRooms: ExamRoom[] = [
  { id: 'ROOM-LH101', roomNumber: 'LH-101', building: 'Aryabhatta Lecture Hall Complex', capacity: 40, rowsCount: 8, colsCount: 5, isActive: true },
  { id: 'ROOM-LH102', roomNumber: 'LH-102', building: 'Aryabhatta Lecture Hall Complex', capacity: 40, rowsCount: 8, colsCount: 5, isActive: true },
  { id: 'ROOM-CSLAB1', roomNumber: 'CS-LAB-1', building: 'Turing Computing Center', capacity: 30, rowsCount: 6, colsCount: 5, isActive: true },
  { id: 'ROOM-ECLAB2', roomNumber: 'EC-LAB-2', building: 'Tesla Electronics Block', capacity: 30, rowsCount: 6, colsCount: 5, isActive: true },
];

const initialHallTickets: ExamHallTicket[] = [
  {
    id: 1,
    cycleId: 'CYCLE-2024-ODD',
    cycleName: 'Autumn End-Semester Examination 2024-25',
    studentId: '1',
    studentName: 'Demo User',
    rollNumber: 'CS21001',
    branch: 'Computer Science',
    semester: 6,
    isEligible: true,
    attendancePercentage: 88.5,
    feeCleared: true,
    qrToken: 'HT-2024-ODD-STD001-VERIFIED',
    issuedAt: '2024-11-10T10:00:00Z',
  },
  {
    id: 2,
    cycleId: 'CYCLE-2024-ODD',
    cycleName: 'Autumn End-Semester Examination 2024-25',
    studentId: '20CS001',
    studentName: 'Aarav Sharma',
    rollNumber: '20CS001',
    branch: 'Computer Science',
    semester: 6,
    isEligible: true,
    attendancePercentage: 92.0,
    feeCleared: true,
    qrToken: 'HT-2024-ODD-20CS001-VERIFIED',
    issuedAt: '2024-11-10T10:00:00Z',
  },
  {
    id: 3,
    cycleId: 'CYCLE-2024-ODD',
    cycleName: 'Autumn End-Semester Examination 2024-25',
    studentId: 'std1',
    studentName: 'Alice Johnson',
    rollNumber: 'CS21001',
    branch: 'Computer Science',
    semester: 3,
    isEligible: true,
    attendancePercentage: 81.2,
    feeCleared: true,
    qrToken: 'HT-2024-ODD-STD1-VERIFIED',
    issuedAt: '2024-11-10T10:00:00Z',
  },
  {
    id: 4,
    cycleId: 'CYCLE-2024-ODD',
    cycleName: 'Autumn End-Semester Examination 2024-25',
    studentId: '20CS002',
    studentName: 'Vikram Malhotra',
    rollNumber: '20CS002',
    branch: 'Computer Science',
    semester: 6,
    isEligible: false,
    debarReason: 'Attendance below required threshold (62.4% < 75.0%)',
    attendancePercentage: 62.4,
    feeCleared: true,
    qrToken: undefined,
    issuedAt: '2024-11-10T10:00:00Z',
  },
  {
    id: 5,
    cycleId: 'CYCLE-2024-ODD',
    cycleName: 'Autumn End-Semester Examination 2024-25',
    studentId: '20CS003',
    studentName: 'Rohan Mehra',
    rollNumber: '20CS003',
    branch: 'Computer Science',
    semester: 6,
    isEligible: false,
    debarReason: 'Outstanding tuition fee balance exceeding permissible grace limit (₹45,000)',
    attendancePercentage: 84.0,
    feeCleared: false,
    qrToken: undefined,
    issuedAt: '2024-11-10T10:00:00Z',
  },
];

const initialSeating: ExamSeatingArrangement[] = [
  { id: 1, examId: '1', studentId: '1', studentName: 'Demo User', studentRoll: 'CS21001', branch: 'CSE', semester: 6, roomId: 'ROOM-LH101', roomNumber: 'LH-101', seatCode: 'R1-C1', benchNumber: 1, attendedStatus: 'present' },
  { id: 2, examId: '1', studentId: '20CS001', studentName: 'Aarav Sharma', studentRoll: '20CS001', branch: 'CSE', semester: 6, roomId: 'ROOM-LH101', roomNumber: 'LH-101', seatCode: 'R1-C3', benchNumber: 2, attendedStatus: 'present' },
  { id: 3, examId: '1', studentId: 'std1', studentName: 'Alice Johnson', studentRoll: 'CS21001', branch: 'CSE', semester: 3, roomId: 'ROOM-LH101', roomNumber: 'LH-101', seatCode: 'R2-C2', benchNumber: 4, attendedStatus: 'present' },
  { id: 4, examId: '2', studentId: '1', studentName: 'Demo User', studentRoll: 'CS21001', branch: 'CSE', semester: 6, roomId: 'ROOM-LH102', roomNumber: 'LH-102', seatCode: 'R1-C2', benchNumber: 1, attendedStatus: 'present' },
  { id: 5, examId: '2', studentId: '20CS001', studentName: 'Aarav Sharma', studentRoll: '20CS001', branch: 'CSE', semester: 6, roomId: 'ROOM-LH102', roomNumber: 'LH-102', seatCode: 'R2-C1', benchNumber: 3, attendedStatus: 'present' },
];

const initialInvigilators: ExamInvigilator[] = [
  { id: 1, examId: '1', examCourse: 'Data Structures and Algorithms', examDate: '2024-11-22', examTime: '09:00 AM - 12:00 PM', teacherId: 'T001', teacherName: 'Dr. Sarah Johnson', teacherEmail: 'sarah.johnson@college.edu', roomId: 'ROOM-LH101', roomNumber: 'LH-101', reportingTime: '08:30 AM', dutyStatus: 'confirmed', notes: 'Chief Invigilator - LH101' },
  { id: 2, examId: '1', examCourse: 'Data Structures and Algorithms', examDate: '2024-11-22', examTime: '09:00 AM - 12:00 PM', teacherId: 'EMP-001', teacherName: 'Prof. John Doe', teacherEmail: 'john.doe@college.edu', roomId: 'ROOM-LH102', roomNumber: 'LH-102', reportingTime: '08:30 AM', dutyStatus: 'assigned', notes: 'Assistant Invigilator' },
  { id: 3, examId: '2', examCourse: 'Database Management Systems', examDate: '2024-11-25', examTime: '02:00 PM - 05:00 PM', teacherId: 'T001', teacherName: 'Dr. Sarah Johnson', teacherEmail: 'sarah.johnson@college.edu', roomId: 'ROOM-LH102', roomNumber: 'LH-102', reportingTime: '01:30 PM', dutyStatus: 'assigned', notes: 'Chief Invigilator - LH102' },
  { id: 4, examId: '3', examCourse: 'Operating Systems', examDate: '2024-11-28', examTime: '09:00 AM - 12:00 PM', teacherId: 'T002', teacherName: 'Prof. Michael Brown', teacherEmail: 'michael.brown@college.edu', roomId: 'ROOM-CSLAB1', roomNumber: 'CS-LAB-1', reportingTime: '08:30 AM', dutyStatus: 'confirmed', notes: 'Lab Invigilator' },
];

const initialMalpractices: ExamMalpractice[] = [
  {
    id: 1,
    examId: '1',
    examCourse: 'Data Structures and Algorithms',
    studentId: '20CS002',
    studentName: 'Vikram Malhotra',
    rollNumber: '20CS002',
    branch: 'CSE',
    reportedBy: 'T001',
    reporterName: 'Dr. Sarah Johnson',
    incidentDescription: 'Possession of unauthorized electronic smartwatch displaying algorithmic notes during examination.',
    evidenceAttachment: 'smartwatch_evidence_01.jpg',
    status: 'penalized',
    verdict: 'Disciplinary Committee (CoE) Verdict: Course registration cancelled for autumn semester; official warning issued.',
    createdAt: '2024-11-22T10:45:00Z',
  },
  {
    id: 2,
    examId: '2',
    examCourse: 'Database Management Systems',
    studentId: '20CS014',
    studentName: 'Neha Patel',
    rollNumber: '20CS014',
    branch: 'CSE',
    reportedBy: 'EMP-001',
    reporterName: 'Prof. John Doe',
    incidentDescription: 'Suspected communication with adjacent student during question 3 section B.',
    status: 'under_investigation',
    createdAt: '2024-11-25T15:20:00Z',
  },
];

const initialRevaluations: ExamRevaluation[] = [
  {
    id: 1,
    studentId: '1',
    studentName: 'Demo User',
    rollNumber: 'CS21001',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    originalMarks: 75,
    revisedMarks: 82,
    assignedEvaluatorId: 'T001',
    evaluatorName: 'Dr. Sarah Johnson',
    status: 'resolved',
    remarks: 'Recalculation error in Question 4(b) corrected; +7 marks awarded.',
    appliedAt: '2024-12-26T14:30:00Z',
    resolvedAt: '2024-12-28T16:00:00Z',
  },
];

const initialSubmissionStatuses: SubjectMarksSubmissionStatus[] = [
  {
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    branch: 'Computer Science',
    semester: 6,
    instructorId: 'T001',
    instructorName: 'Dr. Sarah Johnson',
    instructorEmail: 'sarah.johnson@college.edu',
    totalStudents: 45,
    submittedCount: 45,
    isSubmitted: true,
    isPublished: true,
    moderationApplied: false,
    deadline: '2024-12-18T23:59:59Z',
  },
  {
    courseCode: 'CS302',
    courseName: 'Software Engineering',
    branch: 'Computer Science',
    semester: 6,
    instructorId: 'EMP-001',
    instructorName: 'Prof. John Doe',
    instructorEmail: 'john.doe@college.edu',
    totalStudents: 45,
    submittedCount: 38,
    isSubmitted: false,
    isPublished: false,
    moderationApplied: false,
    deadline: '2024-12-18T23:59:59Z',
  },
  {
    courseCode: 'CS303',
    courseName: 'Computer Networks',
    branch: 'Computer Science',
    semester: 6,
    instructorId: 'T002',
    instructorName: 'Prof. Michael Brown',
    instructorEmail: 'michael.brown@college.edu',
    totalStudents: 40,
    submittedCount: 40,
    isSubmitted: true,
    isPublished: false,
    moderationApplied: true,
    deadline: '2024-12-18T23:59:59Z',
  },
  {
    courseCode: 'CS304',
    courseName: 'Operating Systems',
    branch: 'Computer Science',
    semester: 6,
    instructorId: 'T003',
    instructorName: 'Dr. Emily Davis',
    instructorEmail: 'emily.davis@college.edu',
    totalStudents: 42,
    submittedCount: 20,
    isSubmitted: false,
    isPublished: false,
    moderationApplied: false,
    deadline: '2024-12-18T23:59:59Z',
  },
];

// Helper to load or initialize from localStorage
function getStored<T>(key: string, initial: T): T {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return initial;
  }
}

function setStored<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const coeService = {
  // 1. Exam Cycles
  getCycles: (): ExamCycle[] => {
    return getStored<ExamCycle[]>(STORAGE_KEYS.CYCLES, initialCycles);
  },

  createCycle: (cycle: Omit<ExamCycle, 'id' | 'createdAt'>): ExamCycle => {
    const cycles = coeService.getCycles();
    const newCycle: ExamCycle = {
      ...cycle,
      id: `CYCLE-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    cycles.unshift(newCycle);
    setStored(STORAGE_KEYS.CYCLES, cycles);
    return newCycle;
  },

  updateCycle: (id: string, updates: Partial<ExamCycle>): ExamCycle | null => {
    const cycles = coeService.getCycles();
    const index = cycles.findIndex((c) => c.id === id);
    if (index === -1) return null;
    cycles[index] = { ...cycles[index], ...updates };
    setStored(STORAGE_KEYS.CYCLES, cycles);
    return cycles[index];
  },

  // 2. Exam Rooms
  getRooms: (): ExamRoom[] => {
    return getStored<ExamRoom[]>(STORAGE_KEYS.ROOMS, initialRooms);
  },

  addRoom: (room: Omit<ExamRoom, 'id'>): ExamRoom => {
    const rooms = coeService.getRooms();
    const newRoom: ExamRoom = {
      ...room,
      id: `ROOM-${room.roomNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
    };
    rooms.push(newRoom);
    setStored(STORAGE_KEYS.ROOMS, rooms);
    return newRoom;
  },

  // 3. Seating Allocation (Anti-Cheating Engine)
  getSeatingArrangements: (examId?: string): ExamSeatingArrangement[] => {
    const all = getStored<ExamSeatingArrangement[]>(STORAGE_KEYS.SEATING, initialSeating);
    if (examId) {
      return all.filter((s) => s.examId === examId);
    }
    return all;
  },

  generateInterleavedSeating: (
    examId: string,
    roomId: string,
    students: { id: string; name: string; roll: string; branch: string; semester: number }[]
  ): ExamSeatingArrangement[] => {
    const rooms = coeService.getRooms();
    const room = rooms.find((r) => r.id === roomId) || rooms[0];
    const existing = coeService.getSeatingArrangements().filter((s) => s.examId !== examId);

    // Group students by branch
    const branchGroups: Record<string, typeof students> = {};
    students.forEach((s) => {
      branchGroups[s.branch] = branchGroups[s.branch] || [];
      branchGroups[s.branch].push(s);
    });

    const branchKeys = Object.keys(branchGroups);
    const interleavedList: typeof students = [];
    let maxGroupLength = Math.max(...branchKeys.map((k) => branchGroups[k].length));

    for (let i = 0; i < maxGroupLength; i++) {
      for (const k of branchKeys) {
        if (branchGroups[k][i]) {
          interleavedList.push(branchGroups[k][i]);
        }
      }
    }

    const newArrangements: ExamSeatingArrangement[] = [];
    let bench = 1;
    let studentIdx = 0;

    for (let r = 1; r <= room.rowsCount; r++) {
      for (let c = 1; c <= room.colsCount; c++) {
        if (studentIdx >= interleavedList.length) break;
        const student = interleavedList[studentIdx];
        newArrangements.push({
          id: `seat_${Date.now()}_${studentIdx}`,
          examId,
          studentId: student.id,
          studentName: student.name,
          studentRoll: student.roll,
          branch: student.branch,
          semester: student.semester,
          roomId: room.id,
          roomNumber: room.roomNumber,
          seatCode: `R${r}-C${c}`,
          benchNumber: bench,
          attendedStatus: 'present',
        });
        studentIdx++;
        bench++;
      }
    }

    const updated = [...existing, ...newArrangements];
    setStored(STORAGE_KEYS.SEATING, updated);
    return newArrangements;
  },

  // 4. Invigilators
  getInvigilators: (teacherId?: string): ExamInvigilator[] => {
    const all = getStored<ExamInvigilator[]>(STORAGE_KEYS.INVIGILATORS, initialInvigilators);
    if (teacherId) {
      return all.filter((i) => i.teacherId === teacherId);
    }
    return all;
  },

  assignInvigilator: (duty: Omit<ExamInvigilator, 'id'>): { success: boolean; message?: string; duty?: ExamInvigilator } => {
    const all = coeService.getInvigilators();
    // Clash check: check if teacher already assigned in same date/slot
    const clash = all.find(
      (d) => d.teacherId === duty.teacherId && d.examDate === duty.examDate && d.examTime === duty.examTime
    );
    if (clash) {
      return {
        success: false,
        message: `Conflict detected: ${duty.teacherName} is already assigned to ${clash.roomNumber} for the same time slot!`,
      };
    }

    const newDuty: ExamInvigilator = {
      ...duty,
      id: Date.now(),
    };
    all.push(newDuty);
    setStored(STORAGE_KEYS.INVIGILATORS, all);
    return { success: true, duty: newDuty };
  },

  updateDutyStatus: (dutyId: number | string, status: ExamInvigilator['dutyStatus']): boolean => {
    const all = coeService.getInvigilators();
    const item = all.find((d) => String(d.id) === String(dutyId));
    if (item) {
      item.dutyStatus = status;
      setStored(STORAGE_KEYS.INVIGILATORS, all);
      return true;
    }
    return false;
  },

  // 5. Hall Tickets & Gatekeeper
  getHallTickets: (cycleId?: string): ExamHallTicket[] => {
    const all = getStored<ExamHallTicket[]>(STORAGE_KEYS.HALL_TICKETS, initialHallTickets);
    if (cycleId) {
      return all.filter((h) => h.cycleId === cycleId);
    }
    return all;
  },

  getStudentHallTicket: (studentId: string): ExamHallTicket | null => {
    const all = coeService.getHallTickets();
    return all.find((h) => h.studentId === studentId) || null;
  },

  toggleDebarStudent: (ticketId: number | string, isDebarred: boolean, reason?: string): boolean => {
    const all = coeService.getHallTickets();
    const ticket = all.find((h) => String(h.id) === String(ticketId));
    if (ticket) {
      ticket.isEligible = !isDebarred;
      ticket.debarReason = isDebarred ? reason || 'Administrative order by Controller of Examinations' : undefined;
      ticket.qrToken = !isDebarred ? `HT-VERIFIED-${ticket.rollNumber}-${Date.now().toString(36).toUpperCase()}` : undefined;
      setStored(STORAGE_KEYS.HALL_TICKETS, all);
      return true;
    }
    return false;
  },

  bulkReleaseHallTickets: (cycleId: string): { released: number; debarred: number } => {
    const all = coeService.getHallTickets();
    let released = 0;
    let debarred = 0;

    all.forEach((ticket) => {
      if (ticket.cycleId === cycleId) {
        if (ticket.attendancePercentage >= 75 && ticket.feeCleared) {
          ticket.isEligible = true;
          ticket.debarReason = undefined;
          ticket.qrToken = `HT-RELEASED-${ticket.rollNumber}-${Date.now().toString(36).toUpperCase()}`;
          released++;
        } else {
          ticket.isEligible = false;
          if (ticket.attendancePercentage < 75) {
            ticket.debarReason = `Low Attendance (${ticket.attendancePercentage}% < 75%)`;
          } else if (!ticket.feeCleared) {
            ticket.debarReason = 'Outstanding Academic Dues';
          }
          ticket.qrToken = undefined;
          debarred++;
        }
      }
    });

    setStored(STORAGE_KEYS.HALL_TICKETS, all);
    return { released, debarred };
  },

  // 6. Marks Tracker & Moderation
  getMarksSubmissions: (): SubjectMarksSubmissionStatus[] => {
    return getStored<SubjectMarksSubmissionStatus[]>('campussync_coe_submissions', initialSubmissionStatuses);
  },

  sendFacultyNudge: (courseCode: string): string => {
    const subs = coeService.getMarksSubmissions();
    const sub = subs.find((s) => s.courseCode === courseCode);
    const faculty = sub?.instructorName || 'Faculty member';
    return `Official CoE grading nudge dispatched to ${faculty} for ${courseCode} (${sub?.courseName}).`;
  },

  applyGraceMarksModeration: (rule: Omit<ModerationRule, 'id' | 'appliedDate' | 'appliedCount'>): { count: number; log: ModerationRule } => {
    const logs = getStored<ModerationRule[]>(STORAGE_KEYS.MODERATION_LOGS, []);
    const newLog: ModerationRule = {
      ...rule,
      id: `MOD-${Date.now()}`,
      appliedCount: 14, // demo affected students
      appliedDate: new Date().toISOString(),
    };
    logs.unshift(newLog);
    setStored(STORAGE_KEYS.MODERATION_LOGS, logs);

    // Update submission statuses to indicate moderation applied
    const subs = coeService.getMarksSubmissions();
    subs.forEach((s) => {
      s.moderationApplied = true;
    });
    setStored('campussync_coe_submissions', subs);

    return { count: 14, log: newLog };
  },

  getModerationLogs: (): ModerationRule[] => {
    return getStored<ModerationRule[]>(STORAGE_KEYS.MODERATION_LOGS, [
      {
        id: 'MOD-001',
        title: 'Autumn 2024 End-Term General Moderation (+3 Marks)',
        maxGraceMarks: 3,
        minThreshold: 37,
        passThreshold: 40,
        appliedCount: 12,
        appliedDate: '2024-12-19T14:00:00Z',
        approvedBy: 'Dr. K. R. Ramanathan (CoE)',
      },
    ]);
  },

  // 7. Results Publishing (1-Click Sovereign Publish)
  isResultsPublished: (): boolean => {
    const val = localStorage.getItem(STORAGE_KEYS.RESULTS_PUBLISHED);
    return val === 'true';
  },

  publishOfficialResults: (cycleId: string): { success: boolean; timestamp: string } => {
    localStorage.setItem(STORAGE_KEYS.RESULTS_PUBLISHED, 'true');
    const cycles = coeService.getCycles();
    const cycle = cycles.find((c) => c.id === cycleId);
    if (cycle) {
      cycle.status = 'published';
      cycle.resultsPublishDate = new Date().toISOString();
      setStored(STORAGE_KEYS.CYCLES, cycles);
    }
    return { success: true, timestamp: new Date().toISOString() };
  },

  unpublishResults: (cycleId: string): void => {
    localStorage.setItem(STORAGE_KEYS.RESULTS_PUBLISHED, 'false');
    const cycles = coeService.getCycles();
    const cycle = cycles.find((c) => c.id === cycleId);
    if (cycle) {
      cycle.status = 'evaluation';
      setStored(STORAGE_KEYS.CYCLES, cycles);
    }
  },

  // 8. Malpractice Incident Desk
  getMalpractices: (): ExamMalpractice[] => {
    return getStored<ExamMalpractice[]>(STORAGE_KEYS.MALPRACTICES, initialMalpractices);
  },

  reportMalpractice: (incident: Omit<ExamMalpractice, 'id' | 'createdAt' | 'status'>): ExamMalpractice => {
    const all = coeService.getMalpractices();
    const newRecord: ExamMalpractice = {
      ...incident,
      id: Date.now(),
      status: 'under_investigation',
      createdAt: new Date().toISOString(),
    };
    all.unshift(newRecord);
    setStored(STORAGE_KEYS.MALPRACTICES, all);
    return newRecord;
  },

  updateMalpracticeVerdict: (id: number | string, status: ExamMalpractice['status'], verdict: string): boolean => {
    const all = coeService.getMalpractices();
    const item = all.find((m) => String(m.id) === String(id));
    if (item) {
      item.status = status;
      item.verdict = verdict;
      setStored(STORAGE_KEYS.MALPRACTICES, all);
      return true;
    }
    return false;
  },

  // 9. Revaluations
  getRevaluations: (): ExamRevaluation[] => {
    return getStored<ExamRevaluation[]>(STORAGE_KEYS.REVALUATIONS, initialRevaluations);
  },

  applyRevaluation: (request: Omit<ExamRevaluation, 'id' | 'appliedAt' | 'status'>): ExamRevaluation => {
    const all = coeService.getRevaluations();
    const newReq: ExamRevaluation = {
      ...request,
      id: Date.now(),
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    all.unshift(newReq);
    setStored(STORAGE_KEYS.REVALUATIONS, all);
    return newReq;
  },

  resolveRevaluation: (id: number | string, status: ExamRevaluation['status'], revisedMarks?: number, remarks?: string): boolean => {
    const all = coeService.getRevaluations();
    const item = all.find((r) => String(r.id) === String(id));
    if (item) {
      item.status = status;
      if (revisedMarks !== undefined) item.revisedMarks = revisedMarks;
      if (remarks) item.remarks = remarks;
      item.resolvedAt = new Date().toISOString();
      setStored(STORAGE_KEYS.REVALUATIONS, all);
      return true;
    }
    return false;
  },

  // 10. Timetable Conflict Detector
  checkTimetableConflicts: (exams: { id: string; course: string; courseCode: string; branch: string; semester: number; date: string; time: string }[]): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];
    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        const e1 = exams[i];
        const e2 = exams[j];
        if (e1.date === e2.date && e1.time === e2.time && e1.branch === e2.branch && e1.semester === e2.semester) {
          conflicts.push({
            id: `conf_${e1.id}_${e2.id}`,
            exam1Course: e1.course,
            exam1Code: e1.courseCode,
            exam2Course: e2.course,
            exam2Code: e2.courseCode,
            branch: e1.branch,
            semester: e1.semester,
            date: e1.date,
            slot: e1.time,
            conflictType: 'same_slot_branch',
          });
        }
      }
    }
    return conflicts;
  },
};
