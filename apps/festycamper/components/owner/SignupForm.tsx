'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ownerButtonPrimaryClassName,
  ownerErrorClassName,
  ownerInputClassName,
  ownerLabelClassName,
  ownerSuccessClassName,
} from '@/components/owner/auth-ui';

export function SignupForm() {
  const router = useRouter();
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
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/owner/onboarding`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push('/owner/onboarding');
      router.refresh();
      return;
    }

    setSuccess('Check your email to confirm your account, then sign in.');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={ownerLabelClassName} htmlFor="email">Email</label>
        <input className={ownerInputClassName} id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div>
        <label className={ownerLabelClassName} htmlFor="password">Password</label>
        <input className={ownerInputClassName} id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
      </div>
      <div>
        <label className={ownerLabelClassName} htmlFor="confirmPassword">Confirm password</label>
        <input className={ownerInputClassName} id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
      </div>

      {error && <p className={ownerErrorClassName}>{error}</p>}
      {success && <p className={ownerSuccessClassName}>{success}</p>}

      <button type="submit" disabled={loading} className={ownerButtonPrimaryClassName}>
        {loading ? 'Creating account…' : 'Create owner account'}
      </button>
    </form>
  );
}
