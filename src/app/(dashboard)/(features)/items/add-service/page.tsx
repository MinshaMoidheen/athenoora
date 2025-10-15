'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, X, Search, Camera, Settings, Plus, Minus, Calendar } from 'lucide-react'
import { AddCategoryModal } from '../components/add-category-modal'

interface ServiceFormData {
  serviceName: string
  serviceHsn: string
  serviceCode: string
  category: string
  salePrice: string
  saleTaxType: string
  discountOnSale: string
  discountType: string
  wholesalePrice: string
  wholesaleTaxType: string
  minWholesaleQty: string
  showWholesalePrice: boolean
  // Purchase price fields
  purchasePrice: string
  purchaseTaxType: string
  // Tax fields
  taxRate: string
  // Unit fields
  baseUnit: string
  secondaryUnit: string
  // Image field
  itemImage: File | null
  // Stock fields (only for products)
  openingQuantity: string
  atPrice: string
  minStockToMaintain: string
  location: string
  asOfDate: string
}

export default function AddServicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('pricing')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemType, setItemType] = useState<'product' | 'service'>('service')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Read URL parameter to determine item type
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'product') {
      setItemType('product')
    } else {
      setItemType('service')
    }
  }, [searchParams])
  const [showWholesalePrice, setShowWholesalePrice] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceName: '',
    serviceHsn: '',
    serviceCode: '',
    category: '',
    salePrice: '',
    saleTaxType: 'Without Tax',
    discountOnSale: '',
    discountType: 'Percentage',
    wholesalePrice: '',
    wholesaleTaxType: 'Without Tax',
    minWholesaleQty: '',
    showWholesalePrice: true,
    // Initialize purchase price fields
    purchasePrice: '',
    purchaseTaxType: 'Without Tax',
    // Initialize tax fields
    taxRate: 'None',
    // Initialize unit fields
    baseUnit: '',
    secondaryUnit: '',
    // Initialize image field
    itemImage: null,
    // Initialize new stock fields
    openingQuantity: '',
    atPrice: '',
    minStockToMaintain: '',
    location: '',
    asOfDate: new Date().toISOString().split('T')[0]
  })

  const handleInputChange = (field: keyof ServiceFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddCategory = () => {
    setIsCategoryModalOpen(true)
  }

  const handleCategoryAdded = (categoryName: string) => {
    handleInputChange('category', categoryName)
    setIsCategoryModalOpen(false)
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Update form data
      handleInputChange('itemImage', file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    handleInputChange('itemImage', null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'itemImage' && value instanceof File) {
          formDataObj.append('itemImage', value)
        } else if (key !== 'itemImage') {
          formDataObj.append(key, value.toString())
        }
      })
      formDataObj.append('itemType', itemType)
      formDataObj.append('showWholesalePrice', showWholesalePrice.toString())

      // Here you would call your server action
      // const result = await addService(formDataObj)
      
      // For now, just navigate back
      router.push('/items')
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
        if (key === 'itemImage' && value instanceof File) {
          formDataObj.append('itemImage', value)
        } else if (key !== 'itemImage') {
          formDataObj.append(key, value.toString())
        }
      })
      formDataObj.append('itemType', itemType)
      formDataObj.append('showWholesalePrice', showWholesalePrice.toString())

      // Here you would call your server action
      // const result = await addService(formDataObj)
      
      // Reset form for new entry
      setFormData({
        serviceName: '',
        serviceHsn: '',
        serviceCode: '',
        category: '',
        salePrice: '',
        saleTaxType: 'Without Tax',
        discountOnSale: '',
        discountType: 'Percentage',
        wholesalePrice: '',
        wholesaleTaxType: 'Without Tax',
        minWholesaleQty: '',
        showWholesalePrice: true,
        // Reset purchase price fields
        purchasePrice: '',
        purchaseTaxType: 'Without Tax',
        // Reset tax fields
        taxRate: 'None',
        // Reset unit fields
        baseUnit: '',
        secondaryUnit: '',
        // Reset image field
        itemImage: null,
        // Reset new stock fields
        openingQuantity: '',
        atPrice: '',
        minStockToMaintain: '',
        location: '',
        asOfDate: new Date().toISOString().split('T')[0]
      })
      setActiveTab('pricing')
      setImagePreview(null)
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
            <h1 className="text-3xl font-bold tracking-tight">Add {itemType === 'product' ? 'Item' : 'Service'}</h1>
            {/* Product/Service Toggle */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setItemType('product')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    itemType === 'product' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Product
                </button>
                <button
                  onClick={() => setItemType('service')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    itemType === 'service' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Service
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/items')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceName">
                  {itemType === 'service' ? 'Service Name' : 'Item Name'} <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="serviceName" 
                  value={formData.serviceName}
                  onChange={(e) => handleInputChange('serviceName', e.target.value)}
                  placeholder={itemType === 'service' ? 'Service Name *' : 'Item Name *'}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceHsn">
                  {itemType === 'service' ? 'Service HSN' : 'Item HSN'}
                </Label>
                <div className="relative">
                  <Input 
                    id="serviceHsn" 
                    value={formData.serviceHsn}
                    onChange={(e) => handleInputChange('serviceHsn', e.target.value)}
                    placeholder={itemType === 'service' ? 'Service HSN' : 'Item HSN'}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUnit">Select Base Unit</Label>
                <Select 
                  value={formData.baseUnit}
                  onValueChange={(value) => handleInputChange('baseUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Base Unit" />
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
                    <SelectItem value="packs">PACKS (Pac)</SelectItem>
                    <SelectItem value="pairs">PAIRS (Prs)</SelectItem>
                    <SelectItem value="pieces">PIECES (Pcs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryUnit">Secondary Unit</Label>
                <Select 
                  value={formData.secondaryUnit}
                  onValueChange={(value) => handleInputChange('secondaryUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Secondary Unit" />
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
                    <SelectItem value="packs">PACKS (Pac)</SelectItem>
                    <SelectItem value="pairs">PAIRS (Prs)</SelectItem>
                    <SelectItem value="pieces">PIECES (Pcs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => {
                    if (value === 'add-new') {
                      handleAddCategory()
                    } else {
                      handleInputChange('category', value)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add-new" className="text-blue-600 font-medium">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Category
                    </SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCode">
                  {itemType === 'service' ? 'Service Code' : 'Item Code'}
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="serviceCode" 
                    value={formData.serviceCode}
                    onChange={(e) => handleInputChange('serviceCode', e.target.value)}
                    placeholder={itemType === 'service' ? 'Service Code' : 'Item Code'}
                  />
                 
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Item Image</Label>
                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Camera className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload image</span>
                        <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${itemType === 'product' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            {itemType === 'product' && <TabsTrigger value="stock">Stock</TabsTrigger>}
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
            
              <CardContent className="space-y-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input 
                      id="salePrice" 
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                      placeholder="Sale Price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleTaxType">Tax Type</Label>
                    <Select 
                      value={formData.saleTaxType}
                      onValueChange={(value) => handleInputChange('saleTaxType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Without Tax">Without Tax</SelectItem>
                        <SelectItem value="With Tax">With Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountOnSale">Discount</Label>
                    <Input 
                      id="discountOnSale" 
                      type="number"
                      value={formData.discountOnSale}
                      onChange={(e) => handleInputChange('discountOnSale', e.target.value)}
                      placeholder="Disc. On Sale Pric..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select 
                      value={formData.discountType}
                      onValueChange={(value) => handleInputChange('discountType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Wholesale Price Section */}
                {showWholesalePrice && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">Wholesale Price</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowWholesalePrice(false)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                        <Input 
                          id="wholesalePrice" 
                          type="number"
                          value={formData.wholesalePrice}
                          onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                          placeholder="Wholesale Price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wholesaleTaxType">Tax Type</Label>
                        <Select 
                          value={formData.wholesaleTaxType}
                          onValueChange={(value) => handleInputChange('wholesaleTaxType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Without Tax">Without Tax</SelectItem>
                            <SelectItem value="With Tax">With Tax</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minWholesaleQty">Min Wholesale Qty</Label>
                        <Input 
                          id="minWholesaleQty" 
                          type="number"
                          value={formData.minWholesaleQty}
                          onChange={(e) => handleInputChange('minWholesaleQty', e.target.value)}
                          placeholder="Minimum Wholesale Qty"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!showWholesalePrice && (
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowWholesalePrice(true)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Wholesale Price
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase Price Section */}
            <Card>
             
              <CardContent className="space-y-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="purchaseTaxType">Tax Type</Label>
                    <Select 
                      value={formData.purchaseTaxType}
                      onValueChange={(value) => handleInputChange('purchaseTaxType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Without Tax">Without Tax</SelectItem>
                        <SelectItem value="With Tax">With Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate</Label>
                  <Select 
                    value={formData.taxRate}
                    onValueChange={(value) => handleInputChange('taxRate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="5%">5%</SelectItem>
                      <SelectItem value="12%">12%</SelectItem>
                      <SelectItem value="18%">18%</SelectItem>
                      <SelectItem value="28%">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
              </CardContent>
            </Card>

           
          </TabsContent>

          {itemType === 'product' && (
            <TabsContent value="stock" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Label htmlFor="atPrice">At Price</Label>
                      <Input 
                        id="atPrice" 
                        type="number"
                        value={formData.atPrice}
                        onChange={(e) => handleInputChange('atPrice', e.target.value)}
                        placeholder="Enter price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStockToMaintain">Min Stock To Maintain</Label>
                      <Input 
                        id="minStockToMaintain" 
                        type="number"
                        value={formData.minStockToMaintain}
                        onChange={(e) => handleInputChange('minStockToMaintain', e.target.value)}
                        placeholder="Enter minimum stock"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="asOfDate">As Of Date</Label>
                    <div className="relative">
                      <Input 
                        id="asOfDate" 
                        type="date"
                        value={formData.asOfDate}
                        onChange={(e) => handleInputChange('asOfDate', e.target.value)}
                        className="pr-8"
                      />
                      <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  </div>

                  
                </CardContent>
              </Card>
            </TabsContent>
          )}

        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleSaveAndNew}
            disabled={isSubmitting}
          >
            Save & New
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onAddCategory={handleCategoryAdded}
      />
    </div>
  )
}
