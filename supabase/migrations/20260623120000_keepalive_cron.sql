-- Secondary keepalive: daily pg_cron job touches the database.
-- Enable pg_cron in Dashboard -> Database -> Extensions if this migration fails.
-- Primary keepalive is Vercel Cron -> GET /api/keepalive (see vercel.json).

create extension if not exists pg_cron with schema extensions;

do $$
begin
  perform cron.unschedule('amor-keepalive');
exception
  when others then null;
end $$;

select cron.schedule(
  'amor-keepalive',
  '0 8 * * *',
  $$select count(*) from public.agencies$$
);
