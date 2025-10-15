"use client"

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  CreditCard,
  Calendar,
  MessageCircle,
  Trash2
} from 'lucide-react'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { useDeletePartyMutation, useGetPartyByIdQuery } from '@/store/api/partyApi'

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
  createdAt?: string
  updatedAt?: string
}

export default function PartyDetailPage() {
  const params = useParams()
  const id = String((params as any).id)
  const router = useRouter()
  const { data: party, isLoading } = useGetPartyByIdQuery(id)
  const [deleteParty, { isLoading: deleting }] = useDeletePartyMutation()

  const formatBalance = (balance: number) => {
    const formatted = Math.abs(balance).toFixed(2)
    return balance >= 0 ? `₹ ${formatted}` : `-₹ ${formatted}`
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600'
    if (balance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const handleDeleteParty = async () => {
    try {
      await deleteParty(id).unwrap()
      router.push('/parties')
    } catch (error) {
      console.error('Error deleting party:', error)
    }
  }

  if (isLoading) {
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
            <h1 className="text-3xl font-bold tracking-tight">{party.name}</h1>
            <p className="text-gray-600">Party ID: {party.id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/parties/${party.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Party
          </Button>
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <DeleteConfirmationDialog
            title="Delete Party"
            description="Are you sure you want to delete this party?"
            itemName={party.name}
            onConfirm={handleDeleteParty}
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
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Party Name</label>
                  <p className="text-lg font-semibold">{party.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">GSTIN</label>
                  <p className="text-lg">{party.gstin || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <Badge 
                    variant={party.type === 'customer' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {party.type}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge 
                    variant={party.status === 'active' ? 'default' : 'secondary'}
                    className={party.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {party.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg">{party.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{party.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Billing Address</label>
                <p className="text-lg">{party.billingAddress || 'N/A'}</p>
              </div>
              {party.shippingAddress && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Shipping Address</label>
                  <p className="text-lg">{party.shippingAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Balance</label>
                <p className={`text-2xl font-bold ${getBalanceColor(party.balance || 0)}`}>
                  {formatBalance(party.balance || 0)}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">Opening Balance</label>
                <p className="text-lg">₹ {party.openingBalance?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                <p className="text-lg">₹ {party.creditLimit?.toFixed(2) || 'No Limit'}</p>
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
                <p className="text-lg">{party.createdAt ? new Date(party.createdAt).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-lg">{party.updatedAt ? new Date(party.updatedAt).toLocaleDateString() : '—'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
