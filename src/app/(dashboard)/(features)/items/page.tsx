'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ItemsHeader } from './components/items-header'
import { ItemsContent } from './components/items-content'
import { ItemsList } from './components/items-list'

export default function ItemsPage() {
  const router = useRouter()
  const [hasItems, setHasItems] = useState(true) // Start with false to show empty state

  const handleAddItem = () => {
    router.push('/items/add-service?type=product')
  }

  return (
    <div className="flex-1 space-y-2 p-4 md:p-8 pt-4">
      <ItemsHeader onAddItem={handleAddItem} />
      
      {hasItems ? (
        <ItemsList onAddItem={handleAddItem} />
      ) : (
        <ItemsContent onAddItem={handleAddItem} />
      )}
    </div>
  )
}
