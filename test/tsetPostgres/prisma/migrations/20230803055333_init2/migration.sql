-- CreateTable
CREATE TABLE "preference" (
    "id" SERIAL NOT NULL,
    "prefer" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "preference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "preference" ADD CONSTRAINT "preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
