'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/services/auth/auth.hooks';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/auth/login?next=${next}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex-1 w-full flex flex-col gap-12 animate-pulse">
        <div className="h-10 bg-accent rounded-md" />
        <div className="h-40 bg-muted rounded-md" />
      </div>
    );
  }

  return <>{children}</>;
}
