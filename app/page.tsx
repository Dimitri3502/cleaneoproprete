import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            LP demo + pilot
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Modern deal intake, scoring, and evidence in one finance-grade
            cockpit.
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            Upload pitch decks, track decision posture, and surface AI-ready
            signals across the pipeline. Built for life sciences and healthcare
            investors who need fast, defensible triage.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/deals"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View dealflow
            </Link>
            <Link
              href="/upload"
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Upload a deck
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Snapshot
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Decision readiness dashboard
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "New decks this week",
                  value: "18",
                  detail: "Median 36h triage time",
                },
                {
                  label: "GO recommendations",
                  value: "6",
                  detail: "2 deep dives scheduled",
                },
                {
                  label: "Avg. confidence",
                  value: "0.71",
                  detail: "Evidence-backed summaries",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Pipeline clarity",
            detail:
              "Standardize early-stage intake with structured fields and scoring.",
          },
          {
            title: "Evidence-backed summaries",
            detail:
              "Surface quotes, metrics, and rationale in the deal detail view.",
          },
          {
            title: "Ready for AI",
            detail:
              "Fields and schemas aligned to future enrichment workflows.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{card.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
