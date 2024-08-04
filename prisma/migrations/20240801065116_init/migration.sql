/*
  Warnings:

  - You are about to drop the `Absent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AbsentDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Absent" DROP CONSTRAINT "Absent_absentDateId_fkey";

-- DropForeignKey
ALTER TABLE "Absent" DROP CONSTRAINT "Absent_userId_fkey";

-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- DropTable
DROP TABLE "Absent";

-- DropTable
DROP TABLE "AbsentDate";

-- DropTable
DROP TABLE "AccessToken";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nip" VARCHAR(255),
    "employeeStatus" VARCHAR(255),
    "role" VARCHAR(255) NOT NULL,
    "photo" VARCHAR(255),
    "qrCode" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_token" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(255),
    "expired" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absent_date" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "dayStatus" VARCHAR(100) NOT NULL,
    "information" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absent_date_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absent" (
    "id" TEXT NOT NULL,
    "absentDateId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" VARCHAR(100),
    "arrivalAbsent" BOOLEAN NOT NULL,
    "returnAbsent" BOOLEAN NOT NULL,
    "information" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "permission" VARCHAR(255) NOT NULL,
    "information" TEXT,
    "photo" VARCHAR(255),
    "verify" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_qrCode_key" ON "user"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "access_token_userId_key" ON "access_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "access_token_token_key" ON "access_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "absent_date_date_key" ON "absent_date"("date");

-- AddForeignKey
ALTER TABLE "access_token" ADD CONSTRAINT "access_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absent" ADD CONSTRAINT "absent_absentDateId_fkey" FOREIGN KEY ("absentDateId") REFERENCES "absent_date"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absent" ADD CONSTRAINT "absent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
