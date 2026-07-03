-- Move internal SECURITY DEFINER helpers out of the exposed public schema.

create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;
grant usage on schema app_private to service_role;

create or replace function app_private.handle_new_user()
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

create or replace function app_private.is_current_user_admin()
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

revoke all on function app_private.handle_new_user() from public, anon, authenticated;
revoke all on function app_private.is_current_user_admin() from public, anon;
grant execute on function app_private.is_current_user_admin() to authenticated;
grant execute on function app_private.is_current_user_admin() to service_role;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function app_private.handle_new_user();

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_select_visible" on public.profiles;

create policy "profiles_select_visible"
on public.profiles
for select
to authenticated
using (
  (
    (select auth.uid()) is not null
    and (select auth.uid()) = id
  )
  or app_private.is_current_user_admin()
);

drop function if exists public.handle_new_user();
drop function if exists public.is_current_user_admin();
