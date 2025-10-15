'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Save, X } from 'lucide-react'

interface UnitFormData {
  unitName: string
  shortName: string
}

export default function AddUnitPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<UnitFormData>({
    unitName: '',
    shortName: ''
  })

  const handleInputChange = (field: keyof UnitFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.unitName.trim() || !formData.shortName.trim()) return

    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Here you would call your server action
      // const result = await addUnit(formDataObj)
      
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
    if (!formData.unitName.trim() || !formData.shortName.trim()) return

    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Here you would call your server action
      // const result = await addUnit(formDataObj)
      
      // Reset form for new entry
      setFormData({
        unitName: '',
        shortName: ''
      })
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
            <h1 className="text-3xl font-bold tracking-tight">NEW UNIT</h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/items')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit Form */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="unitName" className="text-sm font-medium text-gray-700">
                  UNIT NAME
                </Label>
                <Input 
                  id="unitName" 
                  value={formData.unitName}
                  onChange={(e) => handleInputChange('unitName', e.target.value)}
                  placeholder="Enter unit name"
                  className="text-lg"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName" className="text-sm font-medium text-gray-700">
                  SHORT NAME
                </Label>
                <Input 
                  id="shortName" 
                  value={formData.shortName}
                  onChange={(e) => handleInputChange('shortName', e.target.value)}
                  placeholder="SHORTNAME"
                  className="text-lg"
                  required 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleSaveAndNew}
            disabled={isSubmitting || !formData.unitName.trim() || !formData.shortName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            Save New
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || !formData.unitName.trim() || !formData.shortName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}
