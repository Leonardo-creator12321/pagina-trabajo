'use client';

import { useUser } from '@/hooks/useUser';

export function Header() {
  const { profile, loading } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <h1 className="text-lg font-semibold text-foreground">
            Game Dev Work Review
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-surface-hover" />
          ) : profile ? (
            <>
              <div className="flex items-center gap-3">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {profile.name}
                </span>
                <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline">
                  {profile.role.toUpperCase()}
                </span>
              </div>

              <a
                href="/logout"
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-danger hover:text-danger"
              >
                Logout
              </a>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
