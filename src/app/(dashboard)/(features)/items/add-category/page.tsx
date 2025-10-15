'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, X } from 'lucide-react'

interface CategoryFormData {
  categoryName: string
}

export default function AddCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: ''
  })

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryName.trim()) return

    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Here you would call your server action
      // const result = await addCategory(formDataObj)
      
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
    if (!formData.categoryName.trim()) return

    setIsSubmitting(true)
    
    try {
      // Create FormData object for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Here you would call your server action
      // const result = await addCategory(formDataObj)
      
      // Reset form for new entry
      setFormData({
        categoryName: ''
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
            <h1 className="text-3xl font-bold tracking-tight">Add Category</h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/items')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Form */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
                  Category Name
                </Label>
                <Input 
                  id="categoryName" 
                  value={formData.categoryName}
                  onChange={(e) => handleInputChange('categoryName', e.target.value)}
                  placeholder="Enter category name"
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
            disabled={isSubmitting || !formData.categoryName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            Save New
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || !formData.categoryName.trim()}
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
