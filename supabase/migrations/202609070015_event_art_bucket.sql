-- Bucket público de artes (flyers) dos eventos: a imagem renderiza no site
-- público, então a leitura é aberta; escrita só de quem gerencia conteúdo
-- (administração, desenvolvedores e comunicação ativa).

insert into storage.buckets (id, name, public)
values ('artes', 'artes', true)
on conflict (id) do nothing;

create policy "Leitura pública das artes"
on storage.objects for select
to authenticated
using (bucket_id = 'artes');

create policy "Gestores de conteúdo enviam artes"
on storage.objects for insert
to authenticated
with check (bucket_id = 'artes' and public.is_content_manager());

create policy "Gestores de conteúdo atualizam artes"
on storage.objects for update
to authenticated
using (bucket_id = 'artes' and public.is_content_manager())
with check (bucket_id = 'artes' and public.is_content_manager());

create policy "Gestores de conteúdo removem artes"
on storage.objects for delete
to authenticated
using (bucket_id = 'artes' and public.is_content_manager());
