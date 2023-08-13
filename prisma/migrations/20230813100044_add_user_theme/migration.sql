-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK', 'LIGHT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'LIGHT';
