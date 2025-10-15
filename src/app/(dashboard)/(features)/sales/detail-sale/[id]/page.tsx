'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Edit,
  Share2,
  Download,
  Printer,
  MoreHorizontal
} from 'lucide-react'

interface SaleDetail {
  id: string
  invoiceNumber: string
  date: string
  customerName: string
  phoneNo: string
  stateOfSupply: string
  paymentType: 'Credit' | 'Cash'
  totalAmount: number
  items: Array<{
    id: number
    item: string
    qty: number
    unit: string
    price: number
    discount: number
    gst: number
    amount: number
  }>
  description?: string
  roundOff: number
}

export default function DetailSalePage() {
  const params = useParams()
  const router = useRouter()
  const saleId = params.id

  const [saleDetail, setSaleDetail] = useState<SaleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Load sale detail on component mount
  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockSaleDetail: SaleDetail = {
      id: saleId as string,
      invoiceNumber: 'INV-001',
      date: '2025-10-06',
      customerName: 'John Doe',
      phoneNo: '9876543210',
      stateOfSupply: 'Same State',
      paymentType: 'Credit',
      totalAmount: 1500.00,
      items: [
        {
          id: 1,
          item: 'Product A',
          qty: 2,
          unit: 'PCS',
          price: 500,
          discount: 10,
          gst: 18,
          amount: 1062.00
        },
        {
          id: 2,
          item: 'Product B',
          qty: 1,
          unit: 'KG',
          price: 300,
          discount: 5,
          gst: 12,
          amount: 319.20
        }
      ],
      description: 'Thank you for your business!',
      roundOff: 0
    }
    
    setSaleDetail(mockSaleDetail)
    setLoading(false)
  }, [saleId])

  const handleEdit = () => {
    router.push(`/sales/edit-sale/${saleId}`)
  }

  const handleBack = () => {
    router.push('/sales')
  }

  const calculateSubtotal = () => {
    if (!saleDetail) return 0
    return saleDetail.items.reduce((sum, item) => {
      const subtotal = item.qty * item.price
      const discountAmount = subtotal * (item.discount / 100)
      return sum + (subtotal - discountAmount)
    }, 0)
  }

  const calculateTotalGST = () => {
    if (!saleDetail) return 0
    return saleDetail.items.reduce((sum, item) => {
      const subtotal = item.qty * item.price
      const discountAmount = subtotal * (item.discount / 100)
      const afterDiscount = subtotal - discountAmount
      return sum + (afterDiscount * (item.gst / 100))
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sale details...</p>
        </div>
      </div>
    )
  }

  if (!saleDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sale Not Found</h2>
          <p className="text-gray-600 mb-6">The sale you're looking for doesn't exist.</p>
          <Button onClick={handleBack}>Back to Sales</Button>
        </div>
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const totalGST = calculateTotalGST()
  const finalTotal = subtotal + totalGST + saleDetail.roundOff

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Sale Details #{saleDetail.invoiceNumber}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Sale Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{saleDetail.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{saleDetail.phoneNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State of Supply</p>
                <p className="font-medium">{saleDetail.stateOfSupply}</p>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <p className="font-medium">{saleDetail.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{saleDetail.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Type</p>
                <Badge className={saleDetail.paymentType === 'Credit' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                  {saleDetail.paymentType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="font-medium">{saleDetail.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-lg">₹{finalTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {saleDetail.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.item}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.qty}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.discount}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.gst}%</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={7} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Subtotal:</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">GST:</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{totalGST.toFixed(2)}</td>
                  </tr>
                  {saleDetail.roundOff !== 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Round Off:</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{saleDetail.roundOff.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="border-t">
                    <td colSpan={7} className="px-4 py-3 text-lg font-bold text-gray-900 text-right">Total:</td>
                    <td className="px-4 py-3 text-lg font-bold text-gray-900">₹{finalTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {saleDetail.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{saleDetail.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
