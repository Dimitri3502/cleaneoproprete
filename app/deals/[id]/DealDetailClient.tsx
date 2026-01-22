"use client";

import {useParams} from "next/navigation";
import Link from "next/link";
import type {EvidenceItem} from "@/lib/types";
import {DecisionBadge} from "@/components/Badge";
import {formatDate} from "@/lib/format";
import {useAnalyzeDealMutation, useDeal, useDealDocuments,} from "@/services/deal/deal.hooks";

const formatEnum = (value?: string | null) =>
  value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

const formatScore = (value?: number | string | null) => {
  if (value === null || value === undefined) return "—";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? "—" : Math.round(numeric);
};

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "—";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
};

export default function DealDetailClient() {
  const params = useParams<{ id: string }>();
  const dealId = params?.id;

  const {
    data: deal,
    isLoading: isDealLoading,
    error: dealError,
  } = useDeal(dealId);

  const {
    data: documents = [],
    isLoading: isDocsLoading,
    error: docsError,
  } = useDealDocuments(dealId);

  const analyzeDealMutation = useAnalyzeDealMutation();

  const loading = isDealLoading || isDocsLoading;
  const isAnalyzing = analyzeDealMutation.isPending;

  const errorMessage =
    (dealError instanceof Error ? dealError.message : null) ||
    (docsError instanceof Error ? docsError.message : null) ||
    (analyzeDealMutation.error instanceof Error
      ? analyzeDealMutation.error.message
      : null);

  const handleRefresh = async () => {
    if (!dealId) return;
    analyzeDealMutation.mutate(dealId);
  };

  const evidenceItems = (deal?.evidence_json ?? []) as EvidenceItem[];
  const summaryBullets = deal?.summary_5_bullets ?? [];
  const riskItems = deal?.risks_red_flags ?? [];
  const missingItems = deal?.missing_info ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Deal detail
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
            {deal?.company_name || "Deal overview"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {deal?.deal_id || "No deal ID"} · {formatEnum(deal?.sector)} ·{" "}
            {formatEnum(deal?.stage)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {deal ? <DecisionBadge decision={deal.go_no_go} /> : null}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isAnalyzing}
            className="rounded-[10px] border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Refresh"}
          </button>
          <Link
            href="/deals"
            className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Back to deals
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[14px] border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading deal detail...
        </div>
      ) : deal ? (
        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Score
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                {formatScore(deal.total_score)}
              </p>
              <p className="text-xs text-muted-foreground">
                Overall confidence{" "}
                {Math.round(Number(deal.overall_confidence ?? 0) * 100)}%
              </p>
            </div>
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Next step
              </p>
              <p className="mt-2 font-heading text-lg font-semibold text-foreground">
                {deal.next_step || "TBD"}
              </p>
              <p className="text-xs text-muted-foreground">
                Owner: {deal.owner || "Unassigned"}
              </p>
            </div>
            <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Activity
              </p>
              <p className="mt-2 text-sm text-foreground/80">
                Created {formatDate(deal.created_at)}
              </p>
              <p className="text-sm text-foreground/80">
                Last touched {formatDate(deal.updated_at)}
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Summary
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {deal.one_liner || "No one-liner captured yet."}
                </p>
                {summaryBullets.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                    {summaryBullets.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/40" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Summary bullets will appear once AI enrichment runs.
                  </p>
                )}
              </div>

              <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Scoring
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Thesis fit", deal.thesis_fit_subscore],
                    ["Stage + ticket", deal.stage_ticket_subscore],
                    ["Team", deal.team_subscore],
                    ["Data signal", deal.data_signal_subscore],
                  ].map(([label, score]) => (
                    <div
                      key={label}
                      className="rounded-[10px] border border-border bg-muted px-4 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-2 font-heading text-xl font-semibold text-foreground">
                        {formatScore(score)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Evidence
                </h2>
                {evidenceItems.length ? (
                  <div className="mt-4 space-y-4">
                    {evidenceItems.map((item, index) => (
                      <div
                        key={`${item.field}-${index}`}
                        className="rounded-[10px] border border-border bg-muted px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {item.field}
                        </p>
                        <p className="mt-2 text-sm text-foreground/80">
                          “{item.quote}”
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.location_hint || "Deck reference pending"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Evidence will populate after AI extraction.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Risks & gaps
                </h2>
                <div className="mt-4 space-y-4 text-sm text-foreground/80">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Red flags
                    </p>
                    {riskItems.length ? (
                      <ul className="mt-2 space-y-2">
                        {riskItems.map((item, index) => (
                          <li key={`${item}-${index}`}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        No red flags logged.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Missing info
                    </p>
                    {missingItems.length ? (
                      <ul className="mt-2 space-y-2">
                        {missingItems.map((item, index) => (
                          <li key={`${item}-${index}`}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        No missing fields flagged.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] border border-border bg-card p-5 shadow-card">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Documents
                </h2>
                {documents.length ? (
                  <div className="mt-4 space-y-3 text-sm text-foreground/80">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-[10px] border border-border bg-muted px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {doc.file_name || "Deck.pdf"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.file_size_bytes)} ·{" "}
                            {formatDate(doc.created_at)}
                          </p>
                        </div>
                        {doc.signedUrl ? (
                          <a
                            href={doc.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-[10px] border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-foreground"
                          >
                            Open
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-[14px] border border-border bg-card p-6 text-sm text-muted-foreground">
          Deal not found.
        </div>
      )}

      {errorMessage ? (
        <div className="rounded-[14px] border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
