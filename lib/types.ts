export type DealSector =
  | "unknown"
  | "biotech"
  | "medtech"
  | "digital_health"
  | "services"
  | "other";

export type DealStage =
  | "unknown"
  | "pre_seed"
  | "seed"
  | "series_a"
  | "series_b"
  | "series_c"
  | "growth"
  | "public";

export type DealDecision = "GO" | "NO_GO" | "REVIEW";

export type DealStatus =
  | "new"
  | "screening"
  | "ic_ready"
  | "diligence"
  | "passed"
  | "closed";

export type EvidenceItem = {
  field: string;
  quote: string;
  location_hint?: string;
};

export type Deal = {
  id: string;
  created_at: string;
  updated_at: string | null;
  deal_id: string | null;
  source_channel: string | null;
  source_sender: string | null;
  company_name: string | null;
  company_website: string | null;
  country: string | null;
  city: string | null;
  sector: DealSector;
  therapeutic_area: string | null;
  indication: string | null;
  modality_or_tech: string | null;
  stage: DealStage;
  round_type: string | null;
  amount_sought_eur: number | string | null;
  valuation_post_money_eur: number | string | null;
  use_of_funds: string | null;
  key_team: string | null;
  lead_contact_name: string | null;
  lead_contact_email: string | null;
  one_liner: string;
  summary_5_bullets: string[];
  why_now: string | null;
  moat_or_differentiation: string | null;
  ip_status: string | null;
  ip_highlights: string | null;
  clinical_or_preclinical_signal: string | null;
  regulatory_pathway: string | null;
  traction_metrics: string | null;
  top_competitors: string | null;
  risks_red_flags: string[];
  missing_info: string[];
  thesis_fit_subscore: number | null;
  stage_ticket_subscore: number | null;
  team_subscore: number | null;
  data_signal_subscore: number | null;
  total_score: number | null;
  go_no_go: DealDecision;
  why_go_no_go_3_bullets: string[];
  overall_confidence: number | string;
  evidence_json: EvidenceItem[];
  confidence_json: Record<string, unknown>;
  status: DealStatus;
  next_step: string | null;
  owner: string | null;
  call_date: string | null;
  call_summary: string | null;
  last_touched_by: string | null;
};

export type DealDocument = {
  id: string;
  created_at: string;
  deal_id: string;
  file_name: string | null;
  storage_bucket: string;
  storage_path: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  sha256: string | null;
  text_extracted: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  signedUrl?: string;
};
