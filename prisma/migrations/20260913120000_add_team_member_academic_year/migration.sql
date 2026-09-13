-- Team members are now scoped to an academic year.
-- Existing members belong to the AY 2025-26 team.
ALTER TABLE `TeamMember`
  ADD COLUMN `academicYear` VARCHAR(191) NOT NULL DEFAULT '2025-26';

CREATE INDEX `TeamMember_academicYear_idx` ON `TeamMember`(`academicYear`);
