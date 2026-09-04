import {
  LayoutDashboard,
  Timer,
  Calculator,
  CheckSquare,
  FileText,
  Music,
  Dumbbell,
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
  Scale,
  Globe,
  type LucideIcon,
} from "lucide-react"

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

// Student: High-Impact Core ERP Modules on Top
export const studentPrimaryNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Attendance Tracker",
    url: "/attendance/student",
    icon: CheckSquare,
    badge: "Live 88.9%",
  },
  {
    title: "Academic Performance",
    url: "/view-marks",
    icon: BarChart3,
    badge: "Grades",
    items: [
      {
        title: "View Marks & SGPA",
        url: "/view-marks",
        badge: "Grades",
      },
      {
        title: "Academic Trajectory",
        url: "/academic-progress",
      },
    ],
  },
  {
    title: "Fees & Billing Ledger",
    url: "/billing-payments",
    icon: DollarSign,
    badge: "Ledger",
  },
  {
    title: "Examinations & Admit Card",
    url: "/schedule/exams",
    icon: Award,
    badge: "Hall Ticket",
  },
  {
    title: "Courses & Academics",
    url: "/courses/my-courses",
    icon: BookOpen,
    items: [
      {
        title: "My Enrolled Courses",
        url: "/courses/my-courses",
      },
      {
        title: "Course Assignments",
        url: "/courses/assignments",
      },
      {
        title: "Course Catalog",
        url: "/courses/catalog",
      },
    ],
  },
  {
    title: "Schedule & Timetable",
    url: "/timetable",
    icon: CalendarDays,
    items: [
      {
        title: "Smart Timetable",
        url: "/timetable",
      },
      {
        title: "Daily Class Schedule",
        url: "/schedule/classes",
      },
      {
        title: "Exam Timetable",
        url: "/schedule/exams",
      },
      {
        title: "Campus Events",
        url: "/schedule/events",
      },
    ],
  },
  {
    title: "Digital Student ID",
    url: "/student-id",
    icon: QrCode,
    badge: "QR Pass",
  },
  {
    title: "Campus Network & Notices",
    url: "/announcements",
    icon: Users,
    items: [
      {
        title: "Official Notices",
        url: "/announcements",
      },
      {
        title: "Student Community",
        url: "/community",
      },
    ],
  },
]

export const studentSecondaryNav: SecondaryNavItem[] = [
  // Academic & Productivity Tools on Top
  {
    name: "Ask AI Academic Assistant",
    url: "/ask-ai",
    icon: Bot,
  },
  {
    name: "Notes & Materials",
    url: "/notes",
    icon: FileText,
  },
  {
    name: "Tasks & Todos",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Academic Calculators",
    url: "/calculators",
    icon: Calculator,
  },
  {
    name: "Pomodoro Focus",
    url: "/pomodoro",
    icon: Timer,
  },
  {
    name: "Daily Motivation",
    url: "/motivation",
    icon: Zap,
  },

  // Non-ERP Utilities moved to the bottom
  {
    name: "Personal Expenses",
    url: "/expenses",
    icon: TrendingUp,
  },
  {
    name: "Study Music Player",
    url: "/music",
    icon: Music,
  },
  {
    name: "Mind & Meditation",
    url: "/meditation",
    icon: Brain,
  },
  {
    name: "Fitness Tracker",
    url: "/fitness",
    icon: Dumbbell,
  },
  {
    name: "Wikipedia Reader",
    url: "/wikipedia",
    icon: Globe,
  },
]

// Teacher: High-Impact Faculty Intelligence on Top
export const teacherPrimaryNav: NavItem[] = [
  {
    title: "Faculty Dashboard",
    url: "/teacher/attendance",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Attendance & At-Risk",
    url: "/teacher/attendance",
    icon: CheckSquare,
    badge: "Risk AI",
  },
  {
    title: "Marks & Evaluation",
    url: "/teacher/upload-marks",
    icon: Award,
    badge: "Grading",
  },
  {
    title: "Classes & Students",
    url: "/teacher/my-classes",
    icon: BookOpen,
    items: [
      {
        title: "My Classes",
        url: "/teacher/my-classes",
      },
      {
        title: "Student Roster Details",
        url: "/teacher/students-details",
      },
      {
        title: "Course Assignments",
        url: "/teacher/assignments",
      },
    ],
  },
  {
    title: "Schedule & Timetable",
    url: "/teacher/timetable",
    icon: CalendarDays,
    items: [
      {
        title: "Teaching Timetable",
        url: "/teacher/timetable",
      },
      {
        title: "Campus Events",
        url: "/schedule/events",
      },
    ],
  },
  {
    title: "Payroll & Compensation",
    url: "/teacher/billing",
    icon: DollarSign,
  },
  {
    title: "Digital Faculty ID",
    url: "/teacher/id",
    icon: QrCode,
    badge: "QR Pass",
  },
  {
    title: "Notices & Community",
    url: "/teacher/announcements",
    icon: Newspaper,
    items: [
      {
        title: "Faculty Announcements",
        url: "/teacher/announcements",
      },
      {
        title: "Campus Community",
        url: "/community",
      },
    ],
  },
]

export const teacherSecondaryNav: SecondaryNavItem[] = [
  {
    name: "Course Notes & Docs",
    url: "/notes",
    icon: FileText,
  },
  {
    name: "AI Teaching Assistant",
    url: "/ask-ai",
    icon: Bot,
  },
]

// Admin: Institutional Control & Business Intelligence on Top
export const adminPrimaryNav: NavItem[] = [
  {
    title: "Admin Overview",
    url: "/admin/overview",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Financial Intelligence",
    url: "/admin/billing",
    icon: DollarSign,
    badge: "₹45.2L",
    items: [
      {
        title: "Institutional Revenue & Payroll",
        url: "/admin/billing",
        badge: "Analytics",
      },
      {
        title: "Student Fee Management",
        url: "/admin/student-billing",
      },
    ],
  },
  {
    title: "Campus Directory",
    url: "/admin/branch-students-overview",
    icon: Building2,
    badge: "1,248 Students",
    items: [
      {
        title: "Branch Students Directory",
        url: "/admin/branch-students-overview",
      },
      {
        title: "Branch Faculty Directory",
        url: "/admin/branch-teachers-overview",
      },
      {
        title: "Manage All Students",
        url: "/admin/manage-students",
      },
      {
        title: "Manage All Faculty",
        url: "/admin/manage-teachers",
      },
    ],
  },
  {
    title: "Academic Operations",
    url: "/admin/subject-allocation",
    icon: BookOpen,
    items: [
      {
        title: "Faculty Subject Allocation",
        url: "/admin/subject-allocation",
      },
      {
        title: "Curriculum Planning",
        url: "/admin/course-planning",
      },
      {
        title: "Subject Catalog",
        url: "/admin/subjects",
      },
      {
        title: "Academic Structure",
        url: "/admin/academic-structure",
      },
    ],
  },
  {
    title: "Digital Admin ID",
    url: "/admin/id",
    icon: QrCode,
    badge: "QR Pass",
  },
  {
    title: "Campus Broadcasts",
    url: "/admin/announcements",
    icon: Newspaper,
  },
]

export const adminSecondaryNav: SecondaryNavItem[] = [
  {
    name: "Admin AI Assistant",
    url: "/ask-ai",
    icon: Bot,
  },
]

// Examination Controller (CoE) Primary Navigation
export const coePrimaryNav: NavItem[] = [
  {
    title: "CoE Dashboard",
    url: "/examination-controller",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Exam Cycles & Timetable",
    url: "/examination-controller/cycles",
    icon: CalendarDays,
    badge: "Master",
    items: [
      {
        title: "Active Exam Cycles",
        url: "/examination-controller/cycles",
      },
      {
        title: "Conflict Detection Engine",
        url: "/examination-controller/cycles",
      },
    ],
  },
  {
    title: "Seating Allocation Engine",
    url: "/examination-controller/seating",
    icon: Building2,
    badge: "Anti-Cheating",
    items: [
      {
        title: "Interleaved Hall Layout",
        url: "/examination-controller/seating",
      },
      {
        title: "Door Charts & Nominal Rolls",
        url: "/examination-controller/seating",
      },
    ],
  },
  {
    title: "Invigilation Roster",
    url: "/examination-controller/invigilation",
    icon: Users,
    items: [
      {
        title: "Faculty Duty Allocations",
        url: "/examination-controller/invigilation",
      },
      {
        title: "Duty Swap Workflow",
        url: "/examination-controller/invigilation",
      },
    ],
  },
  {
    title: "Hall Ticket Gatekeeper",
    url: "/examination-controller/hall-tickets",
    icon: QrCode,
    badge: "Eligibility",
    items: [
      {
        title: "75% Attendance & Fee Filter",
        url: "/examination-controller/hall-tickets",
      },
      {
        title: "Debar & Bulk Release Pass",
        url: "/examination-controller/hall-tickets",
      },
    ],
  },
  {
    title: "Marks & Moderation",
    url: "/examination-controller/moderation",
    icon: BarChart3,
    badge: "Grace Tool",
    items: [
      {
        title: "Faculty Submission Tracker",
        url: "/examination-controller/moderation",
      },
      {
        title: "Grace Marks Moderation",
        url: "/examination-controller/moderation",
      },
    ],
  },
  {
    title: "1-Click Result Publishing",
    url: "/examination-controller/publish",
    icon: Award,
    badge: "Sovereign",
  },
  {
    title: "Malpractice (UFM) Desk",
    url: "/examination-controller/malpractice",
    icon: ShieldAlert,
    badge: "Disciplinary",
  },
]

export const coeSecondaryNav: SecondaryNavItem[] = [
  {
    name: "CoE Regulation Guide",
    url: "/ask-ai",
    icon: Bot,
  },
]

export function getRoleNavigation(role: string) {
  switch (role) {
    case "examination_controller":
      return {
        primary: coePrimaryNav,
        secondary: coeSecondaryNav,
        portalTitle: "Examination Controller (CoE)",
        groupLabel: "Office of the Controller of Examinations",
      }
    case "admin":
      return {
        primary: adminPrimaryNav,
        secondary: adminSecondaryNav,
        portalTitle: "Administrative Suite",
        groupLabel: "Executive Operations",
      }
    case "teacher":
      return {
        primary: teacherPrimaryNav,
        secondary: teacherSecondaryNav,
        portalTitle: "Faculty Portal",
        groupLabel: "Faculty Operations",
      }
    case "student":
    default:
      return {
        primary: studentPrimaryNav,
        secondary: studentSecondaryNav,
        portalTitle: "Student Portal",
        groupLabel: "Academic Hub",
      }
  }
}

// Backward compatibility
export const navigationData = {
  navMain: studentPrimaryNav,
  navSecondary: [],
  projects: studentSecondaryNav,
}