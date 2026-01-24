'use client';

import { useSignOut } from '@/services/auth/auth.hooks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const signOut = useSignOut();

  const logout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Logout
    </Button>
  );
}
