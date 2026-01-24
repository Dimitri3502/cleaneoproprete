# Supabase Backend

This directory contains the Supabase configuration, migrations, and edge functions for the Dealflow OS project.

## Setup

1. Create a Supabase project.
2. Run the SQL schema:
   - Open the SQL editor and execute `supabase/schema.sql` or use the CLI to apply migrations.
3. Ensure the Storage bucket exists:
   - Bucket: `deal-decks`
   - Public reads enabled for demo (policies are included in schema).

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
3.  **Frontend Type**: Add the new key to `EnumKey` in `lib/enums.ts` (located in the frontend app):
    ```typescript
    export type EnumKey = 'deals.sector' | 'deals.stage' | 'my_table.my_col';
    ```
4.  **Usage**: Fetch options in your component:
    ```typescript
    const options = await getOptions('my_table.my_col');
    ```

## Notes

- No authentication is enabled. Policies are open for demo purposes only.
- All Supabase calls are client-side in the frontend; avoid server secrets in components.
