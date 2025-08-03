import { PrismaClient, Unit, Prisma } from '@prisma/client'
import { cache } from '../utils/cache'

const prisma = new PrismaClient()

export interface UnitFilters {
  min_price?: number
  max_price?: number
  unit_area_min?: number
  unit_area_max?: number
  property_types?: string[]
  bedrooms?: number
  compound_id?: string
  developer_id?: string
  amenities?: string[]
  search?: string
  area?: string
  page?: number
  limit?: number
}

export interface UnitWithRelations extends Unit {
  compound: {
    id: string
    name: string
    location: string
    developer: {
      id: string
      name: string
    }
  }
  paymentPlan?: {
    id: string
    downPayment: number
    installment: number
    durationYears: number
  }
}

export class UnitService {
  /**
   * Get units with optimized queries and caching
   */
  static async getUnits(filters: UnitFilters): Promise<{
    data: UnitWithRelations[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const cacheKey = `units:${JSON.stringify(filters)}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    // Build where clause with optimized conditions
    const where: Prisma.UnitWhereInput = {}

    if (filters.min_price || filters.max_price) {
      where.price = {}
      if (filters.min_price) where.price.gte = filters.min_price
      if (filters.max_price) where.price.lte = filters.max_price
    }

    if (filters.unit_area_min || filters.unit_area_max) {
      where.unitArea = {}
      if (filters.unit_area_min) where.unitArea.gte = filters.unit_area_min
      if (filters.unit_area_max) where.unitArea.lte = filters.unit_area_max
    }

    if (filters.bedrooms) {
      where.bedrooms = filters.bedrooms
    }

    if (filters.property_types && filters.property_types.length > 0) {
      where.propertyType = { in: filters.property_types }
    }

    if (filters.compound_id) {
      where.compoundId = filters.compound_id
    }

    if (filters.developer_id) {
      where.compound = { developerId: filters.developer_id }
    }

    if (filters.area) {
      where.compound = {
        ...where.compound,
        location: { contains: filters.area, mode: 'insensitive' }
      }
    }

    if (filters.amenities && filters.amenities.length > 0) {
      where.amenities = { hasSome: filters.amenities }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { referenceNumber: { contains: filters.search, mode: 'insensitive' } },
        { unitNumber: { contains: filters.search, mode: 'insensitive' } },
        { compound: { name: { contains: filters.search, mode: 'insensitive' } } },
        { compound: { developer: { name: { contains: filters.search, mode: 'insensitive' } } } }
      ]
    }

    // Optimized query with includes to prevent N+1
    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          compound: {
            include: {
              developer: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          paymentPlan: {
            select: {
              id: true,
              downPayment: true,
              installment: true,
              durationYears: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.unit.count({ where })
    ])

    const result = {
      data: units as UnitWithRelations[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }

    // Cache for 5 minutes
    cache.set(cacheKey, result, 5 * 60 * 1000)

    return result
  }

  /**
   * Get unit by ID with optimized query
   */
  static async getUnitById(id: string): Promise<UnitWithRelations | null> {
    const cacheKey = `unit:${id}`
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        compound: {
          include: {
            developer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        paymentPlan: {
          select: {
            id: true,
            downPayment: true,
            installment: true,
            durationYears: true
          }
        }
      }
    })

    if (unit) {
      cache.set(cacheKey, unit, 10 * 60 * 1000) // Cache for 10 minutes
    }

    return unit as UnitWithRelations | null
  }

  /**
   * Create unit with validation
   */
  static async createUnit(data: Prisma.UnitCreateInput): Promise<UnitWithRelations> {
    // Validate reference number uniqueness
    const existingUnit = await prisma.unit.findUnique({
      where: { referenceNumber: data.referenceNumber as string }
    })

    if (existingUnit) {
      throw new Error('Reference number already exists')
    }

    // Validate compound exists
    const compound = await prisma.compound.findUnique({
      where: { id: data.compoundId as string }
    })

    if (!compound) {
      throw new Error('Compound not found')
    }

    const unit = await prisma.unit.create({
      data,
      include: {
        compound: {
          include: {
            developer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        paymentPlan: {
          select: {
            id: true,
            downPayment: true,
            installment: true,
            durationYears: true
          }
        }
      }
    })

    // Clear related caches
    cache.deletePattern('units:')
    cache.delete(`unit:${unit.id}`)

    return unit as UnitWithRelations
  }

  /**
   * Get compounds with optimized query
   */
  static async getCompounds() {
    const cacheKey = 'compounds:all'
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const compounds = await prisma.compound.findMany({
      include: {
        developer: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    cache.set(cacheKey, compounds, 10 * 60 * 1000) // Cache for 10 minutes
    return compounds
  }

  /**
   * Get developers with optimized query
   */
  static async getDevelopers() {
    const cacheKey = 'developers:all'
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const developers = await prisma.developer.findMany({
      orderBy: { name: 'asc' }
    })

    cache.set(cacheKey, developers, 10 * 60 * 1000) // Cache for 10 minutes
    return developers
  }
} 