'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Square, Bed, Building2, MapPin, Users } from 'lucide-react'

interface FiltersSidebarProps {
  filters: {
    min_price: string
    max_price: string
    unit_area_min: string
    unit_area_max: string
    property_types: string[]
    bedrooms: string
    compound_id: string
    developer_id: string
    amenities: string[]
    search: string
    area: string
  }
  onFilterChange: (filters: any) => void
}

interface Area {
  id: string
  name: string
}

interface Developer {
  id: string
  name: string
}

const propertyTypes = [
  'Apartment',
  'Villa',
  'Duplex',
  'Penthouse',
  'Chalet',
  'Studio',
  'Townhouse'
]

const amenities = [
  'Pool',
  'Gym',
  'Parking',
  'Balcony',
  'Garden',
  'Garage',
  '24/7 Security',
  'Marina View',
  'Private Terrace',
  'Jacuzzi'
]

export default function FiltersSidebar({ filters, onFilterChange }: FiltersSidebarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [areas, setAreas] = useState<Area[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])

  // Price filter buttons
  const priceRanges = [
    { label: 'Under 1M', min: 0, max: 1000000 },
    { label: '1M - 2M', min: 1000000, max: 2000000 },
    { label: '2M - 5M', min: 2000000, max: 5000000 },
    { label: '5M+', min: 5000000, max: null }
  ]

  // Area filter buttons
  const areaRanges = [
    { label: 'Under 100', min: 0, max: 100 },
    { label: '100-200', min: 100, max: 200 },
    { label: '200-500', min: 200, max: 500 },
    { label: '500+', min: 500, max: null }
  ]

  useEffect(() => {
    // Fetch areas and developers
    const fetchData = async () => {
      try {
        const [areasResponse, developersResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compounds`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/developers`)
        ])

        if (areasResponse.ok) {
          const areasData = await areasResponse.json()
          if (areasData.success) {
            // Extract unique areas from compounds
            const uniqueAreas = Array.from(new Set(areasData.data.map((compound: any) => compound.location)))
              .map((location, index) => ({ id: `area-${index}`, name: location as string }))
            setAreas(uniqueAreas)
          }
        }

        if (developersResponse.ok) {
          const developersData = await developersResponse.json()
          if (developersData.success) {
            setDevelopers(developersData.data)
          }
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }

    // Add a small delay to prevent rapid requests
    const timeoutId = setTimeout(() => {
      fetchData()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleInputChange = (key: string, value: string | string[]) => {
    onFilterChange({ [key]: value })
  }

  const handlePropertyTypeChange = (type: string) => {
    const currentTypes = filters.property_types
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    handleInputChange('property_types', newTypes)
  }

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = filters.amenities
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity]
    handleInputChange('amenities', newAmenities)
  }

  const handlePriceRangeClick = (min: number, max: number | null) => {
    onFilterChange({
      min_price: min.toString(),
      max_price: max ? max.toString() : ''
    })
  }

  const handleAreaRangeClick = (min: number, max: number | null) => {
    onFilterChange({
      unit_area_min: min.toString(),
      unit_area_max: max ? max.toString() : ''
    })
  }

  const clearFilters = () => {
    onFilterChange({
      min_price: '',
      max_price: '',
      unit_area_min: '',
      unit_area_max: '',
      property_types: [],
      bedrooms: '',
      compound_id: '',
      developer_id: '',
      amenities: [],
      search: '',
      area: ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          Price Range
        </h4>
        
        {/* Price Range Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handlePriceRangeClick(range.min, range.max)}
              className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                filters.min_price === range.min.toString() && 
                (range.max ? filters.max_price === range.max.toString() : filters.max_price === '')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.min_price}
            onChange={(e) => handleInputChange('min_price', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.max_price}
            onChange={(e) => handleInputChange('max_price', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Area Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Square className="w-4 h-4 mr-2" />
          Area Range (sq ft)
        </h4>
        
        {/* Area Range Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {areaRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleAreaRangeClick(range.min, range.max)}
              className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                filters.unit_area_min === range.min.toString() && 
                (range.max ? filters.unit_area_max === range.max.toString() : filters.unit_area_max === '')
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Area"
            value={filters.unit_area_min}
            onChange={(e) => handleInputChange('unit_area_min', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max Area"
            value={filters.unit_area_max}
            onChange={(e) => handleInputChange('unit_area_max', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Bed className="w-4 h-4 mr-2" />
          Bedrooms
        </h4>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
          className="input-field"
        >
          <option value="">Any</option>
          <option value="0">Studio</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>
      </div>

      {/* Area Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Area
        </h4>
        <select
          value={filters.area}
          onChange={(e) => handleInputChange('area', e.target.value)}
          className="input-field"
        >
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {/* Developer Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Developer
        </h4>
        <select
          value={filters.developer_id}
          onChange={(e) => handleInputChange('developer_id', e.target.value)}
          className="input-field"
        >
          <option value="">All Developers</option>
          {developers.map((developer) => (
            <option key={developer.id} value={developer.id}>
              {developer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Property Types */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Building2 className="w-4 h-4 mr-2" />
          Property Type
        </h4>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.property_types.includes(type)}
                onChange={() => handlePropertyTypeChange(type)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Search</h4>
        <input
          type="text"
          placeholder="Search properties..."
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          className="input-field"
        />
      </div>
    </div>
  )
} 