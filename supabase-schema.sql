-- ==============================================================================
-- ANURAG ENCLAVE - SUPABASE DATABASE SCHEMA FOR LEADS & SITE VISITS
-- Run this SQL in your Supabase Project: Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create the leads table to capture all customer site visits and plot inquiries
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  email text default '',
  preferred_date text default '',
  plot_number text default '',
  type text default 'site_visit',
  budget text default '',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) for data protection
alter table public.leads enable row level security;

-- 3. Policy: Allow any website visitor to submit a site visit request or inquiry
create policy "Allow website visitors to submit inquiries"
  on public.leads
  for insert
  with check (true);

-- 4. Policy: Allow reading leads (for your admin dashboard and API)
create policy "Allow reading leads for admin"
  on public.leads
  for select
  using (true);

-- 5. Create an index on created_at for fast retrieval of latest inquiries
create index if not exists leads_created_at_idx on public.leads (created_at desc);
