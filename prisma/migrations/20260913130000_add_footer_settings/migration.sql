-- CreateTable
CREATE TABLE `FooterSettings` (
    `id` VARCHAR(191) NOT NULL,
    `copyrightText` TEXT NOT NULL,
    `linksHeading` VARCHAR(191) NOT NULL DEFAULT 'Other links',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
