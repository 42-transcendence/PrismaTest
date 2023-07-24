/*
  Warnings:

  - A unique constraint covering the columns `[signupVerifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_signupVerifyToken_key" ON "User"("signupVerifyToken");
