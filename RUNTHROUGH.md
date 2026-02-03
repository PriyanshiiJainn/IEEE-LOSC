# IEEE Student Chapter Website — Run-through

Quick reference for how everything works and how to use it.

---

## 1. Admin login (view the admin portal)

- **URL:** `/admin/login`
- **Credentials (after `npm run db:seed`):**  
  **Email:** `admin@ieee.lnmiit.ac.in`  
  **Password:** `admin123`
- **When the database is unreachable (e.g. Neon paused):**  
  In **development** (`npm run dev`), the same credentials still work so you can **view the admin portal**. You’ll see the dashboard and sidebar; counts may show 0 and some pages may show “Database unreachable” until the DB is reachable again.
- **Production:** Only real DB login is used; no dev fallback.

---

## 2. Public site (no login)

| Page | What it does |
|------|----------------|
| **/** (Home) | About us + About Optica. Flash banner if one is active in admin. |
| **/team** | Faculty Advisor, Core Team, Functional Team (by role/post). |
| **/events** | List of events. “Register now” or “Registration closed” per event. |
| **/events/[id]/register** | Registration form (name, roll no, email, phone). Submits to API; on success, redirects to /events. |
| **/event-reports** | List of event reports. |
| **/contact** | Contact form; submissions stored in DB and visible in Admin → Submissions. |

**Data source:**  
- If `USE_MOCK_DATA=true` in `.env`: all public content uses **mock data** (no DB).  
- If `USE_MOCK_DATA=false`: content comes from the **database**; if the DB is unreachable, the data layer falls back to mock so the site still loads.

---

## 3. Event registration (input working and functional)

1. User goes to **/events** (or a direct link to an event).
2. Clicks **Register now** on an event → **/events/[id]/register**.
3. Fills: **Name**, **Roll number**, **Email**, **Phone** (all required; email and phone validated).
4. Submits → `POST /api/events/register` with `{ eventId, name, rollNo, email, phone }`.
5. **API:** Validates with Zod (`eventRegistrationSchema`), checks event exists and registration is not closed, then creates `EventRegistration` in the DB.
6. **Success:** “You are registered” and redirect to /events after 2 seconds.  
   **Failure:** Error message (event doesn’t exist, registration closed, DB unreachable, validation error).

**Important:** Registration **always uses the real database** (API does not use `USE_MOCK_DATA`). So:
- With **real events** (from DB, `USE_MOCK_DATA=false`): registration works.
- With **mock events** (e.g. `USE_MOCK_DATA=true` or DB down and fallback to mock): event IDs like `e1` don’t exist in DB, so registration returns “This event doesn’t exist…”. Add events in Admin and use real DB for registration to work.

---

## 4. Admin portal (after login)

| Section | What it does |
|--------|----------------|
| **Dashboard** (/admin) | Counts: Events, Team, Registrations, Submissions. Quick links to all sections. If DB unreachable, shows banner and 0 counts. |
| **Events** | List events; Add / Edit / Delete. Edit: title, description, date, time, venue, category, brochure URL, featured, **registration closed**. |
| **Event registrations** | List all registrations; filter by event (All · Event A · Event B). |
| **Team** | List team members; Add / Edit / Delete. Fields: name, classification (Faculty/Core/Functional), post, image URL, email, phone, LinkedIn, order. |
| **Event reports** | List reports; Add / Edit / Delete. Linked to an event; title, content, cover image URL, published date. |
| **Flash** | One active flash banner for the home page; link to event or custom URL. |
| **About** | Edit “About us” and “About Optica” (home page content). |
| **Submissions** | Read-only list of contact form submissions. |
| **Footer links** | Edit useful links in the footer (label + URL, order). |

All admin **API routes** (`/api/admin/*`) use `requireAdmin()`; only a valid admin session can call them.

---

## 5. Consistency and flow summary

- **Auth:** NextAuth Credentials; JWT session. Email trimmed and lowercased; password checked with bcrypt (or dev fallback when DB down in development).
- **Data layer** (`lib/data.ts`): When `USE_MOCK_DATA=true`, returns mock only. When `false`, tries Prisma; on failure, falls back to mock so the site doesn’t crash.
- **Event registration:** Always Prisma; event must exist in DB and not be registration-closed.
- **Admin:** Session required (middleware + `getAdminSession` / `requireAdmin`). Dashboard, Events, and Registrations pages handle DB unreachable with a banner and empty/0 data so you can still open the portal.

---

## 6. Env and DB checklist

- **`.env`:** `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `USE_MOCK_DATA=false` (for real data and registration).
- **DB reachable:** Run `npx prisma migrate dev` (if needed), then `npm run db:seed`. Then admin login with real DB and event registration work.
- **DB unreachable:** In development you can still log in with seed credentials and view the admin portal; public site uses fallback mock data.
