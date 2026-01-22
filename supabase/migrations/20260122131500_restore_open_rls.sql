-- Restore open RLS policies for demo purposes
-- This allows anonymous access (via anon key) to deals and deal_documents

DROP POLICY IF EXISTS "deals_read_authenticated" ON public.deals;
DROP POLICY IF EXISTS "deals_update_authenticated" ON public.deals;
DROP POLICY IF EXISTS "deals_write_authenticated" ON public.deals;
DROP POLICY IF EXISTS "demo deals all access" ON public.deals;

CREATE POLICY "demo deals all access"
ON public.deals
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "docs_read_authenticated" ON public.deal_documents;
DROP POLICY IF EXISTS "docs_write_authenticated" ON public.deal_documents;
DROP POLICY IF EXISTS "demo deal_documents all access" ON public.deal_documents;

CREATE POLICY "demo deal_documents all access"
ON public.deal_documents
FOR ALL
USING (true)
WITH CHECK (true);
