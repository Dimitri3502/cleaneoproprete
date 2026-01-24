import { useQuery } from '@tanstack/react-query';
import { createClient } from './supabase/client';

export type MetaEnums = {
  enums: {
    [key: string]: string[];
  };
};

export type EnumKey = 'deals.sector' | 'deals.stage' | 'deals.go_no_go' | 'deals.status';

export async function fetchMetaEnums(): Promise<MetaEnums> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke<MetaEnums>('meta-enums');

  if (error || !data) {
    console.error('Error fetching meta-enums:', error);
    return { enums: {} };
  }

  return data;
}

export function useMetaEnums() {
  return useQuery({
    queryKey: ['meta-enums'],
    queryFn: fetchMetaEnums,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function labelFromValue(value: string): string {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
