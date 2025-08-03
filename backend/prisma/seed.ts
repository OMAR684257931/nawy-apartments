import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Ensure database is ready
  try {
    await prisma.$connect()
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }

  // Clear existing data to ensure clean seeding
  console.log('🧹 Clearing existing data...')
  await prisma.paymentPlan.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.compound.deleteMany()
  await prisma.developer.deleteMany()

  // Create Developers
  console.log('🏢 Creating developers...')
  const emaar = await prisma.developer.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Emaar Properties',
      description: 'Leading real estate developer in the UAE'
    }
  })

  const damac = await prisma.developer.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Damac Properties',
      description: 'Premium property developer'
    }
  })

  const sobha = await prisma.developer.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Sobha Realty',
      description: 'Luxury real estate developer'
    }
  })

  // Create Compounds
  console.log('🏘️ Creating compounds...')
  const downtownViews = await prisma.compound.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Downtown Views',
      slug: 'downtown-views',
      location: 'Downtown Dubai',
      description: 'Luxury apartments with stunning city views',
      deliveryYear: 2024,
      finishingStatus: 'Finished',
      developerId: emaar.id
    }
  })

  const palmVista = await prisma.compound.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Palm Vista',
      slug: 'palm-vista',
      location: 'Palm Jumeirah',
      description: 'Exclusive beachfront residences',
      deliveryYear: 2025,
      finishingStatus: 'SemiFinished',
      developerId: damac.id
    }
  })

  const marinaHeights = await prisma.compound.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Marina Heights',
      slug: 'marina-heights',
      location: 'Dubai Marina',
      description: 'Modern apartments with marina views',
      deliveryYear: 2024,
      finishingStatus: 'Finished',
      developerId: sobha.id
    }
  })

  const businessBay = await prisma.compound.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440004' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440004',
      name: 'Business Bay Residences',
      slug: 'business-bay-residences',
      location: 'Business Bay',
      description: 'Contemporary urban living',
      deliveryYear: 2025,
      finishingStatus: 'CoreAndShell',
      developerId: emaar.id
    }
  })

  // Create Units
  console.log('🏠 Creating units...')
  const unit1 = await prisma.unit.upsert({
    where: { id: '770e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '770e8400-e29b-41d4-a716-446655440001',
      title: 'Luxury 2BR Apartment',
      referenceNumber: 'REF001',
      unitNumber: 'A-101',
      price: 2500000,
      bedrooms: 2,
      unitArea: 120.5,
      propertyType: 'Apartment',
      amenities: ['Pool', 'Gym', 'Parking', 'Balcony'],
      saleType: 'DeveloperSale',
      galleryImages: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'
      ],
      deliveryYear: 2024,
      compoundId: downtownViews.id
    }
  })

  const unit2 = await prisma.unit.upsert({
    where: { id: '770e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '770e8400-e29b-41d4-a716-446655440002',
      title: 'Premium 3BR Villa',
      referenceNumber: 'REF002',
      unitNumber: 'V-201',
      price: 4500000,
      bedrooms: 3,
      unitArea: 250.0,
      propertyType: 'Villa',
      amenities: ['Private Pool', 'Garden', 'Garage', 'Maid Room'],
      saleType: 'DeveloperSale',
      galleryImages: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      deliveryYear: 2025,
      compoundId: palmVista.id
    }
  })

  const unit3 = await prisma.unit.upsert({
    where: { id: '770e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '770e8400-e29b-41d4-a716-446655440003',
      title: 'Modern Studio Apartment',
      referenceNumber: 'REF003',
      unitNumber: 'S-301',
      price: 1200000,
      bedrooms: 0,
      unitArea: 65.0,
      propertyType: 'Studio',
      amenities: ['Gym', 'Pool', '24/7 Security'],
      saleType: 'Resale',
      galleryImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      deliveryYear: 2024,
      compoundId: marinaHeights.id
    }
  })

  const unit4 = await prisma.unit.upsert({
    where: { id: '770e8400-e29b-41d4-a716-446655440004' },
    update: {},
    create: {
      id: '770e8400-e29b-41d4-a716-446655440004',
      title: 'Luxury Penthouse Suite',
      referenceNumber: 'REF004',
      unitNumber: 'P-401',
      price: 8500000,
      bedrooms: 4,
      unitArea: 400.0,
      propertyType: 'Penthouse',
      amenities: ['Private Terrace', 'Jacuzzi', 'Wine Cellar', 'Home Theater'],
      saleType: 'DeveloperSale',
      galleryImages: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
      ],
      deliveryYear: 2025,
      compoundId: downtownViews.id
    }
  })

  const unit5 = await prisma.unit.upsert({
    where: { id: '770e8400-e29b-41d4-a716-446655440005' },
    update: {},
    create: {
      id: '770e8400-e29b-41d4-a716-446655440005',
      title: '1BR Marina View',
      referenceNumber: 'REF005',
      unitNumber: 'M-501',
      price: 1800000,
      bedrooms: 1,
      unitArea: 85.0,
      propertyType: 'Apartment',
      amenities: ['Marina View', 'Balcony', 'Gym', 'Pool'],
      saleType: 'DeveloperSale',
      galleryImages: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ],
      deliveryYear: 2024,
      compoundId: marinaHeights.id
    }
  })

  const unit6 = await prisma.unit.upsert({
    where: { id: '770e8400-e29b-41d4-a716-446655440006' },
    update: {},
    create: {
      id: '770e8400-e29b-41d4-a716-446655440006',
      title: 'Elegant Townhouse',
      referenceNumber: 'REF006',
      unitNumber: 'T-601',
      price: 3200000,
      bedrooms: 3,
      unitArea: 180.0,
      propertyType: 'Townhouse',
      amenities: ['Garden', 'Garage', 'Balcony', 'Storage'],
      saleType: 'Resale',
      galleryImages: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      deliveryYear: 2025,
      compoundId: businessBay.id
    }
  })

  // Create Payment Plans
  console.log('💰 Creating payment plans...')
  await prisma.paymentPlan.upsert({
    where: { id: '880e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '880e8400-e29b-41d4-a716-446655440001',
      unitId: unit1.id,
      downPayment: 500000,
      installment: 166667,
      durationYears: 12
    }
  })

  await prisma.paymentPlan.upsert({
    where: { id: '880e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '880e8400-e29b-41d4-a716-446655440002',
      unitId: unit2.id,
      downPayment: 900000,
      installment: 300000,
      durationYears: 12
    }
  })

  await prisma.paymentPlan.upsert({
    where: { id: '880e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '880e8400-e29b-41d4-a716-446655440003',
      unitId: unit3.id,
      downPayment: 240000,
      installment: 80000,
      durationYears: 12
    }
  })

  await prisma.paymentPlan.upsert({
    where: { id: '880e8400-e29b-41d4-a716-446655440004' },
    update: {},
    create: {
      id: '880e8400-e29b-41d4-a716-446655440004',
      unitId: unit4.id,
      downPayment: 1700000,
      installment: 566667,
      durationYears: 12
    }
  })

  await prisma.paymentPlan.upsert({
    where: { id: '880e8400-e29b-41d4-a716-446655440005' },
    update: {},
    create: {
      id: '880e8400-e29b-41d4-a716-446655440005',
      unitId: unit5.id,
      downPayment: 360000,
      installment: 120000,
      durationYears: 12
    }
  })

  await prisma.paymentPlan.upsert({
    where: { id: '880e8400-e29b-41d4-a716-446655440006' },
    update: {},
    create: {
      id: '880e8400-e29b-41d4-a716-446655440006',
      unitId: unit6.id,
      downPayment: 640000,
      installment: 213333,
      durationYears: 12
    }
  })

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created: ${await prisma.developer.count()} developers`)
  console.log(`📊 Created: ${await prisma.compound.count()} compounds`)
  console.log(`📊 Created: ${await prisma.unit.count()} units`)
  console.log(`📊 Created: ${await prisma.paymentPlan.count()} payment plans`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 