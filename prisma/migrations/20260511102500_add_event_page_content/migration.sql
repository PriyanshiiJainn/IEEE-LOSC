-- CreateTable
CREATE TABLE `EventPageContent` (
    `id` VARCHAR(191) NOT NULL,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroDescription` TEXT NOT NULL,
    `invitedTalksHeading` VARCHAR(191) NOT NULL,
    `invitedTalksEmptyText` TEXT NOT NULL,
    `webinarsHeading` VARCHAR(191) NOT NULL,
    `webinarsEmptyText` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
