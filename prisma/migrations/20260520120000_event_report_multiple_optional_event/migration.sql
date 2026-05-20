-- DropForeignKey
ALTER TABLE `EventReport` DROP FOREIGN KEY `EventReport_eventId_fkey`;

-- DropIndex
DROP INDEX `EventReport_eventId_key` ON `EventReport`;

-- AlterTable
ALTER TABLE `EventReport` MODIFY `eventId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `EventReport` ADD CONSTRAINT `EventReport_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX `EventReport_eventId_idx` ON `EventReport`(`eventId`);
