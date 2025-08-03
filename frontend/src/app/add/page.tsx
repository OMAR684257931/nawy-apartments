'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Building2, MapPin, Bed, Square, DollarSign, Calendar, Image as ImageIcon, Upload, X } from 'lucide-react'

interface Compound {
  id: string
  name: string
  location: string
  developer: {
    name: string
  }
}

export default function AddApartmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [compounds, setCompounds] = useState<Compound[]>([])
  const [formData, setFormData] = useState({
    title: '',
    referenceNumber: '',
    unitNumber: '',
    price: '',
    bedrooms: '',
    unitArea: '',
    propertyType: 'Apartment',
    saleType: 'DeveloperSale',
    deliveryYear: new Date().getFullYear().toString(),
    compoundId: '',
    amenities: [] as string[],
    galleryImages: [] as string[]
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const propertyTypes = [
    'Apartment',
    'Villa',
    'Duplex',
    'Penthouse',
    'Chalet',
    'Studio',
    'Townhouse'
  ]

  const saleTypes = [
    'DeveloperSale',
    'Resale'
  ]

  const availableAmenities = [
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

  useEffect(() => {
    fetchCompounds()
  }, [])

  const fetchCompounds = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compounds`)
      const data = await response.json()
      console.log('Compounds fetched:', data)
      if (data.success) {
        setCompounds(data.data)
      }
    } catch (error) {
      console.error('Error fetching compounds:', error)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.map((img, i) => i === index ? value : img)
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, '']
    }))
  }

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/images`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadedImages(prev => [...prev, ...data.data])
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...data.data]
        }))
      } else {
        alert('Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate compound selection
    if (!formData.compoundId) {
      alert('Please select a compound')
      setLoading(false)
      return
    }

    // Validate that the selected compound exists
    const selectedCompound = compounds.find(c => c.id === formData.compoundId)
    if (!selectedCompound) {
      alert('Selected compound not found. Please refresh the page and try again.')
      setLoading(false)
      return
    }

    // Debug logging
    console.log('Form data being sent:', {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      unitArea: parseFloat(formData.unitArea),
      deliveryYear: parseInt(formData.deliveryYear),
      galleryImages: formData.galleryImages.filter(img => img.trim() !== '')
    })
    console.log('Selected compound:', selectedCompound)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          unitArea: parseFloat(formData.unitArea),
          deliveryYear: parseInt(formData.deliveryYear),
          galleryImages: formData.galleryImages.filter(img => img.trim() !== '')
        }),
      })

      const data = await response.json()
      console.log('API response:', data)

      if (data.success) {
        alert('Apartment added successfully!')
        router.push('/search')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error adding apartment:', error)
      alert('Failed to add apartment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Apartment</h1>
          <p className="text-gray-600">Fill in the details to add a new property to the platform</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Luxury 2BR Apartment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                  className="input-field"
                  placeholder="e.g., REF001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.unitNumber}
                  onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                  className="input-field"
                  placeholder="e.g., A-101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (AED) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 2500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={formData.unitArea}
                  onChange={(e) => handleInputChange('unitArea', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 120.5"
                />
              </div>
            </div>

            {/* Property Type and Sale Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  required
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="input-field"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Type *
                </label>
                <select
                  required
                  value={formData.saleType}
                  onChange={(e) => handleInputChange('saleType', e.target.value)}
                  className="input-field"
                >
                  {saleTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compound and Delivery Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compound *
                </label>
                <select
                  required
                  value={formData.compoundId}
                  onChange={(e) => handleInputChange('compoundId', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a compound</option>
                  {compounds.map((compound) => (
                    <option key={compound.id} value={compound.id}>
                      {compound.name} - {compound.location}
                    </option>
                  ))}
                </select>
                {compounds.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">Loading compounds...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Year *
                </label>
                <input
                  type="number"
                  required
                  min="2024"
                  max="2030"
                  value={formData.deliveryYear}
                  onChange={(e) => handleInputChange('deliveryYear', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 2024"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images
              </label>
              
              {/* File Upload */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Input Fields */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Or add image URLs:</h4>
                {formData.galleryImages.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <ImageIcon className="w-4 h-4" />
                  Add Image URL
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {loading ? 'Adding...' : 'Add Apartment'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/search')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 