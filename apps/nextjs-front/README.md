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

## Backend-Driven Enums

To ensure the frontend stays in sync with the database, we use a "meta-enums" system.

### How to add a new enum:

1.  **Database**: Create your enum type and use it in a table column.
    ```sql
    CREATE TYPE my_new_enum AS ENUM ('val1', 'val2');
    ALTER TABLE my_table ADD COLUMN my_col my_new_enum;
    ```
2.  **Edge Function**: Update `supabase/functions/meta-enums/index.ts` to include the new column in the `CONFIG` array:
    ```typescript
    const CONFIG = [...{ table: 'my_table', column: 'my_col' }];
    ```
3.  **Frontend Type**: Add the new key to `EnumKey` in `lib/enums.ts`:
    ```typescript
    export type EnumKey = 'deals.sector' | 'deals.stage' | 'my_table.my_col';
    ```
4.  **Usage**: Fetch options in your component:
    ```typescript
    const options = await getOptions('my_table.my_col');
    ```

## CLI & Deployment

### Local Development

1.  **Start Supabase**:
    ```bash
    supabase start
    ```
2.  **Apply Migrations**:
    ```bash
    supabase migration up
    ```
3.  **Reset Database** (reverts all migrations and reapplies them):
    ```bash
    supabase db reset
    ```
4.  **Run Edge Functions**:
    ```bash
    supabase functions serve --no-verify-jwt
    ```

### Cloud Deployment

1.  **Link Project** (first time only):
    ```bash
    supabase link --project-ref your-project-ref
    ```
2.  **Push Database Changes**:
    ```bash
    supabase db push
    ```
3.  **Deploy Edge Function**:
    ```bash
    supabase functions deploy meta-enums --no-verify-jwt
    ```

## Notes

- No authentication is enabled. Policies are open for demo purposes only.
- All Supabase calls are client-side; avoid server secrets in components.
