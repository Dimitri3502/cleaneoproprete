import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestOnly } from '@/components/auth/guest-only';
import Link from 'next/link';

export default function Page() {
  return (
    <GuestOnly>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>We&apos;ve sent you a magic link</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Please click the link in the email to sign in to your account.
                </p>
                <div className="text-center">
                  <Link href="/auth/login" className="text-sm underline underline-offset-4">
                    Back to login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GuestOnly>
  );
}
