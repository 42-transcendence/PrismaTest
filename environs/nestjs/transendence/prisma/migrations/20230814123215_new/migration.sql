/*
  Warnings:

  - The primary key for the `chat_messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chat_messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `chat_messages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastMessageId` to the `chat_members` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `chat_messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "services"."chat_members" ADD COLUMN     "lastMessageId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "services"."chat_messages" DROP CONSTRAINT "chat_messages_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" UUID NOT NULL,
ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "chat_messages_uuid_key" ON "services"."chat_messages"("uuid");

-- AddForeignKey
ALTER TABLE "services"."chat_members" ADD CONSTRAINT "chat_members_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "services"."chat_messages"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
