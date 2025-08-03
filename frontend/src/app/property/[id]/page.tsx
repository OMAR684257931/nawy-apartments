'use client'

import { useState, useEffect } from 'react'
import { MapPin, Bed, Square, DollarSign, Building2, Calendar, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PaymentPlan {
  id: string
  downPayment: number
  installment: number
  durationYears: number
}

interface Unit {
  id: string
  title: string
  referenceNumber: string
  unitNumber: string
  price: number
  bedrooms: number
  unitArea: number
  propertyType: string
  amenities: string[]
  saleType: string
  galleryImages: string[]
  deliveryYear: number
  compound: {
    id: string
    name: string
    slug: string
    location: string
    description: string
    developer: {
      name: string
      description: string
    }
  }
  paymentPlan: PaymentPlan | null
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [unit, setUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchUnit()
  }, [params.id])

  const fetchUnit = async () => {
    try {
      console.log('Fetching unit with ID:', params.id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${params.id}`)
      const data = await response.json()
      console.log('API response:', data)
      
      if (data.success) {
        setUnit(data.data)
      } else {
        console.error('API returned success: false')
      }
    } catch (error) {
      console.error('Error fetching unit:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href={`/compound/${unit.compound.slug}`} className="hover:text-primary-600">
              {unit.compound.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{unit.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                {unit.galleryImages && unit.galleryImages.length > 0 ? (
                  <img
                    src={unit.galleryImages[selectedImage]}
                    alt={unit.title}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
              </div>
              
              {unit.galleryImages && unit.galleryImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {unit.galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${unit.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{unit.title}</h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{unit.compound.location}</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>{unit.compound.developer.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Delivery {unit.deliveryYear}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPrice(unit.price)}
                  </div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{unit.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{unit.unitArea}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{unit.propertyType}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Reference:</strong> {unit.referenceNumber}</div>
                  <div><strong>Unit Number:</strong> {unit.unitNumber}</div>
                  <div><strong>Sale Type:</strong> {unit.saleType}</div>
                  <div><strong>Compound:</strong> {unit.compound.name}</div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {unit.amenities && unit.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {unit.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Plan */}
            {unit.paymentPlan && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatPrice(unit.paymentPlan.downPayment)}
                    </div>
                    <div className="text-sm text-gray-600">Down Payment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(unit.paymentPlan.installment)}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Installment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {unit.paymentPlan.durationYears} Years
                    </div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Interested in this property?</p>
                  <p className="text-sm text-gray-600">Contact us for more information</p>
                </div>
                
                <button className="btn-primary w-full">
                  Contact Agent
                </button>
                
                <button className="btn-secondary w-full">
                  Schedule Viewing
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Similar Properties</h4>
                <Link href={`/compound/${unit.compound.slug}`} className="text-primary-600 hover:text-primary-700 text-sm">
                  View more in {unit.compound.name} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 