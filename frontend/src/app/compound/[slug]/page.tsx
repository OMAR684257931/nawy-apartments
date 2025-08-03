'use client'

import { useState, useEffect } from 'react'
import { MapPin, Building2, Calendar, Star } from 'lucide-react'
import Link from 'next/link'
import UnitCard from '@/components/UnitCard'

interface Unit {
  id: string
  title: string
  price: number
  bedrooms: number
  unitArea: number
  propertyType: string
  compound: {
    name: string
    location: string
    developer: {
      name: string
    }
  }
  galleryImages: string[]
}

interface Compound {
  id: string
  name: string
  slug: string
  location: string
  description: string
  deliveryYear: number
  finishingStatus: string
  developer: {
    name: string
    description: string
  }
  units: Unit[]
}

export default function CompoundDetailPage({ params }: { params: { slug: string } }) {
  const [compound, setCompound] = useState<Compound | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompound()
  }, [params.slug])

  const fetchCompound = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compounds/slug/${params.slug}`)
      const data = await response.json()
      
      if (data.success) {
        setCompound(data.data)
      }
    } catch (error) {
      console.error('Error fetching compound:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compound details...</p>
        </div>
      </div>
    )
  }

  if (!compound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Compound Not Found</h1>
          <p className="text-gray-600 mb-6">The compound you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {compound.name}
            </h1>
            <p className="text-xl mb-6 text-primary-100">
              {compound.description}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{compound?.location || 'Location not available'}</span>
              </div>
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{compound?.developer?.name || 'Developer not available'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Delivery {compound?.deliveryYear || 'TBD'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compound Details */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {compound.name}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-6">
                  {compound?.description || 'No description available'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><strong>Developer:</strong> {compound.developer.name}</li>
                      <li><strong>Location:</strong> {compound.location}</li>
                      <li><strong>Delivery Year:</strong> {compound.deliveryYear}</li>
                      <li><strong>Finishing Status:</strong> {compound.finishingStatus}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Developer Info</h3>
                    <p className="text-sm text-gray-600">
                      {compound.developer.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Units</span>
                    <span className="font-semibold">{compound.units.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Developer</span>
                    <span className="font-semibold">{compound.developer.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold">{compound.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold">{compound.deliveryYear}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Link href="/search" className="btn-primary w-full text-center">
                    View All Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Units Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Units
            </h2>
            <p className="text-gray-600">
              {compound.units.length} properties available in {compound.name}
            </p>
          </div>

          {compound.units.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compound.units.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No units available
              </h3>
              <p className="text-gray-600">
                Check back later for new listings
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 