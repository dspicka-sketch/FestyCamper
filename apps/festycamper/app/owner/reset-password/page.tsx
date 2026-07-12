import { AuthLink, OwnerAuthShell } from '@/components/owner/OwnerAuthShell';
import { ResetPasswordForm } from '@/components/owner/ResetPasswordForm';

export default function OwnerResetPasswordPage() {
  return (
    <OwnerAuthShell
      title="Choose a new password"
      subtitle="Enter a new password for your owner account."
      footer={
        <>
          <AuthLink href="/owner/login">Back to sign in</AuthLink>
        </>
      }
    >
      <ResetPasswordForm />
    </OwnerAuthShell>
  );
}
