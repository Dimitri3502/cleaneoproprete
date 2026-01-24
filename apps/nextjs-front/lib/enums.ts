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
  const query = useQuery({
    queryKey: ['meta-enums'],
    queryFn: fetchMetaEnums,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getOptions = (key: EnumKey, includeAll = false) => {
    if (!query.data) return [];
    const values = query.data.enums[key] || [];
    const options = values.map((v) => ({
      value: v,
      label: labelFromValue(v),
    }));

    if (includeAll) {
      return [{ value: 'all', label: 'All' }, ...options];
    }
    return options;
  };

  return {
    ...query,
    getOptions,
  };
}

export function labelFromValue(value: string): string {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
