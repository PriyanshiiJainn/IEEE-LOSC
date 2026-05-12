-- Revert CMS-driven events page copy; static text lives in app/events/page.tsx again.
DROP TABLE IF EXISTS `EventPageContent`;
