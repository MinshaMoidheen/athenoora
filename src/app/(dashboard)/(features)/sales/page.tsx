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
  BarChart3, 
  FileSpreadsheet, 
  Printer, 
  MoreHorizontal,
  Share2,
  Calendar,
  Filter,
  Download,
  X,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Dummy sales data
const mockSalesData = [
  {
    id: 1,
    date: '06/10/2025',
    invoiceNo: '2',
    partyName: 'New',
    transaction: 'Sale',
    paymentType: 'Cash',
    amount: 100,
    balance: 100
  },
  {
    id: 2,
    date: '03/10/2025',
    invoiceNo: '1',
    partyName: 'Minsha',
    transaction: 'Sale',
    paymentType: 'Cash',
    amount: 1000,
    balance: 600
  }
]

export default function SalesPage() {
  const router = useRouter()
  const [hasSales, setHasSales] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [receivedAmount, setReceivedAmount] = useState('')
  const [items, setItems] = useState<Array<{
    id: number
    name: string
    qty: number
    price: number
    discount: number
    gst: number
    amount: number
  }>>([])
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    qty: 1,
    price: 0,
    discount: 0,
    gst: 0,
    description: ''
  })

  const totalSales = mockSalesData.reduce((sum, sale) => sum + sale.amount, 0)
  const totalReceived = mockSalesData.reduce((sum, sale) => sum + (sale.amount - sale.balance), 0)
  const totalBalance = totalSales - totalReceived

  const filteredSales = mockSalesData.filter(sale =>
    sale.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.invoiceNo.includes(searchTerm)
  )

  // Calculate totals for invoice
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const totalGST = items.reduce((sum, item) => sum + (item.amount * item.gst / 100), 0)
  const totalAmount = subtotal + totalGST
  const balanceAmount = totalAmount - parseFloat(receivedAmount || '0')

  // Open add item modal
  const openAddItemModal = () => {
    setIsAddItemModalOpen(true)
  }

  // Close add item modal
  const closeAddItemModal = () => {
    setIsAddItemModalOpen(false)
    setNewItem({
      name: '',
      qty: 1,
      price: 0,
      discount: 0,
      gst: 0,
      description: ''
    })
  }

  // Add new item from modal
  const addNewItem = () => {
    if (!newItem.name.trim()) return

    const subtotal = newItem.qty * newItem.price
    const discountAmount = subtotal * (newItem.discount / 100)
    const amountAfterDiscount = subtotal - discountAmount
    const gstAmount = amountAfterDiscount * (newItem.gst / 100)
    const finalAmount = amountAfterDiscount + gstAmount

    const item = {
      id: Date.now(),
      name: newItem.name,
      qty: newItem.qty,
      price: newItem.price,
      discount: newItem.discount,
      gst: newItem.gst,
      amount: finalAmount
    }
    
    const updatedItems = [...items, item]
    setItems(updatedItems)
    
    // Calculate new total
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const newTotalGST = updatedItems.reduce((sum, item) => sum + (item.amount * item.gst / 100), 0)
    const newTotalAmount = newSubtotal + newTotalGST
    setInvoiceAmount(newTotalAmount.toString())
    
    closeAddItemModal()
  }

  // Calculate preview totals for modal
  const previewSubtotal = newItem.qty * newItem.price
  const previewDiscountAmount = previewSubtotal * (newItem.discount / 100)
  const previewAmountAfterDiscount = previewSubtotal - previewDiscountAmount
  const previewTax = previewAmountAfterDiscount * (newItem.gst / 100)
  const previewTotal = previewAmountAfterDiscount + previewTax

  // Create invoice
  const createInvoice = () => {
    if (!customerName.trim() || items.length === 0) {
      alert('Please enter customer name and add at least one item')
      return
    }
    
    // Store invoice data in sessionStorage to pass to success page
    const invoiceData = {
      customerName,
      items,
      subtotal,
      totalGST,
      totalAmount,
      receivedAmount: parseFloat(receivedAmount || '0'),
      balanceAmount
    }
    
    sessionStorage.setItem('invoiceData', JSON.stringify(invoiceData))
    router.push('/sales/invoice-success')
  }

  // Update item
  const updateItem = (id: number, field: string, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'qty' || field === 'price' || field === 'discount' || field === 'gst') {
          const subtotal = updatedItem.qty * updatedItem.price
          const discountAmount = subtotal * (updatedItem.discount / 100)
          const amountAfterDiscount = subtotal - discountAmount
          const gstAmount = amountAfterDiscount * (updatedItem.gst / 100)
          updatedItem.amount = amountAfterDiscount + gstAmount
        }
        return updatedItem
      }
      return item
    })
    setItems(updatedItems)
    
    // Recalculate totals
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const newTotalGST = updatedItems.reduce((sum, item) => sum + (item.amount * item.gst / 100), 0)
    const newTotalAmount = newSubtotal + newTotalGST
    setInvoiceAmount(newTotalAmount.toString())
  }

  // Remove item
  const removeItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
    
    // Recalculate totals
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const newTotalGST = updatedItems.reduce((sum, item) => sum + (item.amount * item.gst / 100), 0)
    const newTotalAmount = newSubtotal + newTotalGST
    setInvoiceAmount(newTotalAmount.toString())
  }

  // Action handlers
  const handleViewSale = (saleId: number) => {
    router.push(`/sales/detail-sale/${saleId}`)
  }

  const handleEditSale = (saleId: number) => {
    router.push(`/sales/edit-sale/${saleId}`)
  }

  const handleDeleteSale = (saleId: number) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      // Delete logic here
      console.log('Deleting sale:', saleId)
    }
  }

  const handleShareSale = (saleId: number) => {
    // Share logic here
    console.log('Sharing sale:', saleId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold tracking-tight">Sale Invoices</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setHasSales(!hasSales)}
            variant="outline"
            size="sm"
          >
            {hasSales ? 'Show Empty State' : 'Show With Data'}
          </Button>
          <Button 
            onClick={() => router.push('/sales/add-sale')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Sale
          </Button>
        </div>
      </div>

     

      {!hasSales ? (
        // Empty State - No Sales Added
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Invoice Creation Form */}
          <div className="space-y-6">
            {/* Bill To Section */}
            <Card>
              <CardHeader>
                <CardTitle>Bill To:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name*</Label>
                  <Input 
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter party name"
                  />
                </div>
                <br/>

                <Button 
                  onClick={openAddItemModal}
                  variant="outline"
                  className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Plus className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">Add New Item</span>
                  </div>
                </Button>
  <br/>
                <div className="space-y-2">
                  <Label htmlFor="invoiceAmount">Invoice Amount*</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input 
                      id="invoiceAmount"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      placeholder="Enter invoice amount"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="received">Received</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input 
                      id="received"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      placeholder="Enter received amount"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Balance: ₹{balanceAmount.toFixed(2)}
                  </Button>
                </div>
              </CardContent>
            </Card>

           

           
            {/* Create Invoice Button */}
            <Button 
              onClick={createInvoice}
              className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
            >
              Create Your First Invoice
            </Button>
          </div>

          {/* Right Panel - Invoice Preview */}
          <div className="space-y-6">
            {/* Top Banner */}
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 text-sm font-bold">⚡</span>
                </div>
                <span className="text-sm text-yellow-800 font-medium">
                  1Cr Vyaparis have created invoices on Vyapar
                </span>
              </div>
            </div> */}

            {/* Invoice Preview */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Invoice Title */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">TAX INVOICE</h2>
                  </div>

                  {/* Bill To and Invoice Details */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">Bill To</h3>
                      <p className="text-gray-600">{customerName || 'Enter customer name'}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold text-gray-900 mb-2">Invoice Details</h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Invoice No. #01</p>
                        <p className="text-sm text-gray-600">Date: 2025-10-06</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div>
                    <div className="bg-purple-600 text-white p-2 rounded-t-md">
                      <div className="grid grid-cols-7 gap-2 text-sm font-medium">
                        <div>#</div>
                        <div>Item name</div>
                        <div>Qty</div>
                        <div>Price/Unit</div>
                        <div>Discount</div>
                        <div>GST</div>
                        <div>Amt</div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-b-md">
                      {items.length === 0 ? (
                        <div className="p-4 text-center">
                          <p className="text-gray-500">No items added yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {items.map((item, index) => (
                            <div key={item.id} className="p-3">
                              <div className="grid grid-cols-7 gap-2 text-sm">
                                <div className="flex items-center">{index + 1}</div>
                                <div>
                                  <Input
                                    value={item.name}
                                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    value={item.discount}
                                    onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                    className="h-8 text-xs"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    value={item.gst}
                                    onChange={(e) => updateItem(item.id, 'gst', parseFloat(e.target.value) || 0)}
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>₹{item.amount.toFixed(2)}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount Summary */}
                  <div className="space-y-2">
                    {/* <div>
                      <Label className="text-sm font-medium">Amount In Words</Label>
                      <p className="text-sm text-gray-500">
                        {totalAmount > 0 ? `₹${totalAmount.toFixed(2)}` : 'Enter amount to see words'}
                      </p>
                    </div> */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sub Total:</span>
                        <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">GST:</span>
                        <span className="text-sm font-medium">₹{totalGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-purple-600">Total:</span>
                        <span className="text-sm font-bold text-purple-600">₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Balance Due:</span>
                        <span className="text-sm font-medium">₹{balanceAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Data State - Sales Added
        <div className="space-y-6">
           {/* Filter Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label>Filter by:</Label>
          <Button variant="outline" size="sm">
            Custom
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">01/10/2025 To 31/10/2025</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            All Firms
          </Button>
        </div>
      </div>
          {/* Sales Summary Card */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Total Sales Amount</h3>
                  <div className="text-3xl font-bold text-purple-900">₹ {totalSales.toLocaleString()}</div>
                  <div className="text-sm text-purple-700 mt-1">
                    Received: ₹ {totalReceived.toLocaleString()} | Balance: ₹ {totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Transactions</CardTitle>
                {/* <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div> */}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 ps-6 pe-4 pb-4 pt-2">
                {/* Search and Filter Bar */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button> */}
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </Button>
                </div>

                {/* Transactions Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                          
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span>Invoice no</span>
                           
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span>Party Name</span>
                           
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span>Transaction</span>
                            
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span>Payment Type</span>
                           
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>Amount</span>
                          
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>Balance</span>
                           
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span>Actions</span>
                         
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((sale) => (
                        <TableRow key={sale.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{sale.date}</TableCell>
                          <TableCell className="text-gray-700">{sale.invoiceNo}</TableCell>
                          <TableCell className="text-gray-700">{sale.partyName}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-800 border-0">
                              {sale.transaction}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-700">{sale.paymentType}</TableCell>
                          <TableCell className="font-medium text-gray-900 text-right">₹ {sale.amount.toLocaleString()}</TableCell>
                          <TableCell className="font-medium text-gray-900 text-right">₹ {sale.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleShareSale(sale.id)}
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
                                  <DropdownMenuItem onClick={() => handleViewSale(sale.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditSale(sale.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Sale
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteSale(sale.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Sale
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

      {/* Add New Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Add New Item
              
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Item Name */}
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Item Name"
              />
            </div>

            {/* Quantity and Unit Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.qty}
                  onChange={(e) => setNewItem({...newItem, qty: parseInt(e.target.value) || 0})}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={newItem.discount}
                onChange={(e) => setNewItem({...newItem, discount: parseFloat(e.target.value) || 0})}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            {/* Tax Rate */}
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate</Label>
              <Select 
                value={newItem.gst.toString()} 
                onValueChange={(value) => setNewItem({...newItem, gst: parseFloat(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>

            

            {/* Calculation Preview */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-gray-900">Calculation Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{previewSubtotal.toFixed(2)}</span>
                </div>
                {newItem.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({newItem.discount}%):</span>
                    <span className="font-medium text-red-600">-₹{previewDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">After Discount:</span>
                  <span className="font-medium">₹{previewAmountAfterDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({newItem.gst}%):</span>
                  <span className="font-medium">₹{previewTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="font-bold text-gray-900">₹{previewTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeAddItemModal}>
                Cancel
              </Button>
              <Button 
                onClick={addNewItem}
                disabled={!newItem.name.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
