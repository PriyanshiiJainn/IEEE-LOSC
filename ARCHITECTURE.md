# IEEE Student Chapter Website — Architecture & Stack

## Recommended stack

Given your skills (React, Next.js, TypeScript, Prisma), this fits well and keeps the project in one codebase.

| Layer   | Technology   | Why |
|--------|--------------|-----|
| **Frontend** | **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS** | Next.js gives you SSR, API routes, and file-based routing. TypeScript for type safety. Tailwind for fast, consistent UI. |
| **Backend**  | **Next.js API Routes / Route Handlers** | Same repo as frontend, no separate server. Handles forms, file uploads, and admin APIs. |
| **Database** | **PostgreSQL** + **Prisma** | Prisma gives type-safe queries and migrations. *(MySQL: see [DATABASE-SWITCH.md](./DATABASE-SWITCH.md).)* |
| **Auth**     | **NextAuth.js** (or **Lucia** / custom JWT) | NextAuth is the standard for Next.js. Use “Credentials” provider: one or more admin users, no signup for visitors. |
| **File storage** | **Local disk** or **Vercel Blob** / **Uploadthing** | Brochures: store in `/public/uploads` or use a blob service if you deploy on Vercel. |
| **Deploy**   | **Vercel** (frontend + APIs) + **Neon** / **Supabase** / **Railway** (PostgreSQL) | Or any Node host + your own PostgreSQL. |

**Summary:** Next.js + TypeScript + Tailwind + PostgreSQL + Prisma + NextAuth. No login for normal users; admin login only.

---

## High-level architecture (plain)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC (no login)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser                                                                     │
│    │                                                                         │
│    ├── /              →  Home (hero, flash event, highlights)                │
│    ├── /about         →  About Us                                            │
│    ├── /events        →  Events list + brochures                             │
│    ├── /team          →  Team members                                        │
│    └── /contact       →  Contact form (submit → API → DB)                    │
│                                                                              │
│  All data (events, team, flash, etc.) comes from DB via API or SSR.          │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APPLICATION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐    │
│  │  App Router      │     │  API / Route     │     │  Server          │    │
│  │  (Pages/UI)      │────▶│  Handlers        │────▶│  Components      │    │
│  │                  │     │  /api/...        │     │  (fetch from DB) │    │
│  └──────────────────┘     └────────┬─────────┘     └────────┬─────────┘    │
│                                    │                        │               │
│                                    │                        │               │
│                                    ▼                        ▼               │
│                           ┌─────────────────────────────────────┐          │
│                           │  Prisma Client                       │          │
│                           │  (type-safe DB access)               │          │
│                           └─────────────────┬───────────────────┘          │
│                                             │                               │
└─────────────────────────────────────────────┼───────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PostgreSQL                                                                  │
│    • users (admin only)                                                      │
│    • events                                                                  │
│    • team_members                                                            │
│    • contact_submissions                                                     │
│    • flash_announcements (current “ad” on home)                              │
│    • site_settings (optional: hero text, links, etc.)                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADMIN (login required)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  /admin/login   →  Credentials (e.g. email + password)                       │
│  /admin         →  Dashboard (redirect to login if not authenticated)        │
│                                                                              │
│  Dashboard sections:                                                         │
│    • Flash / Featured event    — set one “live” ad for home page             │
│    • Events                    — CRUD, upload brochure (file)                │
│    • Team                      — CRUD members                                │
│    • Contact submissions       — list + optionally export                    │
│    • About / site content      — edit paragraphs, links (if you add that)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

So: **one Next.js app** talking to **PostgreSQL** via **Prisma**. Public routes render from DB; admin routes and APIs are protected by session/auth.

---

## Data model (core tables)

Rough shape of tables Prisma would manage:

- **users**  
  - `id`, `email`, `passwordHash`, `name`, `role` (e.g. `"ADMIN"`)  
  - Used only for admin login.

- **events**  
  - `id`, `title`, `description`, `date`, `time`, `venue`, `brochureUrl`, `isFeatured`, `createdAt`, `updatedAt`  
  - `brochureUrl`: path or URL to uploaded PDF/image.  
  - `isFeatured`: used to pick which event is shown in the home-page “flash” div (or you use a separate table).

- **flash_announcements** (recommended)  
  - `id`, `eventId` (FK), `title`, `shortMessage`, `link`, `active`, `startsAt`, `endsAt`, `updatedAt`  
  - Admin turns one “flash” on at a time; home page reads the active row and shows it in a small div.

- **team_members**  
  - `id`, `name`, `role`, `imageUrl`, `order`, `linkedin`, `email` (optional), `createdAt`, `updatedAt`.

- **contact_submissions**  
  - `id`, `name`, `email`, `subject`, `message`, `createdAt`  
  - Filled by the public contact form; admin views in dashboard.

You can add **site_settings** later for hero title, tagline, social links, etc., and treat “About” as rich text or markdown in DB.

---

## Request flow (summary)

1. **Public pages**  
   - User opens `/`, `/events`, etc.  
   - Next.js fetches from the database (via Prisma in Server Components or in `getServerSideProps`/`generateMetadata`).  
   - No login.

2. **Contact form**  
   - POST from `/contact` to e.g. `/api/contact`.  
   - API validates input, writes to `contact_submissions`, returns success/error.

3. **Admin**  
   - `/admin` checks session (NextAuth or your JWT).  
   - If not logged in → redirect to `/admin/login`.  
   - If logged in → show dashboard; all mutating actions go through `/api/admin/*` and check auth again.

4. **Flash ad on home**  
   - Home page (or a layout) runs a query like: “get active `flash_announcements` (or featured event).”  
   - Renders a small banner/link.  
   - Admin panel has “Set current flash” → updates one row (e.g. `active = true` for the chosen one, others `false`).

---

## Folder structure (logical)

```
d:\projii\IEEE\
├── app/
│   ├── page.tsx                 # Home (includes flash div)
│   ├── layout.tsx
│   ├── about/page.tsx
│   ├── events/page.tsx
│   ├── team/page.tsx
│   ├── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx           # Protects all /admin/*
│   │   ├── page.tsx             # Dashboard
│   │   ├── login/page.tsx
│   │   ├── events/page.tsx      # Event CRUD UI
│   │   ├── team/page.tsx        # Team CRUD UI
│   │   ├── submissions/page.tsx # Contact form entries
│   │   └── flash/page.tsx       # Set current home-page ad
│   ├── api/
│   │   ├── contact/route.ts     # POST contact form
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── admin/
│   │   │   ├── events/route.ts
│   │   │   ├── team/route.ts
│   │   │   ├── flash/route.ts
│   │   │   └── upload/route.ts  # Brochure upload
│   │   └── events/route.ts      # Public GET events (optional, or use server components)
│   └── (shared components)
├── components/
│   ├── layout/ (Header, Footer, FlashBanner)
│   ├── home/
│   ├── events/
│   ├── team/
│   └── admin/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts                  # NextAuth config
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── uploads/                 # Brochures (or use blob storage)
├── ARCHITECTURE.md              # This file
└── package.json
```

---

## Security and practices

- **Admin only:** Protect every `/api/admin/*` and `/admin/*` route with session check; reject if not admin.
- **Validation:** Use Zod (or similar) on form and API body for contact and admin APIs.
- **Passwords:** Hash with bcrypt (or Argon2); never store plain text.
- **Uploads:** Restrict types (e.g. PDF, images), cap size, and store outside web root or in a blob store with signed URLs if you want tighter control.

---

## Stack one-liner

**Next.js (App Router) + TypeScript + Tailwind + PostgreSQL + Prisma + NextAuth**, with public pages (Home, About, Events, Team, Contact), no user login, and an admin-only dashboard to manage events, brochures, team, contact submissions, and the home-page flash ad.

If you want, next step can be: Prisma schema for the tables above, then `app/layout.tsx` + `app/page.tsx` and the flash component, or the admin layout plus one protected API route.
