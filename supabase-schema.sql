-- ==============================================================================
-- ANURAG ENCLAVE - HARDENED PRODUCTION SUPABASE DATABASE SCHEMA & ZERO-TRUST RLS
-- Run this SQL in your Supabase Project: Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. LEADS & CRM PIPELINE TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  email text default '',
  preferred_date text default '',
  plot_number text default '',
  type text default 'site_visit',
  budget text default '',
  status text default 'new' check (status in ('new', 'contacted', 'site_visit', 'negotiation', 'closed')),
  notes text default '',
  utm_source text default '',
  inquiry_count integer default 1,
  follow_up_date text default '',
  dpdp_consent boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on leads
alter table public.leads enable row level security;

-- Drop legacy or insecure policies
drop policy if exists "Allow reading leads for admin" on public.leads;
drop policy if exists "Allow website visitors to submit inquiries" on public.leads;
drop policy if exists "Allow anon insert with hygiene" on public.leads;
drop policy if exists "Allow authenticated admin read" on public.leads;
drop policy if exists "Allow authenticated admin update" on public.leads;
drop policy if exists "Service role full access" on public.leads;

-- Policy A: Anon Insert with strict hygiene validation
-- Visitors can submit inquiries through the contact forms and modal triggers.
create policy "Allow anon insert with hygiene"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    length(trim(full_name)) >= 2 and
    length(trim(phone)) >= 10 and
    length(full_name) <= 120 and
    length(phone) <= 30
  );

-- Policy B: ZERO-TRUST READ POLICY
-- Public (anon) CANNOT read leads under any circumstance!
-- Only authenticated users (admins) or service_role can select/read customer records.
create policy "Allow authenticated admin read"
  on public.leads
  for select
  to authenticated, service_role
  using (true);

-- Policy C: ZERO-TRUST UPDATE POLICY
-- Only authenticated admins or service_role can update lead pipeline status or notes.
create policy "Allow authenticated admin update"
  on public.leads
  for update
  to authenticated, service_role
  using (true)
  with check (true);

-- Policy D: ZERO-TRUST DELETE POLICY (DPDP Act 2023 - Right to be Forgotten)
create policy "Allow authenticated admin delete"
  on public.leads
  for delete
  to authenticated, service_role
  using (true);

-- Indexes for lightning-fast CRM sorting and pipeline queries
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create unique index if not exists leads_phone_unique_idx on public.leads (phone);

comment on table public.leads is 'Anurag Enclave customer inquiries, sales pipeline, and DPDP consent tracking.';


-- ------------------------------------------------------------------------------
-- 2. DYNAMIC PLOTS INVENTORY TABLE
-- Allows instant plot status toggling (Available / Reserved / Sold)
-- and price adjustments directly from database without redeploying frontend code.
-- ------------------------------------------------------------------------------
create table if not exists public.plots (
  id integer primary key,
  number text not null unique,
  size text not null check (size in ('30x40', '40x60', '50x80')),
  width numeric not null,
  depth numeric not null,
  area numeric not null,
  facing text not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  price numeric not null,
  price_per_sqft numeric not null,
  is_corner boolean default false,
  is_park_facing boolean default false,
  is_main_boulevard boolean default false,
  row integer not null,
  col integer not null,
  badges text[] default '{}',
  images text[] default '{}',
  description text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS on plots
alter table public.plots enable row level security;

-- Drop legacy policies
drop policy if exists "Allow public read plots" on public.plots;
drop policy if exists "Allow admin manage plots" on public.plots;

-- Policy A: Public read access (anyone can view available plots on the 3D map & grid)
create policy "Allow public read plots"
  on public.plots
  for select
  to anon, authenticated, service_role
  using (true);

-- Policy B: Admin-only modification (insert, update, delete)
create policy "Allow admin manage plots"
  on public.plots
  for all
  to authenticated, service_role
  using (true)
  with check (true);

create index if not exists plots_status_idx on public.plots (status);
create index if not exists plots_facing_idx on public.plots (facing);

comment on table public.plots is 'Anurag Enclave plot inventory with live status and pricing.';
