# Database: PostgreSQL vs MySQL — What Was Changed

The project is currently configured for **PostgreSQL** (e.g. Neon, Supabase). This file lists **every change** made for PostgreSQL so you can switch back to **MySQL** later if needed.

---

## 1. `prisma/schema.prisma`

| Location | Current (PostgreSQL) | For MySQL (revert to) |
|----------|----------------------|------------------------|
| **Datasource provider** (line ~9) | `provider = "postgresql"` | `provider = "mysql"` |
| **AboutContent.aboutUs** (line ~27) | `String @db.Text` | `String @db.LongText` |
| **AboutContent.aboutOptica** (line ~28) | `String @db.Text` | `String @db.LongText` |
| **Event.description** (line ~35) | `String @db.Text` | `String @db.LongText` |
| **Event.date** (line ~36) | `DateTime` (no attribute) | `DateTime @db.Date` |
| **EventReport.content** (line ~83) | `String @db.Text` | `String @db.LongText` |

**Unchanged** (same for both):  
`FlashAnnouncement.shortMessage` and `ContactSubmission.message` are already `@db.Text` (valid in both).

---

## 2. `.env.example`

| Current (PostgreSQL) | For MySQL |
|----------------------|-----------|
| Comment: "PostgreSQL (e.g. Neon, Supabase, Railway) or MySQL" | Keep or simplify to "MySQL" |
| `DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"` | `DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"` |
| Comment "Frontend-only (no MySQL)" | Can stay (generic "no DB") |

---

## 3. `README.md`

| Location | Current | For MySQL |
|----------|---------|-----------|
| Line 3 (first para) | "PostgreSQL" or "PostgreSQL/MySQL" | "MySQL" |
| "Frontend only" section | "real MySQL server" / "real database" | "real MySQL server" |
| "With database" section | "PostgreSQL (e.g. Neon, Supabase) or MySQL" | "MySQL (e.g. PlanetScale, Railway)" |
| DATABASE_URL bullet | Shows both postgresql and mysql URLs | Show only mysql URL |

---

## 4. `ARCHITECTURE.md`

| Location | Current | For MySQL |
|----------|---------|-----------|
| "Given your skills" | "PostgreSQL or MySQL" | "MySQL" |
| Table row Database | "PostgreSQL or MySQL + Prisma" | "MySQL + Prisma" |
| Deploy row | "Neon/PlanetScale or Railway" | "PlanetScale or Railway (MySQL)" |
| Summary line | "PostgreSQL or MySQL" | "MySQL" |
| Diagram box | "PostgreSQL" or "Database" | "MySQL" |
| "So: one Next.js app" | "PostgreSQL" or "database" | "MySQL" |
| Request flow | "from MySQL" | "from MySQL" |
| Stack one-liner | "PostgreSQL or MySQL" | "MySQL" |

---

## 5. `WORKFLOW.md`

| Location | Current | For MySQL |
|----------|---------|-----------|
| Step 2 comment | "DATABASE_URL (PostgreSQL or MySQL)" | "DATABASE_URL (MySQL)" |
| Hiccup bullet | "ensure database is running" / "PostgreSQL or MySQL" | "ensure MySQL is running" |
| "DB connection error" | "database" | "MySQL" |

---

## 6. `lib/data.ts`

| Location | Current | For MySQL |
|----------|---------|-----------|
| Top comment | "when no MySQL" or "when DB is not configured" | "when no MySQL" (optional) |

---

## 7. Application code (API routes, components, Prisma usage)

**No application code changes** were made for PostgreSQL. Prisma queries, types, and APIs are the same for both MySQL and PostgreSQL. Only the schema (provider + column types above) and docs/env differ.

---

## Quick revert checklist (MySQL)

1. **prisma/schema.prisma**  
   - Set `provider = "mysql"`.  
   - Change `AboutContent.aboutUs`, `AboutContent.aboutOptica`, `Event.description`, `EventReport.content` from `@db.Text` to `@db.LongText`.  
   - Add `@db.Date` to `Event.date`.

2. **.env**  
   - Set `DATABASE_URL` to a `mysql://...` connection string.

3. **.env.example**  
   - Default `DATABASE_URL` to `mysql://USER:PASSWORD@HOST:3306/DATABASE`.

4. **README.md, ARCHITECTURE.md, WORKFLOW.md, lib/data.ts**  
   - Replace "PostgreSQL" / "database" with "MySQL" where you want docs to say MySQL only.

5. **Migrations**  
   - After switching provider, you cannot reuse PostgreSQL migrations on MySQL. Either:  
     - Start fresh: delete `prisma/migrations`, run `npx prisma migrate dev --name init` against MySQL, then `npm run db:seed`, or  
     - Use a new MySQL database and run the same.

---

## Quick revert checklist (PostgreSQL)

If you had switched to MySQL and want to go back to PostgreSQL:

1. **prisma/schema.prisma**  
   - Set `provider = "postgresql"`.  
   - Change all `@db.LongText` to `@db.Text`.  
   - Remove `@db.Date` from `Event.date`.

2. **.env**  
   - Set `DATABASE_URL` to a `postgresql://...` connection string.

3. **.env.example**  
   - Default `DATABASE_URL` to a postgresql example.

4. Re-run migrations (or `prisma db push`) and seed against the PostgreSQL database.

---

## Where to see and set event registration

- **See registrations (and filter by event)**  
  **Admin → Event registrations** (`/admin/registrations`). Use “Filter by event: All · Event A · Event B” to show only registrations for a particular event.

- **Set that registration for an event is “gone” (closed)**  
  **Admin → Events** (`/admin/events`) → **Edit** the event → check **“Registration closed”** → Save.  
  When closed: the public Events page shows “Registration closed” instead of “Register now”, the register page shows a message instead of the form, and the API returns “Registration for this event is closed.” if someone submits anyway.

- **Why “event doesn’t exist” / foreign key errors**  
  If the site uses mock data (`USE_MOCK_DATA=true`), event IDs are like `e1`, `e2` and don’t exist in the database. Registration will fail until you set `USE_MOCK_DATA=false` and add events in **Admin → Events** so the site shows real DB events with valid IDs.
