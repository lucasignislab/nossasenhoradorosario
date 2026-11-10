-- Foto de perfil (avatar) dos filhos: melhora a identificação nas listas
-- de presença, membros e escalas. Bucket público de leitura; cada usuário
-- só escreve dentro da própria pasta (<uid>/...).

alter table public.profiles
add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Leitura pública dos avatares"
on storage.objects for select
to authenticated
using (bucket_id = 'avatars');

create policy "Usuário envia o próprio avatar"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Usuário atualiza o próprio avatar"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Usuário remove o próprio avatar"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
