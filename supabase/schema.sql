create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'deal_sector') then
    create type deal_sector as enum (
      'unknown',
      'biotech',
      'medtech',
      'digital_health',
      'services',
      'other'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'deal_stage') then
    create type deal_stage as enum (
      'unknown',
      'pre_seed',
      'seed',
      'series_a',
      'series_b',
      'series_c',
      'growth',
      'public'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'deal_decision') then
    create type deal_decision as enum ('GO', 'NO_GO', 'REVIEW');
  end if;
  if not exists (select 1 from pg_type where typname = 'deal_status') then
    create type deal_status as enum (
      'new',
      'screening',
      'ic_ready',
      'diligence',
      'passed',
      'closed'
    );
  end if;
end
$$;

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deal_id text unique,
  source_channel text,
  source_sender text,
  company_name text,
  company_website text,
  country text,
  city text,
  sector deal_sector not null default 'unknown',
  therapeutic_area text,
  indication text,
  modality_or_tech text,
  stage deal_stage not null default 'unknown',
  round_type text,
  amount_sought_eur numeric,
  valuation_post_money_eur numeric,
  use_of_funds text,
  key_team text,
  lead_contact_name text,
  lead_contact_email text,
  one_liner text not null default '',
  summary_5_bullets text[] not null default '{}'::text[],
  why_now text,
  moat_or_differentiation text,
  ip_status text,
  ip_highlights text,
  clinical_or_preclinical_signal text,
  regulatory_pathway text,
  traction_metrics text,
  top_competitors text,
  risks_red_flags text[] default '{}'::text[],
  missing_info text[] default '{}'::text[],
  thesis_fit_subscore integer,
  stage_ticket_subscore integer,
  team_subscore integer,
  data_signal_subscore integer,
  total_score integer,
  go_no_go deal_decision not null default 'REVIEW',
  why_go_no_go_3_bullets text[] default '{}'::text[],
  overall_confidence numeric not null default 0,
  evidence_json jsonb not null default '[]'::jsonb,
  confidence_json jsonb not null default '{}'::jsonb,
  status deal_status not null default 'new',
  next_step text,
  owner text,
  call_date timestamptz,
  call_summary text,
  last_touched_by text
);

create table if not exists public.deal_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  file_name text,
  storage_bucket text not null default 'deal-decks',
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  sha256 text,
  text_extracted jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists deals_created_at_idx on public.deals (created_at desc);
create index if not exists deals_go_no_go_idx on public.deals (go_no_go);
create index if not exists deals_status_idx on public.deals (status);
create index if not exists deal_documents_deal_id_idx on public.deal_documents (deal_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_deals_updated_at on public.deals;
create trigger set_deals_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

alter table public.deals enable row level security;
alter table public.deal_documents enable row level security;

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

CREATE POLICY "deals_delete_authenticated" ON public.deals
FOR DELETE TO authenticated
USING (true);

-- Deal Documents
CREATE POLICY "docs_read_authenticated" ON public.deal_documents
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "docs_write_authenticated" ON public.deal_documents
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "docs_update_authenticated" ON public.deal_documents
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "docs_delete_authenticated" ON public.deal_documents
FOR DELETE TO authenticated
USING (true);

insert into storage.buckets (id, name, public)
values ('deal-decks', 'deal-decks', false)
on conflict (id) do update set public = excluded.public;

-- Demo-only open Storage policies removed.
drop policy if exists "demo deal-decks read" on storage.objects;
drop policy if exists "demo deal-decks insert" on storage.objects;
drop policy if exists "demo deal-decks update" on storage.objects;
drop policy if exists "demo deal-decks delete" on storage.objects;
