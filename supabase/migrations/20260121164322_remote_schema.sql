


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






CREATE TYPE "public"."deal_decision" AS ENUM (
    'GO',
    'NO-GO',
    'REVIEW'
);


ALTER TYPE "public"."deal_decision" OWNER TO "postgres";


CREATE TYPE "public"."deal_sector" AS ENUM (
    'biotech',
    'medtech',
    'digital_health',
    'techbio',
    'other',
    'unknown'
);


ALTER TYPE "public"."deal_sector" OWNER TO "postgres";


CREATE TYPE "public"."deal_stage" AS ENUM (
    'preclinical',
    'phase1',
    'phase2',
    'phase3',
    'market',
    'unknown'
);


ALTER TYPE "public"."deal_stage" OWNER TO "postgres";


CREATE TYPE "public"."deal_status" AS ENUM (
    'new',
    'precall_sent',
    'precall_done',
    'call_done',
    'ic_ready',
    'closed'
);


ALTER TYPE "public"."deal_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."deal_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deal_id" "uuid" NOT NULL,
    "file_name" "text",
    "storage_bucket" "text" DEFAULT 'deal-decks'::"text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "mime_type" "text",
    "file_size_bytes" bigint,
    "sha256" "text",
    "text_extracted" "jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


ALTER TABLE "public"."deal_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."deals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deal_id" "text",
    "source_channel" "text",
    "source_sender" "text",
    "company_name" "text",
    "company_website" "text",
    "country" "text",
    "city" "text",
    "sector" "public"."deal_sector" DEFAULT 'unknown'::"public"."deal_sector" NOT NULL,
    "therapeutic_area" "text",
    "indication" "text",
    "modality_or_tech" "text",
    "stage" "public"."deal_stage" DEFAULT 'unknown'::"public"."deal_stage" NOT NULL,
    "round_type" "text",
    "amount_sought_eur" numeric,
    "valuation_post_money_eur" numeric,
    "use_of_funds" "text",
    "key_team" "text",
    "lead_contact_name" "text",
    "lead_contact_email" "text",
    "one_liner" "text" DEFAULT ''::"text" NOT NULL,
    "summary_5_bullets" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "why_now" "text",
    "moat_or_differentiation" "text",
    "ip_status" "text",
    "ip_highlights" "text",
    "clinical_or_preclinical_signal" "text",
    "regulatory_pathway" "text",
    "traction_metrics" "text",
    "top_competitors" "text",
    "risks_red_flags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "missing_info" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "thesis_fit_subscore" integer DEFAULT 0 NOT NULL,
    "stage_ticket_subscore" integer DEFAULT 0 NOT NULL,
    "team_subscore" integer DEFAULT 0 NOT NULL,
    "data_signal_subscore" integer DEFAULT 0 NOT NULL,
    "total_score" integer DEFAULT 0 NOT NULL,
    "go_no_go" "public"."deal_decision" DEFAULT 'REVIEW'::"public"."deal_decision" NOT NULL,
    "why_go_no_go_3_bullets" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "overall_confidence" numeric DEFAULT 0.0 NOT NULL,
    "evidence_json" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "confidence_json" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "status" "public"."deal_status" DEFAULT 'new'::"public"."deal_status" NOT NULL,
    "next_step" "text",
    "owner" "text",
    "call_date" timestamp with time zone,
    "call_summary" "text",
    "last_touched_by" "text",
    CONSTRAINT "deals_data_signal_subscore_check" CHECK ((("data_signal_subscore" >= 0) AND ("data_signal_subscore" <= 100))),
    CONSTRAINT "deals_overall_confidence_check" CHECK ((("overall_confidence" >= (0)::numeric) AND ("overall_confidence" <= (1)::numeric))),
    CONSTRAINT "deals_stage_ticket_subscore_check" CHECK ((("stage_ticket_subscore" >= 0) AND ("stage_ticket_subscore" <= 100))),
    CONSTRAINT "deals_team_subscore_check" CHECK ((("team_subscore" >= 0) AND ("team_subscore" <= 100))),
    CONSTRAINT "deals_thesis_fit_subscore_check" CHECK ((("thesis_fit_subscore" >= 0) AND ("thesis_fit_subscore" <= 100))),
    CONSTRAINT "deals_total_score_check" CHECK ((("total_score" >= 0) AND ("total_score" <= 100)))
);


ALTER TABLE "public"."deals" OWNER TO "postgres";


ALTER TABLE ONLY "public"."deal_documents"
    ADD CONSTRAINT "deal_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deals"
    ADD CONSTRAINT "deals_deal_id_key" UNIQUE ("deal_id");



ALTER TABLE ONLY "public"."deals"
    ADD CONSTRAINT "deals_pkey" PRIMARY KEY ("id");



CREATE INDEX "deal_documents_deal_id_idx" ON "public"."deal_documents" USING "btree" ("deal_id");



CREATE INDEX "deal_documents_sha256_idx" ON "public"."deal_documents" USING "btree" ("sha256");



CREATE INDEX "deals_company_name_idx" ON "public"."deals" USING "btree" ("company_name");



CREATE INDEX "deals_created_at_idx" ON "public"."deals" USING "btree" ("created_at" DESC);



CREATE INDEX "deals_decision_idx" ON "public"."deals" USING "btree" ("go_no_go");



CREATE INDEX "deals_evidence_gin" ON "public"."deals" USING "gin" ("evidence_json");



CREATE INDEX "deals_sector_stage_idx" ON "public"."deals" USING "btree" ("sector", "stage");



CREATE INDEX "deals_status_idx" ON "public"."deals" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "deals_set_updated_at" BEFORE UPDATE ON "public"."deals" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."deal_documents"
    ADD CONSTRAINT "deal_documents_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE CASCADE;



ALTER TABLE "public"."deal_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."deals" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "deals_read_authenticated" ON "public"."deals" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "deals_update_authenticated" ON "public"."deals" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "deals_write_authenticated" ON "public"."deals" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "docs_read_authenticated" ON "public"."deal_documents" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "docs_write_authenticated" ON "public"."deal_documents" FOR INSERT TO "authenticated" WITH CHECK (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
























































































































































































































































































































GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";





















GRANT ALL ON TABLE "public"."deal_documents" TO "anon";
GRANT ALL ON TABLE "public"."deal_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."deal_documents" TO "service_role";



GRANT ALL ON TABLE "public"."deals" TO "anon";
GRANT ALL ON TABLE "public"."deals" TO "authenticated";
GRANT ALL ON TABLE "public"."deals" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































drop extension if exists "pg_net";


