import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { SEO } from "@/components/SEO"
import { useAuth } from "@/contexts/AuthContext"
import { useUserData } from "@/hooks/useUserData"
import { Button } from "@/components/ui/button"
import { ShieldAlert, GraduationCap, CheckCircle2, AlertTriangle, Zap } from "lucide-react"
import {
  AuthHeroSection,
  AuthMobileHero,
  AuthRoleSelection,
  AuthMobileRoleSelection,
  AuthForm
} from "@/components/auth"

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
  const [showMobileForm, setShowMobileForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin' | 'teacher' | 'parent' | 'examination_controller' | null>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { updateUserData } = useUserData()
  const [searchParams] = useSearchParams()
  
  // Check URL params for mode (default to login)
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')
  
  const isMobile = useIsMobile()

  // Update URL when mode changes
  useEffect(() => {
    const mode = searchParams.get('mode')
    setIsSignUp(mode === 'signup')
    setFormStep(1)
  }, [searchParams])

  // Check if we should show mobile form based on URL params
  useEffect(() => {
    if (searchParams.get('form') === 'true') {
      setShowMobileForm(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock user data - in a real app, this would come from your auth API
      const role = selectedRole ?? 'student'
      const isCoE = role === 'examination_controller'
      const userData = {
        id: isCoE ? 'coe_001' : role === 'teacher' ? 'T001' : role === 'admin' ? 'admin_001' : '1',
        name: isSignUp ? name : isCoE ? 'Dr. K. R. Ramanathan' : role === 'teacher' ? 'Dr. Sarah Johnson' : role === 'admin' ? 'Campus Administrator' : 'Demo User',
        email: email || (isCoE ? 'coe@campussync.edu' : role === 'teacher' ? 'sarah.johnson@college.edu' : role === 'admin' ? 'admin@campussync.edu' : 'demo@university.edu'),
        collegeName: isSignUp ? collegeName : 'CampusSync University',
        role,
      }
      
      // Update user profile data from auth form
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
      
      // Log the user in
      login(userData)
      
      // Redirect based on role
      const panelPath = 
        role === 'admin' 
          ? '/admin/profile' 
          : role === 'teacher' 
          ? '/teacher/profile' 
          : role === 'examination_controller' 
          ? '/examination-controller' 
          : '/'
      navigate(panelPath, { replace: true })
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJudgeLogin = (role: 'admin' | 'teacher' | 'student', studentId?: string, personaName?: string) => {
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

  const renderJudgeAccessCard = () => (
    <div className="p-4 rounded-xl border-2 border-primary/25 bg-primary/5 space-y-3 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" />
            Hackathon Judge 1-Click Access
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono bg-background px-2 py-0.5 rounded border">
          PS-6 Evaluation
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Instantly enter with pre-configured institutional evaluation roles (no password required):
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="text-xs justify-start h-9 bg-background/90 hover:bg-accent hover:text-accent-foreground font-medium"
          onClick={() => handleJudgeLogin('admin', 'ADM001', 'Dr. Sarah Jenkins (Registrar)')}
        >
          <ShieldAlert className="h-3.5 w-3.5 mr-1.5 text-blue-600 flex-shrink-0" />
          <span className="truncate">Admin (Overview)</span>
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="text-xs justify-start h-9 bg-background/90 hover:bg-accent hover:text-accent-foreground font-medium"
          onClick={() => handleJudgeLogin('teacher', 'T101', 'Prof. Rajesh Iyer (Faculty)')}
        >
          <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-purple-600 flex-shrink-0" />
          <span className="truncate">Faculty (Attendance)</span>
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="text-xs justify-start h-9 bg-background/90 hover:bg-accent hover:text-accent-foreground font-medium"
          onClick={() => handleJudgeLogin('student', '20CS001', 'Aarav Sharma (Cleared)')}
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Student (Cleared)</span>
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          className="text-xs justify-start h-9 bg-background/90 hover:bg-accent hover:text-accent-foreground font-medium"
          onClick={() => handleJudgeLogin('student', '20CS003', 'Rohan Verma (Debarred)')}
        >
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-amber-600 flex-shrink-0" />
          <span className="truncate">Student (Debarred)</span>
        </Button>
      </div>
    </div>
  )

  const nextStep = () => {
    if (isSignUp && formStep === 1) {
      setFormStep(2)
    }
  }

  const prevStep = () => {
    if (formStep === 2) {
      setFormStep(1)
    }
  }

  const handleRoleSelect = (role: 'student' | 'admin' | 'teacher' | 'parent' | 'examination_controller') => {
    setSelectedRole(role)
    setIsSignUp(false)
    if (isMobile) {
      setShowMobileForm(true)
    }
  }

  const handleMobileBack = () => {
    if (selectedRole) {
      setShowRoleSelection(true)
      setShowMobileForm(false)
    } else {
      setShowMobileForm(false)
    }
  }

  // Mobile view
  if (isMobile) {
    // Show role selection first, then hero section, then form
    if (!showRoleSelection && !showMobileForm) {
      return (
        <>
          <SEO 
            title="Welcome to CampusSync"
            description="Transform your academic journey with our comprehensive student management platform."
            keywords="student login, campus sync, academic platform, student management, university app"
          />
          
          <AuthMobileHero onGetStarted={() => setShowRoleSelection(true)} />
        </>
      )
    }

    // Mobile role selection view
    if (showRoleSelection && !showMobileForm) {
      return (
        <>
          <SEO 
            title="Choose Your Role - CampusSync"
            description="Select your role to access the appropriate features for students, teachers, administrators, or parents."
            keywords="user roles, student login, teacher portal, admin access, parent dashboard"
          />
          
          <AuthMobileRoleSelection
            onBack={() => setShowRoleSelection(false)}
            onRoleSelect={handleRoleSelect}
          />
        </>
      )
    }

    // Mobile form view
    return (
      <>
        <SEO 
          title={isSignUp ? "Create Account" : "Sign In"}
          description={isSignUp ? "Join CampusSync and transform your academic journey with our comprehensive student management platform." : "Welcome back to CampusSync. Continue your academic journey."}
          keywords="student login, campus sync, academic platform, student management, university app"
        />
        
        {renderJudgeAccessCard()}
        <AuthForm
          isSignUp={isSignUp}
          setIsSignUp={(value) => {
            setIsSignUp(value);
            setFormStep(1);
          }}
          formStep={formStep}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          collegeName={collegeName}
          setCollegeName={setCollegeName}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          isLoading={isLoading}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          onSubmit={handleSubmit}
          nextStep={nextStep}
          prevStep={prevStep}
          isMobile={true}
          onBack={handleMobileBack}
        />
      </>
    )
  }

  // Desktop view
  return (
    <>
      <SEO 
        title={isSignUp ? "Create Account" : "Sign In"}
        description={isSignUp ? "Join CampusSync and transform your academic journey with our comprehensive student management platform." : "Welcome back to CampusSync. Continue your academic journey."}
        keywords="student login, campus sync, academic platform, student management, university app"
      />
      
      <div className="min-h-screen flex flex-col lg:flex-row">
        <AuthHeroSection />
        <div className="lg:w-1/2 flex items-center justify-center p-4 lg:p-6 xl:p-8 bg-background">
          <div className="w-full max-w-md space-y-6">
            {/* Hackathon Judge / Evaluator 1-Click Fast Login */}
            {renderJudgeAccessCard()}

            {!selectedRole ? (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">Or Choose Your Role</h3>
                  <p className="text-muted-foreground">Select the standard login method</p>
                </div>
                <AuthRoleSelection onRoleSelect={handleRoleSelect} />
              </>
            ) : (
              <AuthForm
                isSignUp={isSignUp}
                setIsSignUp={(value) => {
                  setIsSignUp(value);
                  setFormStep(1);
                }}
                formStep={formStep}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                collegeName={collegeName}
                setCollegeName={setCollegeName}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isLoading={isLoading}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                onSubmit={handleSubmit}
                nextStep={nextStep}
                prevStep={prevStep}
                isMobile={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}