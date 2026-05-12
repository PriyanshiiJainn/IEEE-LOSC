-- AlterTable
ALTER TABLE `AboutContent`
    ADD COLUMN `recentUpdates` TEXT NULL;

UPDATE `AboutContent`
SET `recentUpdates` = ''
WHERE `recentUpdates` IS NULL;

ALTER TABLE `AboutContent`
    MODIFY `recentUpdates` TEXT NOT NULL;
