'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X, Info, Plus, Minus, Search, Calendar } from 'lucide-react'
import { addItem } from '../actions'

interface ItemFormData {
  itemName: string
  sku: string
  category: string
  type: string
  description: string
  hsn: string
  baseUnit: string
  secondaryUnit: string
  salePrice: string
  purchasePrice: string
  taxRate: string
  openingQuantity: string
  minStock: string
  location: string
  saleTaxType: string
  discountOnSale: string
  discountType: string
  wholesalePrice: string
  wholesaleTaxType: string
  minWholesaleQty: string
  purchaseTaxType: string
  asOfDate: string
  showWholesalePrice: boolean
}

export default function AddItemPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('pricing')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemType, setItemType] = useState<'product' | 'service'>('product')
  const [showWholesalePrice, setShowWholesalePrice] = useState(false)
  const [formData, setFormData] = useState<ItemFormData>({
    itemName: '',
    sku: '',
    category: '',
    type: 'product',
    description: '',
    hsn: '',
    baseUnit: '',
    secondaryUnit: '',
    salePrice: '',
    purchasePrice: '',
    taxRate: '',
    openingQuantity: '',
    minStock: '',
    location: '',
    saleTaxType: '',
    discountOnSale: '',
    discountType: '',
    wholesalePrice: '',
    wholesaleTaxType: '',
    minWholesaleQty: '',
    purchaseTaxType: '',
    asOfDate: new Date().toISOString().split('T')[0],
    showWholesalePrice: false
  })

  const handleInputChange = (field: keyof ItemFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })
      formDataObj.append('itemType', itemType)
      formDataObj.append('showWholesalePrice', showWholesalePrice.toString())

      const result = await addItem(formDataObj)
      if (result.success) {
        router.push('/items')
      } else {
        // Handle error
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAndNew = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })
      formDataObj.append('itemType', itemType)
      formDataObj.append('showWholesalePrice', showWholesalePrice.toString())

      const result = await addItem(formDataObj)
      if (result.success) {
        // Reset form for new entry
        setFormData({
          itemName: '',
          sku: '',
          category: '',
          type: 'product',
          description: '',
          hsn: '',
          baseUnit: '',
          secondaryUnit: '',
          salePrice: '',
          purchasePrice: '',
          taxRate: '',
          openingQuantity: '',
          minStock: '',
          location: '',
          saleTaxType: '',
          discountOnSale: '',
          discountType: '',
          wholesalePrice: '',
          wholesaleTaxType: '',
          minWholesaleQty: '',
          purchaseTaxType: '',
          asOfDate: new Date().toISOString().split('T')[0],
          showWholesalePrice: false
        })
        setActiveTab('pricing')
        setItemType('product')
        setShowWholesalePrice(false)
      } else {
        // Handle error
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Add Item</h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/items')}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAndNew}
            disabled={isSubmitting}
            variant="outline"
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            Save & New
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="itemName" 
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  placeholder="Enter item name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Enter SKU" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter category" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Item Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="baseUnit">Base Unit</Label>
                <Input 
                  id="baseUnit" 
                  value={formData.baseUnit}
                  onChange={(e) => handleInputChange('baseUnit', e.target.value)}
                  placeholder="Enter base unit" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input 
                      id="salePrice" 
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                      placeholder="Enter sale price" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input 
                      id="purchasePrice" 
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                      placeholder="Enter purchase price" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Wholesale Pricing</Label>
                    <Switch
                      checked={showWholesalePrice}
                      onCheckedChange={setShowWholesalePrice}
                    />
                  </div>

                  {showWholesalePrice && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                        <Input 
                          id="wholesalePrice" 
                          type="number"
                          value={formData.wholesalePrice}
                          onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                          placeholder="Enter wholesale price" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minWholesaleQty">Min Wholesale Quantity</Label>
                        <Input 
                          id="minWholesaleQty" 
                          type="number"
                          value={formData.minWholesaleQty}
                          onChange={(e) => handleInputChange('minWholesaleQty', e.target.value)}
                          placeholder="Enter minimum quantity" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingQuantity">Opening Quantity</Label>
                    <Input 
                      id="openingQuantity" 
                      type="number"
                      value={formData.openingQuantity}
                      onChange={(e) => handleInputChange('openingQuantity', e.target.value)}
                      placeholder="Enter opening quantity" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input 
                      id="minStock" 
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange('minStock', e.target.value)}
                      placeholder="Enter minimum stock" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsn">HSN Code</Label>
                    <Input 
                      id="hsn" 
                      value={formData.hsn}
                      onChange={(e) => handleInputChange('hsn', e.target.value)}
                      placeholder="Enter HSN code" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input 
                      id="taxRate" 
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value)}
                      placeholder="Enter tax rate" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleTaxType">Sale Tax Type</Label>
                    <Select 
                      value={formData.saleTaxType}
                      onValueChange={(value) => handleInputChange('saleTaxType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inclusive">Inclusive</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseTaxType">Purchase Tax Type</Label>
                    <Select 
                      value={formData.purchaseTaxType}
                      onValueChange={(value) => handleInputChange('purchaseTaxType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inclusive">Inclusive</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
