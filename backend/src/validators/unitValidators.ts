import { z } from 'zod'

// Base unit schema
const unitBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  referenceNumber: z.string().min(1, 'Reference number is required').max(100, 'Reference number too long'),
  unitNumber: z.string().min(1, 'Unit number is required').max(100, 'Unit number too long'),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().min(0, 'Bedrooms must be non-negative'),
  unitArea: z.number().positive('Area must be positive'),
  propertyType: z.enum(['Apartment', 'Villa', 'Duplex', 'Penthouse', 'Chalet', 'Studio', 'Townhouse']),
  saleType: z.enum(['DeveloperSale', 'Resale']),
  deliveryYear: z.number().int().min(2024, 'Delivery year must be 2024 or later'),
  compoundId: z.string().uuid('Invalid compound ID'),
  amenities: z.array(z.string()).optional().default([]),
  galleryImages: z.array(z.string().url('Invalid image URL')).optional().default([])
})

// Create unit schema
export const createUnitSchema = unitBaseSchema

// Update unit schema (all fields optional)
export const updateUnitSchema = unitBaseSchema.partial()

// Filter schema for unit queries
export const unitFiltersSchema = z.object({
  min_price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  max_price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  unit_area_min: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  unit_area_max: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  property_types: z.string().optional().transform((val) => val ? val.split(',') : undefined),
  bedrooms: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  compound_id: z.string().uuid().optional(),
  developer_id: z.string().uuid().optional(),
  amenities: z.string().optional().transform((val) => val ? val.split(',') : undefined),
  search: z.string().optional(),
  area: z.string().optional(),
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1).default('1'),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10).default('10')
})

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format')
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10)
})

// Search schema
export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Search query too long')
})

// Validation helper functions
export const validateUnitData = (data: unknown) => {
  return createUnitSchema.parse(data)
}

export const validateUnitFilters = (filters: unknown) => {
  return unitFiltersSchema.parse(filters)
}

export const validateId = (id: unknown) => {
  return idParamSchema.parse({ id }).id
}

export const validatePagination = (pagination: unknown) => {
  return paginationSchema.parse(pagination)
}

export const validateSearch = (search: unknown) => {
  return searchSchema.parse(search)
} 