-- AlterTable
ALTER TABLE `EventReport` ADD COLUMN `isMom` BOOLEAN NOT NULL DEFAULT false;

-- Existing rows with a PDF were created as MOM entries
UPDATE `EventReport` SET `isMom` = true WHERE `pdfUrl` IS NOT NULL AND `pdfUrl` != '';
