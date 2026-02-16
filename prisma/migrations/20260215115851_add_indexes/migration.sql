-- CreateIndex
CREATE INDEX `Event_date_idx` ON `Event`(`date`);

-- CreateIndex
CREATE INDEX `Event_isFeatured_idx` ON `Event`(`isFeatured`);

-- CreateIndex
CREATE INDEX `EventReport_publishedAt_idx` ON `EventReport`(`publishedAt`);

-- CreateIndex
CREATE INDEX `FlashAnnouncement_active_idx` ON `FlashAnnouncement`(`active`);

-- CreateIndex
CREATE INDEX `TeamMember_classification_order_idx` ON `TeamMember`(`classification`, `order`);
