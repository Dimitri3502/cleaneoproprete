'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { useUser } from '@/services/auth/auth.hooks';
import { LogoutButton } from './logout-button';

export function AuthButton() {
  const { data: user, isLoading: loading } = useUser();

  if (loading) {
    return <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />;
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden sm:inline text-muted-foreground">Hey, {user.email}!</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
