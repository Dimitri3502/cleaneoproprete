-- Create bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('deal-decks', 'deal-decks', false)
    on conflict (id) do nothing;

-- READ
create policy "mvp_read_deal_decks"
on storage.objects
for select
               to anon
               using (bucket_id = 'deal-decks');

-- INSERT
create policy "mvp_insert_deal_decks"
on storage.objects
for insert
to anon
with check (bucket_id = 'deal-decks');

-- DELETE (optional)
create policy "mvp_delete_deal_decks"
on storage.objects
for delete
to anon
using (bucket_id = 'deal-decks');
