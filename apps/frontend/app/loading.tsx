import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container grid gap-6 py-12 md:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-80" />
      ))}
    </main>
  );
}
