export type ExamCycleStatus = 'draft' | 'active' | 'evaluation' | 'published' | 'archived';

export interface ExamCycle {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  startDate: string;
  endDate: string;
  marksSubmissionDeadline: string;
  resultsPublishDate?: string;
  status: ExamCycleStatus;
  createdAt?: string;
}

export interface ExamRoom {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
  rowsCount: number;
  colsCount: number;
  isActive: boolean;
}

export type AttendanceStatus = 'present' | 'absent' | 'malpractice';

export interface ExamSeatingArrangement {
  id: number | string;
  examId: string;
  studentId: string;
  studentName?: string;
  studentRoll?: string;
  branch?: string;
  semester?: number;
  roomId: string;
  roomNumber?: string;
  seatCode: string; // e.g. "R1-C1"
  benchNumber: number;
  attendedStatus: AttendanceStatus;
}

export type DutyStatus = 'assigned' | 'confirmed' | 'swapped' | 'completed';

export interface ExamInvigilator {
  id: number | string;
  examId: string;
  examCourse?: string;
  examDate?: string;
  examTime?: string;
  teacherId: string;
  teacherName?: string;
  teacherEmail?: string;
  roomId: string;
  roomNumber?: string;
  reportingTime: string;
  dutyStatus: DutyStatus;
  notes?: string;
}

export interface ExamHallTicket {
  id: number | string;
  cycleId: string;
  cycleName?: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  branch: string;
  semester: number;
  photoUrl?: string;
  isEligible: boolean;
  debarReason?: string;
  attendancePercentage: number;
  feeCleared: boolean;
  qrToken?: string;
  downloadedAt?: string;
  issuedAt?: string;
}

export type MalpracticeStatus = 'under_investigation' | 'penalized' | 'exonerated';

export interface ExamMalpractice {
  id: number | string;
  examId: string;
  examCourse: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  branch?: string;
  reportedBy: string;
  reporterName: string;
  incidentDescription: string;
  evidenceAttachment?: string;
  status: MalpracticeStatus;
  verdict?: string;
  createdAt: string;
}

export type RevaluationStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';

export interface ExamRevaluation {
  id: number | string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  courseCode: string;
  courseName?: string;
  originalMarks: number;
  revisedMarks?: number;
  assignedEvaluatorId?: string;
  evaluatorName?: string;
  status: RevaluationStatus;
  remarks?: string;
  appliedAt: string;
  resolvedAt?: string;
}

export interface SubjectMarksSubmissionStatus {
  courseCode: string;
  courseName: string;
  branch: string;
  semester: number;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  totalStudents: number;
  submittedCount: number;
  isSubmitted: boolean;
  isPublished: boolean;
  moderationApplied: boolean;
  deadline: string;
}

export interface ModerationRule {
  id: string;
  title: string;
  maxGraceMarks: number;
  minThreshold: number; // e.g. 35
  passThreshold: number; // e.g. 40
  appliedCount: number;
  appliedDate?: string;
  approvedBy: string;
}

export interface TimetableConflict {
  id: string;
  exam1Course: string;
  exam1Code: string;
  exam2Course: string;
  exam2Code: string;
  branch: string;
  semester: number;
  date: string;
  slot: string;
  conflictType: 'same_slot_branch' | 'teacher_clash' | 'room_overlap';
}
