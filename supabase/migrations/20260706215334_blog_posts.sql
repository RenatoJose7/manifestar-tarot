-- Blog privado / Egregora - primeira versao.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_url text not null,
  cover_path text,
  status text not null default 'published'
    check (status in ('published', 'archived')),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_title_not_empty check (length(trim(title)) > 0),
  constraint blog_posts_excerpt_not_empty check (length(trim(excerpt)) > 0),
  constraint blog_posts_content_not_empty check (length(trim(content)) > 0)
);

create index if not exists blog_posts_published_at_idx
on public.blog_posts (published_at desc)
where status = 'published';

create index if not exists blog_posts_author_id_idx
on public.blog_posts (author_id);

alter table public.blog_posts enable row level security;

grant select on table public.blog_posts to anon;
grant select on public.blog_posts to authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

drop policy if exists "blog_posts_public_preview" on public.blog_posts;
drop policy if exists "blog_posts_authenticated_read" on public.blog_posts;
drop policy if exists "blog_posts_admin_insert" on public.blog_posts;
drop policy if exists "blog_posts_admin_update" on public.blog_posts;
drop policy if exists "blog_posts_admin_delete" on public.blog_posts;

create policy "blog_posts_public_preview"
on public.blog_posts
for select
to anon
using (
  status = 'published'
  and published_at <= now()
);

create policy "blog_posts_authenticated_read"
on public.blog_posts
for select
to authenticated
using (
  (
    status = 'published'
    and published_at <= now()
  )
  or app_private.is_current_user_admin()
);

create policy "blog_posts_admin_insert"
on public.blog_posts
for insert
to authenticated
with check (
  app_private.is_current_user_admin()
  and author_id = (select auth.uid())
);

create policy "blog_posts_admin_update"
on public.blog_posts
for update
to authenticated
using (app_private.is_current_user_admin())
with check (app_private.is_current_user_admin());

create policy "blog_posts_admin_delete"
on public.blog_posts
for delete
to authenticated
using (app_private.is_current_user_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'blog-covers',
  'blog-covers',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog_covers_admin_insert" on storage.objects;
drop policy if exists "blog_covers_admin_delete" on storage.objects;

create policy "blog_covers_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-covers'
  and app_private.is_current_user_admin()
);

create policy "blog_covers_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog-covers'
  and app_private.is_current_user_admin()
);
