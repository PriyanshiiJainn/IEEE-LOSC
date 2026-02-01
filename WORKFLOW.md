# Professional workflow

This doc describes how to work on the project in a scalable, maintainable way (similar to standard industry practice).

---

## 1. One-time setup (per machine)

Run these in order. **If any command fails, fix it before continuing.**

```bash
# 1. Install dependencies
npm install

# 2. Environment: copy example and fill in
cp .env.example .env
# Edit .env: set DATABASE_URL (MySQL), NEXTAUTH_URL, NEXTAUTH_SECRET

# 3. Database: create schema and seed admin
npx prisma migrate dev --name init
npm run db:seed

# 4. (Optional) Verify
npm run lint
npm run build
```

**Hiccup?**  
- `npm install` fails → check Node (v18+), network, or run without optional deps.  
- `prisma migrate dev` fails → ensure MySQL is running and `DATABASE_URL` in `.env` is correct.  
- `db:seed` fails → run migrations first; check DB connection.

---

## 2. Daily development

```bash
npm run dev
```

- App: http://localhost:3000  
- Admin: http://localhost:3000/admin (login at `/admin/login`)

---

## 3. Git workflow (syncing and collaboration)

### First time (init + remote)

```bash
git init
git add .
git commit -m "Initial commit: IEEE Student Chapter website"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

### Ongoing (feature work)

- **Branch per feature/fix** (recommended):

  ```bash
  git checkout -b feature/event-registration
  # ... make changes ...
  git add .
  git commit -m "Add event registration form and API"
  git push -u origin feature/event-registration
  ```

  Then open a Pull Request (GitHub/GitLab) into `main`; review and merge.

- **Or work on main** (small team):

  ```bash
  git add .
  git commit -m "Describe change"
  git push
  ```

### Before pushing (checks)

```bash
npm run lint
npm run build
```

Fix any errors before pushing so CI (if you add it later) stays green.

---

## 4. Database changes

When you change `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe_your_change
```

Commit the new migration files under `prisma/migrations/`. Never edit existing migrations by hand.

---

## 5. Environment and secrets

- **Local:** Use `.env` (in `.gitignore`). Copy from `.env.example`.  
- **Production:** Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (and any other vars) in your host (Vercel, Railway, etc.). Never commit production secrets.

---

## 6. If you hit a hiccup

- **Command fails:** Note the exact command and error. Fix the cause (env, DB, Node version), then re-run.  
- **Build/lint fails:** Fix the reported file/line; run the command again.  
- **DB connection error:** Check `DATABASE_URL` and that MySQL is reachable.

When in doubt, run in this order: `npm install` → set `.env` → `prisma migrate dev` → `npm run dev`.
