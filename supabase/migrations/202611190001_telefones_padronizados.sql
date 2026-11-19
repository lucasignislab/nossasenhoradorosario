-- Padroniza telefones já cadastrados: DDD sempre entre parênteses.
-- 11 dígitos → (19) 99999-0000 · 10 dígitos → (19) 3222-0000.

update public.profiles p
set phone = case
  when length(x.digits) = 11
    then '(' || substr(x.digits, 1, 2) || ') ' || substr(x.digits, 3, 5) || '-' || substr(x.digits, 8, 4)
  when length(x.digits) = 10
    then '(' || substr(x.digits, 1, 2) || ') ' || substr(x.digits, 3, 4) || '-' || substr(x.digits, 7, 4)
  else p.phone
end
from (
  select id, regexp_replace(phone, '\D', '', 'g') as digits
  from public.profiles
  where phone is not null
) x
where p.id = x.id and x.digits <> '';
