#!/bin/sh
set -e

# On first run the named volumes are empty and hide the images baked into the
# image.  Copy the bundled files once so the default gallery / PDFs are still
# available, then leave the volume alone on every subsequent start.
if [ -z "$(ls -A /app/public/gallery 2>/dev/null)" ] && [ -d /app/public/gallery-seed ]; then
  echo "Initialising gallery volume with bundled images..."
  cp -r /app/public/gallery-seed/. /app/public/gallery/
fi

if [ -z "$(ls -A /app/public/pdfs 2>/dev/null)" ] && [ -d /app/public/pdfs-seed ]; then
  echo "Initialising pdfs volume with bundled files..."
  cp -r /app/public/pdfs-seed/. /app/public/pdfs/
fi

exec sh -c "npx prisma migrate deploy && npm run db:seed && npm start"
