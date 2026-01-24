import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { GuestOnly } from '@/components/auth/guest-only';

export default function Page() {
  return (
    <GuestOnly>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </GuestOnly>
  );
}
