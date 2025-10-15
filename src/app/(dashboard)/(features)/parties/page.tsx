'use client'

import { useRouter } from 'next/navigation'
import { PartyDetailsHeader } from './components/party-details-header'
import { PartyList } from './components/party-list'

export default function PartyDetailsPage() {
  const router = useRouter()

  const handleAddParty = () => {
    router.push('/parties/add')
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PartyDetailsHeader onAddParty={handleAddParty} />
      <PartyList onAddParty={handleAddParty} />
    </div>
  )
}
