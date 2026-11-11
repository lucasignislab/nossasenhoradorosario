-- Atendimento: senhas/fichas da gira. Sessões abertas pela administração,
-- consulente retira a senha por link público (sem login), chamada em tempo real.

create table public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  session_date date not null,
  event_id uuid references public.events (id) on delete set null,
  status text not null default 'aberta' check (status in ('aberta', 'encerrada')),
  last_called integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance_tickets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions (id) on delete cascade,
  number integer not null,
  visitor_name text not null check (char_length(visitor_name) between 2 and 120),
  status text not null default 'aguardando' check (status in ('aguardando', 'chamado', 'atendido', 'ausente')),
  called_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_id, number)
);

create index attendance_tickets_session_idx on public.attendance_tickets (session_id, number);

alter table public.attendance_sessions enable row level security;
alter table public.attendance_tickets enable row level security;

-- Sessões: leitura pública (link do consulente e telão), gestão da administração.
create policy "Leitura pública das sessões de atendimento"
on public.attendance_sessions for select
to anon, authenticated
using (true);

create policy "Administração cria sessões de atendimento"
on public.attendance_sessions for insert
to authenticated
with check (public.is_administrator());

create policy "Administração atualiza sessões de atendimento"
on public.attendance_sessions for update
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Administração exclui sessões de atendimento"
on public.attendance_sessions for delete
to authenticated
using (public.is_administrator());

-- Senhas: leitura pública (consulente acompanha a chamada); retirada pública
-- apenas como 'aguardando'; chamada/atualização só da administração.
create policy "Leitura pública das senhas"
on public.attendance_tickets for select
to anon, authenticated
using (true);

create policy "Consulentes retiram a própria senha"
on public.attendance_tickets for insert
to anon, authenticated
with check (status = 'aguardando' and called_at is null);

create policy "Administração gerencia as senhas"
on public.attendance_tickets for update
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Administração exclui senhas"
on public.attendance_tickets for delete
to authenticated
using (public.is_administrator());

-- Realtime para a chamada ao vivo (consulente e telão acompanham sem refresh).
alter publication supabase_realtime add table public.attendance_tickets;
alter table public.attendance_tickets replica identity full;
