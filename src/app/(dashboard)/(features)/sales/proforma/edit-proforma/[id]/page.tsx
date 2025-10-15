'use client'

import { useParams } from 'next/navigation'

export default function EditProformaPage() {
  const params = useParams()
  const id = params.id
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Proforma #{id}</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  )
}


