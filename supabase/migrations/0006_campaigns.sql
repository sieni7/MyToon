-- ============================================================
-- MyToon — Campagnes saisonnières
-- Table, RLS, RPC publics (get_active_campaign / validate_promo), seed
-- ============================================================

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  start_date timestamptz,
  end_date timestamptz,
  active boolean not null default false,
  banner_text text default '',
  accent_color text default '#ff6b35',
  promo_code text,
  promo_discount int,
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

create policy "campaigns: public read" on public.campaigns
  for select to anon, authenticated
  using (true);

create policy "campaigns: admins write" on public.campaigns
  for all to authenticated
  using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- ------------------------------------------------------------
-- RPC : campagne active (public)
-- Retourne la campagne active=true dont now() est dans [start, end]
-- (end_date optionnel = illimitée)
-- ------------------------------------------------------------
create or replace function public.get_active_campaign()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.campaigns;
begin
  select * into c from public.campaigns
  where active = true
    and (start_date is null or start_date <= now())
    and (end_date is null or end_date >= now())
  order by created_at asc
  limit 1;
  if c is null then
    return null;
  end if;
  return jsonb_build_object(
    'id', c.id,
    'code', c.code,
    'name', c.name,
    'banner_text', c.banner_text,
    'accent_color', c.accent_color,
    'promo_code', c.promo_code,
    'promo_discount', c.promo_discount
  );
end;
$$;

grant execute on function public.get_active_campaign() to anon, authenticated;

-- ------------------------------------------------------------
-- RPC : validation d'un code promo (public)
-- Retourne {campaign_code, campaign_name, discount} si valide, sinon null
-- ------------------------------------------------------------
create or replace function public.validate_promo(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.campaigns;
begin
  select * into c from public.campaigns
  where promo_code is not null
    and upper(promo_code) = upper(p_code)
    and active = true
    and (start_date is null or start_date <= now())
    and (end_date is null or end_date >= now())
  order by created_at asc
  limit 1;
  if c is null or c.promo_discount is null then
    return null;
  end if;
  return jsonb_build_object(
    'campaign_code', c.code,
    'campaign_name', c.name,
    'discount', c.promo_discount
  );
end;
$$;

grant execute on function public.validate_promo(text) to anon, authenticated;

-- ------------------------------------------------------------
-- Seed : 3 campagnes prêtes (inactives par défaut)
-- ------------------------------------------------------------
insert into public.campaigns (code, name, start_date, end_date, active, banner_text, accent_color, promo_code, promo_discount) values
  ('halloween-2026', 'Halloween', '2026-10-20 00:00:00+00', '2026-11-02 23:59:59+00', false,
   '🎃 Halloween : -15% avec le code HALLOWEEN15', '#ff6b35', 'HALLOWEEN15', 15),
  ('fete-peres', 'Fête des Pères', '2026-06-01 00:00:00+00', '2026-06-30 23:59:59+00', false,
   '👨 Fête des Pères : -15% avec le code PAPA15', '#fbbf24', 'PAPA15', 15),
  ('noel-2026', 'Noël', '2026-12-01 00:00:00+00', '2026-12-31 23:59:59+00', false,
   '🎄 Noël : -10% avec le code NOEL10', '#ef4444', 'NOEL10', 10)
on conflict (code) do nothing;
