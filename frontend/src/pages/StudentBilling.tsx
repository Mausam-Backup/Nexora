import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenericPageSkeleton } from "@/components/ui/page-skeleton"
import { Download, CreditCard, Receipt, DollarSign, Calendar, FileText, Clock, Hash, Bell, AlertTriangle, CheckCircle, Printer } from "lucide-react"
import { usePageLoading } from "@/hooks/use-page-loading"
import { useIsMobile } from "@/hooks/use-mobile"
import { SEO } from "@/components/SEO"
import { BillingStats } from "@/components/billing/BillingStats"
import { BillingFilters } from "@/components/billing/BillingFilters"
import { BillingTable, type BillData } from "@/components/billing/BillingTable"
import { BillingPagination } from "@/components/billing/BillingPagination"
import { useToast } from "@/hooks/use-toast"
import { useERPData } from "@/hooks/useERPData"
import { useAuth } from "@/contexts/AuthContext"
import { exportToCSV, generatePrintableReport } from "@/utils/exportUtils"

export default function StudentBilling() {
  const isLoading = usePageLoading()
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const { user } = useAuth()
  const { getStudent, students, markBillPaid } = useERPData()
  const student = getStudent(user?.id || '20CS001') || students[0]

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

  // Derive bills live from unified ERP student
  const bills: BillData[] = useMemo(() => {
    return student.fees.bills.map(b => ({
      id: b.id,
      studentId: student.rollNumber,
      description: b.title,
      amount: b.amount,
      dueDate: b.dueDate,
      createdAt: `${b.dueDate}T00:00:00Z`,
      status: b.status,
      paymentDate: b.paidAt,
      receiptNo: b.receiptNo
    }))
  }, [student])

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    let filtered = [...bills]

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
  }, [bills, filters])

  // Pagination
  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredBills.slice(startIndex, startIndex + pageSize)
  }, [filteredBills, currentPage, pageSize])

  const totalPages = Math.ceil(filteredBills.length / pageSize)

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
    const paidBills = bills.filter(bill => bill.status === 'paid').length
    const pendingBills = bills.filter(bill => bill.status === 'pending').length
    const overdueBills = bills.filter(bill => bill.status === 'overdue').length
    
    return {
      totalAmount,
      totalBills: bills.length,
      paidBills,
      pendingBills,
      overdueBills
    }
  }, [bills])

  const handlePay = (bill: BillData) => {
    markBillPaid(student.id, bill.id)
    toast({
      title: "Payment Received & Reconciled",
      description: `₹${bill.amount.toLocaleString('en-IN')} paid for ${bill.description}. Clearance updated in real-time!`
    })
    // Immediately generate official university fee receipt
    setTimeout(() => {
      handleDownloadReceipt({
        ...bill,
        status: 'paid',
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNo: bill.receiptNo || `RCP-${Date.now().toString().slice(-6)}`
      })
    }, 350)
  }

  const handleMakePayment = () => {
    const unpaid = bills.find(b => b.status === 'overdue') || bills.find(b => b.status === 'pending')
    if (unpaid) {
      handlePay(unpaid)
    } else {
      toast({
        title: "All Dues Paid",
        description: "You have no outstanding fee bills."
      })
    }
  }

  const handleViewDetails = (bill: BillData) => {
    toast({
      title: `Bill ${bill.id}`,
      description: `${bill.description} — ₹${bill.amount.toLocaleString('en-IN')} (${bill.status.toUpperCase()})`
    })
  }

  const handleDownloadReceipt = (bill: BillData) => {
    generatePrintableReport({
      title: "Official Institutional Fee Receipt",
      subtitle: "Office of the Comptroller of Accounts • Nexora Unified Ledger",
      studentInfo: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester
      },
      statusBadge: {
        text: "PAYMENT CONFIRMED",
        variant: "success"
      },
      columns: ["Receipt No", "Description", "Due Date", "Paid Date", "Amount (INR)", "Status"],
      rows: [
        [
          bill.receiptNo || `RCP-${bill.id.slice(-6)}`,
          bill.description,
          bill.dueDate,
          bill.paymentDate || new Date().toISOString().split('T')[0],
          `₹${bill.amount.toLocaleString('en-IN')}`,
          "PAID"
        ]
      ],
      summaryStats: [
        { label: "Amount Paid", value: `₹${bill.amount.toLocaleString('en-IN')}` },
        { label: "Remaining Balance Due", value: `₹${student.fees.outstanding.toLocaleString('en-IN')}` },
        { label: "Institutional Clearance", value: student.fees.outstanding === 0 ? "Complete Clearance" : "Pending Balance" }
      ]
    })
  }

  const handleExport = () => {
    const headers = ["Bill ID", "Description", "Amount (INR)", "Due Date", "Status", "Payment Date", "Receipt No"]
    const rows = bills.map(b => [
      b.id,
      b.description,
      b.amount,
      b.dueDate,
      b.status.toUpperCase(),
      b.paymentDate || 'N/A',
      b.receiptNo || 'N/A'
    ])
    exportToCSV(`${student.rollNumber}_Fee_Billing_Ledger`, headers, rows)
    toast({
      title: "Export Completed",
      description: `Downloaded billing ledger with ${bills.length} bills as CSV`
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  if (isLoading) return <GenericPageSkeleton />

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <SEO title="Student Billing & Payments" description="View your fees and payment history" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground text-sm hidden sm:block">
            {student.name} • {student.rollNumber} • Semester {student.semester}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button onClick={handleMakePayment} className="flex-1 sm:flex-initial bg-primary">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Pay Outstanding Dues</span>
          </Button>
        </div>
      </div>

      {/* Cross-Module Financial Hold Alert */}
      {!student.clearances.feeClearance ? (
        <Card className="border-destructive/40 bg-destructive/10 text-destructive">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-destructive" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">FINANCIAL HOLD ACTIVE: ₹{student.fees.outstanding.toLocaleString('en-IN')} OVERDUE</p>
              <p className="text-xs">
                You have overdue fee bills. Institutional policy requires fee clearance prior to semester admit card generation and grade card release. Click "Pay Outstanding Dues" or click "Pay Bill" in the table below to settle this balance immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
          <CardContent className="p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Financial Status: <strong>NO DUES PENDING (Full Clearance)</strong></span>
            </div>
            <Badge variant="outline" className="border-emerald-500 text-emerald-600">Accounts Verified</Badge>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
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
              <CardTitle className="text-lg">Fee Bills & Payments</CardTitle>
              <CardDescription className="text-sm">
                Your academic fees and payment history
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredBills.length} of {bills.length} bills
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <BillingTable
            bills={paginatedBills}
            onViewDetails={handleViewDetails}
            onDownloadReceipt={handleDownloadReceipt}
            onPay={handlePay}
            userType="student"
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
    </div>
  )
}