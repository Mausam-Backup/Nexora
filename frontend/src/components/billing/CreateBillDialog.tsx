import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, User, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const billCategories = [
  { id: 'tuition', name: 'Tuition Fees', icon: '🎓' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏠' },
  { id: 'transport', name: 'Bus Transport', icon: '🚌' },
  { id: 'library', name: 'Library Fees', icon: '📚' },
  { id: 'lab', name: 'Laboratory Fees', icon: '🔬' },
  { id: 'exam', name: 'Examination Fees', icon: '📝' },
  { id: 'sports', name: 'Sports Fees', icon: '⚽' },
  { id: 'misc', name: 'Miscellaneous', icon: '📋' }
]

import { useERPData } from "@/hooks/useERPData"

export function CreateBillDialog({ open, onOpenChange }: CreateBillDialogProps) {
  const { toast } = useToast()
  const { students, createBill } = useERPData()
  const [searchTerm, setSearchTerm] = useState('')

  const erpStudents = students.map(s => ({
    id: s.id,
    name: s.name,
    rollNo: s.rollNumber,
    branch: s.department,
    year: `Year ${Math.ceil(s.semester / 2)}`,
    semester: `Sem ${s.semester}`
  }))

  const [selectedStudent, setSelectedStudent] = useState<typeof erpStudents[0] | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    dueDate: '',
    notes: ''
  })

  const filteredStudents = erpStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = () => {
    if (!selectedStudent || !formData.category || !formData.amount || !formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const categoryObj = billCategories.find(c => c.id === formData.category)
    const billTitle = formData.description || (categoryObj ? categoryObj.name : 'Tuition Fee')

    // Persist new bill into ERP database
    createBill(selectedStudent.id, {
      title: billTitle,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      status: 'pending'
    })

    toast({
      title: "Bill Created Successfully",
      description: `Bill of ₹${Number(formData.amount).toLocaleString('en-IN')} billed to ${selectedStudent.name} (${selectedStudent.rollNo})`
    })
    
    // Reset form
    setSelectedStudent(null)
    setFormData({
      category: '',
      amount: '',
      description: '',
      dueDate: '',
      notes: ''
    })
    setSearchTerm('')
    onOpenChange(false)
  }

  const generateBillId = () => {
    const category = billCategories.find(c => c.id === formData.category)?.name.substring(0, 3).toUpperCase() || 'BIL'
    const date = new Date().toISOString().substring(2, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${category}-${date}-${random}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Individual Bill
          </DialogTitle>
          <DialogDescription>
            Create a bill for a specific student with custom details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-4">
            <div>
              <Label>Search & Select Student *</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, roll number, or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {selectedStudent ? (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedStudent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedStudent.rollNo} • {selectedStudent.branch}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedStudent.year} • {selectedStudent.semester} Semester
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedStudent(null)}
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              searchTerm && (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <Card 
                        key={student.id} 
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{student.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {student.rollNo} • {student.branch}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No students found matching your search.
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Bill Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Bill Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {billCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter bill description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Bill ID (Auto-generated)</Label>
                <Input
                  value={selectedStudent && formData.category ? generateBillId() : ''}
                  disabled
                  placeholder="Will be generated automatically"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes or instructions..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* Preview */}
          {selectedStudent && formData.category && formData.amount && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Bill Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student:</span>
                    <span>{selectedStudent.name} ({selectedStudent.rollNo})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{billCategories.find(c => c.id === formData.category)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">₹{formData.amount}</span>
                  </div>
                  {formData.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{new Date(formData.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedStudent || !formData.category || !formData.amount || !formData.dueDate}
          >
            Create Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}