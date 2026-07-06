'use client';

import { useEffect, useState, useCallback } from 'react';
import { SubmissionList } from '@/components/SubmissionList';
import type { Submission } from '@/types/database';

interface SubmissionHistoryProps {
  refreshKey?: number;
}

export function SubmissionHistory({ refreshKey }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data.submissions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions, refreshKey]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-center">
        <p className="text-sm text-danger">{error}</p>
        <button
          onClick={fetchSubmissions}
          className="mt-3 text-xs text-muted underline hover:text-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-lg">📋</p>
        <p className="mt-2 text-sm text-muted">No submissions yet. Upload your first work above!</p>
      </div>
    );
  }

  return <SubmissionList submissions={submissions} showActions={false} />;
}
