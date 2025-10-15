'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Calendar,
  Download,
  Printer,
  MoreHorizontal,
  Share2,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  DollarSign,
  CreditCard,
  Banknote
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mockPaymentData = [
  {
    id: 1,
    date: '06/10/2025',
    receiptNo: 'RCP-001',
    partyName: 'ABC Company',
    paymentType: 'Cash',
    totalPayment: 5000,
    receivedAmount: 5000,
    status: 'Completed',
    referenceNo: 'REF-001'
  },
  {
    id: 2,
    date: '05/10/2025',
    receiptNo: 'RCP-002',
    partyName: 'XYZ Corp',
    paymentType: 'Bank Transfer',
    totalPayment: 3200,
    receivedAmount: 3200,
    status: 'Completed',
    referenceNo: 'REF-002'
  },
  {
    id: 3,
    date: '04/10/2025',
    receiptNo: 'RCP-003',
    partyName: 'Tech Solutions',
    paymentType: 'Cheque',
    totalPayment: 1800,
    receivedAmount: 0,
    status: 'Pending',
    referenceNo: 'REF-003'
  }
]

export default function PaymentInPage() {
  const router = useRouter()
  const [hasPayments, setHasPayments] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const totalCount = mockPaymentData.length
  const totalAmount = mockPaymentData.reduce((sum, payment) => sum + payment.totalPayment, 0)
  const receivedAmount = mockPaymentData.reduce((sum, payment) => sum + payment.receivedAmount, 0)
  const pendingAmount = totalAmount - receivedAmount

  const filtered = mockPaymentData.filter(payment =>
    payment.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.receiptNo.includes(searchTerm)
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 border-0">Completed</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800 border-0">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">{status}</Badge>
    }
  }

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'Cash':
        return <Banknote className="h-4 w-4" />
      case 'Bank Transfer':
      case 'Cheque':
        return <CreditCard className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const handleView = (id: number) => router.push(`/sales/payment-in/detail-payment/${id}`)
  const handleEdit = (id: number) => router.push(`/sales/payment-in/edit-payment/${id}`)
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      console.log('Deleting payment:', id)
    }
  }
  const handleShare = (id: number) => console.log('Sharing payment:', id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold tracking-tight">Payment-In</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setHasPayments(!hasPayments)}
            variant="outline"
            size="sm"
          >
            {hasPayments ? 'Show Empty State' : 'Show With Data'}
          </Button>
          <Button 
            onClick={() => router.push('/sales/payment-in/add-payment')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </div>

      {!hasPayments ? (
        // Empty State
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments recorded yet</h3>
          <p className="text-gray-500 mb-6">Record your first payment to get started.</p>
          <Button 
            onClick={() => router.push('/sales/payment-in/add-payment')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Record Your First Payment
          </Button>
        </div>
      ) : (
        // Data State
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>Filter by:</Label>
              <Button variant="outline" size="sm">Custom</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">01/10/2025 To 31/10/2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">All Firms</Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Payments</p>
                    <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Received</p>
                    <p className="text-2xl font-bold text-green-900">₹{receivedAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">₹{pendingAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Total Value</p>
                    <p className="text-2xl font-bold text-purple-900">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Payments</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 ps-6 pe-4 pb-4 pt-2">
                {/* Search and Filter Bar */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </Button>
                </div>

                {/* Payments Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Date</TableHead>
                        <TableHead className="font-semibold text-gray-900">Receipt No</TableHead>
                        <TableHead className="font-semibold text-gray-900">Party Name</TableHead>
                        <TableHead className="font-semibold text-gray-900">Payment Type</TableHead>
                        <TableHead className="font-semibold text-gray-900">Total Payment</TableHead>
                        <TableHead className="font-semibold text-gray-900">Received</TableHead>
                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{payment.date}</TableCell>
                          <TableCell className="text-gray-700">{payment.receiptNo}</TableCell>
                          <TableCell className="text-gray-700">{payment.partyName}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getPaymentTypeIcon(payment.paymentType)}
                              <span className="text-sm">{payment.paymentType}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">₹{payment.totalPayment.toLocaleString()}</TableCell>
                          <TableCell className="font-medium text-gray-900">₹{payment.receivedAmount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleShare(payment.id)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(payment.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(payment.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(payment.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Payment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
