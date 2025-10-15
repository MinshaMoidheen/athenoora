'use client'

import { useState, useEffect, useRef } from 'react'
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

interface EstimateDetail {
  id: string
  estimateNumber: string
  date: string
  validUntil: string
  customerName: string
  phoneNo: string
  stateOfSupply: string
  status: 'Pending' | 'Accepted' | 'Rejected'
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

export default function DetailEstimatePage() {
  const params = useParams()
  const router = useRouter()
  const estimateId = params.id
  const estimateRef = useRef<HTMLDivElement>(null)

  const [estimateDetail, setEstimateDetail] = useState<EstimateDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Load estimate detail on component mount
  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockEstimateDetail: EstimateDetail = {
      id: estimateId as string,
      estimateNumber: 'EST-001',
      date: '2025-10-06',
      validUntil: '2025-10-16',
      customerName: 'ABC Company',
      phoneNo: '9876543210',
      stateOfSupply: 'Same State',
      status: 'Pending',
      totalAmount: 2500.00,
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
      description: 'This estimate is valid for 10 days from the date of issue.',
      roundOff: 0
    }
    
    setEstimateDetail(mockEstimateDetail)
    setLoading(false)
  }, [estimateId])

  const handleEdit = () => {
    router.push(`/sales/estimates/edit-estimate/${estimateId}`)
  }

  const handleBack = () => {
    router.push('/sales/estimates')
  }

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

  const calculateSubtotal = () => {
    if (!estimateDetail) return 0
    return estimateDetail.items.reduce((sum, item) => {
      const subtotal = item.qty * item.price
      const discountAmount = subtotal * (item.discount / 100)
      return sum + (subtotal - discountAmount)
    }, 0)
  }

  const calculateTotalGST = () => {
    if (!estimateDetail) return 0
    return estimateDetail.items.reduce((sum, item) => {
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
          <p className="mt-4 text-gray-600">Loading estimate details...</p>
        </div>
      </div>
    )
  }

  if (!estimateDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estimate Not Found</h2>
          <p className="text-gray-600 mb-6">The estimate you're looking for doesn't exist.</p>
          <Button onClick={handleBack}>Back to Estimates</Button>
        </div>
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const totalGST = calculateTotalGST()
  const finalTotal = subtotal + totalGST + estimateDetail.roundOff

  const downloadPDF = async () => {
    if (!estimateRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      const canvas = await html2canvas(estimateRef.current, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff'
      })
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      const filename = `Estimate_${estimateDetail.estimateNumber}_${estimateDetail.date}.pdf`
      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const printEstimate = () => {
    if (!estimateRef.current) return
    const content = estimateRef.current.innerHTML
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return
    printWindow.document.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>Estimate ${estimateDetail.estimateNumber}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 0; padding: 24px; }
            .grid { display: grid; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div>${content}</div>
          <script>window.focus(); window.print(); window.close();<\/script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Estimate Details #{estimateDetail.estimateNumber}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => { /* share */ }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={printEstimate}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6" ref={estimateRef}>
        {/* Estimate Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{estimateDetail.customerName}</p>
              </div>
             
              <div>
                <p className="text-sm text-gray-500">State of Supply</p>
                <p className="font-medium">{estimateDetail.stateOfSupply}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estimate Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Estimate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Ref Number</p>
                <p className="font-medium">{estimateDetail.estimateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{estimateDetail.date}</p>
              </div>
             
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(estimateDetail.status)}
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
                <p className="font-medium">{estimateDetail.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-lg">₹{finalTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Remaining</p>
                <p className="font-medium text-orange-600">5 days</p>
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
                  {estimateDetail.items.map((item, index) => (
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
                  {estimateDetail.roundOff !== 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Round Off:</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{estimateDetail.roundOff.toFixed(2)}</td>
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
        {estimateDetail.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{estimateDetail.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center space-x-4">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // Convert to invoice logic
                  console.log('Converting to invoice')
                }}
              >
                Convert to Invoice
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Accept estimate logic
                  console.log('Accepting estimate')
                }}
              >
                Accept Estimate
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Reject estimate logic
                  console.log('Rejecting estimate')
                }}
              >
                Reject Estimate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
