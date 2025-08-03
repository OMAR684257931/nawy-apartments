'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Bed, Square, DollarSign, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import UnitCard from '@/components/UnitCard'
import FiltersSidebar from '@/components/FiltersSidebar'
import Pagination from '@/components/Pagination'

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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    unit_area_min: '',
    unit_area_max: '',
    property_types: [] as string[],
    bedrooms: '',
    compound_id: '',
    developer_id: '',
    amenities: [] as string[],
    search: searchParams.get('q') || '',
    area: '',
    page: 1,
    limit: 12
  })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUnits()
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timeoutId)
  }, [filters])

  // Refresh data when page is mounted (for navigation from add page)
  useEffect(() => {
    fetchUnits()
  }, []) // Empty dependency array means this runs once on mount

  const fetchUnits = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','))
          } else {
            params.append(key, value.toString())
          }
        }
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setUnits(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery }))
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: number) => {
    setFilters(prev => ({ ...prev, page: 1, limit: newLimit }))
  }

  const sortedUnits = [...units].sort((a, b) => {
    const aValue = a[sortBy as keyof Unit]
    const bValue = b[sortBy as keyof Unit]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Search Properties</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <a
                href="/add"
                className="hidden md:flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Apartment</span>
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, compound, or property type..."
                className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded-md transition-colors text-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Sorting Options */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <span className="text-sm font-medium text-gray-700 w-full md:w-auto">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-sm ${
                  sortBy === 'price' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Price</span>
                {sortBy === 'price' ? (
                  sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort('bedrooms')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-sm ${
                  sortBy === 'bedrooms' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Bedrooms</span>
                {sortBy === 'bedrooms' ? (
                  sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort('unitArea')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-sm ${
                  sortBy === 'unitArea' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Area</span>
                {sortBy === 'unitArea' ? (
                  sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => handleSort('title')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-sm ${
                  sortBy === 'title' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Name</span>
                {sortBy === 'title' ? (
                  sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Search Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? 'Loading...' : `${pagination.total} Properties Found`}
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedUnits.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedUnits.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleLimitChange}
                    showItemsPerPage={true}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <a
                  href="/add"
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Property</span>
                </a>
              </div>
            )}

            {/* Mobile Add Button */}
            <div className="md:hidden fixed bottom-6 right-6">
              <a
                href="/add"
                className="flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors"
              >
                <Plus className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 