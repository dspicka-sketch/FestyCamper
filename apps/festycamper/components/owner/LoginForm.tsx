'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ownerButtonPrimaryClassName,
  ownerErrorClassName,
  ownerInputClassName,
  ownerLabelClassName,
} from '@/components/owner/auth-ui';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/owner/dashboard';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(next.startsWith('/') ? next : '/owner/dashboard');
    router.refresh();
  }

  const callbackError = searchParams.get('error') === 'auth_callback_failed';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {callbackError && (
        <p className={ownerErrorClassName}>Sign-in link expired or invalid. Please try again.</p>
      )}

      <div>
        <label className={ownerLabelClassName} htmlFor="email">Email</label>
        <input className={ownerInputClassName} id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div>
        <label className={ownerLabelClassName} htmlFor="password">Password</label>
        <input className={ownerInputClassName} id="password" name="password" type="password" required autoComplete="current-password" />
      </div>

      {error && <p className={ownerErrorClassName}>{error}</p>}

      <button type="submit" disabled={loading} className={ownerButtonPrimaryClassName}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
