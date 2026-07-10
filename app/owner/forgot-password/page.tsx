import { AuthLink, OwnerAuthShell } from '@/components/owner/OwnerAuthShell';
import { ForgotPasswordForm } from '@/components/owner/ForgotPasswordForm';

export default function OwnerForgotPasswordPage() {
  return (
    <OwnerAuthShell
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link."
      footer={
        <>
          Remember your password? <AuthLink href="/owner/login">Back to sign in</AuthLink>
        </>
      }
    >
      <ForgotPasswordForm />
    </OwnerAuthShell>
  );
}
