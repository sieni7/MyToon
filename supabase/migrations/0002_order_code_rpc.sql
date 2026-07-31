-- Compteur atomique des numéros de commande (MT-XXXX)
create table if not exists public.counters (
  key text primary key,
  value bigint not null default 0
);

create or replace function public.next_order_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  n bigint;
begin
  insert into public.counters (key, value) values ('orders', 1)
  on conflict (key) do update set value = public.counters.value + 1
  returning value into n;
  if n is null then
    select value into n from public.counters where key = 'orders';
  end if;
  return 'MT-' || lpad(n::text, 4, '0');
end;
$$;

grant execute on function public.next_order_code() to authenticated;
