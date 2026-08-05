-- ============================================================
-- MyToon — Code promo sur les commandes
-- ============================================================

alter table public.orders
  add column if not exists promo jsonb;
