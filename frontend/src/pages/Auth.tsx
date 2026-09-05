import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { SEO } from "@/components/SEO"
import { useAuth, UserRoleType } from "@/contexts/AuthContext"
import { useUserData } from "@/hooks/useUserData"
import { 
  Eye, 
  EyeOff, 
  User, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft,
  LogIn, 
  Zap, 
  GraduationCap, 
  UserCog, 
  Users, 
  Heart, 
  Award,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { 
  SvgConcaveTop, 
  SvgConcaveBottom, 
  SvgConcentricRings, 
  PayoneerRingLogo 
} from "@/components/auth"

interface RoleOption {
  type: UserRoleType;
  label: string;
  shortLabel: string;
  portalName: string;
  icon: React.ElementType;
}

const ROLES: RoleOption[] = [
  { type: 'student', label: 'Student', shortLabel: 'Student', portalName: 'Student Portal', icon: GraduationCap },
  { type: 'teacher', label: 'Faculty', shortLabel: 'Faculty', portalName: 'Faculty & Attendance Portal', icon: Users },
  { type: 'admin', label: 'Administrator', shortLabel: 'Admin', portalName: 'Institutional Admin Suite', icon: UserCog },
  { type: 'examination_controller', label: 'Exam Controller', shortLabel: 'CoE', portalName: 'Office of the Controller of Exams', icon: Award },
  { type: 'parent', label: 'Parent', shortLabel: 'Parent', portalName: 'Parent Guardian Portal', icon: Heart }
];

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('student')
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  
  const navigate = useNavigate()
  const { login, signInWithSupabase, signUpWithSupabase } = useAuth()
  const { updateUserData } = useUserData()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')

  // Ensure browser back button while on /auth cleanly returns to main home page ('/')
  useEffect(() => {
    const handlePopState = () => {
      window.location.href = "/"
    }

    window.history.pushState({ authPage: true }, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // Sync mode with URL query params
  useEffect(() => {
    const mode = searchParams.get('mode')
    setIsSignUp(mode === 'signup')
    setFormStep(1)
    setAuthError(null)
    setAuthSuccess(null)
  }, [searchParams])

  const toggleMode = (signUp: boolean) => {
    setIsSignUp(signUp)
    setFormStep(1)
    setAuthError(null)
    setAuthSuccess(null)
    if (signUp) {
      setSearchParams({ mode: 'signup' }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const handleRoleChange = (role: UserRoleType) => {
    if (role === 'parent') {
      navigate('/parent')
      return
    }
    setSelectedRole(role)
    setAuthError(null)
  }

  const getPanelRedirect = (role: UserRoleType) => {
    switch (role) {
      case 'admin':
        return '/admin/overview'
      case 'teacher':
        return '/teacher/attendance'
      case 'examination_controller':
        return '/examination-controller'
      default:
        return '/student/dashboard'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthSuccess(null)
    setIsLoading(true)
    
    try {
      if (isSignUp) {
        if (!password || password.length < 6) {
          setAuthError("Password must be at least 6 characters long.")
          setIsLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setAuthError("Passwords do not match.")
          setIsLoading(false)
          return
        }

        const result = await signUpWithSupabase({
          email: email.trim(),
          password,
          name: name.trim(),
          role: selectedRole,
          collegeName: collegeName.trim() || 'Nexora University',
        })

        if (!result.success) {
          setAuthError(result.error || "Failed to create account. Please try again.")
          return
        }

        if (result.requiresEmailConfirmation) {
          setAuthSuccess("Account created successfully! Please check your email inbox to verify your account before logging in.")
          return
        }

        updateUserData({
          name: name.trim(),
          email: email.trim(),
          course: collegeName.trim() || 'Nexora University',
        })

        const panelPath = getPanelRedirect(selectedRole)
        navigate(panelPath, { replace: true })
      } else {
        const result = await signInWithSupabase(email.trim(), password)

        if (!result.success) {
          setAuthError(result.error || "Invalid credentials. Please verify your email and password.")
          return
        }

        const userObj = result.user
        const resolvedRole: UserRoleType = (userObj?.role as UserRoleType) || selectedRole

        if (userObj) {
          updateUserData({
            name: userObj.name,
            email: userObj.email,
            course: userObj.collegeName || 'Nexora University',
          })
        }

        const panelPath = getPanelRedirect(resolvedRole)
        navigate(panelPath, { replace: true })
      }
    } catch (error: any) {
      console.error('Auth submission error:', error)
      setAuthError(error?.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJudgeLogin = (role: 'admin' | 'teacher' | 'student' | 'examination_controller', studentId?: string, personaName?: string) => {
    if (role === 'examination_controller') {
      const coeUser = {
        id: 'coe_001',
        name: 'Dr. K. R. Ramanathan (CoE)',
        email: 'coe@campussync.edu',
        role: 'examination_controller' as const,
        collegeName: 'Apex Institute of Technology'
      }
      login(coeUser)
      updateUserData({
        name: coeUser.name,
        email: coeUser.email,
        course: coeUser.collegeName
      })
      navigate('/examination-controller', { replace: true })
      return
    }

    const judgeUser = {
      id: studentId || (role === 'admin' ? 'ADM001' : role === 'teacher' ? 'T101' : '20CS001'),
      name: personaName || (role === 'admin' ? 'Dr. Sarah Jenkins (Registrar)' : role === 'teacher' ? 'Prof. Rajesh Iyer (Faculty)' : 'Aarav Sharma (Student)'),
      email: `${role}@campussync.edu`,
      role: role,
      collegeName: 'Apex Institute of Technology'
    }

    login(judgeUser)
    updateUserData({
      name: judgeUser.name,
      email: judgeUser.email,
      course: judgeUser.collegeName
    })

    if (role === 'admin') {
      navigate('/admin/overview', { replace: true })
    } else if (role === 'teacher') {
      navigate('/teacher/attendance', { replace: true })
    } else {
      navigate('/student/dashboard', { replace: true })
    }
  }

  const activeRoleConfig = ROLES.find(r => r.type === selectedRole) || ROLES[0]

  return (
    <>
      <SEO 
        title={isSignUp ? "Sign Up - Nexora" : "Sign In - Nexora"}
        description="Comprehensive campus management and institutional governance platform."
        keywords="student login, campus sync, academic platform, exam controller, university management"
      />
      
      {/* Full-Screen Split Layout (No outer container or margins) */}
      <div className="min-h-screen w-full bg-[#161311] flex flex-col lg:flex-row overflow-hidden font-sans antialiased text-neutral-900 selection:bg-orange-500 selection:text-white">
        
        {/* ================= LEFT HALF SECTION (FULL-HEIGHT COVER IMAGE & BLEND) ================= */}
        <div className="relative w-full lg:w-1/2 min-h-[480px] lg:min-h-screen bg-[#161311] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden select-none">
          
          {/* Full-Cover Background Image */}
          <img 
            src="/student-campus-hero.jpg" 
            alt="Student with backpack on campus" 
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="eager"
          />

          {/* Seamless Gradient Blends: deep solid charcoal at top dissolving into photo, gentle ground vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#161311] via-[#161311]/75 to-[#161311]/25 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#161311] via-[#161311]/60 to-transparent pointer-events-none" />
          
          {/* Ambient Background Concentric Rings */}
          <div className="absolute -top-16 -left-16 w-[560px] h-[560px] pointer-events-none opacity-20">
            <SvgConcentricRings className="w-full h-full" />
          </div>

          {/* Top Text Header & Bold Minimalist Headline */}
          <div className="relative z-10 max-w-xl">
            <p className="text-xs sm:text-sm text-neutral-300 font-normal tracking-wide drop-shadow-sm">
              Campus management made simple – academic solutions for you.
            </p>
            
            <h1 className="mt-8 sm:mt-12 lg:mt-14 text-4xl sm:text-5xl lg:text-[58px] font-semibold text-white tracking-[-0.03em] leading-[1.08] drop-shadow-md">
              Manage<br />your campus
            </h1>
          </div>

          {/* Bottom Emblem & Brand Promise */}
          <div className="relative z-10 pt-6 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full border border-orange-500/90 bg-[#161311]/70 backdrop-blur-sm flex items-center justify-center text-orange-400 text-xs shadow-sm shadow-orange-500/20 flex-shrink-0">
              <span className="font-mono text-[10px] leading-none">✦</span>
            </div>
            <p className="text-xs text-neutral-300 font-normal drop-shadow-sm">
              Empowering colleges, faculty, and students with modern institutional workflows.
            </p>
          </div>
        </div>

        {/* ================= RIGHT HALF SECTION (FULL-HEIGHT WHITE CARD) ================= */}
        <div className="relative w-full lg:w-1/2 min-h-screen bg-white lg:rounded-l-[48px] p-8 sm:p-12 lg:p-14 xl:p-20 flex flex-col justify-between shadow-[-20px_0_60px_rgba(0,0,0,0.3)] z-20">
          
          {/* Custom SVG Concave Fillets on Desktop */}
          <div className="hidden lg:block absolute -left-12 top-0 pointer-events-none">
            <SvgConcaveTop fillColor="#FFFFFF" />
          </div>
          <div className="hidden lg:block absolute -left-12 bottom-0 pointer-events-none">
            <SvgConcaveBottom fillColor="#FFFFFF" />
          </div>

          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between w-full">
            {/* Back to Home & Brand Logo with Gradient Ring */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Back to Landing Page"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>

              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 group cursor-pointer"
                title="Nexora Home"
              >
                <PayoneerRingLogo size={32} className="group-hover:scale-105 transition-transform" />
                <span className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Nexora</span>
              </a>
            </div>

            {/* Sign In / Sign Up Mode Switcher */}
            <button
              type="button"
              onClick={() => toggleMode(!isSignUp)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors px-3.5 py-1.5 rounded-full hover:bg-neutral-100 cursor-pointer"
            >
              <User className="h-4 w-4 text-neutral-600" />
              <span>{isSignUp ? "Sign In" : "Sign Up"}</span>
            </button>
          </div>

          {/* Main Center Content */}
          <div className="w-full max-w-[480px] mx-auto my-auto py-6 sm:py-8">
            
            {/* Form Title */}
            <h2 className="text-3xl sm:text-[38px] font-bold text-neutral-900 tracking-tight mb-2">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>

            <p className="text-xs text-neutral-500 mb-5">
              {isSignUp 
                ? "Create your institutional credentials to get started"
                : "Access your dashboard with institutional credentials"
              }
            </p>

            {/* ================= HACKATHON EVALUATOR QUICK PASS (ABOVE FORM) ================= */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-blue-50/60 to-purple-50/90 border-2 border-indigo-200/90 shadow-sm space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <Zap className="h-3.5 w-3.5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                      Hackathon Evaluator Quick Pass
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-extrabold rounded uppercase tracking-wider">
                        Fast Track
                      </span>
                    </span>
                    <p className="text-[10px] text-neutral-500">1-click instant persona access • no password required</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full border border-indigo-200">
                  ⚡ 4 Live Roles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => handleJudgeLogin('admin', 'ADM001', 'Dr. Sarah Jenkins (Registrar)')}
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-blue-50/80 border border-blue-200/80 hover:border-blue-400 text-neutral-900 transition-all text-left flex items-start gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
                  title="Login as Administrator (Overview)"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserCog className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-neutral-900 leading-tight">Admin Overview</div>
                    <div className="text-[10px] text-neutral-500 truncate">Institutional Governance</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleJudgeLogin('teacher', 'T101', 'Prof. Rajesh Iyer (Faculty)')}
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-purple-50/80 border border-purple-200/80 hover:border-purple-400 text-neutral-900 transition-all text-left flex items-start gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
                  title="Login as Faculty (Attendance & Grading)"
                >
                  <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Users className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-neutral-900 leading-tight">Faculty View</div>
                    <div className="text-[10px] text-neutral-500 truncate">Attendance & Marks</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleJudgeLogin('student', '20CS001', 'Aarav Sharma (Cleared)')}
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-emerald-50/80 border border-emerald-200/80 hover:border-emerald-400 text-neutral-900 transition-all text-left flex items-start gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
                  title="Login as Cleared Student (AskAI & Schedule)"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-neutral-900 leading-tight">Student Portal</div>
                    <div className="text-[10px] text-neutral-500 truncate">Aarav Sharma (Cleared)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleJudgeLogin('examination_controller')}
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-amber-50/80 border border-amber-200/80 hover:border-amber-400 text-neutral-900 transition-all text-left flex items-start gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 group cursor-pointer"
                  title="Login as Controller of Examinations"
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Award className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-neutral-900 leading-tight">Exam Controller</div>
                    <div className="text-[10px] text-neutral-500 truncate">Hall Tickets & Debarment</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Separator Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-neutral-400 font-semibold text-[10px] tracking-wider">
                  Or manual credential sign in
                </span>
              </div>
            </div>

            {/* Institutional Role Selector Segmented Pills */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                <span>SELECT ROLE</span>
                <span className="font-medium text-neutral-800">{activeRoleConfig.portalName}</span>
              </div>
              
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-neutral-100/90 rounded-full border border-neutral-200/60">
                {ROLES.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.type
                  return (
                    <button
                      key={role.type}
                      type="button"
                      onClick={() => handleRoleChange(role.type)}
                      className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-neutral-900 text-white shadow-sm' 
                          : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/80'
                      }`}
                      title={role.label}
                    >
                      <Icon className={`h-3 w-3 ${isSelected ? 'text-[#5162ff]' : 'text-neutral-500'}`} />
                      <span className="text-[11px] truncate">{role.shortLabel}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Error & Success Feedback Alerts */}
            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-500" />
                <span className="leading-relaxed font-medium">{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                <span className="leading-relaxed font-medium">{authSuccess}</span>
              </div>
            )}

            {/* Form Elements */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* SIGN IN FORM */}
              {!isSignUp && (
                <>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Email or Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                      />
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 pr-12 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="pt-0.5">
                      <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-[#5162ff] hover:text-[#3b82f6] transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {/* SIGN UP FORM */}
              {isSignUp && (
                <>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Institutional Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="College or University Name"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                      />
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create Password (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 pr-12 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-[52px] rounded-full px-6 pr-12 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              {isSignUp ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] mt-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[52px] mt-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                )
              )}
            </form>
          </div>
          
          {/* Bottom Footer Row */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <p className="font-normal">
              © 2005-2025 Nexora Inc.
            </p>
            
            <div className="flex items-center gap-4 text-neutral-500 relative">
              <Link to="/contact" className="hover:text-neutral-900 transition-colors">
                Contact Us
              </Link>
              
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-1 hover:text-neutral-900 transition-colors focus:outline-none"
                >
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 bottom-6 w-32 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                    {["English", "Español", "Français", "Deutsch"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang)
                          setLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors ${
                          selectedLanguage === lang ? 'font-semibold text-neutral-900' : 'text-neutral-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}