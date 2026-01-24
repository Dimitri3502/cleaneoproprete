-- Create bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('deal-decks', 'deal-decks', false)
    on conflict (id) do update set public = excluded.public;

-- Policies removed here, moved to secure_backend migration.
DROP POLICY IF EXISTS "mvp_read_deal_decks" ON storage.objects;
DROP POLICY IF EXISTS "mvp_insert_deal_decks" ON storage.objects;
DROP POLICY IF EXISTS "mvp_delete_deal_decks" ON storage.objects;
