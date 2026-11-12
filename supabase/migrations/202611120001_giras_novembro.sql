-- Programação de novembro/2026 (arte única do mês, enviada ao bucket 'artes').
-- Idempotente: só insere se ainda não existir evento na data com o mesmo título.

insert into public.events (title, entity, category, event_date, event_time, location, description, details, image_url, status)
select v.title, v.entity, 'gira', v.event_date, '20:00'::time, 'T. U. Senhora do Rosário', v.description,
  'Abertura da casa às 19h · Entrega das fichas às 19h · Início dos trabalhos às 20h. Rua Antônio Adami, 36, Barão Geraldo – Campinas/SP.',
  'https://mrbsszppdlapzafliibq.supabase.co/storage/v1/object/public/artes/giras-novembro-2026.jpeg',
  'confirmada'
from (values
  ('Gira de Marinheiro', 'Marinheiro', '2026-11-06'::date, 'Gira de desenvolvimento e atendimento com a linha de Marinheiro.'),
  ('Ritual de Ofó', 'Ritual de Ofó', '2026-11-09'::date, 'Ritual de Ofó — exclusivo para inscritos. Inscrições na recepção da casa.'),
  ('Toque de Exu e Pomba Gira', 'Exu e Pomba Gira', '2026-11-13'::date, 'Toque de Exu e Pomba Gira, com atendimento aos consulentes.'),
  ('Gira Pet e Ritual das Santas Almas', 'Santas Almas', '2026-11-19'::date, 'Gira Pet (tragam seus animais) e Ritual das Santas Almas.'),
  ('Gira de Exu Mirim', 'Exu Mirim', '2026-11-27'::date, 'Gira de Exu Mirim, com atendimento aos consulentes.')
) as v (title, entity, event_date, description)
where not exists (
  select 1 from public.events e
  where e.event_date = v.event_date and e.title = v.title
);
