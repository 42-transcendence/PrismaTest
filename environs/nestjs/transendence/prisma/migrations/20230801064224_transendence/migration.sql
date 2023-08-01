/*
  Warnings:

  - You are about to drop the column `ip_address` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `is_valid` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `ipAddress` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedTimestamp` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "services"."accounts" DROP CONSTRAINT "accounts_id_fkey";

-- AlterTable
ALTER TABLE "services"."devices" DROP COLUMN "ip_address",
DROP COLUMN "user_agent",
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "updatedTimestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services"."sessions" DROP COLUMN "is_valid",
ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "services"."authorizations" (
    "id" TEXT NOT NULL,
    "redirectURI" TEXT NOT NULL,
    "createdTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services"."_AccountsDevices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountsDevices_AB_unique" ON "services"."_AccountsDevices"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountsDevices_B_index" ON "services"."_AccountsDevices"("B");

-- CreateIndex
CREATE INDEX "devices_updatedTimestamp_idx" ON "services"."devices"("updatedTimestamp");

-- AddForeignKey
ALTER TABLE "services"."records" ADD CONSTRAINT "records_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "services"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services"."_AccountsDevices" ADD CONSTRAINT "_AccountsDevices_A_fkey" FOREIGN KEY ("A") REFERENCES "services"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services"."_AccountsDevices" ADD CONSTRAINT "_AccountsDevices_B_fkey" FOREIGN KEY ("B") REFERENCES "services"."devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
