-- O mural passa a ser uma lista geral da casa: os itens não dependem mais de
-- uma gira cadastrada — quem gerencia pode publicar necessidades a qualquer
-- momento, haja gira marcada ou não.

alter table public.mural_items drop column event_id;
