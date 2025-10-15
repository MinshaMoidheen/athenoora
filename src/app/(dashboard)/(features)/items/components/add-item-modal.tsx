'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { X, Info, Plus, Minus, Search, Calendar } from 'lucide-react'
import { addItem } from '../actions'

interface AddItemModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded?: () => void
}

export function AddItemModal({ isOpen, onOpenChange, onItemAdded }: AddItemModalProps) {
  const [activeTab, setActiveTab] = useState('pricing')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itemType, setItemType] = useState<'product' | 'service'>('product')
  const [showWholesalePrice, setShowWholesalePrice] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files)
      const validImages = newImages.filter(file => file.type.startsWith('image/'))
      
      if (validImages.length !== newImages.length) {
        alert('Please select only image files')
        return
      }

      setUploadedImages(prev => [...prev, ...validImages])
      
      // Create previews
      validImages.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImagePreviews(prev => [...prev, e.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      // Add uploaded images to form data
      uploadedImages.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })
      formData.append('imageCount', uploadedImages.length.toString())
      
      const result = await addItem(formData)
      if (result.success) {
        onOpenChange(false)
        // Notify parent that an item was added
        if (onItemAdded) {
          onItemAdded()
        }
        // Reset form
        setActiveTab('pricing')
        setItemType('product')
        setShowWholesalePrice(false)
        setUploadedImages([])
        setImagePreviews([])
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Add Item</span>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">
                {itemType === 'product' ? 'Item Name' : 'Service Name'} <span className="text-red-500">*</span>
              </Label>
              <Input id="itemName" name="itemName" placeholder={`Enter ${itemType} name`} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemHSN" className="flex items-center gap-1">
                {itemType === 'product' ? 'Item HSN' : 'Service HSN'}
                <Search className="h-3 w-3 text-gray-400" />
              </Label>
              <Input id="itemHSN" name="itemHSN" placeholder={`Enter ${itemType} HSN`} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Select name="category">
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
              <Input id="itemCode" name="itemCode" placeholder={`Enter ${itemType} code`} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseUnit">Base Unit</Label>
              <Select name="baseUnit">
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
              <Select name="secondaryUnit">
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

          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                />
                <Button type="button" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Images
                </Button>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Images ({imagePreviews.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid w-full ${itemType === 'product' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              {itemType === 'product' && (
                <TabsTrigger value="stock">Stock</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="pricing" className="space-y-6">
              {/* Sale Price Section */}
              <div className="space-y-4">
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input id="salePrice" name="salePrice" placeholder="Sale Price" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleTaxType">Tax Type</Label>
                    <Select name="saleTaxType">
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
                    <Input id="discountOnSale" name="discountOnSale" placeholder="Disc. On Sale Price" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Type</Label>
                    <Select name="discountType">
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
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                      <Input id="wholesalePrice" name="wholesalePrice" placeholder="Wholesale Price" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wholesaleTaxType">Tax Type</Label>
                      <Select name="wholesaleTaxType">
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
                    <Input id="minWholesaleQty" name="minWholesaleQty" placeholder="Min Wholesale Qty" type="number" />
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
                      <Input id="purchasePrice" name="purchasePrice" placeholder="Purchase Price" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchaseTaxType">Tax Type</Label>
                      <Select name="purchaseTaxType">
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
               
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate</Label>
                  <Select name="taxRate">
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {itemType === 'product' && (
              <TabsContent value="stock" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingQuantity">Opening Quantity</Label>
                    <Input id="openingQuantity" name="openingQuantity" placeholder="Opening Quantity" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="atPrice">At Price</Label>
                    <div className="relative">
                      <Input id="atPrice" name="atPrice" placeholder="At Price" type="number" className="pr-8" />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                        <Plus className="h-3 w-3 text-gray-400" />
                        <Minus className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asOfDate">As Of Date</Label>
                    <div className="relative">
                      <Input 
                        id="asOfDate" 
                        name="asOfDate"
                        value="03-10-2025" 
                        readOnly
                        className="pr-8"
                      />
                      <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStockToMaintain">Min Stock To Maintain</Label>
                    <Input id="minStockToMaintain" name="minStockToMaintain" placeholder="Min Stock To Maintain" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="Location" />
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
              onClick={() => {
                // Handle save and new logic
                onOpenChange(false)
                setTimeout(() => onOpenChange(true), 100)
              }}
            >
              Save & New
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
