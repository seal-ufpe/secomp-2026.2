import { Badge } from './badge';

export function OriginBadge({ origin }: { origin: 'lovable' | 'base44' }) {
  return <Badge>{origin === 'lovable' ? 'Lovable' : 'Base44'}</Badge>;
}
