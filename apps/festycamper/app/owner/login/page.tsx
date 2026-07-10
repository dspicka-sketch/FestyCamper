import { Suspense } from 'react';
import { AuthLink, OwnerAuthShell } from '@/components/owner/OwnerAuthShell';
import { LoginForm } from '@/components/owner/LoginForm';

function LoginFormFallback() {
  return <p className="text-sm text-sand-200/60">Loading…</p>;
}

export default function OwnerLoginPage() {
  return (
    <OwnerAuthShell
      title="Welcome back"
      subtitle="Sign in to manage your vans and festival bookings."
      footer={
        <>
          New owner? <AuthLink href="/owner/signup">Create an account</AuthLink>
        </>
      }
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-center text-sm">
        <AuthLink href="/owner/forgot-password">Forgot password?</AuthLink>
      </p>
    </OwnerAuthShell>
  );
}
