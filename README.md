# Dealflow OS (MVP Demo)

Finance-grade MVP for managing incoming pitch decks, scoring, and evidence.
Built with Next.js App Router + Supabase (Postgres + Storage) and designed for static export.

## Features
- Deal list with decision/status filters
- Deal detail view with summary, subscores, evidence, and documents
- PDF upload that creates a deal + deal_document record
- Client-side Supabase access (no auth, demo-only open RLS)

## Setup
1. Create a Supabase project.
2. Run the SQL schema:
   - Open the SQL editor and execute `supabase/schema.sql`.
3. Ensure the Storage bucket exists:
   - Bucket: `deal-decks`
   - Public reads enabled for demo (policies are included in schema).
4. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build static export
```bash
npm run build
```

The static site is generated in `out/`. Deploy that folder to S3 or any static host.

For direct deep links like `/deals/<id>` on S3, configure the error document to
`index.html` so client-side routing can render the page.

## Notes
- No authentication is enabled. Policies are open for demo purposes only.
- All Supabase calls are client-side; avoid server secrets in components.
