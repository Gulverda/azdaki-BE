-- CreateEnum
CREATE TYPE "StaffCategory" AS ENUM ('ACTOR', 'DIRECTOR', 'ARTISTIC', 'ADMINISTRATION', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titleKa" TEXT NOT NULL,
    "titleEn" TEXT,
    "excerptKa" TEXT,
    "excerptEn" TEXT,
    "contentKa" TEXT NOT NULL,
    "contentEn" TEXT,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" SERIAL NOT NULL,
    "nameKa" TEXT NOT NULL,
    "nameEn" TEXT,
    "positionKa" TEXT NOT NULL,
    "positionEn" TEXT,
    "bioKa" TEXT,
    "bioEn" TEXT,
    "photo" TEXT,
    "category" "StaffCategory" NOT NULL DEFAULT 'ACTOR',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Performance" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titleKa" TEXT NOT NULL,
    "titleEn" TEXT,
    "shortDescriptionKa" TEXT,
    "shortDescriptionEn" TEXT,
    "descriptionKa" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "authorKa" TEXT,
    "authorEn" TEXT,
    "durationMinutes" INTEGER,
    "ageRestriction" INTEGER,
    "premiereDate" TIMESTAMP(3),
    "coverImage" TEXT,
    "trailerUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "performanceId" INTEGER NOT NULL,

    CONSTRAINT "PerformanceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceCast" (
    "id" SERIAL NOT NULL,
    "roleKa" TEXT,
    "roleEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "performanceId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,

    CONSTRAINT "PerformanceCast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Showtime" (
    "id" SERIAL NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "venueKa" TEXT,
    "venueEn" TEXT,
    "ticketUrl" TEXT,
    "performanceId" INTEGER NOT NULL,

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "titleKa" TEXT,
    "titleEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "performanceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "titleKa" TEXT NOT NULL,
    "titleEn" TEXT,
    "contentKa" TEXT NOT NULL,
    "contentEn" TEXT,
    "heroImage" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_isPublished_publishedAt_idx" ON "News"("isPublished", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Performance_slug_key" ON "Performance"("slug");

-- CreateIndex
CREATE INDEX "Showtime_startsAt_idx" ON "Showtime"("startsAt");

-- AddForeignKey
ALTER TABLE "PerformanceImage" ADD CONSTRAINT "PerformanceImage_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceCast" ADD CONSTRAINT "PerformanceCast_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceCast" ADD CONSTRAINT "PerformanceCast_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryItem" ADD CONSTRAINT "GalleryItem_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
