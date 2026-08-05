-- ============================================================
-- MyToon — Remédiation audit 2026-08-05
-- 1) Workflow 7 statuts : suppression de 'validation_attente'
-- 2) Backfill owner_phone au format E.164
-- 3) Prix promo autoritaire côté serveur (trigger)
-- ============================================================

-- ------------------------------------------------------------
-- 1) choose_variation : n'accepter que 'propositions_pretes'
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
  if o.status <> 'propositions_pretes' then
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
-- 2) Backfill owner_phone au format E.164 depuis client.telephone
-- ------------------------------------------------------------
update public.orders o
set owner_phone = tmp.phone
from (
  select o2.id,
    case
      when regexp_replace(coalesce(o2.client->>'telephone', ''), '\D', '', 'g') ~ '^225[0-9]{10}$'
        then '+' || regexp_replace(o2.client->>'telephone', '\D', '', 'g')
      when regexp_replace(coalesce(o2.client->>'telephone', ''), '\D', '', 'g') ~ '^[0-9]{10}$'
        then '+225' || regexp_replace(o2.client->>'telephone', '\D', '', 'g')
      when regexp_replace(coalesce(o2.client->>'telephone', ''), '\D', '', 'g') <> ''
        then '+' || regexp_replace(o2.client->>'telephone', '\D', '', 'g')
      else null
    end as phone
  from public.orders o2
  where o2.client->>'telephone' is not null
    and o2.client->>'telephone' <> ''
) tmp
where tmp.id = o.id;

-- ------------------------------------------------------------
-- 3) Prix promo autoritaire : revalide le code contre campaigns
-- et force la remise côté serveur (client ne peut pas la falsifier)
-- ------------------------------------------------------------
create or replace function public.enforce_order_promo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.campaigns;
begin
  if new.promo is null or new.promo->>'code' is null or btrim(new.promo->>'code') = '' then
    new.promo := null;
    return new;
  end if;
  select * into c from public.campaigns
    where promo_code is not null
      and upper(promo_code) = upper(btrim(new.promo->>'code'))
      and active = true
      and (start_date is null or start_date <= now())
      and (end_date is null or end_date >= now())
    order by created_at asc
    limit 1;
  if c is null or c.promo_discount is null then
    new.promo := null;
    return new;
  end if;
  new.promo := jsonb_build_object('code', upper(btrim(new.promo->>'code')), 'discount', c.promo_discount);
  return new;
end;
$$;

drop trigger if exists trg_orders_promo on public.orders;
create trigger trg_orders_promo
  before insert or update on public.orders
  for each row execute function public.enforce_order_promo();

-- ------------------------------------------------------------
-- recent_feed : retire la référence au statut supprimé
-- ------------------------------------------------------------
create or replace function public.recent_feed(n int default 8)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  from (
    select
      split_part(coalesce(o.client ->> 'nom', 'Un client'), ' ', 1) as name,
      coalesce(o.client ->> 'quartier', 'Abidjan') as quartier,
      o.avatar ->> 'style' as style,
      o.status
    from public.orders o
    where o.status in ('propositions_pretes', 'validee', 'en_impression', 'expediee', 'livree')
    order by o.updated_at desc
    limit n
  ) t
$$;

grant execute on function public.recent_feed(int) to anon, authenticated;