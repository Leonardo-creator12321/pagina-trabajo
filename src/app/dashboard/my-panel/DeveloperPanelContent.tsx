'use client';

import { useState } from 'react';
import { SubmissionForm } from '@/components/SubmissionForm';
import { SubmissionHistory } from '@/components/SubmissionHistory';

export function DeveloperPanelContent() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSubmissionCreated() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-8">
      {/* Submission Form Section */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">New Submission</h3>
          <p className="text-xs text-muted">
            Upload files or add notes as evidence of your work
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <SubmissionForm onSubmissionCreated={handleSubmissionCreated} />
        </div>
      </section>

      {/* Submission History Section */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Submission History</h3>
          <p className="text-xs text-muted">
            Track the status of your submissions
          </p>
        </div>
        <SubmissionHistory refreshKey={refreshKey} />
      </section>
    </div>
  );
}
