-- Secure Backend by removing open RLS policies and restricting access to authenticated users

-- 1. Tables RLS
-- Drop open demo policies
DROP POLICY IF EXISTS "demo deals all access" ON public.deals;
DROP POLICY IF EXISTS "demo deal_documents all access" ON public.deal_documents;

-- Re-enable or ensure RLS is enabled
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_documents ENABLE ROW LEVEL SECURITY;

-- Add policies for authenticated users
-- Deals
CREATE POLICY "deals_read_authenticated" ON public.deals
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "deals_write_authenticated" ON public.deals
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "deals_update_authenticated" ON public.deals
FOR UPDATE TO authenticated
USING (true);

-- Deal Documents
CREATE POLICY "docs_read_authenticated" ON public.deal_documents
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "docs_write_authenticated" ON public.deal_documents
FOR INSERT TO authenticated
WITH CHECK (true);


-- 2. Storage Policies
-- Policies for deal-decks bucket are applied to storage.objects
-- We use DROP POLICY IF EXISTS to ensure a clean state for this specific bucket

-- Set bucket to private (if not already)
UPDATE storage.buckets SET public = false WHERE id = 'deal-decks';

-- Add storage policies for authenticated users
DROP POLICY IF EXISTS "authenticated_read_deal_decks" ON storage.objects;
CREATE POLICY "authenticated_read_deal_decks"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'deal-decks');

DROP POLICY IF EXISTS "authenticated_insert_deal_decks" ON storage.objects;
CREATE POLICY "authenticated_insert_deal_decks"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'deal-decks');

DROP POLICY IF EXISTS "authenticated_update_deal_decks" ON storage.objects;
CREATE POLICY "authenticated_update_deal_decks"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'deal-decks')
WITH CHECK (bucket_id = 'deal-decks');

DROP POLICY IF EXISTS "authenticated_delete_deal_decks" ON storage.objects;
CREATE POLICY "authenticated_delete_deal_decks"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'deal-decks');
