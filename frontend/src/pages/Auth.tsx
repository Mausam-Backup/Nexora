import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { SEO } from "@/components/SEO"
import { useAuth } from "@/contexts/AuthContext"
import { useUserData } from "@/hooks/useUserData"
import { 
  Eye, 
  EyeOff, 
  User, 
  ChevronDown, 
  ArrowRight, 
  LogIn, 
  Zap, 
  GraduationCap, 
  UserCog, 
  Users, 
  Heart, 
  Award,
  Sparkles
} from "lucide-react"
import { 
  SvgConcaveTop, 
  SvgConcaveBottom, 
  SvgConcentricRings, 
  PayoneerRingLogo 
} from "@/components/auth"

type UserRoleType = 'student' | 'admin' | 'teacher' | 'parent' | 'examination_controller';

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
  const [formStep, setFormStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('student')
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  
  const navigate = useNavigate()
  const { login } = useAuth()
  const { updateUserData } = useUserData()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')

  // Sync mode with URL query params
  useEffect(() => {
    const mode = searchParams.get('mode')
    setIsSignUp(mode === 'signup')
    setFormStep(1)
  }, [searchParams])

  const toggleMode = (signUp: boolean) => {
    setIsSignUp(signUp)
    setFormStep(1)
    if (signUp) {
      setSearchParams({ mode: 'signup' })
    } else {
      setSearchParams({})
    }
  }

  const handleRoleChange = (role: UserRoleType) => {
    if (role === 'parent') {
      navigate('/parent')
      return
    }
    setSelectedRole(role)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const role = selectedRole
      const isCoE = role === 'examination_controller'
      const userData = {
        id: isCoE ? 'coe_001' : role === 'teacher' ? 'T001' : role === 'admin' ? 'admin_001' : '1',
        name: isSignUp ? name : isCoE ? 'Dr. K. R. Ramanathan' : role === 'teacher' ? 'Dr. Sarah Johnson' : role === 'admin' ? 'Campus Administrator' : 'Demo User',
        email: email || (isCoE ? 'coe@campussync.edu' : role === 'teacher' ? 'sarah.johnson@college.edu' : role === 'admin' ? 'admin@campussync.edu' : 'demo@university.edu'),
        collegeName: isSignUp ? collegeName : 'Nexora University',
        role,
      }
      
      if (isSignUp) {
        updateUserData({
          name: name,
          email: email,
          course: collegeName
        })
      } else {
        updateUserData({
          name: userData.name,
          email: userData.email
        })
      }
      
      login(userData)
      
      const panelPath = 
        role === 'admin' 
          ? '/admin/overview' 
          : role === 'teacher' 
          ? '/teacher/attendance' 
          : role === 'examination_controller' 
          ? '/examination-controller' 
          : '/student/dashboard'
          
      navigate(panelPath, { replace: true })
    } catch (error) {
      console.error('Auth error:', error)
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
      
      {/* Outer Shell Wrapper with neutral backdrop */}
      <div className="min-h-screen w-full bg-[#ECEBE9] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 font-sans antialiased text-neutral-900 selection:bg-orange-500 selection:text-white">
        
        {/* Main Split-Screen Presentation Container */}
        <div className="w-full max-w-[1240px] min-h-[720px] lg:min-h-[820px] bg-[#161311] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] shadow-2xl shadow-black/20 flex flex-col lg:flex-row overflow-hidden relative border border-neutral-800/20">
          
          {/* ================= LEFT SECTION (DARK PANEL) ================= */}
          <div className="relative w-full lg:w-[48%] xl:w-[50%] bg-[#161311] text-white p-7 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden select-none">
            
            {/* Ambient Background Concentric Rings */}
            <div className="absolute -bottom-16 -left-16 w-[560px] h-[560px] pointer-events-none">
              <SvgConcentricRings className="w-full h-full" />
            </div>

            {/* Top Text Header */}
            <div className="relative z-10">
              <p className="text-xs sm:text-[13px] text-neutral-400 font-normal tracking-wide">
                Campus management made simple – academic solutions for you.
              </p>
              
              {/* Bold Minimalist Headline */}
              <h1 className="mt-8 sm:mt-12 lg:mt-14 text-4xl sm:text-5xl lg:text-[54px] font-semibold text-white tracking-[-0.03em] leading-[1.08]">
                Manage<br />your campus
              </h1>
            </div>

            {/* Real Student with Bag Image */}
            <div className="relative z-10 my-6 sm:my-8 flex items-center justify-center lg:justify-start">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] overflow-hidden rounded-[26px] shadow-2xl shadow-black/70 border border-white/10 group">
                <img 
                  src="/student-campus-hero.jpg" 
                  alt="Student with backpack on campus" 
                  className="w-full h-[280px] sm:h-[320px] lg:h-[360px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                
                {/* Clean dark gradient overlay on bottom of image for seamless contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Floating Academic Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                    <GraduationCap className="h-3.5 w-3.5 text-orange-400" />
                    <span className="font-medium tracking-wide">Unified Student Experience</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-white/70 font-mono">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    <span>Nexora 2.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Emblem & Tagline */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full border border-orange-500/80 flex items-center justify-center text-orange-400 text-xs shadow-sm shadow-orange-500/20 flex-shrink-0">
                <span className="font-mono text-[10px] leading-none">✦</span>
              </div>
              <p className="text-xs text-neutral-400 font-normal">
                Empowering colleges, faculty, and students with modern institutional workflows.
              </p>
            </div>
          </div>

          {/* ================= RIGHT SECTION (WHITE CARD) ================= */}
          <div className="relative w-full lg:w-[52%] xl:w-[50%] bg-white rounded-t-[32px] sm:rounded-t-[36px] lg:rounded-t-none lg:rounded-l-[44px] p-7 sm:p-10 lg:p-14 flex flex-col justify-between shadow-[-10px_0_30px_rgba(0,0,0,0.08)] z-20">
            
            {/* Custom SVG Concave Fillets on Desktop */}
            <div className="hidden lg:block absolute -left-12 top-0 pointer-events-none">
              <SvgConcaveTop fillColor="#FFFFFF" />
            </div>
            <div className="hidden lg:block absolute -left-12 bottom-0 pointer-events-none">
              <SvgConcaveBottom fillColor="#FFFFFF" />
            </div>

            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between w-full">
              {/* Brand Logo with Gradient Ring */}
              <Link to="/" className="flex items-center gap-2 group">
                <PayoneerRingLogo size={32} className="group-hover:scale-105 transition-transform" />
                <span className="text-2xl font-bold text-neutral-900 tracking-tight">Nexora</span>
              </Link>

              {/* Sign In / Sign Up Mode Switcher */}
              <button
                type="button"
                onClick={() => toggleMode(!isSignUp)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
              >
                <User className="h-4 w-4 text-neutral-600" />
                <span>{isSignUp ? "Sign In" : "Sign Up"}</span>
              </button>
            </div>

            {/* Main Center Content */}
            <div className="w-full max-w-[420px] mx-auto my-auto py-4 sm:py-6">
              
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
                        <Icon className={`h-3 w-3 ${isSelected ? 'text-orange-400' : 'text-neutral-500'}`} />
                        <span className="text-[11px] truncate">{role.shortLabel}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

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

                      {/* Forgot Password Link in vibrant orange */}
                      <div className="pt-0.5">
                        <Link
                          to="/forgot-password"
                          className="text-xs font-semibold text-[#FF4820] hover:text-[#E03A15] transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                {/* SIGN UP FORM */}
                {isSignUp && (
                  <div className="space-y-3">
                    {formStep === 1 ? (
                      <>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="College / University Name"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="w-full h-[52px] rounded-full px-6 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (name && email && collegeName) setFormStep(2)
                          }}
                          disabled={!name || !email || !collegeName}
                          className="w-full h-[52px] rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 mt-2"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[52px] rounded-full px-6 pr-12 text-sm text-neutral-900 bg-white border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400 shadow-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
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
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setFormStep(1)}
                            className="w-1/3 h-[52px] rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                            className="w-2/3 h-[52px] rounded-full bg-gradient-to-r from-[#FF3B22] via-[#FF5528] to-[#FA2A64] hover:opacity-95 text-white font-medium text-sm transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
                          >
                            {isLoading ? "Creating..." : "Create Account"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Primary CTA Gradient Button (Sign In) */}
                {(!isSignUp || formStep === 2) && (
                  !isSignUp && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-[52px] rounded-full text-white font-medium text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#FF3B22] via-[#FF5528] to-[#FA2A64] mt-6"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 stroke-[2.5]" />
                          <span>Sign In</span>
                        </>
                      )}
                    </button>
                  )
                )}
              </form>

              {/* ================= HACKATHON EVALUATOR QUICK PASS (MOVED TO RIGHT SIDE BELOW FORM) ================= */}
              <div className="mt-8 pt-5 border-t border-neutral-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                    <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 text-[10px] shadow-sm">
                      ✦
                    </div>
                    <span className="flex items-center gap-1 text-neutral-900 font-bold">
                      <Zap className="h-3.5 w-3.5 text-orange-500" />
                      Hackathon Evaluator Quick Pass:
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                    1-Click Access
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleJudgeLogin('admin', 'ADM001', 'Dr. Sarah Jenkins (Registrar)')}
                    className="px-2.5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 text-neutral-800 text-[11px] font-medium transition-all text-left truncate flex items-center gap-1.5 active:scale-95 shadow-sm"
                    title="Login as Administrator (Overview)"
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="truncate">Admin Overview</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleJudgeLogin('teacher', 'T101', 'Prof. Rajesh Iyer (Faculty)')}
                    className="px-2.5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 text-neutral-800 text-[11px] font-medium transition-all text-left truncate flex items-center gap-1.5 active:scale-95 shadow-sm"
                    title="Login as Faculty (Attendance)"
                  >
                    <span className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                    <span className="truncate">Faculty View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJudgeLogin('student', '20CS001', 'Aarav Sharma (Cleared)')}
                    className="px-2.5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 text-neutral-800 text-[11px] font-medium transition-all text-left truncate flex items-center gap-1.5 active:scale-95 shadow-sm"
                    title="Login as Cleared Student"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="truncate">Student (Clear)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJudgeLogin('examination_controller')}
                    className="px-2.5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 text-neutral-800 text-[11px] font-medium transition-all text-left truncate flex items-center gap-1.5 active:scale-95 shadow-sm"
                    title="Login as Controller of Examinations"
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="truncate">Exam Controller</span>
                  </button>
                </div>
              </div>
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
      </div>
    </>
  )
}