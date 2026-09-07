-- Mensalidades auto-registradas pelos filhos: valor entre R$ 70 e R$ 100,
-- situação pendente -> pago (comprovante anexado no Storage).
-- A administração mantém controle total pelas policies já existentes.

alter table public.finance_entries
  add column status text not null default 'pago' check (status in ('pendente', 'pago')),
  add column receipt_path text;

-- Uma mensalidade por pessoa por mês (lançamentos avulsos da admin sem profile seguem livres).
create unique index finance_mensalidade_mes_idx
on public.finance_entries (profile_id, (date_trunc('month', entry_date::timestamp)))
where type = 'entrada' and category = 'mensalidade' and profile_id is not null;

-- Faixa de valor só se aplica a mensalidades registradas pelos filhos
-- (lançamentos da administração têm created_by de admin e ficam livres).
alter table public.finance_entries
  add constraint finance_mensalidade_valor_faixa
  check (category <> 'mensalidade' or (amount_cents between 7000 and 10000));

-- O membro registra a própria mensalidade (sempre como pendente).
create policy "Membro registra a própria mensalidade"
on public.finance_entries for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and type = 'entrada'
  and category = 'mensalidade'
  and status = 'pendente'
  and public.is_active_member()
);

-- O membro anexa o comprovante e marca como paga na própria mensalidade.
create policy "Membro envia comprovante da própria mensalidade"
on public.finance_entries for update
to authenticated
using ((select auth.uid()) = profile_id and type = 'entrada' and category = 'mensalidade')
with check ((select auth.uid()) = profile_id and type = 'entrada' and category = 'mensalidade');

-- Bucket privado de comprovantes: cada membro envia para a própria pasta
-- (<profile_id>/<arquivo>); a administração lê tudo.
insert into storage.buckets (id, name, public)
values ('comprovantes', 'comprovantes', false)
on conflict (id) do nothing;

create policy "Membro envia comprovante na própria pasta"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'comprovantes'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and public.is_active_member()
);

create policy "Membro lê os próprios comprovantes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'comprovantes'
  and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_administrator())
);

create policy "Administração gerencia os comprovantes"
on storage.objects for all
to authenticated
using (bucket_id = 'comprovantes' and public.is_administrator())
with check (bucket_id = 'comprovantes' and public.is_administrator());

-- Seed: mensalidades de janeiro a setembro/2026 do Lucas (R$ 100,00, pagas, dia 10).
-- Idempotente: só insere meses ainda sem mensalidade registrada para ele.
do $$
declare
  lucas_id uuid;
  m integer;
  meses text[] := array['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro'];
begin
  select profiles.id into lucas_id
  from public.profiles
  join auth.users on auth.users.id = profiles.id
  where auth.users.email = 'lucascoelho.cps@gmail.com';

  if lucas_id is null then
    raise notice 'Perfil do Lucas não encontrado; seed de mensalidades ignorado.';
    return;
  end if;

  for m in 1..9 loop
    insert into public.finance_entries (type, category, description, amount_cents, entry_date, profile_id, created_by, status)
    select 'entrada', 'mensalidade', format('Mensalidade — %s/2026', meses[m]), 10000, make_date(2026, m, 10), lucas_id, lucas_id, 'pago'
    where not exists (
      select 1 from public.finance_entries existing
      where existing.profile_id = lucas_id
        and existing.type = 'entrada'
        and existing.category = 'mensalidade'
        and date_trunc('month', existing.entry_date::timestamp) = make_date(2026, m, 1)::timestamp
    );
  end loop;
end;
$$;
