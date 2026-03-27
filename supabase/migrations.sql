-- Migrações do banco de dados Supabase
-- Execute este arquivo no SQL Editor do Supabase Dashboard (https://supabase.com/dashboard)

-- ============================================================
-- Tabela: visitas
-- Registra visitas anônimas por página para métricas internas
-- ============================================================
create table if not exists public.visitas (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  page        text        not null,
  session_id  text,
  device_type text,
  referrer    text
);

-- Adiciona session_id se a tabela já existia sem essa coluna
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'visitas'
      and column_name  = 'session_id'
  ) then
    alter table public.visitas add column session_id text;
  end if;
end $$;

-- Habilita Row Level Security
alter table public.visitas enable row level security;

-- Permite inserção pública (anônima)
create policy "Inserção anônima de visitas"
  on public.visitas
  for insert
  to anon
  with check (true);

-- Permite contagem pública de visitas (necessário para status.js exibir o total)
-- O acesso é restrito a HEAD requests com count=exact; nenhum dado de linha é retornado.
create policy "Contagem pública de visitas"
  on public.visitas
  for select
  to anon
  using (true);

-- ============================================================
-- Tabela: velas
-- Armazena as velas virtuais acesas pelos visitantes
-- ============================================================
create table if not exists public.velas (
  id          bigint      primary key generated always as identity,
  created_at  timestamptz not null default now(),
  localizacao geography(POINT, 4326),
  intencao    text,
  user_id     uuid
);

-- Habilita Row Level Security
alter table public.velas enable row level security;

-- Permite inserção e leitura públicas (anônimas)
-- Nota de privacidade: o campo `intencao` pode conter texto pessoal.
-- A política abaixo expõe apenas localização e data; para maior privacidade,
-- crie uma view ou função com SECURITY DEFINER retornando somente esses campos.
create policy "Inserção anônima de velas"
  on public.velas
  for insert
  to anon
  with check (true);

create policy "Leitura pública de velas"
  on public.velas
  for select
  to anon
  using (true);
