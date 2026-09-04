import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Users, Mail, Search, Eye, Phone, MapPin, GraduationCap, Download, Printer, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GenericPageSkeleton } from "@/components/ui/page-skeleton"
import { usePageLoading } from "@/hooks/use-page-loading"
import { useIsMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SEO } from "@/components/SEO"
import { Badge } from "@/components/ui/badge"
import { BranchSelector } from "@/components/admin/BranchSelector"
import { StudentDetailsModal } from "@/components/admin/StudentDetailsModal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useERPData } from "@/hooks/useERPData"
import { exportToCSV, generatePrintableReport } from "@/utils/exportUtils"

export default function ManageStudents() {
  const isLoading = usePageLoading()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const { students, addStudent, deleteStudent, stats } = useERPData()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [statusFilter, setStatusFilter] = useState<'all' | 'eligible' | 'debarred' | 'fee_hold'>('all')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add student form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNumber: "",
    department: "Computer Science and Engineering",
    semester: 6,
    email: "",
    phone: "+91 9876543210"
  })

  const branches = [
    "Computer Science and Engineering", 
    "Electronics & Communication", 
    "Mechanical Engineering", 
    "Information Technology"
  ]

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudent.name || !newStudent.rollNumber) {
      toast({ title: "Validation Error", description: "Name and Roll Number are required.", variant: "destructive" })
      return
    }

    addStudent({
      name: newStudent.name,
      rollNumber: newStudent.rollNumber.toUpperCase(),
      department: newStudent.department,
      semester: Number(newStudent.semester),
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      phone: newStudent.phone,
      parentName: "Guardian / Parent",
      parentPhone: "+91 9876500000",
      address: "Campus Hostel / Residential",
      admissionYear: "2021",
      cgpa: 8.0,
      status: 'active'
    })

    toast({
      title: "Student Enrolled",
      description: `${newStudent.name} (${newStudent.rollNumber}) added to institutional database with initialized attendance, subjects, and fee ledger.`
    })

    setIsAddModalOpen(false)
    setNewStudent({
      name: "",
      rollNumber: "",
      department: "Computer Science and Engineering",
      semester: 6,
      email: "",
      phone: "+91 9876543210"
    })
  }

  const handleDelete = (id: string) => {
    deleteStudent(id)
    toast({ title: "Student Removed", description: `Record ${id} deleted from ERP database.` })
  }

  const handleViewDetails = (student: any) => {
    setSelectedStudent({
      ...student,
      branch: student.department,
      gpa: student.cgpa
    })
    setIsDetailsModalOpen(true)
  }

  const handleExportCSV = () => {
    const headers = ["Roll Number", "Student Name", "Department", "Semester", "CGPA", "Attendance Cleared", "Fee Cleared", "Admit Card Issued", "Status"]
    const rows = students.map(s => [
      s.rollNumber,
      s.name,
      s.department,
      `Sem ${s.semester}`,
      s.cgpa,
      s.clearances.attendanceClearance ? "ELIGIBLE" : "DEBARRED (<75%)",
      s.clearances.feeClearance ? "CLEARED" : "FINANCIAL HOLD",
      s.clearances.admitCardIssued ? "ISSUED" : "LOCKED",
      s.status.toUpperCase()
    ])
    exportToCSV("Institutional_Student_Registry", headers, rows)
    toast({ title: "Export Completed", description: "Downloaded complete student directory as CSV" })
  }

  const handlePrintRegistry = () => {
    generatePrintableReport({
      title: "Official Institutional Student Master Registry",
      subtitle: "Office of the Dean of Academic Affairs & Admissions • CampusSync Central Database",
      columns: ["Roll Number", "Student Name", "Department", "Sem", "CGPA", "Attendance %", "Fee Balance", "Status"],
      rows: students.map(s => {
        const attRecords = Object.values(s.attendance)
        const totalAtt = attRecords.reduce((acc, r) => acc + r.attended, 0)
        const totalSess = attRecords.reduce((acc, r) => acc + r.total, 0)
        const attPct = totalSess > 0 ? ((totalAtt / totalSess) * 100).toFixed(1) : '100'
        return [
          s.rollNumber,
          s.name,
          s.department,
          `Sem ${s.semester}`,
          s.cgpa,
          `${attPct}%`,
          s.fees.outstanding === 0 ? "CLEAR" : `₹${s.fees.outstanding.toLocaleString('en-IN')}`,
          s.status.toUpperCase()
        ]
      }),
      summaryStats: [
        { label: "Total Students Registered", value: students.length },
        { label: "Attendance Debarred", value: stats.debarredCount },
        { label: "Fee Delinquent Holds", value: stats.financialHoldCount }
      ]
    })
  }

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesBranch = selectedBranch === 'all' || student.department === selectedBranch
      
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'eligible' ? (student.clearances.attendanceClearance && student.clearances.feeClearance) :
        statusFilter === 'debarred' ? (!student.clearances.attendanceClearance) :
        statusFilter === 'fee_hold' ? (!student.clearances.feeClearance || student.fees.outstanding > 0) : true
      
      return matchesSearch && matchesBranch && matchesStatus
    })
  }, [students, searchQuery, selectedBranch, statusFilter])

  const branchCounts = useMemo(() => {
    return branches.reduce((acc, branch) => {
      acc[branch] = students.filter(s => s.department === branch).length
      return acc
    }, {} as Record<string, number>)
  }, [students])

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
  }

  if (isLoading) return <GenericPageSkeleton />

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <SEO title="Manage Students" description="Administer student records" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Manage Students</h1>
          <p className="text-muted-foreground text-sm hidden sm:block">Unified student repository with real-time academic & financial status</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
            <Download className="h-4 w-4 mr-2" />
            <span>Export CSV</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintRegistry} className="flex-1 sm:flex-initial">
            <Printer className="h-4 w-4 mr-2" />
            <span>Print Registry</span>
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-initial bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" /> Students
            <Badge variant="secondary" className="ml-2">
              {filteredStudents.length} of {students.length}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">Manage all registered students</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {/* Branch Filter */}
          <div className="mb-6">
            <BranchSelector
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
              branches={branches}
              itemCounts={branchCounts}
            />
          </div>

          {/* Search Bar & Academic Status Filter */}
          <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students by name, roll number, email, or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 w-full"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <Button
                type="button"
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-10 text-xs whitespace-nowrap"
                onClick={() => setStatusFilter('all')}
              >
                All ({students.length})
              </Button>
              <Button
                type="button"
                variant={statusFilter === 'eligible' ? 'default' : 'outline'}
                size="sm"
                className="h-10 text-xs whitespace-nowrap text-emerald-700 dark:text-emerald-400 border-emerald-300"
                onClick={() => setStatusFilter('eligible')}
              >
                Cleared ({students.filter(s => s.clearances.attendanceClearance && s.clearances.feeClearance).length})
              </Button>
              <Button
                type="button"
                variant={statusFilter === 'debarred' ? 'default' : 'outline'}
                size="sm"
                className="h-10 text-xs whitespace-nowrap text-red-700 dark:text-red-400 border-red-300"
                onClick={() => setStatusFilter('debarred')}
              >
                Debarred ({stats.debarredCount})
              </Button>
              <Button
                type="button"
                variant={statusFilter === 'fee_hold' ? 'default' : 'outline'}
                size="sm"
                className="h-10 text-xs whitespace-nowrap text-amber-700 dark:text-amber-400 border-amber-300"
                onClick={() => setStatusFilter('fee_hold')}
              >
                Fee Hold ({stats.financialHoldCount})
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono font-semibold">{s.rollNumber}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.department}</Badge>
                    </TableCell>
                    <TableCell>Sem {s.semester}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(s.status)}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{Number(s.cgpa).toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(s)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredStudents.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-mono font-bold text-sm">{s.rollNumber}</div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{s.department}</Badge>
                        <Badge className={getStatusColor(s.status) + " text-xs"}>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">CGPA: {Number(s.cgpa).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Sem {s.semester}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {s.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {s.phone}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(s)} className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)} className="flex-1">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {filteredStudents.length === 0 && students.length > 0 && (
              <div className="text-center text-muted-foreground py-8">
                No students found matching your search
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleAddStudentSubmit}>
            <DialogHeader>
              <DialogTitle>Enroll New Student</DialogTitle>
              <DialogDescription>
                Add a new student record to the unified ERP system. Academic subjects, attendance, and fee ledgers will be initialized automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Vikram Malhotra"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rollNumber">Roll Number / ID</Label>
                  <Input
                    id="rollNumber"
                    placeholder="e.g. 20CS009"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min={1}
                    max={8}
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newStudent.department}
                  onValueChange={(val) => setNewStudent({ ...newStudent, department: val })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vikram@college.edu"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Complete Enrollment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <StudentDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        student={selectedStudent}
      />
    </div>
  )
}
