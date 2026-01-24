'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import type { DealDecision, DealStatus } from '@/lib/types';
import { DecisionBadge } from '@/components/Badge';
import { formatDate } from '@/lib/format';
import { labelFromValue, useMetaEnums } from '@/lib/enums';
import { useDeals } from '@/services/deal/deal.hooks';
import { useSearchParams } from 'next/navigation';
import DealDetailClient from './DealDetailClient';
import { RequireAuth } from '@/components/auth/require-auth';

type DealDecisionFilter = DealDecision | 'all';
type DealStatusFilter = DealStatus | 'all';

const formatEnum = (value?: string | null) => (value ? labelFromValue(value) : '—');

const formatScore = (value?: number | string | null) => {
  if (value === null || value === undefined) return '—';
  const numeric = Number(value);
  return Number.isNaN(numeric) ? '—' : Math.round(numeric);
};

export default function DealsPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<div>Loading...</div>}>
        <DealsPageContent />
      </Suspense>
    </RequireAuth>
  );
}

function DealsPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [decisionFilter, setDecisionFilter] = useState<DealDecisionFilter>('all');
  const [statusFilter, setStatusFilter] = useState<DealStatusFilter>('all');

  const { getOptions } = useMetaEnums();
  const decisionOptions = getOptions('deals.go_no_go', true);
  const statusOptions = getOptions('deals.status', true);

  const {
    data: deals = [],
    isLoading: loading,
    error: dealsError,
  } = useDeals(decisionFilter, statusFilter);

  if (id) {
    return <DealDetailClient id={id} />;
  }

  const errorMessage = dealsError instanceof Error ? dealsError.message : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Dealflow
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Incoming deals</h1>
          <p className="mt-2 text-sm text-slate-600">
            Filter by decision posture and pipeline status.
          </p>
        </div>
        <Link
          href="/upload"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Upload new deck
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Decision
          </label>
          <select
            value={decisionFilter}
            onChange={(event) => setDecisionFilter(event.target.value as DealDecisionFilter)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {decisionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as DealStatusFilter)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center text-xs text-slate-500">
          {loading ? 'Loading deals...' : `${deals.length} deals`}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={7}>
                    Loading dealflow...
                  </td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={7}>
                    No deals found.
                  </td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <Link
                        href={`/deals?id=${deal.id}`}
                        className="font-semibold text-slate-900 hover:underline"
                      >
                        {deal.company_name || 'Unnamed deal'}
                      </Link>
                      <p className="text-xs text-slate-500">{deal.deal_id || 'No deal ID'}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatEnum(deal.sector)}</td>
                    <td className="px-4 py-4 text-slate-600">{formatEnum(deal.stage)}</td>
                    <td className="px-4 py-4 text-slate-900">{formatScore(deal.total_score)}</td>
                    <td className="px-4 py-4">
                      <DecisionBadge decision={deal.go_no_go} />
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {Math.round(Number(deal.overall_confidence ?? 0) * 100)}%
                    </td>
                    <td className="px-4 py-4 text-slate-500">{formatDate(deal.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {errorMessage ? (
          <div className="border-t border-slate-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
