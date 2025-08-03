# 🏠 Nawy Real Estate Platform

A full-stack real estate listing platform built with modern technologies, featuring advanced search, filtering, and property management capabilities.

![Demo](demo.mp4)

## 🚀 Live Demo

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000  
**API Documentation**: http://localhost:5000/api-docs

## ✨ Features

### 🏘️ Property Management
- **Comprehensive Property Listings**: Detailed property information with images, pricing, and amenities
- **Advanced Search & Filtering**: Filter by price, area, bedrooms, property type, developer, and location
- **Real-time Search**: Instant search suggestions with dropdown results
- **Property Details**: Complete property information with payment plans and developer details
- **Add Properties**: Full form to add new apartments with validation and image upload
- **Image Upload**: Support for uploading multiple images with preview

### 🔍 Advanced Search & Filtering
- **Price Range**: Filter by minimum and maximum price with quick filter buttons
- **Area Range**: Filter by property area with predefined ranges
- **Bedrooms**: Filter by number of bedrooms
- **Property Types**: Filter by apartment, villa, duplex, penthouse, etc.
- **Area Selection**: Dropdown for selecting specific areas
- **Developer Selection**: Filter by specific developers
- **Amenities**: Filter by available amenities (pool, gym, parking, etc.)
- **Text Search**: Search across property titles, compound names, and locations
- **Sorting Options**: Sort by Price, Bedrooms, Area, or Name with ascending/descending order

### 📱 User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Statistics**: Live data from backend showing compounds, properties, and developers
- **Interactive Filters**: Dynamic filter sidebar with clear all functionality
- **Loading States**: Smooth loading indicators and error handling
- **Search Bar**: Prominent search bar at the top of the search page
- **Property Cards**: Beautiful property cards with hover effects and image galleries

### 🏗️ Technical Features
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized queries, caching, and database indexing
- **Security**: Rate limiting, CORS, input sanitization, and validation
- **Error Handling**: Comprehensive error boundaries and user-friendly messages
- **API Documentation**: Complete Swagger/OpenAPI documentation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **SWR**: Data fetching and caching

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **Prisma**: Database ORM
- **PostgreSQL**: Relational database
- **Zod**: Schema validation
- **Swagger**: API documentation
- **Multer**: File upload handling

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **PostgreSQL**: Database with optimized indexing

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nawy-apartments
   ```

2. **Start the application**
   ```bash
   docker compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

4. **Database Seeding**
   The application automatically seeds the database with sample data on startup. The seeding process includes:
   - 3 developers (Emaar Properties, Damac Properties, Sobha Realty)
   - 4 compounds (Downtown Views, Palm Vista, Marina Heights, Business Bay Residences)
   - 6 units with various property types and amenities
   - 6 payment plans for the units
   
   If you need to manually reseed:
   ```bash
   ./scripts/seed.sh
   ```

### Development Setup

1. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd frontend && npm install
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   
   # Frontend
   cp frontend/env.example frontend/.env
   ```

3. **Run development servers**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

## 📁 Project Structure

```
nawy-apartments/
├── backend/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── validators/      # Input validation schemas
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema and migrations
│   └── uploads/             # Uploaded images
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable React components
│   │   └── hooks/           # Custom React hooks
│   └── public/              # Static assets
├── database/
│   └── init.sql             # Database initialization
└── docker-compose.yml       # Container orchestration
```

## 🗄️ Database Schema

### Core Entities

#### Units
- **id**: UUID (Primary Key)
- **title**: Property title
- **referenceNumber**: Unique reference number
- **unitNumber**: Unit number
- **price**: Property price (DECIMAL)
- **bedrooms**: Number of bedrooms
- **unitArea**: Area in square feet
- **propertyType**: Apartment, Villa, Duplex, etc.
- **saleType**: Developer Sale or Resale
- **deliveryYear**: Expected delivery year
- **amenities**: Array of amenities
- **galleryImages**: Array of image URLs
- **compoundId**: Foreign key to Compound

#### Compounds
- **id**: UUID (Primary Key)
- **name**: Compound name
- **slug**: URL-friendly slug
- **location**: Geographic location
- **description**: Compound description
- **deliveryYear**: Expected delivery year
- **finishingStatus**: Finishing status
- **developerId**: Foreign key to Developer

#### Developers
- **id**: UUID (Primary Key)
- **name**: Developer name
- **description**: Developer description

#### Payment Plans
- **id**: UUID (Primary Key)
- **downPayment**: Down payment amount
- **installment**: Monthly installment
- **durationYears**: Payment duration
- **unitId**: Foreign key to Unit

## 🔌 API Endpoints

### Units
- `GET /api/units` - Get all units with filtering and pagination
- `GET /api/units/:id` - Get unit by ID
- `POST /api/units` - Create new unit (with full validation)

### Compounds
- `GET /api/compounds` - Get all compounds
- `GET /api/compounds/:id` - Get compound by ID
- `GET /api/compounds/slug/:slug` - Get compound by slug

### Developers
- `GET /api/developers` - Get all developers

### Upload
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/image` - Upload single image

### Filtering Parameters
- `min_price`, `max_price` - Price range filtering
- `unit_area_min`, `unit_area_max` - Area range filtering
- `property_types` - Property type filtering (comma-separated)
- `bedrooms` - Number of bedrooms
- `compound_id` - Filter by compound
- `developer_id` - Filter by developer
- `amenities` - Filter by amenities (comma-separated)
- `search` - Text search across titles and descriptions
- `area` - Filter by area name
- `page`, `limit` - Pagination parameters

## 🎨 Frontend Pages

### Homepage (`/`)
- Hero section with search functionality
- Real-time statistics from backend
- Featured compounds with images
- Search dropdown with instant results

### Search Page (`/search`)
- Advanced filtering sidebar
- Property grid with responsive cards
- Sorting options (Price, Bedrooms, Area, Name)
- Search bar with real-time filtering
- Pagination for large result sets

### Property Detail (`/property/[id]`)
- Complete property information
- Image gallery
- Payment plan details
- Developer and compound information

### Compound Detail (`/compound/[slug]`)
- Compound overview and description
- All units in the compound
- Developer information
- Location and delivery details

### Add Property (`/add`)
- Comprehensive property form
- Image upload with preview
- Real-time validation
- Compound and developer selection

## 🔧 Development Commands

### Docker Commands
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop all services
docker compose down

# Rebuild and start
docker compose up --build -d
```

### Database Commands
```bash
# Access database
docker compose exec postgres psql -U postgres -d nawy_db

# Reset database
docker compose down -v
docker compose up --build -d
```

### Backend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# View database
npx prisma studio
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

### Backend Security
- **Rate Limiting**: 1000 requests per 15 minutes per IP (configurable)
- **CORS Configuration**: Restricted to allowed origins with image support
- **Input Sanitization**: All inputs sanitized before processing
- **Helmet.js**: Security headers for Express
- **Request Logging**: Comprehensive request logging
- **Error Handling**: Secure error responses without sensitive data
- **Debounced Requests**: Frontend implements debouncing to prevent rapid API calls
- **Cache Management**: Intelligent cache invalidation for data consistency

### Data Validation
- **Zod Schemas**: Type-safe validation for all inputs
- **Input Sanitization**: Prevents XSS and injection attacks
- **UUID Validation**: Proper UUID format validation
- **File Upload Security**: Image-only uploads with size limits

## ⚡ Performance Optimizations

### Database Performance
- **Composite Indexes**: Optimized for common query patterns
- **Single Column Indexes**: All frequently queried fields indexed
- **Query Optimization**: N+1 prevention with includes
- **Connection Pooling**: Efficient database connections

### Application Performance
- **Intelligent Caching**: 5-minute cache for queries, 10-minute for details
- **Pattern-based Cache Invalidation**: Efficient cache management
- **Performance Monitoring**: Response time tracking and alerts
- **Optimized Queries**: Single queries with includes vs N+1

### Frontend Performance
- **Image Optimization**: Next.js Image component with responsive sizes (unoptimized for development)
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Tree-shaking and code splitting
- **Mobile Optimization**: Optimized for mobile networks
- **CORS Image Support**: Proper cross-origin image loading from backend
- **Conditional Image Rendering**: Smart handling of localhost vs external images

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test units endpoint
curl http://localhost:5000/api/units

# Test filtering
curl "http://localhost:5000/api/units?min_price=1000000&max_price=2000000"

# Test add unit
curl -X POST http://localhost:5000/api/units \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Unit","referenceNumber":"TEST001","unitNumber":"A-101","price":2500000,"bedrooms":2,"unitArea":120.5,"propertyType":"Apartment","saleType":"DeveloperSale","deliveryYear":2024,"compoundId":"660e8400-e29b-41d4-a716-446655440001"}'
```

### Frontend Testing
```bash
# Test homepage
curl http://localhost:3000/

# Test search page
curl http://localhost:3000/search

# Test add page
curl http://localhost:3000/add
```

## 🚀 Deployment

### Production Deployment
1. **Environment Setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export DATABASE_URL=your_production_db_url
   export ALLOWED_ORIGINS=your_domain
   ```

2. **Build and Deploy**
   ```bash
   # Build frontend
   cd frontend && npm run build
   
   # Start production services
   docker compose -f docker-compose.prod.yml up -d
   ```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/nawy_db
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=300000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 Architecture Overview

### Layered Architecture
```
┌─────────────────┐
│   Frontend      │ ← Next.js with TypeScript
├─────────────────┤
│   API Gateway   │ ← Express with validation
├─────────────────┤
│   Service Layer │ ← Business logic
├─────────────────┤
│   Data Layer    │ ← Prisma ORM
├─────────────────┤
│   Database      │ ← PostgreSQL
└─────────────────┘
```

### Performance Architecture
```
┌─────────────────┐
│   Cache Layer   │ ← In-memory caching
├─────────────────┤
│   API Layer     │ ← Rate limiting & validation
├─────────────────┤
│   Service Layer │ ← Optimized queries
├─────────────────┤
│   Database      │ ← Indexed PostgreSQL
└─────────────────┘
```

## 🎯 Assignment Requirements Coverage

### ✅ Core Requirements
- [x] **Tech Stack**: Next.js + TypeScript + TailwindCSS, Node.js + Express + TypeScript, PostgreSQL, Prisma, Docker
- [x] **Domain Models**: Compound, Developer, Unit, PaymentPlan with all specified fields
- [x] **API Endpoints**: All required endpoints implemented with Swagger documentation
- [x] **Filtering**: Complete filtering system with all specified parameters
- [x] **Frontend Pages**: All required pages with responsive design
- [x] **Components**: UnitCard, CompoundCard, FiltersSidebar, Pagination
- [x] **Docker Setup**: Complete containerization with all services
- [x] **Database**: PostgreSQL with proper schema and seed data

### ✅ Advanced Features
- [x] **Real-time Search**: Dropdown search with instant results
- [x] **Image Upload**: Multiple image upload with preview
- [x] **Responsive Design**: Mobile-first approach with adaptive layouts
- [x] **Performance**: Caching, indexing, and optimized queries
- [x] **Security**: Rate limiting, CORS, input validation
- [x] **Error Handling**: Comprehensive error boundaries and user feedback
- [x] **Type Safety**: Full TypeScript implementation
- [x] **Documentation**: Complete API documentation and README

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Prisma** for the excellent database ORM
- **TailwindCSS** for the utility-first CSS framework
- **Docker** for containerization
- **PostgreSQL** for the reliable database

---

**Built with ❤️ for modern real estate platforms** 