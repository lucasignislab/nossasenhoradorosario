-- Biblioteca (materiais em PDF subidos pelas Iyás) e Pontos Cantados
-- (árvore de pastas livre + PDF do ponto em cada subpasta).

-- 1) Novo tipo de conteúdo: material em PDF da casa.
alter table public.contents drop constraint contents_kind_check;
alter table public.contents add constraint contents_kind_check
check (kind in ('video', 'artigo', 'documento', 'material'));

-- 2) Árvore de pastas dos pontos cantados (ex.: Esquerda > Exus > Pomba Giras).
create table public.ponto_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  parent_id uuid references public.ponto_folders (id) on delete cascade,
  sort_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ponto_folders_parent_idx on public.ponto_folders (parent_id);

-- 3) PDFs dos pontos, cada um dentro de uma pasta.
create table public.pontos (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.ponto_folders (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  file_path text not null,
  file_name text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pontos_folder_idx on public.pontos (folder_id);

alter table public.ponto_folders enable row level security;
alter table public.pontos enable row level security;

create policy "Membros ativos leem as pastas de pontos"
on public.ponto_folders for select
to authenticated
using (public.is_active_member() or public.is_content_manager());

create policy "Gestores de conteúdo criam pastas de pontos"
on public.ponto_folders for insert
to authenticated
with check (public.is_content_manager());

create policy "Gestores de conteúdo renomeiam pastas de pontos"
on public.ponto_folders for update
to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

create policy "Gestores de conteúdo excluem pastas de pontos"
on public.ponto_folders for delete
to authenticated
using (public.is_content_manager());

create policy "Membros ativos leem os pontos"
on public.pontos for select
to authenticated
using (public.is_active_member() or public.is_content_manager());

create policy "Gestores de conteúdo cadastram pontos"
on public.pontos for insert
to authenticated
with check (public.is_content_manager());

create policy "Gestores de conteúdo atualizam pontos"
on public.pontos for update
to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

create policy "Gestores de conteúdo excluem pontos"
on public.pontos for delete
to authenticated
using (public.is_content_manager());

-- 4) Buckets: PDFs dos pontos e materiais da biblioteca.
insert into storage.buckets (id, name, public)
values ('pontos', 'pontos', true), ('materiais', 'materiais', true)
on conflict (id) do nothing;

create policy "Leitura autenticada dos pontos"
on storage.objects for select
to authenticated
using (bucket_id = 'pontos');

create policy "Gestores de conteúdo enviam pontos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'pontos' and public.is_content_manager());

create policy "Gestores de conteúdo removem pontos"
on storage.objects for delete
to authenticated
using (bucket_id = 'pontos' and public.is_content_manager());

create policy "Leitura autenticada dos materiais"
on storage.objects for select
to authenticated
using (bucket_id = 'materiais');

create policy "Gestores de conteúdo enviam materiais"
on storage.objects for insert
to authenticated
with check (bucket_id = 'materiais' and public.is_content_manager());

create policy "Gestores de conteúdo removem materiais"
on storage.objects for delete
to authenticated
using (bucket_id = 'materiais' and public.is_content_manager());
