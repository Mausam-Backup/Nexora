import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, UserPlus, GraduationCap, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { BillingStats } from "./BillingStats"
import { BillingFilters } from "./BillingFilters"
import { BillingTable, type BillData } from "./BillingTable"
import { BillingPagination } from "./BillingPagination"
import { CreateBillDialog } from "./CreateBillDialog"
import { BulkBillDialog } from "./BulkBillDialog"
import { useToast } from "@/hooks/use-toast"
import { useERPData } from "@/hooks/useERPData"
import { exportToCSV, generatePrintableReport } from "@/utils/exportUtils"

export function StudentBillingSection() {
  const { toast } = useToast()
  const { students } = useERPData()

  // Derive student bills dynamically from unified ERP students
  const studentBills: BillData[] = useMemo(() => {
    return students.flatMap(student =>
      student.fees.bills.map(b => ({
        id: b.id,
        studentId: `${student.rollNumber} - ${student.name}`,
        description: b.title,
        amount: b.amount,
        dueDate: b.dueDate,
        createdAt: `${b.dueDate}T00:00:00Z`,
        status: b.status,
        paymentDate: b.paidAt,
        receiptNo: b.receiptNo
      }))
    )
  }, [students])
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    dateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [createBillOpen, setCreateBillOpen] = useState(false)
  const [bulkBillOpen, setBulkBillOpen] = useState(false)

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    let filtered = [...studentBills]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(bill =>
        bill.id.toLowerCase().includes(searchLower) ||
        bill.description.toLowerCase().includes(searchLower) ||
        bill.studentId?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(bill => bill.status === filters.status)
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date()
      const filterDate = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setDate(now.getDate())
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any
      
      switch (filters.sortBy) {
        case 'amount':
          aVal = a.amount
          bVal = b.amount
          break
        case 'dueDate':
          aVal = new Date(a.dueDate)
          bVal = new Date(b.dueDate)
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
      }

      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [filters])

  // Pagination
  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredBills.slice(startIndex, startIndex + pageSize)
  }, [filteredBills, currentPage, pageSize])

  const totalPages = Math.ceil(filteredBills.length / pageSize)

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = studentBills.reduce((sum, bill) => sum + bill.amount, 0)
    const paidBills = studentBills.filter(bill => bill.status === 'paid').length
    const pendingBills = studentBills.filter(bill => bill.status === 'pending').length
    const overdueBills = studentBills.filter(bill => bill.status === 'overdue').length
    
    return {
      totalAmount,
      totalBills: studentBills.length,
      paidBills,
      pendingBills,
      overdueBills
    }
  }, [])

  const handleViewDetails = (bill: BillData) => {
    toast({
      title: "Bill Details",
      description: `Viewing details for ${bill.id}`
    })
  }

  const handleEdit = (bill: BillData) => {
    toast({
      title: "Edit Bill",
      description: `Editing ${bill.id}`
    })
  }

  const handleDownloadReceipt = (bill: BillData) => {
    generatePrintableReport({
      title: "Official Institutional Fee Receipt",
      subtitle: "Office of the Dean of Finance & Accounts • Institutional Ledger Copy",
      statusBadge: {
        text: "PAYMENT VERIFIED",
        variant: "success"
      },
      columns: ["Receipt No", "Student Details", "Description", "Amount (INR)", "Due Date", "Paid Date", "Status"],
      rows: [
        [
          bill.receiptNo || `RCP-${bill.id.slice(-6)}`,
          bill.studentId || "Student",
          bill.description,
          `₹${bill.amount.toLocaleString('en-IN')}`,
          bill.dueDate,
          bill.paymentDate || new Date().toISOString().split('T')[0],
          "PAID"
        ]
      ]
    })
  }

  const handleExport = () => {
    const headers = ["Bill ID", "Student Details", "Description", "Amount (INR)", "Due Date", "Status", "Payment Date", "Receipt No"]
    const rows = studentBills.map(b => [
      b.id,
      b.studentId || '',
      b.description,
      b.amount,
      b.dueDate,
      b.status.toUpperCase(),
      b.paymentDate || 'N/A',
      b.receiptNo || 'N/A'
    ])
    exportToCSV("Institutional_Student_Fee_Ledger", headers, rows)
    toast({
      title: "Export Completed",
      description: "Downloaded institutional student fee ledger as CSV"
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Student Fee Management</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreateBillOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Bill
          </Button>
          <Button onClick={() => setBulkBillOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Bulk Create
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Across all students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBills}</div>
            <p className="text-xs text-muted-foreground">With billing records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBills}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.paidBills / stats.totalBills) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Component */}
      <BillingStats
        totalAmount={stats.totalAmount}
        totalBills={stats.totalBills}
        paidBills={stats.paidBills}
        pendingBills={stats.pendingBills}
        overdueBills={stats.overdueBills}
        userType="student"
      />

      {/* Filters */}
      <BillingFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
      />

      {/* Bills Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Student Fee Bills</CardTitle>
              <CardDescription className="text-sm">
                Comprehensive student billing and fee management
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredBills.length} of {studentBills.length} bills
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <BillingTable
            bills={paginatedBills}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDownloadReceipt={handleDownloadReceipt}
            userType="admin"
            showActions={true}
          />
          
          {filteredBills.length > pageSize && (
            <div className="mt-6 border-t pt-4">
              <BillingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredBills.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateBillDialog open={createBillOpen} onOpenChange={setCreateBillOpen} />
      <BulkBillDialog open={bulkBillOpen} onOpenChange={setBulkBillOpen} />
    </div>
  )
}