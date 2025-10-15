'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  DollarSign, 
  Hash, 
  Tag,
  Calendar,
  Image as ImageIcon,
  Trash2,
  Eye
} from 'lucide-react'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'

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
  images?: string[]
  createdAt: string
  updatedAt: string
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
  images: ['/images/laptop1.jpg', '/images/laptop2.jpg'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20'
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItem(mockItem)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const formatPrice = (price: number) => {
    return `₹ ${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  }

  const getStockColor = (stock: number, type: string) => {
    if (type === 'service') return 'text-gray-600'
    if (stock === 0) return 'text-red-600'
    if (stock < 10) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleDeleteItem = async () => {
    setDeleting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate back to items list
      router.push('/items')
      
      // Show success message (you can add a toast notification here)
      console.log('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      // Show error message (you can add a toast notification here)
    } finally {
      setDeleting(false)
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
            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-gray-600">SKU: {item.sku} | ID: {item.id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/items/${item.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Item
          </Button>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Images
          </Button>
          <DeleteConfirmationDialog
            title="Delete Item"
            description="Are you sure you want to delete this item?"
            itemName={item.name}
            onConfirm={handleDeleteItem}
            isLoading={deleting}
            trigger={
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Item Name</label>
                  <p className="text-lg font-semibold">{item.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">SKU</label>
                  <p className="text-lg">{item.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <Badge 
                    variant={item.type === 'product' ? 'default' : 'secondary'}
                    className={item.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {item.type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge 
                    variant={item.status === 'active' ? 'default' : 'secondary'}
                    className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <Badge variant="outline" className="capitalize">
                    {item.category}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">HSN Code</label>
                  <p className="text-lg">{item.hsn || 'N/A'}</p>
                </div>
              </div>
              {item.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-lg">{item.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Sale Price</label>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(item.price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cost Price</label>
                  <p className="text-2xl font-bold text-gray-600">{formatPrice(item.cost)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Profit Margin</label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(item.price - item.cost)} ({(((item.price - item.cost) / item.cost) * 100).toFixed(1)}%)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tax Rate</label>
                  <p className="text-lg">{item.taxRate || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          {item.type === 'product' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Stock Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Stock</label>
                    <p className={`text-2xl font-bold ${getStockColor(item.stock, item.type)}`}>
                      {item.stock} units
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Opening Quantity</label>
                    <p className="text-lg">{item.openingQuantity || 0} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Min Stock Level</label>
                    <p className="text-lg">{item.minStock || 0} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-lg">{item.location || 'N/A'}</p>
                  </div>
                </div>
                {item.stock <= (item.minStock || 0) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">⚠️ Low Stock Alert</p>
                    <p className="text-yellow-700 text-sm">Stock is below minimum level</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {item.images && item.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {item.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg border flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Value</label>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(item.price * item.stock)}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">Cost Value</label>
                <p className="text-lg">{formatPrice(item.cost * item.stock)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Profit Potential</label>
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice((item.price - item.cost) * item.stock)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Units Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Units Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Base Unit</label>
                <p className="text-lg capitalize">{item.baseUnit || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Secondary Unit</label>
                <p className="text-lg capitalize">{item.secondaryUnit || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-lg">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-lg">{new Date(item.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
