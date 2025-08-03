'use client'

import { Bed, Square, MapPin, Building2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

interface UnitCardProps {
  unit: Unit
}

export default function UnitCard({ unit }: UnitCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatArea = (area: number) => {
    return new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(area)
  }

  const getBedroomText = (bedrooms: number) => {
    if (bedrooms === 0) return 'Studio'
    if (bedrooms === 1) return '1 BR'
    return `${bedrooms} BR`
  }

  return (
    <Link href={`/property/${unit.id}`} className="block group">
      <div className="property-card">
        {/* Image */}
        <div className="relative h-32 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
          {unit.galleryImages && unit.galleryImages.length > 0 ? (
            <img
              src={unit.galleryImages[0]}
              alt={unit.title}
              className="property-image w-full h-full object-cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => console.error('Image failed to load:', unit.galleryImages[0])}
              onLoad={() => console.log('Image loaded successfully:', unit.galleryImages[0])}
            />
          ) : (
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
              alt={unit.title}
              fill
              className="property-image"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            {unit.propertyType}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {unit.title}
          </h3>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{unit.compound?.location || 'Location not available'}</span>
          </div>

          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span>{getBedroomText(unit.bedrooms)}</span>
              </div>
              <div className="flex items-center">
                <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span>{formatArea(unit.unitArea)} sq ft</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div className="flex-1">
              <p className="text-base sm:text-lg md:text-xl font-bold text-primary-600">
                {formatPrice(unit.price)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">{unit.compound?.developer?.name || 'Developer not available'}</p>
            </div>
            <div className="text-right sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{unit.compound?.name || 'Compound not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 