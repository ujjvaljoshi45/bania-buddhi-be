/*
  Warnings:

  - You are about to drop the column `isVerified` on the `OtpLog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED');

-- AlterTable
ALTER TABLE "OtpLog" DROP COLUMN "isVerified",
ADD COLUMN     "status" "OtpStatus" NOT NULL DEFAULT 'PENDING';
