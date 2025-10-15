'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Search,
  FileText,
  Image,
  Paperclip
} from 'lucide-react'

interface InvoiceItem {
  id: number
  item: string
  qty: string
  unit: string
  price: string
  discount: string
  gst: string
  amount: string
}

export default function EditSalePage() {
  const params = useParams()
  const router = useRouter()
  const saleId = params.id

  const [creditMode, setCreditMode] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceDate, setInvoiceDate] = useState('')
  const [stateOfSupply, setStateOfSupply] = useState('')
  const [roundOff, setRoundOff] = useState(true)
  const [roundOffValue, setRoundOffValue] = useState('0')
  const [total, setTotal] = useState('0')
  
  // Additional options state
  const [showDescription, setShowDescription] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, item: '', qty: '', unit: 'NONE', price: '', discount: '', gst: 'Select', amount: '' }
  ])

  // Load sale data on component mount
  useEffect(() => {
    // Mock data - in real app, fetch from API
    setCustomerName('John Doe')
    setPhoneNo('9876543210')
    setInvoiceNumber('INV-001')
    setInvoiceDate('2025-10-06')
    setStateOfSupply('same')
    setTotal('1500.00')
    
    setItems([
      { id: 1, item: 'Product A', qty: '2', unit: 'PCS', price: '500', discount: '10', gst: '18', amount: '1062.00' },
      { id: 2, item: 'Product B', qty: '1', unit: 'KG', price: '300', discount: '5', gst: '12', amount: '319.20' }
    ])
  }, [saleId])

  const addNewRow = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1
    setItems([...items, {
      id: newId,
      item: '',
      qty: '',
      unit: 'NONE',
      price: '',
      discount: '',
      gst: 'Select',
      amount: ''
    }])
  }

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof InvoiceItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const calculateAmount = (item: InvoiceItem) => {
    const qty = parseFloat(item.qty) || 0
    const price = parseFloat(item.price) || 0
    const discount = parseFloat(item.discount) || 0
    const gst = parseFloat(item.gst) || 0
    
    const subtotal = qty * price
    const discountAmount = subtotal * (discount / 100)
    const afterDiscount = subtotal - discountAmount
    const gstAmount = afterDiscount * (gst / 100)
    const amount = afterDiscount + gstAmount
    
    return amount.toFixed(2)
  }

  const calculateTotals = () => {
    const totalQty = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(calculateAmount(item)), 0)
    
    return {
      totalQty: totalQty.toFixed(0),
      totalAmount: totalAmount.toFixed(2)
    }
  }

  const totals = calculateTotals()

  const handleSave = () => {
    // Save logic here
    console.log('Saving sale:', { customerName, items, totals })
    router.push('/sales')
  }

  const handleCancel = () => {
    router.push('/sales')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Edit Sale #{saleId}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Sale</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Credit</span>
              <button
                onClick={() => setCreditMode(!creditMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  creditMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    creditMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm">Cash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Customer and Invoice Details */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Customer/Party Details</h3>
                <div>
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    Search by Name/Phone *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Search by name or phone"
                      className="pr-8"
                    />
                    <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phoneNo" className="text-sm font-medium">Phone No.</Label>
                  <Input
                    id="phoneNo"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Invoice Number</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Enter invoice number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Invoice Date</Label>
                    <Input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">State of supply</Label>
                  <Select value={stateOfSupply} onValueChange={setStateOfSupply}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same">Same State</SelectItem>
                      <SelectItem value="different">Different State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITEM</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE/UNIT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.item}
                          onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                          placeholder="Enter item name"
                          className="border-0 focus:ring-0 p-0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                          placeholder="0"
                          className="border-0 focus:ring-0 p-0 w-16"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                          <SelectTrigger className="border-0 focus:ring-0 p-0 h-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">NONE</SelectItem>
                            <SelectItem value="PCS">PCS</SelectItem>
                            <SelectItem value="KG">KG</SelectItem>
                            <SelectItem value="LTR">LTR</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          placeholder="0.00"
                          className="border-0 focus:ring-0 p-0 w-20"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                          placeholder="0"
                          className="border-0 focus:ring-0 p-0 w-16 text-xs"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Select value={item.gst} onValueChange={(value) => updateItem(item.id, 'gst', value)}>
                          <SelectTrigger className="border-0 focus:ring-0 p-0 h-auto text-xs w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Select">Select</SelectItem>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={calculateAmount(item)}
                          readOnly
                          className="border-0 focus:ring-0 p-0 w-20 bg-gray-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRow(item.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">TOTAL</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{totals.totalQty}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{totals.totalAmount}</td>
                    <td className="px-4 py-3">
                      <Button
                        onClick={addNewRow}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        ADD ROW
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="flex justify-between items-start">
          {/* Additional Options */}
          <div className="flex flex-col space-y-3">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => setShowDescription(!showDescription)}
              >
                <FileText className="h-4 w-4" />
                <span>ADD DESCRIPTION</span>
              </Button>
              {showDescription && (
                <Textarea
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Enter description..."
                  className="w-64"
                  rows={3}
                />
              )}
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="roundOff"
                checked={roundOff}
                onCheckedChange={(checked) => setRoundOff(checked === true)}
              />
              <Label htmlFor="roundOff" className="text-sm">Round Off</Label>
              <Input
                value={roundOffValue}
                onChange={(e) => setRoundOffValue(e.target.value)}
                className="w-16 h-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Total</Label>
              <Input
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-24 h-8"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
