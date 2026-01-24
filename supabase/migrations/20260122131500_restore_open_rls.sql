-- This migration originally restored open RLS policies for demo purposes.
-- It has been neutralized to secure the backend.
-- Use migrations/20260124171500_secure_backend.sql for current policies.

DROP POLICY IF EXISTS "deals_read_authenticated" ON public.deals;
DROP POLICY IF EXISTS "deals_update_authenticated" ON public.deals;
DROP POLICY IF EXISTS "deals_write_authenticated" ON public.deals;
DROP POLICY IF EXISTS "demo deals all access" ON public.deals;

DROP POLICY IF EXISTS "docs_read_authenticated" ON public.deal_documents;
DROP POLICY IF EXISTS "docs_write_authenticated" ON public.deal_documents;
DROP POLICY IF EXISTS "demo deal_documents all access" ON public.deal_documents;
