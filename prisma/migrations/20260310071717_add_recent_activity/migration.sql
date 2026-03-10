/*
  Warnings:

  - You are about to drop the column `minutesOfMeeting` on the `EventReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `EventReport` DROP COLUMN `minutesOfMeeting`;

-- CreateTable
CREATE TABLE `RecentActivity` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RecentActivity_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
