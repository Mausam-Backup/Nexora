import {
  LayoutDashboard,
  Timer,
  Calculator,
  CheckSquare,
  FileText,
  DollarSign,
  Users,
  BookOpen,
  CalendarDays,
  Bot,
  Brain,
  Zap,
  Newspaper,
  Award,
  BarChart3,
  QrCode,
  Building2,
  TrendingUp,
  ShieldAlert,
  FileSpreadsheet,
  FileUp,
  CreditCard,
  History,
  Scale,
  Globe,
  Music,
  Dumbbell,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  badge?: string
  items?: {
    title: string
    url: string
    badge?: string
  }[]
}

export interface SecondaryNavItem {
  name: string
  url: string
  icon: LucideIcon
}

// ==============================================================================
// 1. ADMIN NAVIGATION: Prioritizes PS-6 Core ERP & Audit Functions on Top
// ==============================================================================
export const adminPrimaryNav: NavItem[] = [
  {
    title: 'Spreadsheet Audit Ledger',
    url: '/admin/overview',
    icon: FileSpreadsheet,
    badge: 'PS-6 Core',
    isActive: true,
  },
  {
    title: 'Manage Students (Master)',
    url: '/admin/manage-students',
    icon: Users,
    badge: 'Registry',
  },
  {
    title: 'Manage Faculty Roster',
    url: '/admin/manage-teachers',
    icon: Users,
  },
  {
    title: 'Institutional Fees & Billing',
    url: '/admin/billing',
    icon: DollarSign,
    badge: 'Accounts',
    items: [
      {
        title: 'Revenue & Billing Overview',
        url: '/admin/billing',
      },
      {
        title: 'Student Fee Management',
        url: '/admin/student-billing',
      },
    ],
  },
  {
    title: 'Academic Operations',
    url: '/admin/subject-allocation',
    icon: BookOpen,
    items: [
      {
        title: 'Faculty Subject Allocation',
        url: '/admin/subject-allocation',
      },
      {
        title: 'Curriculum Planning',
        url: '/admin/course-planning',
      },
      {
        title: 'Subject Catalog',
        url: '/admin/subjects',
      },
      {
        title: 'Academic Structure',
        url: '/admin/academic-structure',
      },
    ],
  },
  {
    title: 'Branch Directories',
    url: '/admin/branch-students-overview',
    icon: Building2,
    items: [
      {
        title: 'Branch Students Directory',
        url: '/admin/branch-students-overview',
      },
      {
        title: 'Branch Faculty Directory',
        url: '/admin/branch-teachers-overview',
      },
    ],
  },
  {
    title: 'Digital Admin ID Pass',
    url: '/admin/id',
    icon: QrCode,
    badge: 'QR ID',
  },
  {
    title: 'Campus Broadcasts',
    url: '/admin/announcements',
    icon: Newspaper,
  },
]

export const adminSecondaryNav: SecondaryNavItem[] = [
  {
    name: 'AI ERP Copilot',
    url: '/ask-ai',
    icon: Bot,
  },
]

// ==============================================================================
// 2. FACULTY NAVIGATION: Prioritizes Roll Call & Grade Upload on Top
// ==============================================================================
export const teacherPrimaryNav: NavItem[] = [
  {
    title: 'Take Class Attendance',
    url: '/teacher/attendance',
    icon: CheckSquare,
    badge: '75% Gate',
    isActive: true,
  },
  {
    title: 'Upload & Moderate Marks',
    url: '/teacher/upload-marks',
    icon: Award,
    badge: 'Grading',
  },
  {
    title: 'Classes & Student Roster',
    url: '/teacher/my-classes',
    icon: BookOpen,
    items: [
      {
        title: 'My Teaching Classes',
        url: '/teacher/my-classes',
      },
      {
        title: 'Enrolled Student Details',
        url: '/teacher/students-details',
      },
      {
        title: 'Course Assignments',
        url: '/teacher/assignments',
      },
    ],
  },
  {
    title: 'Teaching Schedule',
    url: '/teacher/timetable',
    icon: CalendarDays,
  },
  {
    title: 'Faculty Payroll & Dues',
    url: '/teacher/billing',
    icon: DollarSign,
  },
  {
    title: 'Digital Faculty ID',
    url: '/teacher/id',
    icon: QrCode,
    badge: 'QR Pass',
  },
  {
    title: 'Faculty Announcements',
    url: '/teacher/announcements',
    icon: Newspaper,
  },
]

export const teacherSecondaryNav: SecondaryNavItem[] = [
  {
    name: 'AI Teaching Assistant',
    url: '/ask-ai',
    icon: Bot,
  },
  {
    name: 'Course Notes & Docs',
    url: '/notes',
    icon: FileText,
  },
]

// ==============================================================================
// 3. STUDENT NAVIGATION: Prioritizes Attendance, Grades, Fees & Hall Ticket
// ==============================================================================
export const studentPrimaryNav: NavItem[] = [
  {
    title: 'Student Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: 'Attendance & Cutoff Gate',
    url: '/attendance/student',
    icon: CheckSquare,
    badge: 'Min 75%',
  },
  {
    title: 'Academic Transcript & Marks',
    url: '/view-marks',
    icon: BarChart3,
    badge: 'Grades',
  },
  {
    title: 'Fees & Payment Ledger',
    url: '/billing-payments',
    icon: DollarSign,
    badge: 'Clearance',
  },
  {
    title: 'Exam Timetable & Admit Card',
    url: '/schedule/exams',
    icon: Award,
    badge: 'Hall Ticket',
  },
  {
    title: 'Courses & Assignments',
    url: '/courses/my-courses',
    icon: BookOpen,
    items: [
      {
        title: 'My Enrolled Courses',
        url: '/courses/my-courses',
      },
      {
        title: 'Course Assignments',
        url: '/courses/assignments',
      },
      {
        title: 'Course Catalog',
        url: '/courses/catalog',
      },
    ],
  },
  {
    title: 'Class Timetable & Schedule',
    url: '/timetable',
    icon: CalendarDays,
    items: [
      {
        title: 'Smart Timetable',
        url: '/timetable',
      },
      {
        title: 'Daily Class Schedule',
        url: '/schedule/classes',
      },
      {
        title: 'Campus Events',
        url: '/schedule/events',
      },
    ],
  },
  {
    title: 'Digital Student ID Pass',
    url: '/student-id',
    icon: QrCode,
    badge: 'QR ID',
  },
  {
    title: 'Official Announcements',
    url: '/announcements',
    icon: Users,
  },
]

export const studentSecondaryNav: SecondaryNavItem[] = [
  {
    name: 'Ask AI ERP Copilot',
    url: '/ask-ai',
    icon: Bot,
  },
  {
    name: 'Academic Calculators',
    url: '/calculators',
    icon: Calculator,
  },
  {
    name: 'Study Tasks & Notes',
    url: '/tasks',
    icon: CheckSquare,
  },
]

// ==============================================================================
// 4. EXAMINATION CONTROLLER (COE) NAVIGATION
// ==============================================================================
export const coePrimaryNav: NavItem[] = [
  {
    title: 'CoE Dashboard Overview',
    url: '/examination-controller',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: 'Hall Ticket & Eligibility Gate',
    url: '/examination-controller/hall-tickets',
    icon: QrCode,
    badge: '75% Gate',
  },
  {
    title: 'Marks & Grace Moderation',
    url: '/examination-controller/moderation',
    icon: BarChart3,
    badge: 'Grace Tool',
  },
  {
    title: '1-Click Result Publishing',
    url: '/examination-controller/publish',
    icon: Award,
    badge: 'Sovereign',
  },
  {
    title: 'Seating Allocation Engine',
    url: '/examination-controller/seating',
    icon: Building2,
    badge: 'Anti-Cheat',
  },
  {
    title: 'Exam Cycles & Schedule',
    url: '/examination-controller/cycles',
    icon: CalendarDays,
  },
  {
    title: 'Faculty Invigilation Roster',
    url: '/examination-controller/invigilation',
    icon: Users,
  },
  {
    title: 'Malpractice (UFM) Desk',
    url: '/examination-controller/malpractice',
    icon: ShieldAlert,
  },
]

export const coeSecondaryNav: SecondaryNavItem[] = [
  {
    name: 'CoE AI Regulations Assistant',
    url: '/ask-ai',
    icon: Bot,
  },
]

export function getRoleNavigation(role: string) {
  switch (role) {
    case 'examination_controller':
      return {
        primary: coePrimaryNav,
        secondary: coeSecondaryNav,
        portalTitle: 'Examination Controller (CoE)',
        groupLabel: 'Controller of Examinations Suite',
      }
    case 'admin':
      return {
        primary: adminPrimaryNav,
        secondary: adminSecondaryNav,
        portalTitle: 'Executive Admin Suite',
        groupLabel: 'PS-6 ERP Core Operations',
      }
    case 'teacher':
      return {
        primary: teacherPrimaryNav,
        secondary: teacherSecondaryNav,
        portalTitle: 'Faculty Portal',
        groupLabel: 'Faculty & Attendance Hub',
      }
    case 'student':
    default:
      return {
        primary: studentPrimaryNav,
        secondary: studentSecondaryNav,
        portalTitle: 'Student ERP Portal',
        groupLabel: 'Academic & Clearance Hub',
      }
  }
}

// Backward compatibility
export const navigationData = {
  navMain: studentPrimaryNav,
  navSecondary: [],
  projects: studentSecondaryNav,
}
