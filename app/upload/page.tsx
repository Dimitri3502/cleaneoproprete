"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import type { DealSector, DealStage } from "@/lib/types";
import { getOptions } from "@/lib/enums";

export default function UploadPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState<DealSector>("unknown");
  const [stage, setStage] = useState<DealStage>("unknown");
  const [sectorOptions, setSectorOptions] = useState<{ value: string; label: string }[]>([]);
  const [stageOptions, setStageOptions] = useState<{ value: string; label: string }[]>([]);
  const [sourceChannel, setSourceChannel] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      const [sOptions, stOptions] = await Promise.all([
        getOptions("deals.sector"),
        getOptions("deals.stage"),
      ]);
      setSectorOptions(sOptions);
      setStageOptions(stOptions);
    }
    loadOptions();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a PDF deck to upload.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    const supabase = supabaseClient();

    const { data: dealData, error: dealError } = await supabase
      .from("deals")
      .insert({
        company_name: companyName || null,
        sector,
        stage,
        source_channel: sourceChannel || null,
        lead_contact_email: leadEmail || null,
        one_liner: "",
      })
      .select("id")
      .single();

    if (dealError || !dealData?.id) {
      setSubmitting(false);
      setErrorMessage(dealError?.message ?? "Unable to create deal.");
      return;
    }

    const dealId = dealData.id;
    const storagePath = `deals/${dealId}/deck.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("deal-decks")
      .upload(storagePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      setSubmitting(false);
      setErrorMessage(uploadError.message);
      return;
    }

    const { error: documentError } = await supabase.from("deal_documents").insert({
      deal_id: dealId,
      file_name: file.name,
      storage_bucket: "deal-decks",
      storage_path: storagePath,
      mime_type: file.type,
      file_size_bytes: file.size,
    });

    if (documentError) {
      setSubmitting(false);
      setErrorMessage(documentError.message);
      return;
    }

    // 4) Call analyze-deck Edge Function
    const { error: fnError } = await supabase.functions.invoke("analyze-deck", {
      body: {
        deal_id: dealId,
        storage_bucket: "deal-decks",
        storage_path: `deals/${dealId}/deck.pdf`,
      },
    });

    if (fnError) {
      console.error("analyze-deck failed", fnError);
    }

    router.push(`/deals/${dealId}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Upload
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Upload a pitch deck
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a new deal record and attach the deck PDF for review.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Company name
              </span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Nova Therapeutics"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Lead contact email
              </span>
              <input
                value={leadEmail}
                onChange={(event) => setLeadEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="partner@fund.com"
                type="email"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Sector
              </span>
              <select
                value={sector}
                onChange={(event) =>
                  setSector(event.target.value as DealSector)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {sectorOptions.length > 0 ? (
                  sectorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value="unknown">Loading...</option>
                )}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Stage
              </span>
              <select
                value={stage}
                onChange={(event) =>
                  setStage(event.target.value as DealStage)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {stageOptions.length > 0 ? (
                  stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value="unknown">Loading...</option>
                )}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Source channel
            </span>
            <input
              value={sourceChannel}
              onChange={(event) => setSourceChannel(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="Inbound, referral, conference"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Deck PDF
            </span>
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
          </label>

          {errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? "Uploading..." : "Create deal and upload"}
          </button>
        </form>
      </div>

      <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          What happens next
        </h2>
        <ul className="space-y-3">
          <li>
            A new deal record is created with basic metadata for immediate
            tracking.
          </li>
          <li>
            The deck is stored in Supabase Storage for downstream AI extraction.
          </li>
          <li>
            Documents appear in the deal detail view for quick review.
          </li>
        </ul>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Demo note: authentication and RLS are open for pilot purposes only.
        </div>
      </aside>
    </div>
  );
}
