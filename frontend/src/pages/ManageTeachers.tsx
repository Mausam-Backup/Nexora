import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, UserCog, Mail, Search, Eye, Phone, Building, Calendar, Sparkles, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GenericPageSkeleton } from "@/components/ui/page-skeleton"
import { usePageLoading } from "@/hooks/use-page-loading"
import { useIsMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SEO } from "@/components/SEO"
import { Badge } from "@/components/ui/badge"
import { BranchSelector } from "@/components/admin/BranchSelector"
import { TeacherDetailsModal } from "@/components/admin/TeacherDetailsModal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export interface TeacherRecord {
  id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  employeeId: string
  joiningDate: string
  qualification: string
  experience: number
  subjects: string[]
  officeRoom: string
  status: 'active' | 'inactive'
  salary: number
}

const DEFAULT_TEACHERS: TeacherRecord[] = [
  {
    id: 'EMP-001',
    name: 'Prof. John Doe',
    email: 'john.doe@college.edu',
    phone: '+91 9876543230',
    department: 'Computer Science',
    designation: 'Professor',
    employeeId: 'EMP-001',
    joiningDate: '2018-07-15',
    qualification: 'Ph.D in Computer Science',
    experience: 12,
    subjects: ['Data Structures', 'Algorithms', 'Machine Learning'],
    officeRoom: 'CS-201',
    status: 'active',
    salary: 85000
  },
  {
    id: 'EMP-012',
    name: 'Dr. Priya Menon',
    email: 'priya.menon@college.edu',
    phone: '+91 9876543231',
    department: 'Electronics & Communication',
    designation: 'Associate Professor',
    employeeId: 'EMP-012',
    joiningDate: '2019-08-20',
    qualification: 'Ph.D in Electronics Engineering',
    experience: 8,
    subjects: ['Digital Signal Processing', 'Communication Systems', 'VLSI Design'],
    officeRoom: 'ECE-105',
    status: 'active',
    salary: 75000
  },
  {
    id: 'EMP-023',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@college.edu',
    phone: '+91 9876543232',
    department: 'Mechanical Engineering',
    designation: 'Professor',
    employeeId: 'EMP-023',
    joiningDate: '2015-06-10',
    qualification: 'Ph.D in Mechanical Engineering',
    experience: 15,
    subjects: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer'],
    officeRoom: 'ME-301',
    status: 'active',
    salary: 90000
  },
  {
    id: 'EMP-034',
    name: 'Dr. Anita Singh',
    email: 'anita.singh@college.edu',
    phone: '+91 9876543233',
    department: 'Civil Engineering',
    designation: 'Assistant Professor',
    employeeId: 'EMP-034',
    joiningDate: '2020-01-15',
    qualification: 'Ph.D in Civil Engineering',
    experience: 6,
    subjects: ['Structural Engineering', 'Construction Management', 'Surveying'],
    officeRoom: 'CE-202',
    status: 'active',
    salary: 65000
  },
  {
    id: 'EMP-045',
    name: 'Prof. Suresh Patel',
    email: 'suresh.patel@college.edu',
    phone: '+91 9876543234',
    department: 'Information Technology',
    designation: 'Associate Professor',
    employeeId: 'EMP-045',
    joiningDate: '2017-09-01',
    qualification: 'M.Tech in Information Technology',
    experience: 10,
    subjects: ['Database Systems', 'Web Development', 'Software Engineering'],
    officeRoom: 'IT-150',
    status: 'inactive',
    salary: 70000
  }
]

export default function ManageTeachers() {
  const isLoading = usePageLoading()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  
  const [teachers, setTeachers] = useState<TeacherRecord[]>(() => {
    const saved = localStorage.getItem('campussync_teachers')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {}
    }
    return DEFAULT_TEACHERS
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherRecord | null>(null)

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    employeeId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    qualification: 'M.Tech / Ph.D',
    experience: 5,
    subjects: '',
    officeRoom: 'CS-101',
    status: 'active' as 'active' | 'inactive',
    salary: 70000
  })

  const departments = [
    "Computer Science", 
    "Electronics & Communication", 
    "Mechanical Engineering", 
    "Civil Engineering", 
    "Information Technology"
  ]

  // Synchronize on load with Supabase table
  useEffect(() => {
    async function loadTeachers() {
      try {
        const { data, error } = await supabase.from('profiles').eq('role', 'teacher')
        if (!error && data && data.length > 0) {
          const mapped: TeacherRecord[] = data.map((t: any) => ({
            id: t.id || t.employee_id || `EMP-${Date.now()}`,
            name: t.name,
            email: t.email,
            phone: t.phone || '+91 9876543210',
            department: t.department || t.branch || 'Computer Science',
            designation: t.designation || 'Professor',
            employeeId: t.employee_id || t.id,
            joiningDate: t.joining_date || '2021-01-01',
            qualification: t.qualification || 'Ph.D',
            experience: t.experience_years || 5,
            subjects: t.subjects || ['Core Curriculum'],
            officeRoom: t.office_room || 'Room 101',
            status: (t.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
            salary: Number(t.salary) || 75000
          }))
          setTeachers(mapped)
          localStorage.setItem('campussync_teachers', JSON.stringify(mapped))
        }
      } catch (err) {
        console.warn('Supabase fetch fallback for teachers:', err)
      }
    }
    loadTeachers()
  }, [])

  const saveTeachersList = (updated: TeacherRecord[]) => {
    setTeachers(updated)
    localStorage.setItem('campussync_teachers', JSON.stringify(updated))
  }

  const openAddModal = () => {
    const nextNum = teachers.length + 1
    const nextId = `EMP-${String(nextNum).padStart(3, '0')}`
    setFormState({
      id: nextId,
      name: '',
      email: '',
      phone: '+91 98765' + Math.floor(10000 + Math.random() * 90000),
      department: selectedDepartment !== 'all' ? selectedDepartment : 'Computer Science',
      designation: 'Assistant Professor',
      employeeId: nextId,
      joiningDate: new Date().toISOString().split('T')[0],
      qualification: 'Ph.D in Engineering',
      experience: 5,
      subjects: 'Data Structures, Algorithms',
      officeRoom: 'CS-204',
      status: 'active',
      salary: 75000
    })
    setIsAddModalOpen(true)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name.trim() || !formState.employeeId.trim()) {
      toast({ title: 'Validation Error', description: 'Name and Employee ID are required.', variant: 'destructive' })
      return
    }

    const newRecord: TeacherRecord = {
      id: formState.employeeId,
      name: formState.name.trim(),
      email: formState.email.trim() || `${formState.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      phone: formState.phone,
      department: formState.department,
      designation: formState.designation,
      employeeId: formState.employeeId,
      joiningDate: formState.joiningDate,
      qualification: formState.qualification,
      experience: Number(formState.experience) || 1,
      subjects: formState.subjects.split(',').map(s => s.trim()).filter(Boolean),
      officeRoom: formState.officeRoom,
      status: formState.status,
      salary: Number(formState.salary) || 70000
    }

    const updated = [newRecord, ...teachers]
    saveTeachersList(updated)

    // Sync to Supabase in background
    supabase.from('profiles').insert({
      id: newRecord.id,
      name: newRecord.name,
      email: newRecord.email,
      phone: newRecord.phone,
      role: 'teacher',
      department: newRecord.department,
      branch: newRecord.department,
      designation: newRecord.designation,
      employee_id: newRecord.employeeId,
      joining_date: newRecord.joiningDate,
      qualification: newRecord.qualification,
      experience_years: newRecord.experience,
      office_room: newRecord.officeRoom,
      salary: newRecord.salary,
      status: newRecord.status
    }).then(() => {})

    setIsAddModalOpen(false)
    toast({
      title: 'Faculty Added Successfully',
      description: `${newRecord.name} (${newRecord.employeeId}) has been registered to ${newRecord.department}.`
    })
  }

  const openEditModal = (teacher: TeacherRecord) => {
    setFormState({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      designation: teacher.designation,
      employeeId: teacher.employeeId,
      joiningDate: teacher.joiningDate,
      qualification: teacher.qualification,
      experience: teacher.experience,
      subjects: teacher.subjects.join(', '),
      officeRoom: teacher.officeRoom,
      status: teacher.status,
      salary: teacher.salary
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updated = teachers.map(t => {
      if (t.id === formState.id || t.employeeId === formState.employeeId) {
        return {
          ...t,
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          department: formState.department,
          designation: formState.designation,
          qualification: formState.qualification,
          experience: Number(formState.experience),
          subjects: formState.subjects.split(',').map(s => s.trim()).filter(Boolean),
          officeRoom: formState.officeRoom,
          status: formState.status,
          salary: Number(formState.salary)
        }
      }
      return t
    })

    saveTeachersList(updated)

    // Sync update to Supabase
    supabase.from('profiles').eq('id', formState.id).update({
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      department: formState.department,
      branch: formState.department,
      designation: formState.designation,
      qualification: formState.qualification,
      experience_years: Number(formState.experience),
      office_room: formState.officeRoom,
      status: formState.status,
      salary: Number(formState.salary)
    }).then(() => {})

    setIsEditModalOpen(false)
    toast({
      title: 'Faculty Record Updated',
      description: `Updated profile details for ${formState.name}.`
    })
  }

  const confirmDelete = (teacher: TeacherRecord) => {
    setTeacherToDelete(teacher)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirmed = () => {
    if (!teacherToDelete) return
    const updated = teachers.filter(t => t.id !== teacherToDelete.id && t.employeeId !== teacherToDelete.employeeId)
    saveTeachersList(updated)

    // Sync delete to Supabase
    supabase.from('profiles').eq('id', teacherToDelete.id).delete().then(() => {})

    setIsDeleteModalOpen(false)
    setTeacherToDelete(null)
    toast({
      title: 'Faculty Record Deleted',
      description: `Removed ${teacherToDelete.name} from institutional roster.`
    })
  }

  const handleViewDetails = (teacher: TeacherRecord) => {
    setSelectedTeacher(teacher)
    setIsDetailsModalOpen(true)
  }

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || teacher.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const departmentCounts = departments.reduce((acc, dept) => {
    acc[dept] = teachers.filter(t => t.department === dept).length
    return acc
  }, {} as Record<string, number>)

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
      : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
  }

  if (isLoading) return <GenericPageSkeleton />

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-7xl mx-auto">
      <SEO title="Manage Teachers" description="Administer teacher records and institutional faculty directory" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserCog className="h-7 w-7 text-primary" /> Manage Faculty & Teachers
          </h1>
          <p className="text-muted-foreground text-sm hidden sm:block">
            Create, update, assign departments, and manage institutional faculty profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/admin/branch-teachers-overview'}
            className="w-full sm:w-auto"
          >
            <Building className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">View by Department</span>
            <span className="sm:hidden">Departments</span>
          </Button>
          <Button onClick={openAddModal} className="w-full sm:w-auto shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add New Teacher</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Faculty Directory
                <Badge variant="secondary" className="ml-2">
                  {filteredTeachers.length} of {teachers.length} Active
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Single relational ledger of teaching staff with real-time state synchronization
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-6 space-y-6">
          {/* Department Filter Selector */}
          <div>
            <BranchSelector
              selectedBranch={selectedDepartment}
              onBranchChange={setSelectedDepartment}
              branches={departments}
              itemCounts={departmentCounts}
            />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search faculty by name, employee ID, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/80"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold">Faculty Member</TableHead>
                  <TableHead className="font-semibold">Employee ID</TableHead>
                  <TableHead className="font-semibold">Department & Role</TableHead>
                  <TableHead className="font-semibold">Experience & Office</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No faculty members found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-medium text-foreground">{teacher.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" /> {teacher.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {teacher.employeeId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{teacher.department}</div>
                        <div className="text-xs text-muted-foreground">{teacher.designation}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{teacher.experience} Years Exp.</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" /> {teacher.officeRoom}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(teacher.status)}>
                          {teacher.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(teacher)}
                            title="View Profile Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(teacher)}
                            title="Edit Faculty Record"
                          >
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(teacher)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete Faculty Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="border border-border/70 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{teacher.name}</h3>
                    <p className="text-xs text-muted-foreground">{teacher.designation} • {teacher.department}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(teacher.status)}>
                    {teacher.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                  <div>
                    <span className="text-muted-foreground">ID: </span>
                    <span className="font-mono font-medium">{teacher.employeeId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Office: </span>
                    <span>{teacher.officeRoom}</span>
                  </div>
                  <div className="col-span-2 truncate">
                    <span className="text-muted-foreground">Email: </span>
                    <span>{teacher.email}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(teacher)} className="h-8 text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(teacher)} className="h-8 text-xs">
                    <Edit className="h-3.5 w-3.5 mr-1 text-primary" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => confirmDelete(teacher)} className="h-8 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ADD TEACHER MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Faculty Member
            </DialogTitle>
            <DialogDescription>
              Register a new professor or lecturer to the institutional database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  placeholder="e.g. EMP-088"
                  value={formState.employeeId}
                  onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="faculty@college.edu"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formState.department}
                  onValueChange={(val) => setFormState({ ...formState, department: val })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={formState.designation}
                  onValueChange={(val) => setFormState({ ...formState, designation: val })}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Head of Department">Head of Department (HoD)</SelectItem>
                    <SelectItem value="Visiting Faculty">Visiting Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  placeholder="e.g. Ph.D in Computer Science"
                  value={formState.qualification}
                  onChange={(e) => setFormState({ ...formState, qualification: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formState.experience}
                  onChange={(e) => setFormState({ ...formState, experience: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officeRoom">Office / Cabin</Label>
                <Input
                  id="officeRoom"
                  placeholder="e.g. CS-204"
                  value={formState.officeRoom}
                  onChange={(e) => setFormState({ ...formState, officeRoom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Compensation (₹)</Label>
                <Input
                  id="salary"
                  type="number"
                  step="1000"
                  value={formState.salary}
                  onChange={(e) => setFormState({ ...formState, salary: Number(e.target.value) })}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="subjects">Assigned Subjects (comma-separated)</Label>
                <Input
                  id="subjects"
                  placeholder="e.g. Data Structures, Computer Networks, Machine Learning"
                  value={formState.subjects}
                  onChange={(e) => setFormState({ ...formState, subjects: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(val: 'active' | 'inactive') => setFormState({ ...formState, status: val })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive / On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Register Faculty Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT TEACHER MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Edit Faculty Record ({formState.employeeId})
            </DialogTitle>
            <DialogDescription>
              Update information and credentials for {formState.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={formState.department}
                  onValueChange={(val) => setFormState({ ...formState, department: val })}
                >
                  <SelectTrigger id="edit-department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-designation">Designation</Label>
                <Select
                  value={formState.designation}
                  onValueChange={(val) => setFormState({ ...formState, designation: val })}
                >
                  <SelectTrigger id="edit-designation">
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Head of Department">Head of Department (HoD)</SelectItem>
                    <SelectItem value="Visiting Faculty">Visiting Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-qualification">Qualification</Label>
                <Input
                  id="edit-qualification"
                  value={formState.qualification}
                  onChange={(e) => setFormState({ ...formState, qualification: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-experience">Experience (Years)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={formState.experience}
                  onChange={(e) => setFormState({ ...formState, experience: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-officeRoom">Office / Cabin</Label>
                <Input
                  id="edit-officeRoom"
                  value={formState.officeRoom}
                  onChange={(e) => setFormState({ ...formState, officeRoom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary (₹)</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  value={formState.salary}
                  onChange={(e) => setFormState({ ...formState, salary: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(val: 'active' | 'inactive') => setFormState({ ...formState, status: val })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive / On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="edit-subjects">Assigned Subjects (comma-separated)</Label>
                <Input
                  id="edit-subjects"
                  value={formState.subjects}
                  onChange={(e) => setFormState({ ...formState, subjects: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Remove Faculty Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{teacherToDelete?.name}</span> ({teacherToDelete?.employeeId}) from the faculty directory? This action will remove their subject allocations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Modal */}
      {selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  )
}
