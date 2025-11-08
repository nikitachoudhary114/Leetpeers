/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leetcodeProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `problemsSolved` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `streakCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoomPlayers` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RoomPlayers" DROP CONSTRAINT "_RoomPlayers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RoomPlayers" DROP CONSTRAINT "_RoomPlayers_B_fkey";

-- DropIndex
DROP INDEX "public"."User_leetcodeProfile_key";

-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "bio",
DROP COLUMN "country",
DROP COLUMN "githubProfile",
DROP COLUMN "leetcodeProfile",
DROP COLUMN "linkedinProfile",
DROP COLUMN "problemsSolved",
DROP COLUMN "streakCount",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."Room";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropTable
DROP TABLE "public"."_RoomPlayers";
