# Sondos Lasheen — Portfolio

React + Vite + TypeScript, Framer Motion, GSAP ScrollTrigger, Lenis. A static site with a small back-end (Vercel serverless functions) for the contact form.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 (also runs the /api functions)
npm run build      # type-check + production build into dist/
npm run preview    # serve the build
npm run lint       # oxlint
```

Add `?intro=0` to the URL to skip the intro curtain while testing.

## Where things live

| What | Where |
|---|---|
| Name, contact, links, bio, education, courses | `src/data/profile.ts` |
| Featured projects (8) and the "More UI studies" grid | `src/data/projects.ts` |
| Services, skills, experience, FAQ, marquee words | `src/data/content.ts` |
| Colors (dark + light) and spacing | `src/styles/tokens.css` |
| Page sections | `src/components/sections/` |
| Contact form back-end and /admin | `api/` (`contact.ts`, `admin/`, shared code in `_lib/`) |
| Security headers, deep-link rewrite | `vercel.json` |

## Add or edit a project

1. Add an object to `src/data/projects.ts` (copy an existing one). Set `kind` to `built`, `uiux` or `brand`.
2. Put images in `raw-assets/<assetFolder>/`. Name the main image `cover.png` (or `.jpg`). Every other image in the folder becomes the project gallery (sorted by file name). For a `brand` project the gallery is shown as a brand wall.
3. Run `npm run assets`. It writes optimized WebP files to `public/projects/<slug>/` and updates `src/data/assets.generated.json`. Commit both.
4. Add real links in `links` (`live`, `repo`, `behance`). A link that is missing is simply not shown. A `live` link also adds an embedded live preview on the project page.

Projects without a cover image show a tidy placeholder with the project's initials.

## Change colors

Edit the CSS variables in `src/styles/tokens.css`. `:root` is dark mode, `[data-theme='light']` is light mode. `--accent` is the calm red used for buttons and small marks; `--accent-text` is the red used for small text; `--accent-soft` is a faint tint for highlighted areas.

## How the contact form works

When someone fills in the form on your site, the page sends it to `/api/contact` (a small server function on Vercel, in `api/contact.ts`). The function checks the message, blocks spam, and **emails it to your Gmail** through a free service called Resend. The visitor's email is set as "reply-to", so you just press **Reply** in Gmail to answer them.

### What you must do (once, about 10 minutes)

1. **Create a Resend account** at resend.com using the **same email as your inbox**: `sondoslasheen@gmail.com`. This matters: before you own a domain, Resend only delivers to the email you signed up with.
2. In Resend, open **API Keys → Create API Key** and copy the key (it starts with `re_`).
3. In Vercel open your project → **Settings → Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | the key you copied |
   | `CONTACT_TO_EMAIL` | `sondoslasheen@gmail.com` |
   | `CONTACT_FROM_EMAIL` | leave it out for now |

4. **Redeploy.** Variables only reach the site on a new deployment: Deployments → the latest one → ⋯ → **Redeploy**.
5. **Test it on the live URL:** open your site, send yourself a message, and check Gmail (also the Spam folder the first time; mark it "Not spam").

Later, when you own a domain, verify it in Resend and set `CONTACT_FROM_EMAIL` to something like `Portfolio <hello@yourdomain.com>`. Until then the sender shows as `onboarding@resend.dev`.

### What the form protects against

- **Validation** on the server: name, a valid email and a message are required. Limits: name 100, email 255, subject 200, message 3000 characters. Messages with more than 3 links are rejected. Everything is trimmed, and escaped inside the email.
- **Hidden trap field**: bots fill it in, people never see it. Those messages are silently dropped.
- **Too fast**: sending less than 3 seconds after the page opened is rejected.
- **Rate limit**: 5 messages per IP per hour. *Honest note:* on Vercel each server instance keeps its own counter in memory, and it resets when the instance goes to sleep. It stops casual spam but is not a strict global limit. For a strict one, connect a shared store (for example Upstash Redis).
- **Optional Cloudflare Turnstile** (off by default). To turn it on, create a Turnstile widget, set `TURNSTILE_SECRET_KEY` (server) and `VITE_TURNSTILE_SITE_KEY` (browser), then redeploy.

If sending fails, the visitor sees a friendly message with your email (copy button) and a WhatsApp link, so no lead is lost.

### Where your messages arrive

In your **Gmail inbox**, with the subject "New portfolio message from <name>", showing the name, email, subject, message, time (Cairo) and the visitor's country. Press **Reply** to answer.

### Optional: keep messages on a private page (/admin)

Email is enough on its own. If you also want a list of messages that you can mark as read or delete:

1. Create a free project at supabase.com. In **SQL Editor**, paste and run `supabase/messages.sql` (it creates the `messages` table and locks it).
2. In Supabase **Project Settings → API**, copy the **Project URL** and the **service_role** key (a secret: never share it, never put it in the frontend).
3. In Vercel add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` (a long password that only you know). Redeploy.
4. Open `https://your-site/admin`, log in, and you will see every new message. If the Supabase variables are missing, the form still works by email only.

The login is rate limited (5 attempts per 15 minutes per IP) and uses a signed, `httpOnly` cookie that lasts 8 hours.

### Running it on your computer

`npm run dev` also runs the `/api` functions (a small helper in `scripts/vite-api.ts`). Copy `.env.example` to `.env` and fill in the values. To test without sending a real email, set `CONTACT_DRY_RUN=true` in `.env`.

## CV file

Put the PDF at `public/Sondos_Fouad_Lasheen_CV.pdf`. The "Download CV" button downloads it (replace the file, keep the same name).

## Deploy on Vercel (free Hobby plan)

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/sondosfouad11/portfolio.git   # create an empty PUBLIC repo first
git push -u origin main
```

1. Go to vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. **Settings → Environment Variables**: add the variables from "How the contact form works", then redeploy. The `api/` folder is picked up automatically as serverless functions.
4. `vercel.json` makes deep links like `/work/wafid` work, adds security headers, and sets long cache headers for images.
5. Custom domain: **Settings → Domains → Add**, then follow the DNS steps Vercel shows.
6. After you know the final URL, replace `https://sondoslasheen.vercel.app` in `index.html`, `public/sitemap.xml` and `public/robots.txt`.

## Accessibility and motion

`prefers-reduced-motion` turns off smooth scrolling, pinning, parallax, the marquee movement and the intro (simple fades remain). The custom cursor is off on touch devices. The project gallery becomes a swipeable snap row on phones. The mobile menu and the image lightbox trap keyboard focus and close with Escape.

## Performance notes

- Sections below the first screen, the footer and the smooth-scroll library load after the first paint (`src/lib/sections.ts`), so the first screen needs less JavaScript. Jumping to a section from the menu loads everything first, then scrolls.
- The hero portrait and the two main fonts are preloaded from `index.html` (`scripts/vite-preload.ts`).
- `npm run assets` creates several WebP sizes per image; the browser picks the right one.
