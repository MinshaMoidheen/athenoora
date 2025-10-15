"use client"

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
import { ArrowLeft, Save, X, Info, Calendar, Plus, Minus } from 'lucide-react'
import { useGetPartyByIdQuery, useUpdatePartyMutation } from '@/store/api/partyApi'

interface Party {
  id: string
  name: string
  gstin?: string
  phone?: string
  email?: string
  balance?: number
  type?: 'customer' | 'supplier'
  status?: 'active' | 'inactive'
  billingAddress?: string
  shippingAddress?: string
  openingBalance?: number
  creditLimit?: number
  gstType?: string
  state?: string
  shippingState?: string
  shippingCity?: string
  shippingPincode?: string
  shippingCountry?: string
  asOfDate?: string
  noLimit?: boolean
  customLimitValue?: number
  additionalField1?: string
  additionalField2?: string
  additionalField3?: string
}

export default function PartyEditPage() {
  const params = useParams()
  const id = String((params as any).id)
  const router = useRouter()
  const { data: fetchedParty, isLoading } = useGetPartyByIdQuery(id)
  const [updateParty, { isLoading: saving }] = useUpdatePartyMutation()
  const [party, setParty] = useState<Party | null>(null)
  const [activeTab, setActiveTab] = useState('gst-address')
  const [noLimit, setNoLimit] = useState(true)
  const [showShippingAddress, setShowShippingAddress] = useState(false)

  useEffect(() => {
    if (fetchedParty) {
      setParty(fetchedParty)
      setNoLimit(!(fetchedParty.customLimitValue && fetchedParty.customLimitValue > 0))
      setShowShippingAddress(!!fetchedParty.shippingAddress)
    }
  }, [fetchedParty])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!party) return
    await updateParty({
      id,
      name: party.name,
      gstin: party.gstin,
      phone: party.phone,
      email: party.email,
      billingAddress: party.billingAddress,
      shippingAddress: showShippingAddress ? party.shippingAddress : undefined,
      openingBalance: party.openingBalance,
      gstType: party.gstType,
      state: party.state,
      asOfDate: party.asOfDate,
      noLimit,
      customLimitValue: noLimit ? undefined : party.customLimitValue,
      additionalField1: party.additionalField1,
      additionalField2: party.additionalField2,
      additionalField3: party.additionalField3,
    }).unwrap()
    router.push(`/parties/${id}`)
  }

  const handleInputChange = (field: keyof Party, value: any) => {
    if (party) {
      setParty({ ...party, [field]: value })
    }
  }

  if (isLoading || !party) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading party details...</p>
        </div>
      </div>
    )
  }

  if (!party) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Party Not Found</h2>
          <p className="text-gray-600">The party you're looking for doesn't exist.</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Party</h1>
            <p className="text-gray-600">{party.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/parties/${party.id}`)}
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
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partyName">
                  Party Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="partyName" 
                  value={party.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter party name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin" className="flex items-center gap-1">
                  GSTIN
                  <Info className="h-3 w-3 text-gray-400" />
                </Label>
                <Input 
                  id="gstin" 
                  value={party.gstin || ''}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  placeholder="Enter GSTIN" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                value={party.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gst-address">GST & Address</TabsTrigger>
            <TabsTrigger value="credit-balance" className="flex items-center gap-2">
              Credit & Balance
            </TabsTrigger>
            <TabsTrigger value="additional-fields">Additional Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="gst-address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>GST & Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstType">GST Type</Label>
                    <Select 
                      value={party.gstType || ''}
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
                      value={party.state || ''}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email ID</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={party.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Textarea 
                    id="billingAddress" 
                    value={party.billingAddress || ''}
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
                          value={party.shippingAddress || ''}
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
                    value={party.openingBalance || ''}
                    onChange={(e) => handleInputChange('openingBalance', parseFloat(e.target.value) || 0)}
                    placeholder="Enter opening balance" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asOfDate">As Of Date</Label>
                  <div className="relative">
                    <Input 
                      id="asOfDate" 
                      type="date"
                      value={party.asOfDate || ''}
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
                        value={party.customLimitValue || ''}
                        onChange={(e) => handleInputChange('customLimitValue', parseFloat(e.target.value) || 0)}
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
                    value={party.additionalField1 || ''}
                    onChange={(e) => handleInputChange('additionalField1', e.target.value)}
                    placeholder="Enter additional field 1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalField2">Additional Field 2</Label>
                  <Input 
                    id="additionalField2" 
                    value={party.additionalField2 || ''}
                    onChange={(e) => handleInputChange('additionalField2', e.target.value)}
                    placeholder="Enter additional field 2" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalField3">Additional Field 3</Label>
                  <Input 
                    id="additionalField3" 
                    value={party.additionalField3 || ''}
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
