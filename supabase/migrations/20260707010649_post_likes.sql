-- Curtidas da Egregora.

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint post_likes_post_user_unique unique (post_id, user_id)
);

create index if not exists post_likes_post_id_idx
on public.post_likes (post_id);

create index if not exists post_likes_user_id_idx
on public.post_likes (user_id);

alter table public.post_likes enable row level security;

grant select on public.post_likes to anon, authenticated;
grant insert, delete on public.post_likes to authenticated;

drop policy if exists "post_likes_public_read_published" on public.post_likes;
drop policy if exists "post_likes_insert_own" on public.post_likes;
drop policy if exists "post_likes_delete_own_or_admin" on public.post_likes;

create policy "post_likes_public_read_published"
on public.post_likes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.blog_posts
    where blog_posts.id = post_likes.post_id
      and blog_posts.status = 'published'
      and blog_posts.published_at <= now()
  )
  or app_private.is_current_user_admin()
);

create policy "post_likes_insert_own"
on public.post_likes
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.blog_posts
    where blog_posts.id = post_likes.post_id
      and blog_posts.status = 'published'
      and blog_posts.published_at <= now()
  )
);

create policy "post_likes_delete_own_or_admin"
on public.post_likes
for delete
to authenticated
using (
  user_id = (select auth.uid())
  or app_private.is_current_user_admin()
);
