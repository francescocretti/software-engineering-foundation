-- Reference table for the Supabase profile. Every table in an exposed schema
-- enables Row Level Security, replaces the broad default grants with the
-- minimum the policies are designed to allow, and keeps invariants in
-- constraints so no client can bypass them.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One public profile per authenticated user.';

alter table public.profiles enable row level security;

-- Grants define what is possible; policies define which rows. Both are needed.
revoke all on table public.profiles from anon, authenticated;
grant select, insert (id, display_name), update (display_name)
  on table public.profiles to authenticated;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
