import type { VanStatus } from '@prisma/client';
import { getStatusMeta } from '@/lib/owner/van-display';

export function VanStatusBadge({ status }: { status: VanStatus }) {
  const meta = getStatusMeta(status);
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
      {meta.label}
    </span>
  );
}
