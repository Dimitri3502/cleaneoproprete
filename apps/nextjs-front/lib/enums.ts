import { supabaseClient } from './supabaseClient';

export type MetaEnums = {
  enums: {
    [key: string]: string[];
  };
};

export type EnumKey = 'deals.sector' | 'deals.stage' | 'deals.go_no_go' | 'deals.status';

let cachedEnums: MetaEnums | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMetaEnums(): Promise<MetaEnums> {
  const now = Date.now();
  if (cachedEnums && now - lastFetch < CACHE_DURATION) {
    return cachedEnums;
  }

  const supabase = supabaseClient();
  const { data, error } = await supabase.functions.invoke<MetaEnums>('meta-enums');

  if (error || !data) {
    console.error('Error fetching meta-enums:', error);
    // Return empty or fallback if needed. For now, empty structure.
    return cachedEnums || { enums: {} };
  }

  cachedEnums = data;
  lastFetch = now;
  return data;
}

export async function getOptions(key: EnumKey): Promise<{ value: string; label: string }[]> {
  const meta = await getMetaEnums();
  const values = meta.enums[key] || [];
  return values.map((v) => ({
    value: v,
    label: labelFromValue(v),
  }));
}

export function labelFromValue(value: string): string {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
