-- ============================================================
-- MyToon — Phase A : backend Supabase
-- Tables, RLS, Storage. Appliquer via Supabase (SQL Editor ou
-- `npx supabase db push` depuis le dossier du projet).
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  owner_user_id uuid references auth.users(id) on delete cascade,
  owner_phone text,
  client jsonb not null,
  product jsonb not null,
  avatar jsonb not null,
  options jsonb not null default '{}'::jsonb,
  photo_path text,
  status text not null default 'recue',
  timeline jsonb not null default '[]'::jsonb,
  variations jsonb not null default '[]'::jsonb,
  chosen_variation text,
  printer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_code_idx on public.orders (code);
create index orders_owner_user_id_idx on public.orders (owner_user_id);
create index orders_status_idx on public.orders (status);

-- ------------------------------------------------------------
-- ADMINS
-- ------------------------------------------------------------
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SETTINGS (bandeau promo, etc.)
-- ------------------------------------------------------------
create table public.settings (
  key text primary key,
  value jsonb not null
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.admins enable row level security;
alter table public.settings enable row level security;

-- --- ORDERS ---
create policy "orders: insert own" on public.orders
  for insert to authenticated
  with check (owner_user_id = auth.uid());

create policy "orders: select own" on public.orders
  for select to authenticated
  using (owner_user_id = auth.uid());

create policy "orders: admins all" on public.orders
  for all to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- Le client ne peut PAS mettre à jour directement : il passe par l'RPC
-- choose_variation (sécurisée) pour valider sa déclinaison.

-- --- ADMINS ---
create policy "admins: select self" on public.admins
  for select to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()));

-- --- SETTINGS ---
create policy "settings: public read" on public.settings
  for select to anon, authenticated
  using (true);

create policy "settings: admins write" on public.settings
  for all to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- ------------------------------------------------------------
-- RPC : validation d'une déclinaison par le client
-- ------------------------------------------------------------
create or replace function public.choose_variation(order_code text, variation_index int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders;
begin
  select * into o from public.orders where code = order_code;
  if o is null then
    raise exception 'commande introuvable';
  end if;
  if o.owner_user_id <> auth.uid() then
    raise exception 'cette commande ne t''appartient pas';
  end if;
  if o.status not in ('propositions_pretes', 'validation_attente') then
    raise exception 'commande pas en attente de validation';
  end if;
  if variation_index < 0 or variation_index >= jsonb_array_length(o.variations) then
    raise exception 'déclinaison invalide';
  end if;
  update public.orders
  set chosen_variation = o.variations -> variation_index,
      status = 'validee',
      updated_at = now(),
      timeline = o.timeline || jsonb_build_object('status', 'validee', 'date', now(), 'note', 'Déclinaison validée par le client')
  where id = o.id;
end;
$$;

grant execute on function public.choose_variation(text, int) to authenticated;

-- ------------------------------------------------------------
-- STORAGE : bucket privé "media"
-- photos/{uid}/... (photo du client)
-- variations/{code}/1.jpg..3.jpg (déclinaisons, admin)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

create policy "media: upload own photo" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "media: admin upload variations" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'variations'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );

create policy "media: read own photo" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "media: read own variations" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'variations'
    and exists (
      select 1 from public.orders o
      where o.code = (storage.foldername(name))[2]
        and o.owner_user_id = auth.uid()
    )
  );

create policy "media: admins all" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  )
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );
