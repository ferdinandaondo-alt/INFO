# The Global Scam Economy — Digital Report Marketplace

A production-structured Next.js app for selling a single premium PDF report
("The Global Scam Economy: Understanding Fraud and Its Impact Worldwide"),
with card/PayPal + crypto checkout, auth, a user dashboard, and an admin
control room. Built with Next.js 15 (App Router), TypeScript, Tailwind,
Prisma, and NextAuth.

**Design:** dark terminal/hacker aesthetic — JetBrains Mono for headlines
and data labels with a green glow treatment, Inter for body copy (kept
separate from the mono font deliberately, so long-form text stays readable
rather than everything competing for attention). "INFO" remains the
site/platform name in the header and footer; the product itself is branded
as its own report.

## What's fully wired vs. what needs your credentials

This is a real, working codebase — not a mockup. Once you add your own
credentials below, checkout, auth, downloads, and admin approval all work
end to end. The three things that inherently require **your** accounts:

| Feature | Status |
|---|---|
| Card + PayPal payments | Wired to PayPal's real Orders API. Add your PayPal Business `CLIENT_ID`/`SECRET` and it processes real (or sandbox) payments. |
| Crypto payments | Full flow (address + QR + tx-hash submission + admin approval) is built. You must paste in **your own wallet addresses** in Admin → Payment Settings — this app can't generate wallets for you, and on-chain confirmation is manually verified by the admin (no blockchain node is wired in, since that requires a paid RPC provider of your choice). |
| Transactional email | Wired to SMTP via `nodemailer`. Add any SMTP provider's credentials (Resend, Postmark, SES, Gmail) and welcome/receipt/download emails send automatically. |

Everything else — auth, database schema, admin dashboard, download tokens,
refund/approve workflow, CMS-style product content — is complete and
functional.

## 1. Install

```bash
npm install
cp .env.example .env
```

Fill in `.env` (see comments in the file for where to get each value).

## 2. Database

Requires Postgres. Locally, the fastest path is Docker:

```bash
docker run --name info-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=info_marketplace -p 5432:5432 -d postgres:16-alpine
```

Then push the schema and seed a product + admin account:

```bash
npm run db:push
npm run db:seed
```

The seed script prints the admin login it created — **change that password
immediately** after your first sign-in.

## 3. PayPal (card + PayPal wallet)

1. Create a PayPal Business account if you don't have one.
2. Go to [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials.
3. Create an app, copy the **Client ID** and **Secret** into `.env` as
   `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
4. Leave `PAYPAL_ENV=sandbox` while testing; switch to `live` when ready to
   take real payments.
5. Optional but recommended: under Webhooks, add
   `https://yourdomain.com/api/webhooks/paypal` and copy the Webhook ID into
   `PAYPAL_WEBHOOK_ID` — this catches refunds/disputes issued from the
   PayPal dashboard directly.

Card payments run through the same integration (PayPal's hosted card
fields) — there's no separate Stripe-style setup needed.

## 4. Crypto wallets

Sign in as admin → **Admin → Payment Settings** → paste in your receiving
address and network label for each currency you want to accept (BTC, ETH,
SOL, USDT-TRC20, USDT-ERC20). These are stored in the database, not in code,
so you can rotate them anytime without a redeploy.

When a buyer pays in crypto, they submit their transaction hash, and the
order sits in **Awaiting review** until you manually verify the transaction
on a block explorer and click **Approve** in Admin → Orders — at which
point the download unlocks and the confirmation email sends automatically.

## 5. Google login (optional)

Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
add `http://localhost:3000/api/auth/callback/google` (and your production
URL) as an authorized redirect URI, and put the client ID/secret in `.env`.

## 6. Upload the product PDF

Sign in as admin → **Admin → PDF manager** → upload the file. It's stored
outside the public folder and only ever served through a signed,
per-order download token — never a guessable URL.

## 7. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Docker

```bash
docker compose up --build
```

Spins up the app + Postgres together. Set your real env vars in `.env`
first — `docker-compose.yml` reads from it.

## Project structure

```
app/                  Pages + API routes (App Router)
  api/                REST endpoints: checkout, admin, auth, downloads
  admin/               Admin control room
  dashboard/           Customer purchase/download history
  checkout/            Card/PayPal + crypto checkout
  product/             Product detail page
components/            UI components
lib/                   Prisma client, NextAuth config, PayPal helper, email
prisma/schema.prisma   Full data model
storage/products/      Private PDF storage (not web-accessible directly)
```

## Adding a second product later

The schema already models `Product` as a table, not a hardcoded page, so
adding another item later is a data change (new `Product` row + a
dynamic `[slug]` route) rather than a rebuild.

## Security notes

- Passwords are hashed with bcrypt (cost factor 12).
- Downloads are only ever served via a random 64-character signed token
  tied to a specific paid order — never a static file URL.
- All `/api/admin/*` routes check for an authenticated session with the
  `ADMIN` role server-side before doing anything.
- `middleware.ts` protects `/dashboard` and `/admin` at the routing layer
  too, redirecting non-admins away from `/admin`.
- PayPal webhook signatures are verified server-side before any order
  status is trusted from a webhook payload.

Before going live: get the placeholder legal pages (`/legal/privacy`,
`/legal/terms`, `/legal/refunds`) reviewed by counsel, and run through
PayPal's sandbox checkout end-to-end at least once.
