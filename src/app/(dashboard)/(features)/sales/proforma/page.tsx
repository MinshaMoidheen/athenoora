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
  DollarSign
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mockProformaData = [
  { id: 1, date: '06/10/2025', proformaNo: 'PI-001', partyName: 'ABC Company', status: 'Pending', amount: 2500, validUntil: '16/10/2025' },
  { id: 2, date: '05/10/2025', proformaNo: 'PI-002', partyName: 'XYZ Corp', status: 'Accepted', amount: 1800, validUntil: '15/10/2025' },
  { id: 3, date: '04/10/2025', proformaNo: 'PI-003', partyName: 'Tech Solutions', status: 'Rejected', amount: 3200, validUntil: '14/10/2025' }
]

export default function ProformaPage() {
  const router = useRouter()
  const [hasProforma, setHasProforma] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const totalCount = mockProformaData.length
  const totalAmount = mockProformaData.reduce((sum, inv) => sum + inv.amount, 0)
  const pending = mockProformaData.filter(inv => inv.status === 'Pending').length
  const accepted = mockProformaData.filter(inv => inv.status === 'Accepted').length

  const filtered = mockProformaData.filter(inv =>
    inv.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.proformaNo.includes(searchTerm)
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
      case 'Accepted':
        return <Badge className="bg-green-100 text-green-800 border-0">Accepted</Badge>
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 border-0">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">{status}</Badge>
    }
  }

  const handleView = (id: number) => router.push(`/sales/proforma/detail-proforma/${id}`)
  const handleEdit = (id: number) => router.push(`/sales/proforma/edit-proforma/${id}`)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold tracking-tight">Proforma Invoices</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setHasProforma(!hasProforma)} variant="outline" size="sm">
            {hasProforma ? 'Show Empty State' : 'Show With Data'}
          </Button>
          <Button onClick={() => router.push('/sales/proforma/add-proforma')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Proforma
          </Button>
        </div>
      </div>

      {!hasProforma ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proforma invoices created yet</h3>
          <p className="text-gray-500 mb-6">Create your first proforma invoice to get started.</p>
          <Button onClick={() => router.push('/sales/proforma/add-proforma')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Proforma
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Proformas</p>
                    <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">{pending}</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Accepted</p>
                    <p className="text-2xl font-bold text-green-900">{accepted}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Proformas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 ps-6 pe-4 pb-4 pt-2">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search proforma invoices..."
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

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Date</TableHead>
                        <TableHead className="font-semibold text-gray-900">Proforma No</TableHead>
                        <TableHead className="font-semibold text-gray-900">Party Name</TableHead>
                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900">Valid Until</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{row.date}</TableCell>
                          <TableCell className="text-gray-700">{row.proformaNo}</TableCell>
                          <TableCell className="text-gray-700">{row.partyName}</TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                          <TableCell className="text-gray-700">{row.validUntil}</TableCell>
                          <TableCell className="font-medium text-gray-900 text-right">₹ {row.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => console.log('share', row.id)}
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
                                  <DropdownMenuItem onClick={() => handleView(row.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(row.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Proforma
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => console.log('delete', row.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Proforma
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


