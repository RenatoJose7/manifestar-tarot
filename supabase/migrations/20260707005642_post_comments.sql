-- Comentarios da Egregora.

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint post_comments_content_not_empty check (length(trim(content)) > 0),
  constraint post_comments_author_name_not_empty check (length(trim(author_name)) > 0)
);

create index if not exists post_comments_post_created_idx
on public.post_comments (post_id, created_at desc);

create index if not exists post_comments_user_id_idx
on public.post_comments (user_id);

alter table public.post_comments enable row level security;

grant select, insert, delete on public.post_comments to authenticated;

drop policy if exists "post_comments_authenticated_read" on public.post_comments;
drop policy if exists "post_comments_insert_own" on public.post_comments;
drop policy if exists "post_comments_delete_own_or_admin" on public.post_comments;

create policy "post_comments_authenticated_read"
on public.post_comments
for select
to authenticated
using (
  exists (
    select 1
    from public.blog_posts
    where blog_posts.id = post_comments.post_id
      and blog_posts.status = 'published'
      and blog_posts.published_at <= now()
  )
  or app_private.is_current_user_admin()
);

create policy "post_comments_insert_own"
on public.post_comments
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.blog_posts
    where blog_posts.id = post_comments.post_id
      and blog_posts.status = 'published'
      and blog_posts.published_at <= now()
  )
);

create policy "post_comments_delete_own_or_admin"
on public.post_comments
for delete
to authenticated
using (
  user_id = (select auth.uid())
  or app_private.is_current_user_admin()
);
