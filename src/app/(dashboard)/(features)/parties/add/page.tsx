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
import { ArrowLeft, Save, X, Info, Calendar, Plus, Minus } from 'lucide-react'
import { useAddPartyMutation } from '@/store/api/partyApi'

interface PartyFormData {
  partyName: string
  gstin: string
  phoneNumber: string
  email: string
  gstType: string
  state: string
  billingAddress: string
  shippingAddress: string
  openingBalance: string
  asOfDate: string
  customLimitValue: string
  additionalField1: string
  additionalField2: string
  additionalField3: string
}

export default function AddPartyPage() {
  const router = useRouter()
  const [addParty, { isLoading: isSaving }] = useAddPartyMutation()
  const [activeTab, setActiveTab] = useState('gst-address')
  const [noLimit, setNoLimit] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShippingAddress, setShowShippingAddress] = useState(false)
  const [formData, setFormData] = useState<PartyFormData>({
    partyName: '',
    gstin: '',
    phoneNumber: '',
    email: '',
    gstType: '',
    state: '',
    billingAddress: '',
    shippingAddress: '',
    openingBalance: '',
    asOfDate: new Date().toISOString().split('T')[0],
    customLimitValue: '',
    additionalField1: '',
    additionalField2: '',
    additionalField3: ''
  })

  const handleInputChange = (field: keyof PartyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: formData.partyName,
        gstin: formData.gstin,
        phone: formData.phoneNumber,
        email: formData.email,
        billingAddress: formData.billingAddress,
        shippingAddress: showShippingAddress ? formData.shippingAddress : undefined,
        openingBalance: formData.openingBalance ? Number(formData.openingBalance) : undefined,
        gstType: formData.gstType,
        state: formData.state,
        asOfDate: formData.asOfDate,
        noLimit,
        customLimitValue: noLimit ? undefined : (formData.customLimitValue ? Number(formData.customLimitValue) : undefined),
        additionalField1: formData.additionalField1,
        additionalField2: formData.additionalField2,
        additionalField3: formData.additionalField3,
      }
      await addParty(payload).unwrap()
      router.push('/parties')
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
      const payload = {
        name: formData.partyName,
        gstin: formData.gstin,
        phone: formData.phoneNumber,
        email: formData.email,
        billingAddress: formData.billingAddress,
        shippingAddress: showShippingAddress ? formData.shippingAddress : undefined,
        openingBalance: formData.openingBalance ? Number(formData.openingBalance) : undefined,
        gstType: formData.gstType,
        state: formData.state,
        asOfDate: formData.asOfDate,
        noLimit,
        customLimitValue: noLimit ? undefined : (formData.customLimitValue ? Number(formData.customLimitValue) : undefined),
        additionalField1: formData.additionalField1,
        additionalField2: formData.additionalField2,
        additionalField3: formData.additionalField3,
      }
      await addParty(payload).unwrap()
      // Reset form for new entry
        setFormData({
          partyName: '',
          gstin: '',
          phoneNumber: '',
          email: '',
          gstType: '',
          state: '',
          billingAddress: '',
          shippingAddress: '',
          openingBalance: '',
          asOfDate: new Date().toISOString().split('T')[0],
          customLimitValue: '',
          additionalField1: '',
          additionalField2: '',
          additionalField3: ''
        })
        setActiveTab('gst-address')
        setNoLimit(true)
        setShowShippingAddress(false)
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
            <h1 className="text-3xl font-bold tracking-tight">Add Party</h1>
            {/* <p className="text-gray-600">Create a new party in your system</p> */}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/parties')}
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
            {isSubmitting || isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            {/* <CardTitle>Basic Information</CardTitle> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partyName">
                  Party Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="partyName" 
                  value={formData.partyName}
                  onChange={(e) => handleInputChange('partyName', e.target.value)}
                  placeholder="Enter party name" 
                  required 
                />
              </div>
              

              <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input 
                  id="gstin" 
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  placeholder="Enter GSTIN" 
                />
            </div>
              <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter phone number" 
              />
            </div>
            </div>

            
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gst-address">GST & Address</TabsTrigger>
            <TabsTrigger value="credit-balance">Credit & Balance</TabsTrigger>
            <TabsTrigger value="additional-fields">Additional Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="gst-address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>GST & Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstType">GST Type</Label>
                    <Select 
                      value={formData.gstType}
                      onValueChange={(value) => handleInputChange('gstType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select GST type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unregistered">Unregistered/Consumer</SelectItem>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="composition">Composition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={formData.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="email">Email ID</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address" 
                  />
                </div>
                </div>

                

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Textarea 
                    id="billingAddress" 
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    placeholder="Enter billing address"
                    rows={4}
                  />
                </div>

                {/* Shipping Address Toggle */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Shipping Address</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShippingAddress(!showShippingAddress)}
                      className="flex items-center gap-2"
                    >
                      {showShippingAddress ? (
                        <>
                          <Minus className="h-4 w-4" />
                          Hide Shipping Address
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Shipping Address
                        </>
                      )}
                    </Button>
                  </div>

                  {showShippingAddress && (
                    <div className="space-y-2">
                      <Textarea 
                        id="shippingAddress" 
                        value={formData.shippingAddress}
                        onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                        placeholder="Enter shipping address"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit-balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Credit & Balance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openingBalance">Opening Balance</Label>
                  <Input 
                    id="openingBalance" 
                    type="number"
                    value={formData.openingBalance}
                    onChange={(e) => handleInputChange('openingBalance', e.target.value)}
                    placeholder="Enter opening balance" 
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

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="creditLimit" className="flex items-center gap-1">
                      Credit Limit
                      <Info className="h-3 w-3 text-gray-400" />
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="no-limit"
                        checked={noLimit}
                        onCheckedChange={setNoLimit}
                      />
                      <Label htmlFor="no-limit" className={noLimit ? "text-purple-600 font-medium" : "text-gray-500"}>
                        No Limit
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="custom-limit"
                        checked={!noLimit}
                        onCheckedChange={(checked) => setNoLimit(!checked)}
                      />
                      <Label htmlFor="custom-limit" className={!noLimit ? "text-purple-600 font-medium" : "text-gray-500"}>
                        Custom Limit
                      </Label>
                    </div>
                  </div>

                  {!noLimit && (
                    <div className="space-y-2">
                      <Label htmlFor="customLimitValue">Custom Limit Amount</Label>
                      <Input 
                        id="customLimitValue" 
                        type="number"
                        value={formData.customLimitValue}
                        onChange={(e) => handleInputChange('customLimitValue', e.target.value)}
                        placeholder="Enter custom limit" 
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional-fields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Additional Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="additionalField1">Additional Field 1</Label>
                  <Input 
                    id="additionalField1" 
                    value={formData.additionalField1}
                    onChange={(e) => handleInputChange('additionalField1', e.target.value)}
                    placeholder="Enter additional field 1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalField2">Additional Field 2</Label>
                  <Input 
                    id="additionalField2" 
                    value={formData.additionalField2}
                    onChange={(e) => handleInputChange('additionalField2', e.target.value)}
                    placeholder="Enter additional field 2" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalField3">Additional Field 3</Label>
                  <Input 
                    id="additionalField3" 
                    value={formData.additionalField3}
                    onChange={(e) => handleInputChange('additionalField3', e.target.value)}
                    placeholder="Enter additional field 3" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
