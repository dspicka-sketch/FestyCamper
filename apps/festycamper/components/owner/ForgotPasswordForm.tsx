'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ownerButtonPrimaryClassName,
  ownerErrorClassName,
  ownerInputClassName,
  ownerLabelClassName,
  ownerSuccessClassName,
} from '@/components/owner/auth-ui';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/owner/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess('If an account exists for that email, we sent a password reset link.');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={ownerLabelClassName} htmlFor="email">Email</label>
        <input className={ownerInputClassName} id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>

      {error && <p className={ownerErrorClassName}>{error}</p>}
      {success && <p className={ownerSuccessClassName}>{success}</p>}

      <button type="submit" disabled={loading} className={ownerButtonPrimaryClassName}>
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
