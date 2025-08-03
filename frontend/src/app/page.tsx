'use client'

import { useState, useEffect } from 'react'
import { Building2, Home, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import SearchDropdown from '@/components/SearchDropdown'
import Statistics from '@/components/Statistics'

interface Compound {
  id: string
  name: string
  slug: string
  location: string
  description: string
  developer: {
    name: string
  }
}

export default function HomePage() {
  const [featuredCompounds, setFeaturedCompounds] = useState<Compound[]>([])

  useEffect(() => {
    fetchFeaturedCompounds()
  }, [])

  const fetchFeaturedCompounds = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compounds`)
      const data = await response.json()
      
      if (data.success) {
        setFeaturedCompounds(data.data.slice(0, 3)) // Get first 3 compounds
      }
    } catch (error) {
      console.error('Error fetching featured compounds:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Home In A Compound
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Search and compare among 15,000+ properties and 800+ prime compounds
            </p>
            
            {/* Search Bar with Dropdown */}
            <SearchDropdown />
          </div>
        </div>
      </section>

      {/* Real Statistics */}
      <Statistics />

      {/* Featured Compounds */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Compounds
            </h2>
            <p className="text-lg text-gray-600">
              Discover the most popular developments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCompounds.map((compound) => (
              <div key={compound.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                  <Image
                    src={`https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=400&fit=crop`}
                    alt={compound.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {compound.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {compound.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{compound.developer.name}</span>
                    <Link href={`/compound/${compound.slug}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/search" className="btn-primary">
              View All Compounds
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Explore thousands of properties and find the perfect match for your lifestyle
          </p>
          <Link href="/search" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            Start Your Search
          </Link>
        </div>
      </section>
    </div>
  )
} 