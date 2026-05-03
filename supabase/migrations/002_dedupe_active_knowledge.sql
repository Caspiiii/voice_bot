with ranked_active_duplicates as (
  select
    id,
    row_number() over (
      partition by lower(btrim(title)), md5(btrim(content))
      order by updated_at desc nulls last, created_at desc nulls last, id desc
    ) as duplicate_rank
  from knowledge_entries
  where active = true
)
update knowledge_entries
set active = false
from ranked_active_duplicates
where knowledge_entries.id = ranked_active_duplicates.id
  and ranked_active_duplicates.duplicate_rank > 1;

create unique index if not exists knowledge_entries_active_title_content_unique
on knowledge_entries (lower(btrim(title)), md5(btrim(content)))
where active = true;

