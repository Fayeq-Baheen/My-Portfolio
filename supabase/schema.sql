-- Run this whole file once in Supabase > SQL Editor > New query > Run.
-- Public visitors can READ content and SEND messages. Only a logged-in admin can change things.

create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  role text not null default '',
  intro text not null default '',
  email text not null default '',
  github text not null default '',
  linkedin text not null default '',
  about text not null default ''
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  details text not null default '',
  image_url text,
  alt text not null default '',
  tech text[] not null default '{}',
  live text,
  code text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  position int not null default 0
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~* '^\S+@\S+\.\S+$' and char_length(email) <= 200),
  message text not null check (char_length(message) between 10 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profile  enable row level security;
alter table public.projects enable row level security;
alter table public.skills   enable row level security;
alter table public.messages enable row level security;

-- Everyone can read the public content
create policy "public read profile"  on public.profile  for select using (true);
create policy "public read projects" on public.projects for select using (true);
create policy "public read skills"   on public.skills   for select using (true);

-- Only the logged-in admin can change it
create policy "admin write profile"  on public.profile  for all to authenticated using (true) with check (true);
create policy "admin write projects" on public.projects for all to authenticated using (true) with check (true);
create policy "admin write skills"   on public.skills   for all to authenticated using (true) with check (true);

-- Contact messages: anyone can send, only the admin can read/manage
create policy "anyone can send message" on public.messages for insert to anon, authenticated with check (true);
create policy "admin reads messages"    on public.messages for select to authenticated using (true);
create policy "admin updates messages"  on public.messages for update to authenticated using (true) with check (true);
create policy "admin deletes messages"  on public.messages for delete to authenticated using (true);

-- Image storage (public bucket, only admin uploads)
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "public read images"  on storage.objects for select using (bucket_id = 'project-images');
create policy "admin upload images" on storage.objects for insert to authenticated with check (bucket_id = 'project-images');
create policy "admin update images" on storage.objects for update to authenticated using (bucket_id = 'project-images');
create policy "admin delete images" on storage.objects for delete to authenticated using (bucket_id = 'project-images');

-- Starter content (edit it later from the admin panel)
insert into public.profile (id, name, role, intro, email, github, linkedin, about) values (
  1, 'Your Name', 'Junior React Developer', 'I build clean, responsive web apps with React.',
  'you@example.com', 'https://github.com/your-username', 'https://www.linkedin.com/in/your-username',
  'Write your own biography, your learning journey and your goals in the admin panel.'
) on conflict (id) do nothing;

insert into public.skills (name, position) values
  ('React', 1), ('JavaScript', 2), ('HTML', 3), ('Tailwind CSS', 4), ('Git & GitHub', 5)
on conflict (name) do nothing;

insert into public.projects (title, description, details, tech, position)
select 'Project One', 'Short summary of what it does.', 'Longer description: the problem, your solution, what you learned.', array['React','Tailwind'], 1
where not exists (select 1 from public.projects);
