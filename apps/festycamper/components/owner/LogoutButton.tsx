'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ownerButtonSecondaryClassName } from '@/components/owner/auth-ui';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/owner/login');
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} disabled={loading} className={ownerButtonSecondaryClassName}>
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
