import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

/**
 * Hook to fetch the current user using React Query.
 */
export function useUser() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(['auth', 'user'], session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, queryClient]);

  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to sign out and invalidate auth queries.
 */
export function useSignOut() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
  };
}
