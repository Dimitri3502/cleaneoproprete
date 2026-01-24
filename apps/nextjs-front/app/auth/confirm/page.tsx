'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type EmailOtpType } from '@supabase/supabase-js';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/deals';

    if (token_hash && type) {
      supabase.auth
        .verifyOtp({
          type,
          token_hash,
        })
        .then(({ error }) => {
          if (!error) {
            router.push(next);
          } else {
            router.push(`/auth/error?error=${encodeURIComponent(error.message)}`);
          }
        });
    } else {
      router.push(`/auth/error?error=${encodeURIComponent('No token hash or type')}`);
    }
  }, [router, searchParams, supabase.auth]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Verifying...</h1>
        <p className="text-muted-foreground">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          </div>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
