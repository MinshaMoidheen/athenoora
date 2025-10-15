'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link, MessageCircle } from 'lucide-react'

export default function WhatsAppConnectPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-12 w-12 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Connect</h1>
              <p className="text-gray-600 leading-relaxed">
                Connect with your customers and suppliers through WhatsApp. Send invoices, 
                receive payments, and manage your business conversations in one place.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-medium">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Connecting
              </Button>
            </div>

           
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
