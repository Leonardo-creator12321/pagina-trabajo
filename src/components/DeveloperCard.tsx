import Link from 'next/link';
import { Profile } from '@/types/database';

interface DeveloperCardProps {
  developer: Profile;
  submissionCount: number;
}

export function DeveloperCard({ developer, submissionCount }: DeveloperCardProps) {
  return (
    <Link href={`/dashboard/developer/${developer.id}`}>
      <div className="group relative rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="relative flex flex-col items-center gap-4">
          {developer.avatar_url ? (
            <img
              src={developer.avatar_url}
              alt={developer.name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-border transition-all duration-200 group-hover:ring-primary/50"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary ring-2 ring-border transition-all duration-200 group-hover:ring-primary/50">
              {developer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {developer.name}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
