'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Share2, Download, Printer } from 'lucide-react'

interface ProformaDetailItem {
  id: number
  item: string
  qty: number
  unit: string
  price: number
  discount: number
  gst: number
  amount: number
}

interface ProformaDetail {
  id: string
  proformaNumber: string
  date: string
  validUntil: string
  customerName: string
  stateOfSupply: string
  status: 'Pending' | 'Accepted' | 'Rejected'
  items: ProformaDetailItem[]
  roundOff: number
  description?: string
}

export default function DetailProformaPage() {
  const params = useParams()
  const router = useRouter()
  const detailRef = useRef<HTMLDivElement>(null)
  const id = params.id as string

  const [detail, setDetail] = useState<ProformaDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mock: ProformaDetail = {
      id,
      proformaNumber: 'PI-001',
      date: '2025-10-06',
      validUntil: '2025-10-16',
      customerName: 'ABC Company',
      stateOfSupply: 'Same State',
      status: 'Pending',
      items: [
        { id: 1, item: 'Product A', qty: 2, unit: 'PCS', price: 500, discount: 10, gst: 18, amount: 1062.00 },
        { id: 2, item: 'Product B', qty: 1, unit: 'KG', price: 300, discount: 5, gst: 12, amount: 319.20 }
      ],
      roundOff: 0,
      description: 'This proforma is valid for 10 days from the date of issue.'
    }
    setDetail(mock)
    setLoading(false)
  }, [id])

  const subtotal = detail?.items.reduce((sum, i) => sum + (i.qty * i.price * (1 - i.discount / 100)), 0) || 0
  const totalGST = detail?.items.reduce((sum, i) => {
    const base = i.qty * i.price * (1 - i.discount / 100)
    return sum + base * (i.gst / 100)
  }, 0) || 0
  const finalTotal = subtotal + totalGST + (detail?.roundOff || 0)

  const downloadPDF = async () => {
    if (!detailRef.current || !detail) return
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).default
    const canvas = await html2canvas(detailRef.current, { useCORS: true, allowTaint: true, background: '#ffffff' })
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
    pdf.save(`Proforma_${detail.proformaNumber}_${detail.date}.pdf`)
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
          <title>Proforma ${detail.proformaNumber}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 0; padding: 24px; }
            .grid { display: grid; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }
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

  if (loading || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proforma details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/sales/proforma')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Proforma Details #{detail.proformaNumber}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/sales/proforma/edit-proforma/${id}`)}>
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

      <div className="p-6 space-y-6" ref={detailRef}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{detail.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State of Supply</p>
                <p className="font-medium">{detail.stateOfSupply}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Proforma Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Ref Number</p>
                <p className="font-medium">{detail.proformaNumber}</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="font-medium">{detail.items.length}</p>
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
                  {detail.items.map((i, idx) => (
                    <tr key={i.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{i.item}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{i.qty}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{i.unit}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{i.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{i.discount}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{i.gst}%</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{i.amount.toFixed(2)}</td>
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
                  {detail.roundOff !== 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Round Off:</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{detail.roundOff.toFixed(2)}</td>
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

        {detail.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{detail.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


