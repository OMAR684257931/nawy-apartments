'use client'

import { useState, useEffect } from 'react'
import { Building2, Home, MapPin } from 'lucide-react'

interface Statistics {
  compounds: number
  properties: number
  developers: number
}

export default function Statistics() {
  const [stats, setStats] = useState<Statistics>({ compounds: 0, properties: 0, developers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      // Fetch compounds count
      const compoundsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compounds`)
      const compoundsData = await compoundsResponse.json()
      
      // Fetch units count
      const unitsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
      const unitsData = await unitsResponse.json()
      
      // Fetch developers count
      const developersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/developers`)
      const developersData = await developersResponse.json()
      
      setStats({
        compounds: compoundsData.success ? compoundsData.data.length : 0,
        properties: unitsData.success ? unitsData.pagination?.total || unitsData.data.length : 0,
        developers: developersData.success ? developersData.data.length : 0
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
      // Fallback to sample data
      setStats({ compounds: 4, properties: 6, developers: 3 })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="bg-gray-200 w-16 h-16 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.compounds}+</h3>
            <p className="text-gray-600">Compounds Available</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.properties}+</h3>
            <p className="text-gray-600">Properties Listed</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.developers}+</h3>
            <p className="text-gray-600">Developers</p>
          </div>
        </div>
      </div>
    </section>
  )
} 