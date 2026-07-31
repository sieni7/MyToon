-- ============================================================
-- MyToon — Stats publiques (compteur honnête côté hero)
-- Le public ne peut pas lire la table orders (RLS) : on expose
-- uniquement des compteurs agrégés via une fonction security definer.
-- ============================================================

create or replace function public.order_stats()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'orders',    (select count(*) from public.orders),
    'validated', (select count(*) from public.orders where status in ('validee', 'en_impression', 'expediee', 'livree'))
  )
$$;

grant execute on function public.order_stats() to anon, authenticated;
