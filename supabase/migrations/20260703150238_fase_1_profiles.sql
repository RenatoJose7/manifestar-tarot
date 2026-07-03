-- Manifestar Tarot - Supabase Fase 1
-- Atualizado em: 03/07/2026
--
-- Importante:
-- - Use no frontend apenas a Project URL e a anon/public key.
-- - Nunca coloque service_role/secret key no frontend.
-- - Em projetos novos, o Supabase pode exigir GRANT explicito para a Data API.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  whatsapp text,
  email text not null,
  consentimento_whatsapp boolean not null default false,
  consentimento_whatsapp_aceito_em timestamptz,
  termos_aceitos boolean not null default false,
  termos_versao text,
  status text not null default 'active'
    check (status in ('active', 'blocked', 'removed')),
  role text not null default 'user'
    check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfis dos usuarios cadastrados no site Manifestar Tarot.';

comment on column public.profiles.role is
  'Papel interno. Nao deve ser atualizado pelo frontend do usuario.';

comment on column public.profiles.status is
  'Status operacional do usuario: active, blocked ou removed.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (
    id,
    nome,
    whatsapp,
    email,
    consentimento_whatsapp,
    consentimento_whatsapp_aceito_em,
    termos_aceitos,
    termos_versao
  )
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'nome', ''),
      split_part(new.email, '@', 1),
      'Cliente'
    ),
    nullif(new.raw_user_meta_data ->> 'telefone', ''),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'consentimento_whatsapp')::boolean, false),
    case
      when nullif(new.raw_user_meta_data ->> 'consentimento_whatsapp_aceito_em', '') is not null
        then (new.raw_user_meta_data ->> 'consentimento_whatsapp_aceito_em')::timestamptz
      else null
    end,
    coalesce((new.raw_user_meta_data ->> 'termos_aceitos')::boolean, false),
    nullif(new.raw_user_meta_data ->> 'termos_versao', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and status = 'active'
  );
$$;

revoke all on function public.set_updated_at() from public;
revoke all on function public.handle_new_user() from public;
revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

grant usage on schema public to anon, authenticated;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (nome, whatsapp) on public.profiles to authenticated;
grant all privileges on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_own_basic" on public.profiles;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) is not null
  and (select auth.uid()) = id
);

create policy "profiles_select_admin"
on public.profiles
for select
to authenticated
using (public.is_current_user_admin());

create policy "profiles_update_own_basic"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) is not null
  and (select auth.uid()) = id
  and status = 'active'
)
with check (
  (select auth.uid()) is not null
  and (select auth.uid()) = id
  and status = 'active'
);
