-- Programação real de setembro/2026, extraída da arte oficial do Instagram
-- (@t.u.senhoradorosario). Arte em public/agenda/giras-setembro-2026.jpeg.
-- Giras na casa: fichas às 19h, início dos trabalhos às 19h30.
-- Giras em Pedreira-SP: mediante inscrição, vagas limitadas.

insert into public.events (title, entity, description, details, category, event_date, event_time, location, image_url) values
  ('Gira de Caboclo', 'Caboclos', 'Entrega das fichas às 19h. Início dos trabalhos às 19h30.', null, 'gira', '2026-09-04', '19:30', 'T. U. Senhora do Rosário — Rua Antônio Adami, 36, Barão Geraldo, Campinas-SP', '/agenda/giras-setembro-2026.jpeg'),
  ('Gira de Exu do Ouro', 'Exu do Ouro', 'Entrega das fichas às 19h. Início dos trabalhos às 19h30.', null, 'gira', '2026-09-11', '19:30', 'T. U. Senhora do Rosário — Rua Antônio Adami, 36, Barão Geraldo, Campinas-SP', '/agenda/giras-setembro-2026.jpeg'),
  ('Gira de Preto Velho', 'Pretos Velhos', 'Entrega das fichas às 19h. Início dos trabalhos às 19h30.', null, 'gira', '2026-09-18', '19:30', 'T. U. Senhora do Rosário — Rua Antônio Adami, 36, Barão Geraldo, Campinas-SP', '/agenda/giras-setembro-2026.jpeg'),
  ('Gira de Águas de Oxalá', 'Águas de Oxalá', 'Gira realizada em Pedreira-SP.', 'Mediante inscrição — vagas limitadas.', 'gira', '2026-09-25', '19:30', 'Barracão de Pedreira - SP', '/agenda/giras-setembro-2026.jpeg'),
  ('Gira em Pedreira — Festa de Erê e Guardiões', 'Erê e Guardiões', 'Festa de Erê e Guardiões, realizada em Pedreira-SP.', 'Mediante inscrição — vagas limitadas.', 'festividade', '2026-09-26', '19:30', 'Barracão de Pedreira - SP', '/agenda/giras-setembro-2026.jpeg');
