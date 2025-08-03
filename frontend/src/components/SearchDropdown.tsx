'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Building2, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  type: 'unit' | 'compound'
  location?: string
  compound?: string
  price?: number
  bedrooms?: number
}

export default function SearchDropdown() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      searchProperties()
    } else {
      setResults([])
      setShowDropdown(false)
    }
  }, [searchQuery])

  const searchProperties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units?search=${encodeURIComponent(searchQuery)}&limit=5`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        const searchResults: SearchResult[] = data.data.map((unit: any) => ({
          id: unit.id,
          title: unit.title,
          type: 'unit' as const,
          location: unit.compound?.location,
          compound: unit.compound?.name,
          price: unit.price,
          bedrooms: unit.bedrooms
        }))
        setResults(searchResults)
        setShowDropdown(true)
      } else {
        console.error('API error:', data.error)
        setResults([])
      }
    } catch (error) {
      console.error('Error searching properties:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowDropdown(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'unit') {
      router.push(`/property/${result.id}`)
    }
    setShowDropdown(false)
    setSearchQuery('')
  }

  return (
    <div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location, compound, or property type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            onFocus={() => searchQuery.trim().length > 2 && setShowDropdown(true)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {result.type === 'unit' ? (
                        <Home className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Building2 className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        {result.location && (
                          <>
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{result.location}</span>
                          </>
                        )}
                        {result.compound && (
                          <span className="ml-2">• {result.compound}</span>
                        )}
                      </div>
                      {result.price && (
                        <div className="text-xs text-primary-600 mt-1">
                          {new Intl.NumberFormat('en-AE', {
                            style: 'currency',
                            currency: 'AED',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(result.price)}
                          {result.bedrooms && ` • ${result.bedrooms} BR`}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-gray-200">
                <Link 
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all results →
                </Link>
              </div>
            </div>
          ) : searchQuery.trim().length > 2 ? (
            <div className="p-4 text-center text-gray-500">
              No properties found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
} 