-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE finishing_status AS ENUM ('Finished', 'SemiFinished', 'CoreAndShell');
CREATE TYPE property_type AS ENUM ('Apartment', 'Villa', 'Duplex', 'Penthouse', 'Chalet', 'Studio', 'Townhouse');
CREATE TYPE sale_type AS ENUM ('DeveloperSale', 'Resale');

-- Create tables
CREATE TABLE IF NOT EXISTS developers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(500) NOT NULL,
    description TEXT,
    delivery_year INTEGER NOT NULL,
    finishing_status finishing_status NOT NULL,
    map_url TEXT,
    developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    unit_number VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER NOT NULL,
    unit_area DECIMAL(8,2) NOT NULL,
    property_type property_type NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    sale_type sale_type NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    delivery_year INTEGER NOT NULL,
    compound_id UUID REFERENCES compounds(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    down_payment DECIMAL(12,2) NOT NULL,
    installment DECIMAL(12,2) NOT NULL,
    duration_years INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_units_compound_id ON units(compound_id);
CREATE INDEX idx_units_price ON units(price);
CREATE INDEX idx_units_bedrooms ON units(bedrooms);
CREATE INDEX idx_units_property_type ON units(property_type);
CREATE INDEX idx_units_reference_number ON units(reference_number);
CREATE INDEX idx_units_unit_number ON units(unit_number);
CREATE INDEX idx_units_delivery_year ON units(delivery_year);
CREATE INDEX idx_units_created_at ON units(created_at);
CREATE INDEX idx_compounds_developer_id ON compounds(developer_id);
CREATE INDEX idx_compounds_slug ON compounds(slug);
CREATE INDEX idx_compounds_location ON compounds(location);
CREATE INDEX idx_developers_name ON developers(name);

-- Composite indexes for common queries
CREATE INDEX idx_units_price_bedrooms ON units(price, bedrooms);
CREATE INDEX idx_units_property_type_price ON units(property_type, price);
CREATE INDEX idx_units_compound_price ON units(compound_id, price);

-- Insert sample data
INSERT INTO developers (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Emaar Properties', 'Leading real estate developer in the UAE'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Damac Properties', 'Premium property developer'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Sobha Realty', 'Luxury real estate developer');

INSERT INTO compounds (id, name, slug, location, description, delivery_year, finishing_status, developer_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Downtown Views', 'downtown-views', 'Downtown Dubai', 'Luxury apartments with stunning city views', 2024, 'Finished', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Palm Vista', 'palm-vista', 'Palm Jumeirah', 'Exclusive beachfront residences', 2025, 'SemiFinished', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Marina Heights', 'marina-heights', 'Dubai Marina', 'Modern apartments with marina views', 2024, 'Finished', '550e8400-e29b-41d4-a716-446655440003'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Business Bay Residences', 'business-bay-residences', 'Business Bay', 'Contemporary urban living', 2025, 'CoreAndShell', '550e8400-e29b-41d4-a716-446655440001');

INSERT INTO units (id, title, reference_number, unit_number, price, bedrooms, unit_area, property_type, amenities, sale_type, gallery_images, delivery_year, compound_id) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Luxury 2BR Apartment', 'REF001', 'A-101', 2500000, 2, 120.5, 'Apartment', ARRAY['Pool', 'Gym', 'Parking', 'Balcony'], 'DeveloperSale', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'], 2024, '660e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Premium 3BR Villa', 'REF002', 'V-201', 4500000, 3, 250.0, 'Villa', ARRAY['Private Pool', 'Garden', 'Garage', 'Maid Room'], 'DeveloperSale', ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'], 2025, '660e8400-e29b-41d4-a716-446655440002'),
    ('770e8400-e29b-41d4-a716-446655440003', 'Modern Studio Apartment', 'REF003', 'S-301', 1200000, 0, 65.0, 'Studio', ARRAY['Gym', 'Pool', '24/7 Security'], 'Resale', ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'], 2024, '660e8400-e29b-41d4-a716-446655440003'),
    ('770e8400-e29b-41d4-a716-446655440004', 'Luxury Penthouse Suite', 'REF004', 'P-401', 8500000, 4, 400.0, 'Penthouse', ARRAY['Private Terrace', 'Jacuzzi', 'Wine Cellar', 'Home Theater'], 'DeveloperSale', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'], 2025, '660e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440005', '1BR Marina View', 'REF005', 'M-501', 1800000, 1, 85.0, 'Apartment', ARRAY['Marina View', 'Balcony', 'Gym', 'Pool'], 'DeveloperSale', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'], 2024, '660e8400-e29b-41d4-a716-446655440003'),
    ('770e8400-e29b-41d4-a716-446655440006', 'Elegant Townhouse', 'REF006', 'T-601', 3200000, 3, 180.0, 'Townhouse', ARRAY['Garden', 'Garage', 'Balcony', 'Storage'], 'Resale', ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'], 2025, '660e8400-e29b-41d4-a716-446655440004');

INSERT INTO payment_plans (id, unit_id, down_payment, installment, duration_years) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 500000, 166667, 12),
    ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 900000, 300000, 12),
    ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 240000, 80000, 12),
    ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 1700000, 566667, 12),
    ('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 360000, 120000, 12),
    ('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440006', 640000, 213333, 12); 