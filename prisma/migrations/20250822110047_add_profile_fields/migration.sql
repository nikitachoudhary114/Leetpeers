/*
  Warnings:

  - A unique constraint covering the columns `[leetcodeProfile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "githubProfile" TEXT,
ADD COLUMN     "leetcodeProfile" TEXT,
ADD COLUMN     "linkedinProfile" TEXT,
ADD COLUMN     "problemsSolved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streakCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_leetcodeProfile_key" ON "public"."User"("leetcodeProfile");
