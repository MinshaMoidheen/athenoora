'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Hash,
  ChevronLeft,
  ChevronRight,
  Settings,
  Filter,
  Download,
  Printer,
  MessageSquare,
  Clock,
  Plus,
  ShoppingCart,
  TrendingUp,
  X,
  ArrowDown,
  ArrowUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { AddCategoryModal } from './add-category-modal'

interface Item {
  id: string
  name: string
  sku?: string
  price: number
  cost: number
  stock: number
  category: string
  status: 'active' | 'inactive'
  type: 'product' | 'service'
}

interface ItemTransaction {
  id: string
  type: 'sale' | 'purchase' | 'adjustment' | 'transfer'
  quantity: number
  date: string
  price: number
  total: number
  reference: string
}

// Mock data - in real app this would come from API/database
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Dell Laptop XPS 13',
    sku: 'LAP-001',
    price: 85000.00,
    cost: 65000.00,
    stock: 15,
    category: 'Electronics',
    status: 'active',
    type: 'product'
  },
  {
    id: '2',
    name: 'Web Development Service',
    sku: 'SVC-001',
    price: 25000.00,
    cost: 12000.00,
    stock: 0,
    category: 'Services',
    status: 'active',
    type: 'service'
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    sku: 'FUR-001',
    price: 12000.00,
    cost: 7500.00,
    stock: 8,
    category: 'Furniture',
    status: 'active',
    type: 'product'
  },
  {
    id: '4',
    name: 'iPhone 15 Pro',
    sku: 'PHN-001',
    price: 120000.00,
    cost: 95000.00,
    stock: 5,
    category: 'Electronics',
    status: 'active',
    type: 'product'
  },
  {
    id: '5',
    name: 'Digital Marketing Service',
    sku: 'SVC-002',
    price: 18000.00,
    cost: 10000.00,
    stock: 0,
    category: 'Services',
    status: 'active',
    type: 'service'
  },
  {
    id: '6',
    name: 'Office Desk - Mahogany',
    sku: 'FUR-002',
    price: 25000.00,
    cost: 15000.00,
    stock: 3,
    category: 'Furniture',
    status: 'active',
    type: 'product'
  },
  {
    id: '7',
    name: 'Samsung 4K Monitor',
    sku: 'MON-001',
    price: 35000.00,
    cost: 25000.00,
    stock: 12,
    category: 'Electronics',
    status: 'active',
    type: 'product'
  },
  {
    id: '8',
    name: 'Graphic Design Service',
    sku: 'SVC-003',
    price: 8000.00,
    cost: 4000.00,
    stock: 0,
    category: 'Services',
    status: 'active',
    type: 'service'
  },
  {
    id: '9',
    name: 'Wireless Keyboard & Mouse',
    sku: 'ACC-001',
    price: 3500.00,
    cost: 2000.00,
    stock: 0,
    category: 'Electronics',
    status: 'inactive',
    type: 'product'
  },
  {
    id: '10',
    name: 'Conference Table',
    sku: 'FUR-003',
    price: 45000.00,
    cost: 30000.00,
    stock: 2,
    category: 'Furniture',
    status: 'active',
    type: 'product'
  },
  {
    id: '11',
    name: 'Consulting Service',
    sku: 'SVC-004',
    price: 5000.00,
    cost: 2000.00,
    stock: 0,
    category: 'Services',
    status: 'active',
    type: 'service'
  },
  {
    id: '12',
    name: 'Gaming Headset',
    sku: 'GAM-001',
    price: 8000.00,
    cost: 5000.00,
    stock: 20,
    category: 'Electronics',
    status: 'active',
    type: 'product'
  },
  {
    id: '13',
    name: 'Bookshelf Unit',
    sku: 'FUR-004',
    price: 15000.00,
    cost: 9000.00,
    stock: 6,
    category: 'Furniture',
    status: 'active',
    type: 'product'
  },
  {
    id: '14',
    name: 'SEO Optimization Service',
    sku: 'SVC-005',
    price: 12000.00,
    cost: 6000.00,
    stock: 0,
    category: 'Services',
    status: 'active',
    type: 'service'
  },
  {
    id: '15',
    name: 'Portable Hard Drive 1TB',
    sku: 'STG-001',
    price: 6000.00,
    cost: 3500.00,
    stock: 25,
    category: 'Electronics',
    status: 'active',
    type: 'product'
  }
]

// Mock transaction data
const mockItemTransactions: ItemTransaction[] = [
  {
    id: '1',
    type: 'sale',
    quantity: 5,
    date: '03/10/2025',
    price: 150.00,
    total: 750.00,
    reference: 'SO-001'
  },
  {
    id: '2',
    type: 'purchase',
    quantity: 20,
    date: '02/10/2025',
    price: 100.00,
    total: 2000.00,
    reference: 'PO-001'
  },
  {
    id: '3',
    type: 'adjustment',
    quantity: -2,
    date: '01/10/2025',
    price: 120.00,
    total: -240.00,
    reference: 'ADJ-001'
  }
]

interface ItemsListProps {
  onAddItem: () => void
}

export function ItemsList({ onAddItem }: ItemsListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState<Item[]>([]) // Start with empty array
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [transactions, setTransactions] = useState<ItemTransaction[]>(mockItemTransactions)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('products')
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  // Add sample data when component mounts (for demo purposes)
  const addSampleData = () => {
    setItems(mockItems)
    setSelectedItem(mockItems[0]) // Select first item by default
  }

  // Add a new item (this would be called from the modal)
  const addNewItem = (newItem: Item) => {
    setItems(prev => [...prev, newItem])
  }

  const formatPrice = (price: number) => {
    return `₹ ${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  }

  const getStockColor = (stock: number, type: string) => {
    if (type === 'service') return 'text-gray-600'
    if (stock === 0) return 'text-red-600'
    if (stock < 10) return 'text-yellow-600'
    return 'text-green-600'
  }

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  const handleDeleteItem = async (itemId: string) => {
    setDeletingId(itemId)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove item from state
      setItems(prev => prev.filter(item => item.id !== itemId))
      
      // Show success message (you can add a toast notification here)
      console.log('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      // Show error message (you can add a toast notification here)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddService = () => {
    router.push('/items/add-service')
  }

  const handleAddItem = () => {
    router.push('/items/add-service?type=product')
  }

  const handleAddCategory = () => {
    setIsCategoryModalOpen(true)
  }

  const handleAddUnit = () => {
    router.push('/items/add-unit')
  }

  const handleCategoryAdded = (categoryName: string) => {
    // Here you would typically add the category to your state or call an API
    console.log('Category added:', categoryName)
    setIsCategoryModalOpen(false)
  }








  return (
    <div className="space-y-2">
      {/* Top Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="products" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            PRODUCTS
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            SERVICES
          </TabsTrigger>
          <TabsTrigger value="category" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            CATEGORY
          </TabsTrigger>
          <TabsTrigger value="units" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            UNITS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-0">
          <div className="flex h-[calc(100vh-150px)]">
            {/* Left Panel - Items List */}
            <div className="w-1/3 border-r bg-white">
              {/* Header */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
                      placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
                  <Button 
                    onClick={handleAddItem} 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
      </div>

              {/* Items List Table */}
              <div className="flex-1 overflow-y-auto">
      {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                      <p className="text-gray-500 text-sm">Get started by adding your first item or loading sample data.</p>
            <div className="flex gap-2">
                        <Button onClick={addSampleData} variant="outline" size="sm">
                Load Sample Data
              </Button>
            </div>
          </div>
        </div>
      ) : (
                  <div className="border-b">
                    {/* Table Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-1">
                          ITEM
                          <Filter className="h-3 w-3" />
                  </div>
                        <div className="flex items-center gap-1">
                          QUANTITY
                          <Filter className="h-3 w-3" />
                  </div>
                  </div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            selectedItem?.id === item.id 
                              ? 'bg-blue-50 border-l-4 border-blue-500' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="font-medium text-gray-900 truncate">{item.name}</div>
                            <div className="text-gray-600">{item.stock}</div>
                    </div>
                          <div className="flex justify-end mt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/items/${item.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/items/${item.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  View Pricing
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
        </div>
      )}
              </div>
            </div>

            {/* Right Panel - Item Details */}
            <div className="flex-1 bg-white">
              {selectedItem ? (
                <>
                  {/* Item Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900 uppercase">{selectedItem.name}</h2>
                        <Button variant="ghost" size="sm">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        ADJUST ITEM
                      </Button>
                    </div>
                    
                    {/* Price Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">SALE PRICE:</span>
                        <span className="text-lg font-bold text-green-600">{formatPrice(selectedItem.price)} (excl)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">PURCHASE PRICE:</span>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(selectedItem.cost)} (excl)</span>
                      </div>
                    </div>
                    
                    {/* Stock Information */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">STOCK QUANTITY:</span>
                        <span className="text-lg font-bold text-gray-900">{selectedItem.stock}</span>
                      </div>
          <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">STOCK VALUE:</span>
                        <span className="text-lg font-bold text-green-600">₹ {(selectedItem.price * selectedItem.stock).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
          </div>
          
                  {/* Transactions Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">TRANSACTIONS</h3>
          <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search transactions..."
                            className="pl-10 pr-8 w-64"
                          />
                          <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-600">
                          <div className="flex items-center gap-1">
                            TYPE
                            <Filter className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-1">
                            INVOICE/...
                            <Filter className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-1">
                            NAME
                            <Filter className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-1">
                            DATE
                            <ArrowDown className="h-3 w-3" />
                            <Filter className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-1">
                            QUANTITY
                            <Filter className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-1">
                            PRICE/U...
                            <Filter className="h-3 w-3" />
                          </div>
            <div className="flex items-center gap-1">
                            STATUS
                            <Filter className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                      <div className="divide-y">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="px-4 py-3 hover:bg-gray-50">
                            <div className="grid grid-cols-7 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-gray-900">Add Adjustment...</span>
                              </div>
                              <div className="text-gray-900">{transaction.reference}</div>
                              <div className="text-gray-900">{selectedItem.name}</div>
                              <div className="text-gray-600">{transaction.date}</div>
                              <div className="text-gray-900">{transaction.quantity} Pac</div>
                              <div className="text-gray-900 font-medium">
                                ₹ {transaction.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="flex items-center justify-end">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Select an item</h3>
                    <p className="text-gray-500">Choose an item from the list to view details and transactions.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-0">
          <div className="flex h-[calc(100vh-150px)]">
            {/* Left Panel - Services List */}
            <div className="w-1/3 border-r bg-white">
              {/* Header */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search services..."
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleAddService} 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Services List Table */}
              <div className="flex-1 overflow-y-auto">
                <div className="border-b">
                  {/* Table Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        ITEM
                        <Filter className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y">
                    <div className="px-4 py-3 cursor-pointer transition-colors bg-blue-50 border-l-4 border-blue-500">
                      <div className="text-sm font-medium text-gray-900">dfghj</div>
                      <div className="flex justify-end mt-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
              </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Service Details */}
            <div className="flex-1 bg-white">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase">DFGHJ</h2>
                    <Button variant="ghost" size="sm">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Service Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">SALE PRICE:</span>
                    <span className="text-lg font-bold text-green-600">₹0.00 (excl)</span>
                  </div>
                </div>
              </div>

              {/* Transactions Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">TRANSACTIONS</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search transactions..."
                        className="pl-10 pr-8 w-64"
                      />
                      <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        TYPE
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        INVOICE/...
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        NAME
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        DATE
                        <ArrowDown className="h-3 w-3" />
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        QUANTITY
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        PRICE/U...
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        STATUS
                        <Filter className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-center text-gray-500">
                    No transactions to show
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="category" className="space-y-0">
          <div className="flex h-[calc(100vh-150px)]">
            {/* Left Panel - Categories List */}
            <div className="w-1/3 border-r bg-white">
              {/* Header */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleAddCategory} 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Categories List Table */}
              <div className="flex-1 overflow-y-auto">
                <div className="border-b">
                  {/* Table Body */}
                  <div className="divide-y">
                    
                    <div className="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">Sample item</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">2</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Category Items */}
            <div className="flex-1 bg-white">
              {/* <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 uppercase">ITEMS NOT IN ANY CATEGORY</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Move To This Category
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search items..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </div> */}

              {/* Items Table */}
              <div className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        NAME
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        QUANTITY
                        <Filter className="h-3 w-3" />
                      </div>
                      <div className="flex items-center gap-1">
                        STOCK VALUE
                        <Filter className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  <div className="divide-y">
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-gray-900">Sample Item</div>
                        <div className="text-gray-600">-11</div>
                        <div className="text-gray-900">₹0.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
          </div>
        </TabsContent>

        <TabsContent value="units" className="space-y-0">
          <div className="flex h-[calc(100vh-150px)]">
            {/* Left Panel - Units List */}
            <div className="w-1/3 border-r bg-white">
              {/* Header */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search units..."
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleAddUnit} 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Units
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Units List Table */}
              <div className="flex-1 overflow-y-auto">
                <div className="border-b">
                  {/* Table Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                      <div>FULLNAME</div>
                      <div>SHORTNAME</div>
                    </div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y">
                    {[
                      { fullName: 'BAGS', shortName: 'Bag' },
                      { fullName: 'BOTTLES', shortName: 'Btl' },
                      { fullName: 'BOX', shortName: 'Box' },
                      { fullName: 'BUNDLES', shortName: 'Bdl' },
                      { fullName: 'CANS', shortName: 'Can' },
                      { fullName: 'CARTONS', shortName: 'Ctn' },
                      { fullName: 'DOZENS', shortName: 'Dzn' },
                      { fullName: 'GRAMMES', shortName: 'Gm' },
                      { fullName: 'KILOGRAMS', shortName: 'Kg' },
                      { fullName: 'LITRE', shortName: 'Ltr' },
                      { fullName: 'METERS', shortName: 'Mtr' }
                    ].map((unit, index) => (
                      <div 
                        key={index}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          index === 3 ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="font-medium text-gray-900">{unit.fullName}</div>
                          <div className="text-gray-600">{unit.shortName}</div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Unit Conversions */}
            <div className="flex-1 bg-white">
              {/* <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 uppercase">Unit Conversions</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add Conversion
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search conversions..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </div> */}

              {/* Conversions Table */}
              <div className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                      <div>UNITS</div>
                      <div>CONVERSION</div>
                    </div>
                  </div>
                  <div className="p-8 text-center text-gray-500">
                    No Rows To Show
                  </div>
          </div>
        </div>
      </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleCategoryAdded}
      />
    </div>
  )
}
