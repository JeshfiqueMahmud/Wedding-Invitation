# Deploying for free — GitHub Pages + Render + Supabase

```
 Guests ──► GitHub Pages (React site)                https://jeshfiquemahmud.github.io/Wedding-Invitation/
              │  photos: read straight from Supabase with the public anon key
              │  RSVPs, wishes, admin: VITE_API_URL ─┐
              ▼                                      ▼
        Supabase Storage  ◄── uploads ──  Render free web service (Express API)
        "images" bucket                      │  DATABASE_URL (SSL)
                                             ▼
                                     Supabase Postgres  (rsvps, guestbook_messages, images)
```

| Piece | Where | Cost |
|---|---|---|
| Website (React/Vite) | GitHub Pages, built by `.github/workflows/deploy-pages.yml` | Free |
| API (Express) | Render free web service, `render.yaml` | Free (sleeps after 15 min idle) |
| Database + photos | Supabase free project | Free (pauses after 7 days with **no** activity) |

Do the steps **in order** — each one needs a value from the one before.

---

## Step 1 — Supabase: create the project

1. Go to **https://supabase.com** → **Start your project** → sign in with GitHub.
2. **New project**
   - **Name:** `wedding`
   - **Database password:** click **Generate a password** and save it in your password manager. You need it in Step 3.
   - **Region:** *Southeast Asia (Singapore)* — closest to Dhaka.
   - **Plan:** Free → **Create new project**. Wait ~2 minutes.

### Create the tables, security rules and photo bucket

3. Left sidebar → **SQL Editor** → **New query**.
4. Open [`supabase/schema.sql`](supabase/schema.sql) from this repo, copy **all** of it, paste, click **Run**.
   You should see *Success. No rows returned*. (Running it again later is safe.)
5. Check it worked:
   - **Table Editor** shows `rsvps`, `guestbook_messages` (with 3 starter wishes) and `images`.
   - **Storage** shows a bucket called **images** marked **Public**.

### What the access rules do (already set by the SQL)

| Who | Tables | Storage bucket `images` |
|---|---|---|
| Anyone with the public **anon** key (the website) | can **read** `images` only. RSVPs and wishes are invisible. | can **view** files by URL (bucket is public) |
| The Render backend (database password + **service** key) | full access | upload / replace / delete |

Row Level Security is **on** for all three tables, and there are **no** insert/update/delete policies on the bucket — so nobody can upload or change anything except through your password-protected admin.
You can see this under **Authentication → Policies** (tables) and **Storage → Policies** (bucket).

---

## Step 2 — Supabase: copy your keys and connection string

Keep these in a note for the next steps. **Never paste the service key or database password into GitHub.**

| Name | Where to find it | Goes to |
|---|---|---|
| **Project URL** `https://xxxx.supabase.co` | Project Settings → **Data API** | Render `SUPABASE_URL`, GitHub `VITE_SUPABASE_URL` |
| **anon / publishable key** (public) | Project Settings → **API Keys** → `anon` `public` (Legacy tab) **or** the `sb_publishable_…` key | GitHub `VITE_SUPABASE_ANON_KEY` only |
| **service_role / secret key** (secret!) | Project Settings → **API Keys** → `service_role` (Legacy tab, click *Reveal*) **or** a `sb_secret_…` key | Render `SUPABASE_SERVICE_KEY` only |
| **Connection string** (secret!) | Top bar **Connect** → **Connection String** tab → Type **URI** → Method **Session pooler** → copy | Render `DATABASE_URL` |

About the connection string:
- Use the **Session pooler** one (host `aws-0-…pooler.supabase.com`, port **5432**). The *Direct connection* host is IPv6-only and **Render cannot reach it**.
- Replace `[YOUR-PASSWORD]` with the database password from Step 1. If the password contains `@ # / ? : %`, URL-encode them (`@` → `%40`, `#` → `%23`, `/` → `%2F`, `?` → `%3F`, `:` → `%3A`, `%` → `%25`) — or reset the password to letters and numbers only under Project Settings → Database.
- **SSL:** the server always connects with SSL (see `server/db.js`). For extra strictness you can also turn on **Project Settings → Database → SSL Configuration → Enforce SSL**, and optionally download the certificate there and set `DATABASE_CA_CERT` to its contents so the certificate is verified too.

---

## Step 3 — On your computer: copy the photos into Supabase

1. In the project folder, copy `.env.example` to a new file named `.env` and fill in
   `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
   (`.env` is git-ignored — it never gets uploaded.)
2. Upload the 8 gallery photos and the couple portrait:
   ```bash
   npm run images:upload
   ```
   You'll see `✅ gallery-1 → https://xxxx.supabase.co/storage/v1/object/public/images/…` for each one, and the rows appear in **Table Editor → images** and files in **Storage → images**.
3. (Optional) Try everything locally first — two terminals:
   ```bash
   npm run dev
   ```
   ```bash
   npm run client
   ```
   Open http://localhost:5173 — RSVPs and wishes now save to Supabase.

> Your old local `server/wedding.db` only held 3 demo RSVPs and the demo wishes, so there's nothing to migrate. If you ever need to, `npm run db:migrate-sqlite -- --skip-samples` copies an old SQLite file into Supabase.

---

## Step 4 — Render: deploy the API (free)

> If you created the paid `wedding-invitation` service from the earlier setup, delete it first so you aren't billed: open it → **Settings** → bottom → **Delete Web Service**.

1. Go to **https://dashboard.render.com** → sign in with GitHub.
2. **New +** → **Blueprint** → connect **JeshfiqueMahmud/Wedding-Invitation** → Render reads `render.yaml` and shows a service called **wedding-api** on the **Free** plan.
3. It asks for the secret values — paste:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Session pooler string with your password filled in |
   | `SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | the service_role / secret key |
   | `ADMIN_PASSWORD` | a long passphrase only the organizers know |

   (`NODE_ENV`, `NODE_VERSION`, `ALLOWED_ORIGINS` are filled in from the file.)
4. **Deploy Blueprint**. When the log says *Your service is live*, copy its URL, e.g. `https://wedding-api-ab12.onrender.com`.
5. Open `https://wedding-api-ab12.onrender.com/api/health` → you should see `{"status":"ok","database":"postgres",…}`.

<details><summary>Prefer to click it together by hand instead of a Blueprint?</summary>

**New +** → **Web Service** → pick the repo →
Language **Node** · Branch **main** · Region **Singapore** ·
Build Command `npm ci --omit=dev` · Start Command `npm start` · Instance Type **Free** →
**Environment Variables**: the four above plus `NODE_ENV=production` and `ALLOWED_ORIGINS=https://jeshfiquemahmud.github.io` →
**Advanced** → Health Check Path `/api/health` → **Deploy Web Service**.
</details>

What the backend reads from the environment: `PORT` (Render sets it), `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`, `ALLOWED_ORIGINS`.
CORS only allows `https://jeshfiquemahmud.github.io` (plus `localhost` when not in production). The origin is scheme + host only — no `/Wedding-Invitation` path.

---

## Step 5 — GitHub: turn on Pages and add the settings

1. Repo → **Settings** → **Pages** → *Build and deployment* → **Source: GitHub Actions**.
2. Repo → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable**, three times:

   | Name | Value |
   |---|---|
   | `VITE_API_URL` | your Render URL, **no trailing slash** — `https://wedding-api-ab12.onrender.com` |
   | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | the **anon / publishable** key |

   These are *Variables*, not *Secrets*, on purpose: anything starting with `VITE_` is built into the public website, so it must only ever be public values. **Never** add the service key, database URL or admin password here.
3. Push to `main` (or **Actions** tab → *Deploy site to GitHub Pages* → **Run workflow**).
4. **Actions** tab → wait for the green tick on both *build* and *deploy* (~1–2 min).
5. Your site: **https://jeshfiquemahmud.github.io/Wedding-Invitation/**

From now on every push to `main` rebuilds the site automatically, and Render redeploys the API automatically.

**Base path & routing:** the workflow builds with `VITE_BASE_PATH=/Wedding-Invitation/` so all scripts, styles and bundled images load from the right folder. The site doesn't use React Router (the admin is a pop-up), so there are no deep links to break; the workflow still copies `index.html` to `404.html` as a safety net. If you later add a custom domain, change `VITE_BASE_PATH` in the workflow to `/` and add the domain to `ALLOWED_ORIGINS` on Render.

---

## Changing photos later (no code, no redeploy)

Open the site → **Organizer dashboard** (shield icon, top-right of the menu bar) → enter `ADMIN_PASSWORD` → **Photos** tab.
- **Replace** swaps a photo (portrait or gallery); the old file is deleted from storage.
- Edit the caption / subtitle / position number and press **Save**.
- **Add a gallery photo** at the end of the grid; the bin icon removes one.

Changes are live for every visitor on their next page load. Max 8 MB per photo; ~1600 px wide JPG or WebP is ideal.

---

## Keeping it awake (optional, free)

- Render's free API sleeps after 15 idle minutes; the first visitor then sees *"Waking up the guest book…"* for up to a minute while it starts (the site keeps retrying for 90 s).
- Supabase pauses a free project after 7 days without any database activity.

A free monitor fixes both: at **https://uptimerobot.com** add an **HTTP(s)** monitor for `https://<your-render-url>/api/health` every **10 minutes**. One always-on service uses ~730 of Render's 750 free hours a month.

---

## ✅ After-deploy checklist

**Backend & database**
- [ ] `https://<render-url>/api/health` → `"status":"ok"`.
- [ ] `https://<render-url>/api/guestbook` → JSON list with the 3 starter wishes.
- [ ] `https://<render-url>/api/rsvps` → `{"error":"Incorrect password"}` (the guest list is protected).

**Website**
- [ ] `https://jeshfiquemahmud.github.io/Wedding-Invitation/` opens with fonts, colours and the intro.
- [ ] Reload the page (Ctrl+F5) — no 404, no blank page.
- [ ] Browser DevTools (F12) → **Console** has no red errors; **Network** shows calls going to your Render URL (not `localhost`).

**Data flow**
- [ ] Post a wish in the guestbook → it appears → it's in Supabase **Table Editor → guestbook_messages**.
- [ ] Submit an RSVP → the pass pops up → row appears in **rsvps**.
- [ ] Organizer dashboard: wrong password is refused; correct one shows the RSVP, stats and **Export CSV** works.

**Photos**
- [ ] Gallery and portrait image URLs start with `https://xxxx.supabase.co/storage/v1/object/public/images/` (right-click → *Copy image address*).
- [ ] Dashboard → Photos → **Replace** one gallery photo → refresh the site → new photo shows. Storage → images has the new file and not the old one.
- [ ] Add a gallery photo, then delete it.

**Security**
- [ ] On GitHub, search the repo for `service_role`, `sb_secret`, your DB password → nothing found.
- [ ] `.env` is **not** listed on GitHub.

---

## 🛠 Fixing common problems

| Symptom | Cause | Fix |
|---|---|---|
| **CORS error** in Console: *blocked by CORS policy / No 'Access-Control-Allow-Origin'* | Render's `ALLOWED_ORIGINS` doesn't match the site's origin | Render → service → **Environment** → `ALLOWED_ORIGINS=https://jeshfiquemahmud.github.io` (no trailing slash, no `/Wedding-Invitation`). Save → it redeploys. Render **Logs** show `🚫 CORS blocked request from …` with the exact origin it saw. |
| CORS error **only on the first visit**, then fine | Render was asleep and returned a 502 page without CORS headers | Nothing to fix — the site retries automatically. Use UptimeRobot (above) to avoid it. |
| **Blank page** on GitHub Pages | Assets loaded from the wrong folder | F12 → Network: if `/assets/index-….js` is 404, the build didn't get the base path — check the workflow still sets `VITE_BASE_PATH`. Also confirm Settings → Pages → Source is **GitHub Actions** (not *Deploy from a branch*). |
| **404 on refresh** or on a deep link | Pages has no file for that path | The workflow's `404.html` copy handles it. If you add React Router later, use `HashRouter` (URLs like `/#/admin`) — simplest on Pages. |
| Calls go to `http://localhost…` or to `/api/...` on github.io (404) | `VITE_API_URL` wasn't set when the site was built | Add the Variable in GitHub (Step 5), then **Actions → Run workflow** — Vite values are baked in at build time, so a rebuild is required. |
| Warning in Actions: *VITE_API_URL is not set* | Same as above | Same as above. |
| Render log: `ENETUNREACH` / `connect ETIMEDOUT … :5432` with a `db.xxxx.supabase.co` host | Using the IPv6-only **Direct** connection | Use the **Session pooler** string (Step 2). |
| `password authentication failed for user "postgres"` | Wrong password or the user part is missing the project ref | The pooler user is `postgres.<project-ref>`, not just `postgres`. Re-copy the string; URL-encode special characters. |
| `self-signed certificate in certificate chain` | `DATABASE_CA_CERT` set to the wrong file, or `?sslmode=verify-full` copied in the URL | Remove `DATABASE_CA_CERT` (SSL stays on, just without CA pinning) or set it to Supabase's downloaded certificate. |
| `relation "rsvps" does not exist` | Schema wasn't run in this project | Run `supabase/schema.sql` in the SQL Editor (Step 1). |
| `/api/health` works but everything else is slow for ~1 minute | Free instance waking up | Expected. UptimeRobot keeps it awake. |
| Supabase dashboard says **Project paused** | 7 days without activity | Click **Restore project**; add the UptimeRobot monitor. |
| Photo upload: *Photo storage is not configured on the server* | `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` missing on Render | Add them in Render → Environment. |
| Photo upload: *Storage upload failed: … row-level security* or *Invalid Compact JWS* | The **anon** key was pasted into `SUPABASE_SERVICE_KEY` | Use the **service_role** / **sb_secret_** key there. |
| Photo upload: *Bucket not found* | Schema's bucket step didn't run | Re-run `supabase/schema.sql`, or Storage → **New bucket** `images`, **Public** on. |
| Photos show but not the new ones | Browser cache of the old page | Hard refresh. New uploads get new file names, so stale photos never stick. |
| Dashboard: *Too many wrong attempts* | 8 wrong passwords from one IP | Wait 15 minutes, or redeploy the service on Render to reset. |
| Changing the admin password | — | Render → Environment → edit `ADMIN_PASSWORD` → Save. No GitHub change needed. |
