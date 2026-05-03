create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  active boolean default true,
  embedding vector(1536),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create index if not exists knowledge_entries_embedding_idx
on knowledge_entries
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function set_knowledge_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists knowledge_entries_updated_at on knowledge_entries;

create trigger knowledge_entries_updated_at
before update on knowledge_entries
for each row
execute function set_knowledge_entries_updated_at();

create or replace function match_knowledge_entries(
  query_embedding vector(1536),
  match_count int default 5,
  match_threshold float default 0.15
)
returns table (
  id uuid,
  title text,
  content text,
  active boolean,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_entries.id,
    knowledge_entries.title,
    knowledge_entries.content,
    knowledge_entries.active,
    1 - (knowledge_entries.embedding <=> query_embedding) as similarity
  from knowledge_entries
  where knowledge_entries.active = true
    and knowledge_entries.embedding is not null
    and 1 - (knowledge_entries.embedding <=> query_embedding) > match_threshold
  order by knowledge_entries.embedding <=> query_embedding
  limit match_count;
end;
$$;

