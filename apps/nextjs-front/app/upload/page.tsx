'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import type { DealSector, DealStage } from '@/lib/types';
import { useCreateDealMutation } from '@/services/deal/deal.hooks';
import { useMetaEnums } from '@/lib/enums';
import { RequireAuth } from '@/components/auth/require-auth';

export default function UploadPage() {
  return (
    <RequireAuth>
      <UploadPageContent />
    </RequireAuth>
  );
}

function UploadPageContent() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<DealSector>('unknown');
  const [stage, setStage] = useState<DealStage>('unknown');

  const { getOptions } = useMetaEnums();
  const sectorOptions = getOptions('deals.sector');
  const stageOptions = getOptions('deals.stage');
  const createDealMutation = useCreateDealMutation();

  const [sourceChannel, setSourceChannel] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setLocalErrorMessage('Please select a PDF deck to upload.');
      return;
    }

    setLocalErrorMessage(null);

    createDealMutation.mutate(
      {
        companyName,
        sector,
        stage,
        sourceChannel,
        leadEmail,
        file,
      },
      {
        onSuccess: (data) => {
          router.push(`/deals?id=${data.dealId}`);
        },
      },
    );
  };

  const submitting = createDealMutation.isPending;
  const errorMessage =
    localErrorMessage ||
    (createDealMutation.error instanceof Error ? createDealMutation.error.message : null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Upload</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Upload a pitch deck</h1>
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
                onChange={(event) => setSector(event.target.value as DealSector)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {sectorOptions.length > 0 ? (
                  sectorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value="unknown" disabled>
                    Loading...
                  </option>
                )}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Stage
              </span>
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value as DealStage)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {stageOptions.length > 0 ? (
                  stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value="unknown" disabled>
                    Loading...
                  </option>
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
            {submitting ? 'Uploading...' : 'Create deal and upload'}
          </button>
        </form>
      </div>

      <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">What happens next</h2>
        <ul className="space-y-3">
          <li>A new deal record is created with basic metadata for immediate tracking.</li>
          <li>The deck is stored in Supabase Storage for downstream AI extraction.</li>
          <li>Documents appear in the deal detail view for quick review.</li>
        </ul>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Demo note: authentication and RLS are open for pilot purposes only.
        </div>
      </aside>
    </div>
  );
}
