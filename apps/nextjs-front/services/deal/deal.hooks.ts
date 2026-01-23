import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { getOptions } from '@/lib/enums';
import type { Deal, DealDocument, DealSector, DealStage } from '@/lib/types';

/**
 * Hook to fetch sector options for deals.
 */
export function useSectorOptions() {
  return useQuery({
    queryKey: ['options', 'deals.sector'],
    queryFn: () => getOptions('deals.sector'),
  });
}

/**
 * Hook to fetch stage options for deals.
 */
export function useStageOptions() {
  return useQuery({
    queryKey: ['options', 'deals.stage'],
    queryFn: () => getOptions('deals.stage'),
  });
}

/**
 * Hook to fetch decision options for deals, including an "All" option.
 */
export function useDecisionOptions() {
  return useQuery({
    queryKey: ['options', 'deals.go_no_go'],
    queryFn: async () => {
      const dOptions = await getOptions('deals.go_no_go');
      return [{ value: 'all', label: 'All' }, ...dOptions];
    },
  });
}

/**
 * Hook to fetch status options for deals, including an "All" option.
 */
export function useStatusOptions() {
  return useQuery({
    queryKey: ['options', 'deals.status'],
    queryFn: async () => {
      const sOptions = await getOptions('deals.status');
      return [{ value: 'all', label: 'All' }, ...sOptions];
    },
  });
}

/**
 * Hook to fetch a list of deals with optional filtering.
 */
export function useDeals(decisionFilter: string = 'all', statusFilter: string = 'all') {
  return useQuery({
    queryKey: ['deals', decisionFilter, statusFilter],
    queryFn: async () => {
      const supabase = supabaseClient();
      let query = supabase.from('deals').select('*').order('created_at', { ascending: false });

      if (decisionFilter !== 'all') {
        query = query.eq('go_no_go', decisionFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Deal[];
    },
  });
}

/**
 * Hook to fetch a single deal by ID.
 */
export function useDeal(dealId?: string) {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      if (!dealId) return null;
      const supabase = supabaseClient();
      const { data, error } = await supabase.from('deals').select('*').eq('id', dealId).single();
      if (error) throw error;
      return data as Deal;
    },
    enabled: !!dealId,
  });
}

/**
 * Hook to fetch documents for a specific deal, including signed URLs.
 */
export function useDealDocuments(dealId?: string) {
  return useQuery({
    queryKey: ['deal_documents', dealId],
    queryFn: async () => {
      if (!dealId) return [];
      const supabase = supabaseClient();
      const { data: documentData, error: docError } = await supabase
        .from('deal_documents')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });

      if (docError) throw docError;

      return await Promise.all(
        (documentData ?? []).map(async (doc) => {
          const signed = await supabase.storage
            .from(doc.storage_bucket ?? 'deal-decks')
            .createSignedUrl(doc.storage_path, 60 * 60);

          if (signed.data?.signedUrl) {
            return { ...doc, signedUrl: signed.data.signedUrl } as DealDocument;
          }

          const publicUrl = supabase.storage
            .from(doc.storage_bucket ?? 'deal-decks')
            .getPublicUrl(doc.storage_path);

          return {
            ...doc,
            signedUrl: publicUrl.data.publicUrl,
          } as DealDocument;
        }),
      );
    },
    enabled: !!dealId,
  });
}

interface CreateDealParams {
  companyName: string;
  sector: DealSector;
  stage: DealStage;
  sourceChannel: string;
  leadEmail: string;
  file: File;
}

/**
 * Hook to create a deal, upload the deck, and trigger AI analysis.
 */
export function useCreateDealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyName,
      sector,
      stage,
      sourceChannel,
      leadEmail,
      file,
    }: CreateDealParams) => {
      const supabase = supabaseClient();

      // 1) Create Deal
      const { data: dealData, error: dealError } = await supabase
        .from('deals')
        .insert({
          company_name: companyName || null,
          sector,
          stage,
          source_channel: sourceChannel || null,
          lead_contact_email: leadEmail || null,
          one_liner: '',
        })
        .select('id')
        .single();

      if (dealError || !dealData?.id) {
        throw new Error(dealError?.message ?? 'Unable to create deal.');
      }

      const dealId = dealData.id;
      const storagePath = `deals/${dealId}/deck.pdf`;

      // 2) Upload File
      const { error: uploadError } = await supabase.storage
        .from('deal-decks')
        .upload(storagePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // 3) Create Document Record
      const { error: documentError } = await supabase.from('deal_documents').insert({
        deal_id: dealId,
        file_name: file.name,
        storage_bucket: 'deal-decks',
        storage_path: storagePath,
        mime_type: file.type,
        file_size_bytes: file.size,
      });

      if (documentError) {
        throw new Error(documentError.message);
      }

      // 4) Call analyze-deck Edge Function
      const { error: fnError } = await supabase.functions.invoke('analyze-deck', {
        body: {
          deal_id: dealId,
          storage_bucket: 'deal-decks',
          storage_path: storagePath,
        },
      });

      if (fnError) {
        console.error('analyze-deck failed', fnError);
        // We don't necessarily throw here if the deal was created successfully,
        // but for a mutation it's often better to know if something failed.
      }

      return { dealId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

/**
 * Hook to trigger AI analysis for an existing deal.
 */
export function useAnalyzeDealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const supabase = supabaseClient();

      // 1) Get the latest document for this deal
      const { data: latestDoc, error: docError } = await supabase
        .from('deal_documents')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (docError || !latestDoc) {
        throw new Error('No document found for analysis.');
      }

      // 2) Call analyze-deck Edge Function
      const { error: fnError } = await supabase.functions.invoke('analyze-deck', {
        body: {
          deal_id: dealId,
          storage_bucket: latestDoc.storage_bucket ?? 'deal-decks',
          storage_path: latestDoc.storage_path,
        },
      });

      if (fnError) {
        throw new Error(`Analysis failed: ${fnError.message}`);
      }

      return { success: true };
    },
    onSuccess: (_, dealId) => {
      queryClient.invalidateQueries({ queryKey: ['deal', dealId] });
      queryClient.invalidateQueries({ queryKey: ['deal_documents', dealId] });
    },
  });
}
