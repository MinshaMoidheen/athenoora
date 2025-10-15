'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Network, Users, TrendingUp, Globe } from 'lucide-react'

export default function VyaparNetworkPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vyapar Network</h1>
              <p className="text-gray-600 leading-relaxed">
                Join the Vyapar business network and connect with thousands of businesses. 
                Share opportunities and grow together.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg text-lg font-medium">
                <Network className="mr-2 h-5 w-5" />
                Join Network
              </Button>
            </div>

           

            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
