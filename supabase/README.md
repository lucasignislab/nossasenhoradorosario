# Ativação do portal dos filhos

## 1. Criar e conectar o projeto

1. Crie um projeto no Supabase.
2. No SQL Editor, execute a migration `migrations/202607220001_member_profiles.sql`.
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave publicável do projeto.

## 2. Configurar a confirmação de e-mail

Em **Authentication > Email Templates > Confirm signup**, use o endereço:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Cadastre `http://localhost:3000` como Site URL durante o desenvolvimento e adicione o domínio de produção nas Redirect URLs antes da publicação.

## 3. Ativar os primeiros responsáveis

Depois que Iyá Pri, Iyá Bru e o desenvolvedor criarem suas contas, substitua os e-mails abaixo e execute no SQL Editor:

```sql
update public.profiles p
set role = 'admin', status = 'active'
from auth.users u
where p.id = u.id
  and u.email in ('email-da-iya-pri', 'email-da-iya-bru');

update public.profiles p
set role = 'developer', status = 'active'
from auth.users u
where p.id = u.id
  and u.email = 'email-do-desenvolvedor';
```

Todos os demais cadastros começam com `role = 'member'` e `status = 'pending'`. Eles só acessam o conteúdo interno depois da aprovação administrativa.
