-- ============================================================
-- MyToon — Flux public des dernières commandes (ticker social)
-- Preuve sociale VIVANTE mais sans exposer de données privées :
-- on ne renvoie que prénom + quartier + style + statut,
-- pour les commandes dont les déclinaisons ont été créées.
-- ============================================================

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
    where o.status in ('propositions_pretes', 'validation_attente', 'validee', 'en_impression', 'expediee', 'livree')
    order by o.updated_at desc
    limit n
  ) t
$$;

grant execute on function public.recent_feed(int) to anon, authenticated;
