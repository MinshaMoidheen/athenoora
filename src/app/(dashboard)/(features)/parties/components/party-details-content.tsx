'use client'

import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

interface PartyDetailsContentProps {
  onAddParty: () => void
}

export function PartyDetailsContent({ onAddParty }: PartyDetailsContentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-8">
        {/* Main illustration card */}
        <div className="w-80 h-48 bg-yellow-100 rounded-lg p-6 relative">
          {/* Three user icons on the left */}
          <div className="flex flex-col space-y-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          
          {/* Text lines */}
          <div className="absolute left-16 top-6 space-y-2">
            <div className="w-32 h-2 bg-gray-300 rounded"></div>
            <div className="w-24 h-2 bg-gray-300 rounded"></div>
          </div>
          
          {/* Large user icon in top right */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-yellow-700" />
          </div>
          
          {/* Plus icon in bottom right */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <Plus className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">Party Details</h2>
        <p className="text-gray-600 leading-relaxed">
          Add your customers and suppliers to manage your business easily. Track payments and grow your business without any hassle!
        </p>
        <Button onClick={onAddParty} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Party
        </Button>
      </div>
    </div>
  )
}
