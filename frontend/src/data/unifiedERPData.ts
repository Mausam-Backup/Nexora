export interface SubjectAttendanceRecord {
  subjectCode: string
  subjectName: string
  attended: number
  total: number
  percentage: number
  history: Array<{
    date: string
    slot: string
    status: 'present' | 'absent' | 'late'
  }>
}

export interface SubjectMarkRecord {
  subjectCode: string
  subjectName: string
  internal: number // max 30
  external: number // max 70
  total: number // max 100
  grade: string
  gp: number
  credits: number
}

export interface StudentFeeBill {
  id: string
  description: string
  amount: number
  dueDate: string
  createdAt: string
  status: 'paid' | 'pending' | 'overdue'
  paidAt?: string
  receiptNo?: string
}

export interface UnifiedStudent {
  id: string
  rollNumber: string
  name: string
  email: string
  phone: string
  department: string
  branch: string
  semester: number
  section: string
  admissionYear: string
  avatar: string
  status: 'active' | 'inactive' | 'debarred'
  parentName: string
  parentPhone: string
  address: string
  cgpa: number
  attendance: Record<string, SubjectAttendanceRecord>
  marks: Record<string, SubjectMarkRecord>
  fees: {
    totalDue: number
    totalPaid: number
    outstanding: number
    status: 'paid' | 'pending' | 'overdue'
    bills: StudentFeeBill[]
  }
  clearances: {
    attendanceClearance: boolean
    feeClearance: boolean
    admitCardIssued: boolean
    academicHoldReason?: string
  }
}

export const INITIAL_ERP_SUBJECTS = [
  { code: 'CS301', name: 'Database Management Systems', credits: 4, faculty: 'Dr. Sarah Johnson' },
  { code: 'CS302', name: 'Software Engineering', credits: 4, faculty: 'Prof. Michael Brown' },
  { code: 'CS303', name: 'Computer Networks', credits: 4, faculty: 'Dr. Emily Davis' },
  { code: 'CS304', name: 'Operating Systems', credits: 4, faculty: 'Prof. Robert Wilson' },
]

export function computeGrade(total: number): { grade: string; gp: number } {
  if (total >= 90) return { grade: 'A+', gp: 10 }
  if (total >= 80) return { grade: 'A', gp: 9 }
  if (total >= 70) return { grade: 'B+', gp: 8 }
  if (total >= 60) return { grade: 'B', gp: 7 }
  if (total >= 50) return { grade: 'C+', gp: 6 }
  if (total >= 40) return { grade: 'C', gp: 5 }
  return { grade: 'F', gp: 0 }
}

export function computeStudentClearances(student: Partial<UnifiedStudent>): UnifiedStudent['clearances'] {
  const attendanceValues = Object.values(student.attendance || {})
  const totalClasses = attendanceValues.reduce((sum, a) => sum + a.total, 0)
  const attendedClasses = attendanceValues.reduce((sum, a) => sum + a.attended, 0)
  const overallAttendancePercent = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 100

  const attendanceClearance = overallAttendancePercent >= 75
  const hasOverdueBills = student.fees?.bills.some(b => b.status === 'overdue') || false
  const feeClearance = !hasOverdueBills

  let academicHoldReason: string | undefined = undefined
  if (!attendanceClearance && !feeClearance) {
    academicHoldReason = `Debarred: Attendance (${overallAttendancePercent.toFixed(1)}% < 75%) and Outstanding Overdue Fees.`
  } else if (!attendanceClearance) {
    academicHoldReason = `Attendance Shortage: ${overallAttendancePercent.toFixed(1)}% (Institutional Minimum: 75%).`
  } else if (!feeClearance) {
    academicHoldReason = `Financial Hold: Overdue fee payments pending reconciliation.`
  }

  return {
    attendanceClearance,
    feeClearance,
    admitCardIssued: attendanceClearance && feeClearance,
    academicHoldReason,
  }
}

export const INITIAL_UNIFIED_STUDENTS: UnifiedStudent[] = [
  {
    id: '20CS001',
    rollNumber: '20CS001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    phone: '+91 9876543210',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'A',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma',
    status: 'active',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 9876543211',
    address: '124 Tech Park Avenue, Bangalore',
    cgpa: 9.35,
    attendance: {
      CS301: {
        subjectCode: 'CS301',
        subjectName: 'Database Management Systems',
        attended: 40,
        total: 45,
        percentage: 88.9,
        history: [
          { date: '2025-01-20', slot: '10:00 AM', status: 'present' },
          { date: '2025-01-22', slot: '10:00 AM', status: 'present' },
          { date: '2025-01-24', slot: '10:00 AM', status: 'present' },
        ]
      },
      CS302: {
        subjectCode: 'CS302',
        subjectName: 'Software Engineering',
        attended: 38,
        total: 42,
        percentage: 90.5,
        history: [{ date: '2025-01-21', slot: '02:00 PM', status: 'present' }]
      },
      CS303: {
        subjectCode: 'CS303',
        subjectName: 'Computer Networks',
        attended: 36,
        total: 40,
        percentage: 90.0,
        history: [{ date: '2025-01-23', slot: '11:00 AM', status: 'present' }]
      },
      CS304: {
        subjectCode: 'CS304',
        subjectName: 'Operating Systems',
        attended: 34,
        total: 40,
        percentage: 85.0,
        history: [{ date: '2025-01-25', slot: '03:00 PM', status: 'present' }]
      }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 28, external: 68, total: 96, grade: 'A+', gp: 10, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 27, external: 65, total: 92, grade: 'A+', gp: 10, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 29, external: 63, total: 92, grade: 'A+', gp: 10, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 26, external: 67, total: 93, grade: 'A+', gp: 10, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 82000,
      outstanding: 0,
      status: 'paid',
      bills: [
        { id: 'TUI-2025-001', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-10', receiptNo: 'RCP-2025-881' },
        { id: 'LAB-2025-001', description: 'Advanced Computing Lab Fee', amount: 5000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-10', receiptNo: 'RCP-2025-882' },
        { id: 'LIB-2025-001', description: 'Library Subscription', amount: 2000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-10', receiptNo: 'RCP-2025-883' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: true,
      admitCardIssued: true
    }
  },
  {
    id: '20CS002',
    rollNumber: '20CS002',
    name: 'Neha Patel',
    email: 'neha.patel@college.edu',
    phone: '+91 9876543212',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'A',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha%20Patel',
    status: 'active',
    parentName: 'Amit Patel',
    parentPhone: '+91 9876543213',
    address: '45 Green Park, Mumbai',
    cgpa: 8.85,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 36, total: 45, percentage: 80.0, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 34, total: 42, percentage: 81.0, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 32, total: 40, percentage: 80.0, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 31, total: 40, percentage: 77.5, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 26, external: 61, total: 87, grade: 'A', gp: 9, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 25, external: 64, total: 89, grade: 'A', gp: 9, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 27, external: 60, total: 87, grade: 'A', gp: 9, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 24, external: 62, total: 86, grade: 'A', gp: 9, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 82000,
      outstanding: 0,
      status: 'paid',
      bills: [
        { id: 'TUI-2025-002', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-12', receiptNo: 'RCP-2025-901' },
        { id: 'LAB-2025-002', description: 'Advanced Computing Lab Fee', amount: 5000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-12', receiptNo: 'RCP-2025-902' },
        { id: 'LIB-2025-002', description: 'Library Subscription', amount: 2000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-12', receiptNo: 'RCP-2025-903' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: true,
      admitCardIssued: true
    }
  },
  {
    id: '20CS003',
    rollNumber: '20CS003',
    name: 'Rahul Gupta (Low Attendance Case)',
    email: 'rahul.gupta@college.edu',
    phone: '+91 9876543214',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'B',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul%20Gupta',
    status: 'debarred',
    parentName: 'Suresh Gupta',
    parentPhone: '+91 9876543215',
    address: '77 Central Street, Delhi',
    cgpa: 7.15,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 28, total: 45, percentage: 62.2, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 26, total: 42, percentage: 61.9, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 27, total: 40, percentage: 67.5, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 26, total: 40, percentage: 65.0, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 16, external: 48, total: 64, grade: 'B', gp: 7, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 18, external: 51, total: 69, grade: 'B', gp: 7, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 17, external: 49, total: 66, grade: 'B', gp: 7, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 19, external: 53, total: 72, grade: 'B+', gp: 8, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 75000,
      outstanding: 7000,
      status: 'overdue',
      bills: [
        { id: 'TUI-2025-003', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-14', receiptNo: 'RCP-2025-915' },
        { id: 'LAB-2025-003', description: 'Advanced Computing Lab Fee', amount: 5000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'overdue' },
        { id: 'LIB-2025-003', description: 'Library Subscription', amount: 2000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'overdue' }
      ]
    },
    clearances: {
      attendanceClearance: false,
      feeClearance: false,
      admitCardIssued: false,
      academicHoldReason: 'DEBARRED: Aggregate Attendance is 64.1% (<75% Cutoff) and ₹7,000 Overdue Fees Pending.'
    }
  },
  {
    id: '20CS004',
    rollNumber: '20CS004',
    name: 'Priya Singh (Fee Hold Case)',
    email: 'priya.singh@college.edu',
    phone: '+91 9876543216',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'A',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Singh',
    status: 'active',
    parentName: 'Vikash Singh',
    parentPhone: '+91 9876543217',
    address: '109 IT Highway, Pune',
    cgpa: 9.10,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 42, total: 45, percentage: 93.3, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 39, total: 42, percentage: 92.8, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 37, total: 40, percentage: 92.5, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 36, total: 40, percentage: 90.0, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 29, external: 67, total: 96, grade: 'A+', gp: 10, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 28, external: 66, total: 94, grade: 'A+', gp: 10, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 27, external: 65, total: 92, grade: 'A+', gp: 10, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 28, external: 64, total: 92, grade: 'A+', gp: 10, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 45000,
      outstanding: 37000,
      status: 'overdue',
      bills: [
        { id: 'TUI-2025-004', description: 'Semester 6 Tuition Fee (Part 1)', amount: 45000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-10', receiptNo: 'RCP-2025-940' },
        { id: 'TUI-2025-004B', description: 'Semester 6 Tuition Fee (Part 2)', amount: 30000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'overdue' },
        { id: 'LAB-2025-004', description: 'Advanced Computing Lab Fee', amount: 5000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'overdue' },
        { id: 'LIB-2025-004', description: 'Library Subscription', amount: 2000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'overdue' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: false,
      admitCardIssued: false,
      academicHoldReason: 'FINANCIAL HOLD: Outstanding Balance of ₹37,000 Overdue. Hall Ticket & Transcript Held.'
    }
  },
  {
    id: '20CS005',
    rollNumber: '20CS005',
    name: 'Vikram Yadav',
    email: 'vikram.yadav@college.edu',
    phone: '+91 9876543218',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'B',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Yadav',
    status: 'active',
    parentName: 'Dharmendra Yadav',
    parentPhone: '+91 9876543219',
    address: '88 Cyber City, Hyderabad',
    cgpa: 8.20,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 37, total: 45, percentage: 82.2, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 35, total: 42, percentage: 83.3, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 33, total: 40, percentage: 82.5, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 32, total: 40, percentage: 80.0, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 24, external: 58, total: 82, grade: 'A', gp: 9, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 23, external: 55, total: 78, grade: 'B+', gp: 8, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 25, external: 56, total: 81, grade: 'A', gp: 9, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 22, external: 57, total: 79, grade: 'B+', gp: 8, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 82000,
      outstanding: 0,
      status: 'paid',
      bills: [
        { id: 'TUI-2025-005', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-11', receiptNo: 'RCP-2025-961' },
        { id: 'LAB-2025-005', description: 'Advanced Computing Lab Fee', amount: 5000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-11', receiptNo: 'RCP-2025-962' },
        { id: 'LIB-2025-005', description: 'Library Subscription', amount: 2000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-11', receiptNo: 'RCP-2025-963' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: true,
      admitCardIssued: true
    }
  },
  {
    id: '20CS006',
    rollNumber: '20CS006',
    name: 'Kavya Sharma',
    email: 'kavya.sharma@college.edu',
    phone: '+91 9876543220',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'B',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavya%20Sharma',
    status: 'active',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 9876543221',
    address: '12 Sector 14, Chandigarh',
    cgpa: 8.60,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 39, total: 45, percentage: 86.6, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 36, total: 42, percentage: 85.7, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 34, total: 40, percentage: 85.0, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 35, total: 40, percentage: 87.5, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 27, external: 60, total: 87, grade: 'A', gp: 9, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 26, external: 62, total: 88, grade: 'A', gp: 9, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 26, external: 59, total: 85, grade: 'A', gp: 9, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 27, external: 61, total: 88, grade: 'A', gp: 9, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 82000,
      outstanding: 0,
      status: 'paid',
      bills: [
        { id: 'TUI-2025-006', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-13', receiptNo: 'RCP-2025-971' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: true,
      admitCardIssued: true
    }
  },
  {
    id: '20CS007',
    rollNumber: '20CS007',
    name: 'Arjun Verma',
    email: 'arjun.verma@college.edu',
    phone: '+91 9876543222',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'A',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun%20Verma',
    status: 'active',
    parentName: 'Sunil Verma',
    parentPhone: '+91 9876543223',
    address: '33 Salt Lake, Kolkata',
    cgpa: 7.90,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 35, total: 45, percentage: 77.7, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 32, total: 42, percentage: 76.1, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 31, total: 40, percentage: 77.5, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 30, total: 40, percentage: 75.0, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 22, external: 55, total: 77, grade: 'B+', gp: 8, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 21, external: 53, total: 74, grade: 'B+', gp: 8, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 24, external: 54, total: 78, grade: 'B+', gp: 8, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 23, external: 56, total: 79, grade: 'B+', gp: 8, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 82000,
      outstanding: 0,
      status: 'paid',
      bills: [
        { id: 'TUI-2025-007', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-14', receiptNo: 'RCP-2025-981' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: true,
      admitCardIssued: true
    }
  },
  {
    id: '20CS008',
    rollNumber: '20CS008',
    name: 'Ananya Das',
    email: 'ananya.das@college.edu',
    phone: '+91 9876543224',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    semester: 6,
    section: 'A',
    admissionYear: '2021',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Das',
    status: 'active',
    parentName: 'Pradeep Das',
    parentPhone: '+91 9876543225',
    address: '55 Lake View, Chennai',
    cgpa: 9.60,
    attendance: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', attended: 44, total: 45, percentage: 97.7, history: [] },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', attended: 41, total: 42, percentage: 97.6, history: [] },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', attended: 39, total: 40, percentage: 97.5, history: [] },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', attended: 39, total: 40, percentage: 97.5, history: [] }
    },
    marks: {
      CS301: { subjectCode: 'CS301', subjectName: 'Database Management Systems', internal: 30, external: 69, total: 99, grade: 'A+', gp: 10, credits: 4 },
      CS302: { subjectCode: 'CS302', subjectName: 'Software Engineering', internal: 29, external: 68, total: 97, grade: 'A+', gp: 10, credits: 4 },
      CS303: { subjectCode: 'CS303', subjectName: 'Computer Networks', internal: 30, external: 67, total: 97, grade: 'A+', gp: 10, credits: 4 },
      CS304: { subjectCode: 'CS304', subjectName: 'Operating Systems', internal: 29, external: 68, total: 97, grade: 'A+', gp: 10, credits: 4 },
    },
    fees: {
      totalDue: 82000,
      totalPaid: 82000,
      outstanding: 0,
      status: 'paid',
      bills: [
        { id: 'TUI-2025-008', description: 'Semester 6 Tuition Fee', amount: 75000, dueDate: '2025-01-15', createdAt: '2024-12-01', status: 'paid', paidAt: '2025-01-08', receiptNo: 'RCP-2025-991' }
      ]
    },
    clearances: {
      attendanceClearance: true,
      feeClearance: true,
      admitCardIssued: true
    }
  }
]
