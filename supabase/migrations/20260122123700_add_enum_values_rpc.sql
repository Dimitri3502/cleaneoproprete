-- Function to get enum values for a specific table column
create or replace function public.get_column_enum_values(p_table text, p_column text)
returns text[]
language plpgsql
security definer
as $$
declare
    v_udt_name text;
begin
    -- 1. Get the type name for the column
    select udt_name into v_udt_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = p_table
      and column_name = p_column;

    if v_udt_name is null then
        return array[]::text[];
    end if;

    -- 2. Get the enum values for that type
    return array(
        select e.enumlabel
        from pg_enum e
        join pg_type t on e.enumtypid = t.oid
        where t.typname = v_udt_name
        order by e.enumsortorder
    );
end;
$$;

-- Grant usage to public roles
grant execute on function public.get_column_enum_values(text, text) to anon, authenticated, service_role;
