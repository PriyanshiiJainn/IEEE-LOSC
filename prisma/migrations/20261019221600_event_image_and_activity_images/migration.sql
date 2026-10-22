-- AlterTable
ALTER TABLE `Event` ADD COLUMN `imageUrl` TEXT NULL;

-- CreateTable
CREATE TABLE `RecentActivityImage` (
    `id` VARCHAR(191) NOT NULL,
    `activityId` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RecentActivityImage_activityId_idx`(`activityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecentActivityImage` ADD CONSTRAINT `RecentActivityImage_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `RecentActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
