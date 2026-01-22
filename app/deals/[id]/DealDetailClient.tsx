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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Deal detail
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {deal?.company_name || "Deal overview"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
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
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Refresh"}
          </button>
          <Link
            href="/deals"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to deals
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading deal detail...
        </div>
      ) : deal ? (
        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Score
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {formatScore(deal.total_score)}
              </p>
              <p className="text-xs text-slate-500">
                Overall confidence{" "}
                {Math.round(Number(deal.overall_confidence ?? 0) * 100)}%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Next step
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {deal.next_step || "TBD"}
              </p>
              <p className="text-xs text-slate-500">
                Owner: {deal.owner || "Unassigned"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Activity
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Created {formatDate(deal.created_at)}
              </p>
              <p className="text-sm text-slate-700">
                Last touched {formatDate(deal.updated_at)}
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Summary
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {deal.one_liner || "No one-liner captured yet."}
                </p>
                {summaryBullets.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {summaryBullets.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">
                    Summary bullets will appear once AI enrichment runs.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
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
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">
                        {formatScore(score)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Evidence
                </h2>
                {evidenceItems.length ? (
                  <div className="mt-4 space-y-4">
                    {evidenceItems.map((item, index) => (
                      <div
                        key={`${item.field}-${index}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {item.field}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          “{item.quote}”
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.location_hint || "Deck reference pending"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">
                    Evidence will populate after AI extraction.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Risks & gaps
                </h2>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Red flags
                    </p>
                    {riskItems.length ? (
                      <ul className="mt-2 space-y-2">
                        {riskItems.map((item, index) => (
                          <li key={`${item}-${index}`}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        No red flags logged.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Missing info
                    </p>
                    {missingItems.length ? (
                      <ul className="mt-2 space-y-2">
                        {missingItems.map((item, index) => (
                          <li key={`${item}-${index}`}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        No missing fields flagged.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Documents
                </h2>
                {documents.length ? (
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {doc.file_name || "Deck.pdf"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(doc.file_size_bytes)} ·{" "}
                            {formatDate(doc.created_at)}
                          </p>
                        </div>
                        {doc.signedUrl ? (
                          <a
                            href={doc.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                          >
                            Open
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Deal not found.
        </div>
      )}

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
