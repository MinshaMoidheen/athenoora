'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X, Info, Plus, Minus, Search, Calendar } from 'lucide-react'

interface Item {
  id: string
  name: string
  sku: string
  price: number
  cost: number
  stock: number
  category: string
  status: 'active' | 'inactive'
  type: 'product' | 'service'
  description?: string
  hsn?: string
  baseUnit?: string
  secondaryUnit?: string
  salePrice?: number
  purchasePrice?: number
  taxRate?: number
  openingQuantity?: number
  minStock?: number
  location?: string
  saleTaxType?: string
  discountOnSale?: number
  discountType?: string
  wholesalePrice?: number
  wholesaleTaxType?: string
  minWholesaleQty?: number
  purchaseTaxType?: string
  asOfDate?: string
  showWholesalePrice?: boolean
}

// Mock data - in real app this would come from API
const mockItem: Item = {
  id: '1',
  name: 'Dell Laptop XPS 13',
  sku: 'LAP-001',
  price: 85000.00,
  cost: 65000.00,
  stock: 15,
  category: 'Electronics',
  status: 'active',
  type: 'product',
  description: 'High-performance laptop with Intel i7 processor, 16GB RAM, and 512GB SSD',
  hsn: '8471.30.00',
  baseUnit: 'numbers',
  secondaryUnit: 'none',
  salePrice: 85000.00,
  purchasePrice: 65000.00,
  taxRate: 18,
  openingQuantity: 20,
  minStock: 5,
  location: 'Warehouse A',
  saleTaxType: 'without',
  discountOnSale: 0,
  discountType: 'percent',
  wholesalePrice: 80000,
  wholesaleTaxType: 'without',
  minWholesaleQty: 5,
  purchaseTaxType: 'without',
  asOfDate: '2024-01-15',
  showWholesalePrice: true
}

export default function ItemEditPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('pricing')
  const [itemType, setItemType] = useState<'product' | 'service'>('product')
  const [showWholesalePrice, setShowWholesalePrice] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItem(mockItem)
      setItemType(mockItem.type)
      setShowWholesalePrice(mockItem.showWholesalePrice || false)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      router.push(`/items/${params.id}`)
    }, 2000)
  }

  const handleInputChange = (field: keyof Item, value: any) => {
    if (item) {
      setItem({ ...item, [field]: value })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Item Not Found</h2>
          <p className="text-gray-600">The item you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
            <p className="text-gray-600">{item.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/items/${item.id}`)}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Basic Information</span>
              <div className="flex items-center gap-2">
                {/* Item Type Toggle */}
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant={itemType === 'product' ? 'default' : 'outline'}
                    onClick={() => {
                      setItemType('product')
                      setActiveTab('pricing')
                    }}
                    size="sm"
                    className={itemType === 'product' ? 'bg-purple-600 hover:bg-purple-700' : 'text-purple-600 border-purple-600 hover:bg-purple-50'}
                  >
                    Product
                  </Button>
                  <Button
                    type="button"
                    variant={itemType === 'service' ? 'default' : 'outline'}
                    onClick={() => {
                      setItemType('service')
                      setActiveTab('pricing')
                    }}
                    size="sm"
                    className={itemType === 'service' ? 'bg-purple-600 hover:bg-purple-700' : 'text-purple-600 border-purple-600 hover:bg-purple-50'}
                  >
                    Service
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">
                  {itemType === 'product' ? 'Item Name' : 'Service Name'} <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="itemName" 
                  value={item.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={`Enter ${itemType} name`} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemHSN" className="flex items-center gap-1">
                  {itemType === 'product' ? 'Item HSN' : 'Service HSN'}
                  <Search className="h-3 w-3 text-gray-400" />
                </Label>
                <Input 
                  id="itemHSN" 
                  value={item.hsn || ''}
                  onChange={(e) => handleInputChange('hsn', e.target.value)}
                  placeholder={`Enter ${itemType} HSN`} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select 
                    value={item.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemCode">
                  {itemType === 'product' ? 'Item Code' : 'Service Code'}
                </Label>
                <Input 
                  id="itemCode" 
                  value={item.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder={`Enter ${itemType} code`} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseUnit">Base Unit</Label>
                <Select 
                  value={item.baseUnit || ''}
                  onValueChange={(value) => handleInputChange('baseUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="bags">BAGS (Bag)</SelectItem>
                    <SelectItem value="bottles">BOTTLES (Btl)</SelectItem>
                    <SelectItem value="box">BOX (Box)</SelectItem>
                    <SelectItem value="bundles">BUNDLES (Bdl)</SelectItem>
                    <SelectItem value="cans">CANS (Can)</SelectItem>
                    <SelectItem value="cartons">CARTONS (Ctn)</SelectItem>
                    <SelectItem value="dozens">DOZENS (Dzn)</SelectItem>
                    <SelectItem value="grammes">GRAMMES (Gm)</SelectItem>
                    <SelectItem value="kilograms">KILOGRAMS (Kg)</SelectItem>
                    <SelectItem value="litre">LITRE (Ltr)</SelectItem>
                    <SelectItem value="meters">METERS (Mtr)</SelectItem>
                    <SelectItem value="mililitre">MILILITRE (Ml)</SelectItem>
                    <SelectItem value="numbers">NUMBERS (Nos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryUnit">Secondary Unit</Label>
                <Select 
                  value={item.secondaryUnit || ''}
                  onValueChange={(value) => handleInputChange('secondaryUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="bags">BAGS (Bag)</SelectItem>
                    <SelectItem value="bottles">BOTTLES (Btl)</SelectItem>
                    <SelectItem value="box">BOX (Box)</SelectItem>
                    <SelectItem value="bundles">BUNDLES (Bdl)</SelectItem>
                    <SelectItem value="cans">CANS (Can)</SelectItem>
                    <SelectItem value="cartons">CARTONS (Ctn)</SelectItem>
                    <SelectItem value="dozens">DOZENS (Dzn)</SelectItem>
                    <SelectItem value="grammes">GRAMMES (Gm)</SelectItem>
                    <SelectItem value="kilograms">KILOGRAMS (Kg)</SelectItem>
                    <SelectItem value="litre">LITRE (Ltr)</SelectItem>
                    <SelectItem value="meters">METERS (Mtr)</SelectItem>
                    <SelectItem value="mililitre">MILILITRE (Ml)</SelectItem>
                    <SelectItem value="numbers">NUMBERS (Nos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={item.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter item description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${itemType === 'product' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            {itemType === 'product' && (
              <TabsTrigger value="stock">Stock</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sale Price Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Sale Price</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <Input 
                        id="salePrice" 
                        type="number"
                        value={item.salePrice || ''}
                        onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                        placeholder="Sale Price" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saleTaxType">Tax Type</Label>
                      <Select 
                        value={item.saleTaxType || ''}
                        onValueChange={(value) => handleInputChange('saleTaxType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Without..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="without">Without Tax</SelectItem>
                          <SelectItem value="with">With Tax</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discountOnSale">Disc. On Sale Price</Label>
                      <Input 
                        id="discountOnSale" 
                        type="number"
                        value={item.discountOnSale || ''}
                        onChange={(e) => handleInputChange('discountOnSale', parseFloat(e.target.value) || 0)}
                        placeholder="Disc. On Sale Price" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Type</Label>
                      <Select 
                        value={item.discountType || ''}
                        onValueChange={(value) => handleInputChange('discountType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Percent..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Percent</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-purple-600 p-0 h-auto"
                    onClick={() => setShowWholesalePrice(!showWholesalePrice)}
                  >
                    + Add Wholesale Price
                  </Button>
                </div>

                {/* Wholesale Price Section */}
                {showWholesalePrice && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Wholesale Price</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                        <Input 
                          id="wholesalePrice" 
                          type="number"
                          value={item.wholesalePrice || ''}
                          onChange={(e) => handleInputChange('wholesalePrice', parseFloat(e.target.value) || 0)}
                          placeholder="Wholesale Price" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wholesaleTaxType">Tax Type</Label>
                        <Select 
                          value={item.wholesaleTaxType || ''}
                          onValueChange={(value) => handleInputChange('wholesaleTaxType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Without..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="without">Without Tax</SelectItem>
                            <SelectItem value="with">With Tax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minWholesaleQty" className="flex items-center gap-1">
                        Min Wholesale Qty
                        <Info className="h-3 w-3 text-gray-400" />
                      </Label>
                      <Input 
                        id="minWholesaleQty" 
                        type="number"
                        value={item.minWholesaleQty || ''}
                        onChange={(e) => handleInputChange('minWholesaleQty', parseFloat(e.target.value) || 0)}
                        placeholder="Min Wholesale Qty" 
                      />
                    </div>
                  </div>
                )}

                {/* Purchase Price Section - Only for Products */}
                {itemType === 'product' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Purchase Price</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Purchase Price</Label>
                        <Input 
                          id="purchasePrice" 
                          type="number"
                          value={item.purchasePrice || ''}
                          onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                          placeholder="Purchase Price" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purchaseTaxType">Tax Type</Label>
                        <Select 
                          value={item.purchaseTaxType || ''}
                          onValueChange={(value) => handleInputChange('purchaseTaxType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Without..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="without">Without Tax</SelectItem>
                            <SelectItem value="with">With Tax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Taxes Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Taxes</h4>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate</Label>
                    <Select 
                      value={item.taxRate?.toString() || ''}
                      onValueChange={(value) => handleInputChange('taxRate', parseFloat(value) || 0)}
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
              </CardContent>
            </Card>
          </TabsContent>

          {itemType === 'product' && (
            <TabsContent value="stock" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingQuantity">Opening Quantity</Label>
                    <Input 
                      id="openingQuantity" 
                      type="number"
                      value={item.openingQuantity || ''}
                      onChange={(e) => handleInputChange('openingQuantity', parseFloat(e.target.value) || 0)}
                      placeholder="Opening Quantity" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asOfDate">As Of Date</Label>
                    <div className="relative">
                      <Input 
                        id="asOfDate" 
                        type="date"
                        value={item.asOfDate || ''}
                        onChange={(e) => handleInputChange('asOfDate', e.target.value)}
                        className="pr-8"
                      />
                      <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStock" className="flex items-center gap-1">
                      Min Stock To Maintain
                      <Info className="h-3 w-3 text-gray-400" />
                    </Label>
                    <Input 
                      id="minStock" 
                      type="number"
                      value={item.minStock || ''}
                      onChange={(e) => handleInputChange('minStock', parseFloat(e.target.value) || 0)}
                      placeholder="Min Stock To Maintain" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={item.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Location" 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </form>
    </div>
  )
}
