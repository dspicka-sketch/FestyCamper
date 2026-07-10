'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ownerButtonPrimaryClassName,
  ownerErrorClassName,
  ownerInputClassName,
  ownerLabelClassName,
  ownerSuccessClassName,
} from '@/components/owner/auth-ui';

export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirmPassword = String(form.get('confirmPassword') ?? '');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess('Password updated. Redirecting to your dashboard…');
    setTimeout(() => {
      router.push('/owner/dashboard');
      router.refresh();
    }, 1500);
  }

  if (!ready) {
    return <p className="text-sm text-sand-200/60">Loading…</p>;
  }

  if (!hasSession) {
    return (
      <p className={ownerErrorClassName}>
        Reset link expired or invalid. Request a new link from the forgot password page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={ownerLabelClassName} htmlFor="password">New password</label>
        <input className={ownerInputClassName} id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div>
        <label className={ownerLabelClassName} htmlFor="confirmPassword">Confirm new password</label>
        <input className={ownerInputClassName} id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
      </div>

      {error && <p className={ownerErrorClassName}>{error}</p>}
      {success && <p className={ownerSuccessClassName}>{success}</p>}

      <button type="submit" disabled={loading} className={ownerButtonPrimaryClassName}>
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
