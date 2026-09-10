-- pgTAP test for the profiles authorization surface. Run with `corepack yarn
-- db:test` against the local stack. Each test file is wrapped in a rolled-back
-- transaction so fixtures never leak.
begin;

create extension if not exists pgtap with schema extensions;

select plan(6);

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'owner@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'other@example.test');

insert into public.profiles (id, display_name) values
  ('11111111-1111-4111-8111-111111111111', 'Owner'),
  ('22222222-2222-4222-8222-222222222222', 'Other');

-- Anonymous clients have no grant at all.
set local role anon;
select throws_ok(
  'select * from public.profiles',
  '42501',
  null,
  'anonymous clients cannot read profiles'
);
reset role;

-- Authenticated users see and change only their own row.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select results_eq(
  'select id from public.profiles',
  $$values ('11111111-1111-4111-8111-111111111111'::uuid)$$,
  'authenticated users read only their own profile'
);

select lives_ok(
  $$update public.profiles set display_name = 'Owner Renamed'
    where id = '11111111-1111-4111-8111-111111111111'$$,
  'owners can update their own profile'
);

-- An update aimed at another user matches no visible row.
update public.profiles set display_name = 'Tampered'
  where id = '22222222-2222-4222-8222-222222222222';

select throws_ok(
  $$insert into public.profiles (id, display_name)
    values ('33333333-3333-4333-8333-333333333333', 'Impostor')$$,
  '42501',
  null,
  'users cannot create profiles for other identities'
);

reset role;

select is(
  (select display_name from public.profiles
    where id = '22222222-2222-4222-8222-222222222222'),
  'Other',
  'other users'' profiles are untouched by cross-user updates'
);

select is(
  (select display_name from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'),
  'Owner Renamed',
  'the owner update was applied'
);

select * from finish();

rollback;
