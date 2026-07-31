-- ============================================================
-- MyToon — Correctif RLS : récursion infinie sur la table "admins"
-- Les policies qui testent `exists(select ... from admins ...)`
-- sur la table admins elle-même bouclent à l'infini.
-- Solution : fonction security definer is_admin() + policies
-- basées dessus (le definer contourne la RLS, plus de boucle).
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid())
$$;

grant execute on function public.is_admin() to authenticated;

-- --- ADMINS ---
drop policy if exists "admins: select self" on public.admins;
create policy "admins: select self" on public.admins
  for select to authenticated
  using (public.is_admin());

-- --- ORDERS ---
drop policy if exists "orders: admins all" on public.orders;
create policy "orders: admins all" on public.orders
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- --- SETTINGS ---
drop policy if exists "settings: admins write" on public.settings;
create policy "settings: admins write" on public.settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- --- STORAGE ---
drop policy if exists "media: admin upload variations" on storage.objects;
create policy "media: admin upload variations" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'variations'
    and public.is_admin()
  );

drop policy if exists "media: admins all" on storage.objects;
create policy "media: admins all" on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
