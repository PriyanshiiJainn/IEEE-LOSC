FROM node:20-alpine

WORKDIR /app

# Install dependencies (includes devDeps needed for build)
# prisma/schema.prisma must exist before npm ci so the postinstall
# `prisma generate` step can find the schema.
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# Copy full source
COPY . .

# Build Next.js for production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Save bundled media to seed directories so the entrypoint can copy them into
# the named volumes on first run (volumes mount over public/gallery and public/pdfs,
# hiding whatever was baked into the image layer).
RUN cp -r /app/public/gallery /app/public/gallery-seed \
 && cp -r /app/public/pdfs    /app/public/pdfs-seed

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["/docker-entrypoint.sh"]
