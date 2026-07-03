# Status Supabase - Manifestar Tarot

Atualizado em: 03/07/2026

## Projeto conectado

- Project ref: `bqrzihhoylkzpjgwevnn`
- Nome visto pela CLI: `manifestarbd's Project`
- Regiao: `us-east-1`
- Postgres: `17.6.1.141`

## Migrations aplicadas

As migrations foram criadas em `supabase/migrations/` e aplicadas no banco remoto via Supabase CLI.

- `20260703150238_fase_1_profiles.sql`
  - cria `public.profiles`;
  - cria trigger de perfil automatico no cadastro;
  - cria RLS e grants iniciais.

- `20260703150507_harden_profiles_functions.sql`
  - move funcoes internas `SECURITY DEFINER` para o schema privado `app_private`;
  - troca as policies de SELECT por uma policy unica;
  - remove alertas de seguranca/performance apontados pelo Supabase Advisor.

## Estado confirmado

Consultas feitas com `npx supabase db query --linked` confirmaram:

- tabela `public.profiles` existe;
- trigger `on_auth_user_created` existe em `auth.users`;
- funcoes internas existem em `app_private`;
- policies atuais de `public.profiles`:
  - `profiles_select_visible`;
  - `profiles_update_own_basic`.

`npx supabase db advisors --linked` retornou:

```txt
No issues found
```

## Proximo passo

1. Testar cadastro/login/minha conta com um usuario comum.
2. Seguir para a Fase 3: blog privado com previa publica.

## Fase 2 iniciada

Implementado no frontend:

- `Minha conta` busca dados reais da tabela `profiles`;
- usuario logado pode editar `nome` e `whatsapp`;
- email aparece bloqueado para edicao;
- header troca `Cadastro` por `Minha conta` quando ha sessao ativa;
- header mostra `Admin` apenas quando o perfil possui `role = 'admin'`;
- pagina `admin.html` valida sessao e role antes de exibir o painel.

Validacoes feitas:

- `node --check` em scripts de auth, conta, admin, cadastro, login e componentes;
- `npx supabase db query --linked` confirmou Paola como admin;
- `npx supabase db advisors --linked` encontrou apenas o aviso de Auth sobre leaked password protection desativado.

## Admin

A conta da Paola ja foi marcada como admin:

- Email: `manifestartarot@gmail.com`
- Nome encontrado no perfil: `Paola Airan`
- Role: `admin`
- Status: `active`

Comando executado:

```sql
update public.profiles
set role = 'admin'
where lower(email) = lower('manifestartarot@gmail.com');
```

## Observacoes

- A chave `anon/public` pode ficar no frontend.
- Nunca colocar `service_role` ou secret key no frontend.
- O aviso sobre Docker durante `db push` veio do cache/catalogo local da CLI, nao da execucao SQL remota.
