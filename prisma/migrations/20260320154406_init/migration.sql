/*
  Warnings:

  - Added the required column `start` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GraduationStatus" AS ENUM ('PASSED', 'FAILED', 'ONGOING');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "graduationDate" TIMESTAMP(3),
ADD COLUMN     "graduationStatus" "GraduationStatus" NOT NULL DEFAULT 'ONGOING';
