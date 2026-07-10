import { Suspense } from 'react';
import { AuthLink, OwnerAuthShell } from '@/components/owner/OwnerAuthShell';
import { SignupForm } from '@/components/owner/SignupForm';

export default function OwnerSignupPage() {
  return (
    <OwnerAuthShell
      title="Create your owner account"
      subtitle="Sign up to list vans, manage bookings, and earn on festival weekends."
      footer={
        <>
          Already have an account? <AuthLink href="/owner/login">Sign in</AuthLink>
        </>
      }
    >
      <SignupForm />
    </OwnerAuthShell>
  );
}
