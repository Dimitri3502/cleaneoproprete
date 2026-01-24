-- Grant full CRUD rights to authenticated users on public schema tables

-- 1. Deals table
-- SELECT, INSERT, UPDATE were added in 20260124171500_secure_backend.sql
-- Adding DELETE policy
DROP POLICY IF EXISTS "deals_delete_authenticated" ON public.deals;
CREATE POLICY "deals_delete_authenticated" ON public.deals
FOR DELETE TO authenticated
USING (true);

-- 2. Deal Documents table
-- SELECT, INSERT were added in 20260124171500_secure_backend.sql
-- Adding UPDATE and DELETE policies
DROP POLICY IF EXISTS "docs_update_authenticated" ON public.deal_documents;
CREATE POLICY "docs_update_authenticated" ON public.deal_documents
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "docs_delete_authenticated" ON public.deal_documents;
CREATE POLICY "docs_delete_authenticated" ON public.deal_documents
FOR DELETE TO authenticated
USING (true);
