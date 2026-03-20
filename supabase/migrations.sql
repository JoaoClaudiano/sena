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

-- Habilita Row Level Security
alter table public.visitas enable row level security;

-- Permite inserção pública (anônima) — sem leitura pública
create policy "Inserção anônima de visitas"
  on public.visitas
  for insert
  to anon
  with check (true);

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
