'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings, 
  Printer, 
  Download, 
  MessageSquare, 
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react'

export default function InvoiceSuccessPage() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const [companyDetails, setCompanyDetails] = useState({
    name: 'My Company',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    logo: null as File | null
  })
  const [signature, setSignature] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: '01',
    date: '2025-10-06',
    customerName: 'Sample Customer',
    items: [
      {
        id: 1,
        name: 'Sample Item',
        hsn: '-',
        qty: 10,
        price: 100,
        amount: 1000
      }
    ],
    subtotal: 1000,
    total: 1000,
    received: 0,
    balance: 1000
  })

  // Load invoice data from sessionStorage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('invoiceData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setInvoiceData({
          invoiceNo: '01',
          date: new Date().toISOString().split('T')[0],
          customerName: data.customerName,
          items: data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            hsn: '-',
            qty: item.qty,
            price: item.price,
            amount: item.amount
          })),
          subtotal: data.subtotal,
          total: data.totalAmount,
          received: data.receivedAmount,
          balance: data.balanceAmount
        })
      } catch (error) {
        console.error('Error parsing invoice data:', error)
      }
    }
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCompanyDetails({...companyDetails, logo: file})
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSignature(file)
      const reader = new FileReader()
      reader.onload = (e) => setSignaturePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const saveCompanyDetails = () => {
    setIsCompanyModalOpen(false)
  }

  const saveSignature = () => {
    setIsSignatureModalOpen(false)
  }

  // Download PDF function
  const downloadPDF = async () => {
    if (!invoiceRef.current) return

    setIsGeneratingPDF(true)
    
    try {
      // Dynamically import the required libraries
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      // Get the invoice element
      const element = invoiceRef.current
      
      // Convert to canvas
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff'
      })

      // Get canvas dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      // Add image to PDF
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Generate filename
      const filename = `Invoice_${invoiceData.invoiceNo}_${invoiceData.date}.pdf`
      
      // Download the PDF
      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Print function
  const printInvoice = () => {
    if (!invoiceRef.current) return
    const content = invoiceRef.current.innerHTML
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return
    printWindow.document.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNo}</title>
          <style>
            /* Basic print styles to preserve layout */
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 0; padding: 24px; }
            .grid { display: grid; }
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

  const formatAmountInWords = (amount: number) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    
    if (amount === 0) return 'Zero Rupees only'
    if (amount === 1000) return 'One Thousand Rupees only'
    
    return `${amount.toLocaleString()} Rupees only`
  }

  return (
    <div className="space-y-6">
      {/* Invoice Card */}
      <Card ref={invoiceRef} className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          {/* Company Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{companyDetails.name}</h2>
              <p className="text-gray-600">Phone no: {companyDetails.phone}</p>
              {companyDetails.email && (
                <p className="text-gray-600">Email: {companyDetails.email}</p>
              )}
              {companyDetails.address && (
                <p className="text-gray-600">{companyDetails.address}</p>
              )}
              {companyDetails.gstin && (
                <p className="text-gray-600">GSTIN: {companyDetails.gstin}</p>
              )}
            </div>
            <div 
              className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => setIsCompanyModalOpen(true)}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-500">Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-600">TAX INVOICE</h1>
          </div>

          {/* Bill To and Invoice Details */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To</h3>
              <p className="text-gray-600">{invoiceData.customerName}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-900 mb-2">Invoice Details</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Invoice No: {invoiceData.invoiceNo}</p>
                <p className="text-sm text-gray-600">Date: {invoiceData.date}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="bg-purple-600 text-white p-3 rounded-t-lg">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium">
                <div>#</div>
                <div>Item name</div>
                <div>HSN/SAC</div>
                <div>Quantity</div>
                <div>Price/Unit</div>
                <div>Amount</div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-b-lg">
              {invoiceData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-6 gap-4 p-3 border-b border-gray-100 last:border-b-0">
                  <div className="text-sm">{index + 1}</div>
                  <div className="text-sm">{item.name}</div>
                  <div className="text-sm">{item.hsn}</div>
                  <div className="text-sm">{item.qty}</div>
                  <div className="text-sm">₹ {item.price.toFixed(2)}</div>
                  <div className="text-sm font-medium">₹ {item.amount.toFixed(2)}</div>
                </div>
              ))}
              {/* Total Row */}
              <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 font-semibold">
                <div className="col-span-3">Total</div>
                <div className="text-sm">{invoiceData.items.reduce((sum, item) => sum + item.qty, 0)}</div>
                <div></div>
                <div className="text-sm">₹ {invoiceData.subtotal.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Amount Summary and Words */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Invoice Amount In Words</h4>
              <p className="text-sm text-gray-600">{formatAmountInWords(invoiceData.total)}</p>
            </div>
            <div className="text-right space-y-2">
              <div className="flex justify-between w-48">
                <span className="text-sm text-gray-600">Sub Total:</span>
                <span className="text-sm font-medium">₹ {invoiceData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48 bg-purple-100 p-2 rounded">
                <span className="text-sm font-semibold text-purple-800">Total:</span>
                <span className="text-sm font-bold text-purple-800">₹ {invoiceData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48">
                <span className="text-sm text-gray-600">Received:</span>
                <span className="text-sm font-medium">₹ {invoiceData.received.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-sm font-medium">₹ {invoiceData.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mb-6">
            <p className="text-gray-600">Thanks for doing business with us!</p>
          </div>

          {/* Terms and Signature */}
          <div className="flex justify-between items-end">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
              <p className="text-sm text-gray-600">Payment due within 30 days</p>
            </div>
            <div 
              className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => setIsSignatureModalOpen(true)}
            >
              {signaturePreview ? (
                <img src={signaturePreview} alt="Signature" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Authorized Signatory</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
          onClick={() => setIsCompanyModalOpen(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Edit Company Details
        </Button>
        <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50" onClick={printInvoice}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button 
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          variant="outline" 
          className="border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </Button>
        <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
          <MessageSquare className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </Button>
      </div>

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Enter your Business details to be printed on your invoice header</DialogTitle>
          </VisuallyHidden>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyDetails.name}
                onChange={(e) => setCompanyDetails({...companyDetails, name: e.target.value})}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={companyDetails.phone}
                onChange={(e) => setCompanyDetails({...companyDetails, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                value={companyDetails.email}
                onChange={(e) => setCompanyDetails({...companyDetails, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={companyDetails.address}
                onChange={(e) => setCompanyDetails({...companyDetails, address: e.target.value})}
                placeholder="Enter address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN No.</Label>
              <Input
                id="gstin"
                value={companyDetails.gstin}
                onChange={(e) => setCompanyDetails({...companyDetails, gstin: e.target.value})}
                placeholder="Enter GSTIN"
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <ImageIcon className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Upload Company Logo</p>
                <p className="text-sm text-gray-500">Click to upload your company logo</p>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsCompanyModalOpen(false)}>
                CANCEL
              </Button>
              <Button 
                onClick={saveCompanyDetails}
                className="bg-purple-600 hover:bg-purple-700"
              >
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signature Upload Modal */}
      <Dialog open={isSignatureModalOpen} onOpenChange={setIsSignatureModalOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Upload Authority Signature
              <Button variant="ghost" size="sm" onClick={() => setIsSignatureModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => document.getElementById('signature-upload')?.click()}
            >
              <Upload className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Upload Authority Signature</p>
              <p className="text-sm text-gray-500">Click to upload signature file</p>
              <input
                id="signature-upload"
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="hidden"
              />
            </div>

            {signaturePreview && (
              <div className="text-center">
                <img src={signaturePreview} alt="Signature Preview" className="max-w-full h-20 mx-auto border rounded" />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsSignatureModalOpen(false)}>
                CANCEL
              </Button>
              <Button 
                onClick={saveSignature}
                className="bg-purple-600 hover:bg-purple-700"
              >
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
