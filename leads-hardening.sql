-- Run once in Supabase SQL Editor.

-- 1. Normalize existing phone numbers to the last 10 digits so the unique index can be created.
update public.leads
set phone = right(regexp_replace(phone, '\D', '', 'g'), 10)
where phone is not null;

-- If this next statement fails, you have duplicate phones. Merge or delete the extras first:
--   select phone, count(*) from public.leads group by phone having count(*) > 1;
create unique index if not exists leads_phone_unique on public.leads (phone);

-- 2. Atomic "repeat inquiry" update, so two simultaneous submissions can't lose a count.
create or replace function public.bump_lead_inquiry(
  p_phone text,
  p_type text,
  p_plot text,
  p_date text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.leads
  set inquiry_count = coalesce(inquiry_count, 1) + 1,
      notes = coalesce(nullif(notes, '') || E'\n', '')
              || '[' || to_char(now() at time zone 'Asia/Kolkata', 'DD/MM/YYYY') || '] Re-inquired: ' || p_type,
      type = p_type,
      plot_number = coalesce(p_plot, plot_number),
      preferred_date = coalesce(p_date, preferred_date),
      updated_at = now()
  where phone = p_phone
  returning inquiry_count into new_count;
  return new_count;
end;
$$;

-- Only the server (service role) may call it; the public anon key must not.
revoke all on function public.bump_lead_inquiry(text, text, text, text) from public, anon, authenticated;
grant execute on function public.bump_lead_inquiry(text, text, text, text) to service_role;

-- 3. Optional audit log for CRM actions (status changes, plot toggles, deletes).
create table if not exists public.audit_log (
  id bigserial primary key,
  at timestamptz not null default now(),
  action text not null,
  target text,
  detail jsonb
);
alter table public.audit_log enable row level security;
-- No policies = no access for anon/authenticated. Only the service role (server) can read/write.

