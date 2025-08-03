-- CreateEnum
CREATE TYPE "FinishingStatus" AS ENUM ('Finished', 'SemiFinished', 'CoreAndShell');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'Villa', 'Duplex', 'Penthouse', 'Chalet', 'Studio', 'Townhouse');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('DeveloperSale', 'Resale');

-- CreateTable
CREATE TABLE "developers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compounds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "delivery_year" INTEGER NOT NULL,
    "finishing_status" "FinishingStatus" NOT NULL,
    "map_url" TEXT,
    "developer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "unit_number" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "unit_area" DECIMAL(8,2) NOT NULL,
    "property_type" "PropertyType" NOT NULL,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sale_type" "SaleType" NOT NULL,
    "gallery_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delivery_year" INTEGER NOT NULL,
    "compound_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "down_payment" DECIMAL(12,2) NOT NULL,
    "installment" DECIMAL(12,2) NOT NULL,
    "duration_years" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "compounds_slug_key" ON "compounds"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "units_reference_number_key" ON "units"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "payment_plans_unit_id_key" ON "payment_plans"("unit_id");

-- AddForeignKey
ALTER TABLE "compounds" ADD CONSTRAINT "compounds_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_compound_id_fkey" FOREIGN KEY ("compound_id") REFERENCES "compounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE; 