'use client';

import { useState } from 'react';
import { Submission } from '@/types/database';
import { StatusBadge } from '@/components/StatusBadge';
import { FilePreview } from '@/components/FilePreview';

interface SubmissionListProps {
  submissions: Submission[];
  showActions?: boolean;
}

function getFileTypeIcon(fileType: string): string {
  switch (fileType) {
    case 'pdf':
      return '📄';
    case 'image':
      return '🖼️';
    case 'video':
      return '🎬';
    case 'note':
      return '📝';
    default:
      return '📎';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function SubmissionList({
  submissions: initialSubmissions,
  showActions = false,
}: SubmissionListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function togglePreview(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleStatusUpdate(submissionId: string, newStatus: 'approved' | 'rejected') {
    setLoadingId(submissionId);
    try {
      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const { submission: updated } = await response.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === submissionId ? { ...s, status: updated.status } : s))
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoadingId(null);
    }
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-muted">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label={submission.file_type}>
                {getFileTypeIcon(submission.file_type)}
              </span>
              <div>
                <h4 className="font-medium text-foreground">{submission.title}</h4>
                <p className="text-xs text-muted">
                  {formatDate(submission.created_at)} &middot;{' '}
                  {submission.file_type.charAt(0).toUpperCase() + submission.file_type.slice(1)}
                </p>
                {submission.description && submission.file_type !== 'note' && (
                  <p className="mt-1 text-xs text-muted">{submission.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={submission.status} />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePreview(submission.id)}
                  className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
                >
                  {expandedIds.has(submission.id) ? 'Hide' : 'Preview'}
                </button>

                {showActions && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'approved')}
                      disabled={loadingId === submission.id || submission.status === 'approved'}
                      className="rounded-lg bg-success/15 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                      disabled={loadingId === submission.id || submission.status === 'rejected'}
                      className="rounded-lg bg-danger/15 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {expandedIds.has(submission.id) && (
            <div className="mt-4 border-t border-border pt-4">
              <FilePreview
                fileUrl={submission.file_url}
                fileType={submission.file_type as 'pdf' | 'image' | 'video' | 'note'}
                textContent={submission.description}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
