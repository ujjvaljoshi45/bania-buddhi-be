/*
  Warnings:

  - You are about to drop the column `emailId` on the `OtpLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OtpLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OtpLog" DROP COLUMN "emailId",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
