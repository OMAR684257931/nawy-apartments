#!/bin/bash

echo "🌱 Running database seeding..."

# Check if containers are running
if ! docker compose ps | grep -q "nawy-backend.*Up"; then
    echo "❌ Backend container is not running. Starting services..."
    docker compose up -d
    sleep 10
fi

# Run the seed script
echo "📦 Executing Prisma seed..."
docker exec nawy-backend npm run prisma:seed

if [ $? -eq 0 ]; then
    echo "✅ Seeding completed successfully!"
    echo ""
    echo "📊 Testing seeded data:"
    echo "✅ Units: $(curl -s "http://localhost:5000/api/units" | jq -r '.data | length') units"
    echo "✅ Compounds: $(curl -s "http://localhost:5000/api/compounds" | jq -r '.data | length') compounds"
    echo "✅ Developers: $(curl -s "http://localhost:5000/api/developers" | jq -r '.data | length') developers"
else
    echo "❌ Seeding failed!"
    exit 1
fi 