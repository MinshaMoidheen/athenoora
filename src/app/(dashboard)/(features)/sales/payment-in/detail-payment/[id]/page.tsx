'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Share2, Download, Printer, Banknote, CreditCard, DollarSign } from 'lucide-react'

interface PaymentDetailItem {
  id: number
  type: string
  amount: number
}

interface PaymentDetail {
  id: string
  receiptNo: string
  date: string
  partyName: string
  referenceNo: string
  totalPayment: number
  receivedAmount: number
  status: 'Completed' | 'Pending' | 'Failed'
  paymentTypes: PaymentDetailItem[]
  description?: string
  image?: string
}

export default function DetailPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const detailRef = useRef<HTMLDivElement>(null)
  const id = params.id as string

  const [detail, setDetail] = useState<PaymentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mock: PaymentDetail = {
      id,
      receiptNo: 'RCP-001',
      date: '2025-10-06',
      partyName: 'ABC Company',
      referenceNo: 'REF-001',
      totalPayment: 5000,
      receivedAmount: 5000,
      status: 'Completed',
      paymentTypes: [
        { id: 1, type: 'Cash', amount: 3000 },
        { id: 2, type: 'Bank Transfer', amount: 2000 }
      ],
      description: 'Payment received for invoice #INV-001',
      image: 'payment-receipt.jpg'
    }
    setDetail(mock)
    setLoading(false)
  }, [id])

  const downloadPDF = async () => {
    if (!detailRef.current || !detail) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      const canvas = await html2canvas(detailRef.current, { 
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
      pdf.save(`Payment_${detail.receiptNo}_${detail.date}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const printDoc = () => {
    if (!detailRef.current || !detail) return
    const content = detailRef.current.innerHTML
    const w = window.open('', '_blank', 'width=800,height=600')
    if (!w) return
    w.document.open()
    w.document.write(`
      <html>
        <head>
          <title>Payment ${detail.receiptNo}</title>
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
    w.document.close()
  }

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

  if (loading || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/sales/payment-in')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Payment Details #{detail.receiptNo}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/sales/payment-in/edit-payment/${id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => {/* share */}}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={printDoc}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6" ref={detailRef}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Party Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Party Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Party Name</p>
                <p className="font-medium">{detail.partyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference No</p>
                <p className="font-medium">{detail.referenceNo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Receipt No</p>
                <p className="font-medium">{detail.receiptNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{detail.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(detail.status)}
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
                <p className="text-sm text-gray-500">Total Payment</p>
                <p className="font-medium text-lg">₹{detail.totalPayment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Received Amount</p>
                <p className="font-medium text-lg text-green-600">₹{detail.receivedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Methods</p>
                <p className="font-medium">{detail.paymentTypes.length} methods</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detail.paymentTypes.map((payment, index) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getPaymentTypeIcon(payment.type)}
                          <span className="text-sm font-medium text-gray-900">{payment.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t">
                    <td colSpan={2} className="px-4 py-3 text-lg font-bold text-gray-900 text-right">Total:</td>
                    <td className="px-4 py-3 text-lg font-bold text-gray-900">₹{detail.totalPayment.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {detail.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{detail.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Image */}
        {detail.image && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Receipt Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full max-w-md">
                <img
                  src={`/images/${detail.image}`}
                  alt="Payment Receipt"
                  className="w-full h-48 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
