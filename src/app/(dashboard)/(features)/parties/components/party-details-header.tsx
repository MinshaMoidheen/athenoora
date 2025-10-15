'use client'

import { Button } from '@/components/ui/button'
import { Plus, Settings, MoreHorizontal } from 'lucide-react'

interface PartyDetailsHeaderProps {
  onAddParty: () => void
}

export function PartyDetailsHeader({ onAddParty }: PartyDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold tracking-tight">Parties</h1>
        
      </div>
      <Button onClick={onAddParty} className="bg-red-600 hover:bg-red-700">
        <Plus className="mr-2 h-4 w-4" />
        Add Party
      </Button>
    </div>
  )
}
