-- AlterEnum
ALTER TYPE "StaffCategory" ADD VALUE 'ARTISTIC_DIRECTOR' BEFORE 'ACTOR';

-- AboutPage: ერთი content ველის ნაცვლად საიტის სექციები
ALTER TABLE "AboutPage" RENAME COLUMN "contentKa" TO "introKa";
ALTER TABLE "AboutPage" RENAME COLUMN "contentEn" TO "introEn";
ALTER TABLE "AboutPage" ALTER COLUMN "introKa" DROP NOT NULL;
ALTER TABLE "AboutPage"
    ADD COLUMN "subtitleKa" TEXT,
    ADD COLUMN "subtitleEn" TEXT,
    ADD COLUMN "foundedYear" INTEGER,
    ADD COLUMN "whoWeAreKa" TEXT,
    ADD COLUMN "whoWeAreEn" TEXT,
    ADD COLUMN "foundingKa" TEXT,
    ADD COLUMN "foundingEn" TEXT,
    ADD COLUMN "goalsKa" TEXT,
    ADD COLUMN "goalsEn" TEXT,
    ADD COLUMN "tasksKa" TEXT[],
    ADD COLUMN "tasksEn" TEXT[],
    ADD COLUMN "achievementsKa" TEXT[],
    ADD COLUMN "achievementsEn" TEXT[];

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" SERIAL NOT NULL,
    "nameKa" TEXT NOT NULL,
    "nameEn" TEXT,
    "logo" TEXT,
    "url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);
