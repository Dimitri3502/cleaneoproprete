'use client';

import { useUser } from '@/services/auth/auth.hooks';
import { InfoIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { data: user, isLoading: loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-12 animate-pulse">
        <div className="h-10 bg-accent rounded-md" />
        <div className="h-40 bg-muted rounded-md" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto w-full">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
