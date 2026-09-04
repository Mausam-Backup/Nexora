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

// Student: High-Impact Core Modules on Top
export const studentPrimaryNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Academic Performance",
    url: "/view-marks",
    icon: BarChart3,
    badge: "Insights",
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
        title: "Exam Schedule",
        url: "/schedule/exams",
      },
      {
        title: "Campus Events",
        url: "/schedule/events",
      },
    ],
  },
  {
    title: "Attendance Tracker",
    url: "/attendance/student",
    icon: CheckSquare,
    badge: "Live",
  },
  {
    title: "Fees & Billing",
    url: "/billing-payments",
    icon: DollarSign,
  },
  {
    title: "Digital Student ID",
    url: "/student-id",
    icon: QrCode,
    badge: "QR Pass",
  },
  {
    title: "Campus Network",
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
  {
    name: "Notes & Materials",
    url: "/notes",
    icon: FileText,
  },
  {
    name: "Expense Tracker",
    url: "/expenses",
    icon: TrendingUp,
  },
  {
    name: "Tasks & Todos",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Pomodoro Focus",
    url: "/pomodoro",
    icon: Timer,
  },
  {
    name: "Academic Calculators",
    url: "/calculators",
    icon: Calculator,
  },
  {
    name: "Ask AI Assistant",
    url: "/ask-ai",
    icon: Bot,
  },
  {
    name: "Mind & Meditation",
    url: "/meditation",
    icon: Brain,
  },
  {
    name: "Daily Motivation",
    url: "/motivation",
    icon: Zap,
  },
  {
    name: "Fitness Tracker",
    url: "/fitness",
    icon: Dumbbell,
  },
  {
    name: "Study Music Player",
    url: "/music",
    icon: Music,
  },
]

// Teacher: High-Impact Faculty Intelligence on Top
export const teacherPrimaryNav: NavItem[] = [
  {
    title: "Faculty Dashboard",
    url: "/",
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

export function getRoleNavigation(role: string) {
  switch (role) {
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