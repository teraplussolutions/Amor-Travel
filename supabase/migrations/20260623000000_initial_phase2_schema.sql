-- Amor Travel Phase 2 — initial schema
-- Project: ekdeizmxgucpvcrmoftz (amortravel.net)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum (
  'super_admin',
  'agency_admin',
  'agent',
  'staff'
);

create type public.trip_source as enum (
  'amortravel.mk',
  'facebook',
  'manual',
  'import'
);

create type public.trip_image_match as enum (
  'page',
  'keyword',
  'none'
);

-- ---------------------------------------------------------------------------
-- Agencies (multi-tenant root)
-- ---------------------------------------------------------------------------

create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  domain text,
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agencies_slug_key unique (slug)
);

create index agencies_is_active_idx on public.agencies (is_active);

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users, agency-scoped staff)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  agency_id uuid references public.agencies (id) on delete set null,
  role public.user_role not null default 'staff',
  full_name text,
  phone text,
  avatar_url text,
  locale text not null default 'mk',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_super_admin_no_agency check (
    role <> 'super_admin' or agency_id is null
  ),
  constraint profiles_non_super_admin_has_agency check (
    role = 'super_admin' or agency_id is not null
  )
);

create index profiles_agency_id_idx on public.profiles (agency_id);
create index profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Trips (extends imported JSON / lib/trips/types ImportedTrip)
-- ---------------------------------------------------------------------------

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  slug text not null,
  title_mk text not null,
  title_en text not null default '',
  destination_mk text not null default '',
  destination_en text not null default '',
  departure_date date,
  return_date date,
  duration_days integer,
  duration_nights text,
  price_early_eur numeric(10, 2),
  price_regular_eur numeric(10, 2),
  included_mk text not null default '',
  excluded_mk text not null default '',
  program_mk text not null default '',
  itinerary jsonb not null default '[]'::jsonb,
  hero_image text,
  gallery_images text[] not null default '{}',
  source public.trip_source[] not null default '{}',
  source_urls text[] not null default '{}',
  image_match public.trip_image_match not null default 'none',
  published boolean not null default false,
  imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_agency_slug_key unique (agency_id, slug),
  constraint trips_itinerary_is_array check (jsonb_typeof(itinerary) = 'array')
);

create index trips_agency_id_idx on public.trips (agency_id);
create index trips_published_idx on public.trips (agency_id, published);
create index trips_departure_date_idx on public.trips (departure_date);
create index trips_slug_idx on public.trips (slug);

-- ---------------------------------------------------------------------------
-- Site settings (per-agency CMS / branding)
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies (id) on delete cascade,
  company_name text not null default 'Amor Travel',
  public_email text,
  private_email text,
  phone text,
  address_mk text,
  address_en text,
  social jsonb not null default '{}'::jsonb,
  logo_url text,
  hero_slides jsonb not null default '[]'::jsonb,
  featured_trips jsonb not null default '[]'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_agency_id_key unique (agency_id)
);

create index site_settings_agency_id_idx on public.site_settings (agency_id);

-- ---------------------------------------------------------------------------
-- Exchange rates (NBRM EUR/MKD — agency override or platform default)
-- ---------------------------------------------------------------------------

create table public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies (id) on delete cascade,
  currency text not null,
  rate numeric(12, 6) not null,
  rate_date date not null,
  source text not null default 'nbrm',
  created_at timestamptz not null default now(),
  constraint exchange_rates_rate_positive check (rate > 0),
  constraint exchange_rates_currency_check check (currency in ('EUR', 'MKD'))
);

create unique index exchange_rates_platform_currency_date_key
  on public.exchange_rates (currency, rate_date)
  where agency_id is null;

create unique index exchange_rates_agency_currency_date_key
  on public.exchange_rates (agency_id, currency, rate_date)
  where agency_id is not null;

create index exchange_rates_rate_date_idx on public.exchange_rates (rate_date desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger agencies_set_updated_at
  before update on public.agencies
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trips_set_updated_at
  before update on public.trips
  for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS helpers (agency-scoped)
-- ---------------------------------------------------------------------------

create or replace function public.current_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select p.*
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'super_admin'
      and p.is_active = true
  );
$$;

create or replace function public.user_agency_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.agency_id
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
  limit 1;
$$;

create or replace function public.user_has_agency_access(target_agency_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin()
    or public.user_agency_id() = target_agency_id;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security — stubs (tighten in Phase 2 auth wiring)
-- ---------------------------------------------------------------------------

alter table public.agencies enable row level security;
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.site_settings enable row level security;
alter table public.exchange_rates enable row level security;

-- Agencies
create policy agencies_select_member
  on public.agencies for select
  to authenticated
  using (public.user_has_agency_access(id));

create policy agencies_manage_super_admin
  on public.agencies for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Profiles
create policy profiles_select_self_or_agency
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.user_has_agency_access(agency_id)
  );

create policy profiles_update_self
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_manage_super_admin
  on public.profiles for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Trips — staff CRUD within agency; public read when published
create policy trips_select_published_public
  on public.trips for select
  to anon, authenticated
  using (published = true);

create policy trips_select_agency_member
  on public.trips for select
  to authenticated
  using (public.user_has_agency_access(agency_id));

create policy trips_insert_agency_member
  on public.trips for insert
  to authenticated
  with check (public.user_has_agency_access(agency_id));

create policy trips_update_agency_member
  on public.trips for update
  to authenticated
  using (public.user_has_agency_access(agency_id))
  with check (public.user_has_agency_access(agency_id));

create policy trips_delete_agency_member
  on public.trips for delete
  to authenticated
  using (public.user_has_agency_access(agency_id));

-- Site settings
create policy site_settings_select_public
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy site_settings_manage_agency
  on public.site_settings for all
  to authenticated
  using (public.user_has_agency_access(agency_id))
  with check (public.user_has_agency_access(agency_id));

-- Exchange rates
create policy exchange_rates_select_authenticated
  on public.exchange_rates for select
  to authenticated
  using (
    agency_id is null
    or public.user_has_agency_access(agency_id)
  );

create policy exchange_rates_select_public_latest
  on public.exchange_rates for select
  to anon
  using (agency_id is null);

create policy exchange_rates_manage_agency
  on public.exchange_rates for all
  to authenticated
  using (
    public.is_super_admin()
    or public.user_has_agency_access(agency_id)
  )
  with check (
    public.is_super_admin()
    or public.user_has_agency_access(agency_id)
  );
