-- Leva P1: aniversariantes (birth_date), Regras da Casa (house_documents)
-- e intenção de doação pública (visitante avisa, administração confirma).

-- 1) Data de nascimento na ficha do filho (aniversariantes + carteirinha).
alter table public.profiles
add column if not exists birth_date date;

-- 2) Regras da Casa: documentos internos em PDF, gestão da administração.
create table public.house_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text,
  file_path text not null,
  file_name text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.house_documents enable row level security;

create policy "Membros ativos leem os documentos publicados"
on public.house_documents for select
to authenticated
using (public.is_administrator() or (published and public.is_active_member()));

create policy "Administração cria documentos"
on public.house_documents for insert
to authenticated
with check (public.is_administrator());

create policy "Administração atualiza documentos"
on public.house_documents for update
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Administração exclui documentos"
on public.house_documents for delete
to authenticated
using (public.is_administrator());

insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', true)
on conflict (id) do nothing;

create policy "Leitura autenticada dos documentos"
on storage.objects for select
to authenticated
using (bucket_id = 'documentos');

create policy "Administração envia documentos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'documentos' and public.is_administrator());

create policy "Administração remove documentos"
on storage.objects for delete
to authenticated
using (bucket_id = 'documentos' and public.is_administrator());

-- 3) Intenção de doação pública (página /doar, sem login): entra como
-- pendente no financeiro; a administração confirma o recebimento.
create policy "Visitantes registram intenção de doação"
on public.finance_entries for insert
to anon, authenticated
with check (
  type = 'entrada'
  and category = 'doacao'
  and status = 'pendente'
  and profile_id is null
  and created_by is null
);
