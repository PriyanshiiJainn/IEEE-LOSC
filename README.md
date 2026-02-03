# IEEE Student Chapter Website

Next.js 14 (App Router) + TypeScript + Tailwind + PostgreSQL + Prisma + NextAuth. Public site (About, Team, Events, Event Reports, Contact) with admin-only dashboard for content management.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for stack and data model. Using **PostgreSQL**; to switch to MySQL see [DATABASE-SWITCH.md](./DATABASE-SWITCH.md).

---

## Git setup and syncing

### 1. Initialize (first time)

```bash
git init
git add .
git commit -m "Initial commit: Next.js + Prisma + admin portal scaffold"
```

### 2. Add a remote and push

**GitHub**

```bash
# Create a new repo on GitHub (e.g. ieee-lnmiit-website), then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**GitLab / other**

```bash
git remote add origin <your-remote-url>
git branch -M main
git push -u origin main
```

### 3. Later: sync changes

```bash
git add .
git commit -m "Describe your changes"
git push
```

### 4. Env and secrets (do not commit)

- Copy `.env.example` to `.env` and fill in values.
- Never commit `.env` (it’s in `.gitignore`).

---

## Local development

### Frontend only (no database yet)

You can run and develop the full UI without a real database:

1. **Env:** Copy `.env.example` to `.env` and set **`USE_MOCK_DATA=true`** (and a placeholder `DATABASE_URL` if you like). With `USE_MOCK_DATA=true` the app never connects to the DB, so no connection errors and fast loads.
2. **Install:** `npm install`
3. **Run:** `npm run dev` → http://localhost:3000

All pages use **mock data** when the DB is unreachable. Contact form and event registration will show a “database not configured” message until you add a real database and run migrations.

### With database (admin, forms, real data)

1. Create a database — **PostgreSQL** (e.g. [Neon](https://neon.tech), Supabase, Railway). *(To use MySQL instead, see [DATABASE-SWITCH.md](./DATABASE-SWITCH.md).)*
2. **Env:** Copy `.env.example` to `.env` and set:
   - **`DATABASE_URL`** — PostgreSQL: `postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require`
   - **`USE_MOCK_DATA`** — remove this line or set to **`false`** so the app uses the real database instead of mock data
   - **`NEXTAUTH_URL`** — e.g. `http://localhost:3000`
   - **`NEXTAUTH_SECRET`** — a long random string (e.g. run `openssl rand -base64 32`)
3. **Migrations:** `npx prisma migrate dev --name init`
4. **Seed admin:** `npm run db:seed` (creates admin user and default About content)
5. **Run:** `npm run dev` → http://localhost:3000  

**Admin:** http://localhost:3000/admin — log in at `/admin/login`.  
Default seeded admin: **email** `admin@ieee.lnmiit.ac.in` / **password** `admin123` (change after first login).

---

## Event registration

“Register now” on an event sends users to a short form (name, roll number, email, phone). Data is stored in the database; admins view registrations in the dashboard. No Google Form required; everything stays on your site.

## Brochures / downloads

Event brochures are stored as URLs in the DB (e.g. local `/uploads/` or, later, Google Drive shareable links). Adding Google Drive later = upload to Drive and save the link in the same `brochureUrl` field; no front-end change needed.
