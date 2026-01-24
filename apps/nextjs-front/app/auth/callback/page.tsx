'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { EmailOtpType } from '@supabase/supabase-js';

const supabase = createClient();

function AuthCallbackContent() {
  const handled = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (handled.current) return;

    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;

    if (!tokenHash || !type) return;

    handled.current = true;

    (async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (!error) {
          router.replace('/');
        } else {
          console.error('Error verifying OTP:', error);
          router.replace('/auth/error');
        }
      } catch (e) {
        console.error('Unexpected error during OTP verification:', e);
        router.replace('/auth/error');
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Connexion en cours…</h1>
        <p className="text-muted-foreground">
          Veuillez patienter pendant que nous finalisons votre connexion.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
