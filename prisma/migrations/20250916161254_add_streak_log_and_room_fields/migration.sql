-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "dailyTarget" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "streakCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastTotalSolved" INTEGER;

-- CreateTable
CREATE TABLE "public"."StreakLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "StreakLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StreakLog" ADD CONSTRAINT "StreakLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StreakLog" ADD CONSTRAINT "StreakLog_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;