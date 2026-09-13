-- CreateTable
CREATE TABLE `AcademicYear` (
    `id` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AcademicYear_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Register every year that already has members, plus the upcoming 2026-27.
INSERT INTO `AcademicYear` (`id`, `year`)
SELECT UUID(), `academicYear` FROM `TeamMember` GROUP BY `academicYear`;

INSERT IGNORE INTO `AcademicYear` (`id`, `year`) VALUES (UUID(), '2026-27');

-- AlterTable: sub-team heading a member is listed under
ALTER TABLE `TeamMember` ADD COLUMN `category` VARCHAR(191) NULL;

-- Backfill the functional sub-team headings that used to be derived from the
-- post text, so the published team page is unchanged.
UPDATE `TeamMember` SET `category` = 'Web Development Team'
  WHERE `classification` = 'FUNCTIONAL' AND LOWER(`post`) LIKE '%web%';
UPDATE `TeamMember` SET `category` = 'Content Creation Team'
  WHERE `classification` = 'FUNCTIONAL' AND LOWER(`post`) LIKE '%content%';
UPDATE `TeamMember` SET `category` = 'Event Management Team'
  WHERE `classification` = 'FUNCTIONAL' AND LOWER(`post`) LIKE '%event%';
