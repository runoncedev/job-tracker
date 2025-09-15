create table public.application (
  id uuid not null default gen_random_uuid (),
  company text not null,
  status text not null default 'applied'::text,
  applied_date date not null default CURRENT_DATE,
  url text null,
  notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  deleted_at timestamp with time zone null,
  constraint applications_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_applications_applied_date on public.application using btree (applied_date desc) TABLESPACE pg_default;

create index IF not exists idx_applications_status on public.application using btree (status) TABLESPACE pg_default;

create index IF not exists idx_applications_deleted_at on public.application using btree (deleted_at) TABLESPACE pg_default;