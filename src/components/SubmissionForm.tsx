'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { FileUploader } from '@/components/FileUploader';
import type { FileType } from '@/types/database';

interface SubmissionFormProps {
  onSubmissionCreated?: () => void;
}

export function SubmissionForm({ onSubmissionCreated }: SubmissionFormProps) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<FileType>('pdf');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadError, setUploadError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    if (fileType !== 'note' && !fileUrl) {
      setMessage({ type: 'error', text: 'Please upload a file first' });
      return;
    }

    if (fileType === 'note' && !textContent.trim()) {
      setMessage({ type: 'error', text: 'Please enter note content' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || null,
        file_type: fileType,
        file_url: fileType === 'note' ? null : fileUrl,
      };

      // For notes, store the text content in the description if no description provided,
      // or in file_url as a data reference
      if (fileType === 'note') {
        body.description = textContent.trim();
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create submission');
      }

      setMessage({ type: 'success', text: 'Submission created successfully!' });
      setTitle('');
      setDescription('');
      setFileUrl(null);
      setTextContent('');
      setFileType('pdf');

      if (onSubmissionCreated) {
        onSubmissionCreated();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to create submission',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
          Title <span className="text-danger">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter submission title"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      {/* Description (hidden for notes since note content IS the description) */}
      {fileType !== 'note' && (
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* File Type Selector */}
      <div>
        <label htmlFor="fileType" className="mb-1.5 block text-sm font-medium text-foreground">
          Type
        </label>
        <select
          id="fileType"
          value={fileType}
          onChange={(e) => {
            setFileType(e.target.value as FileType);
            setFileUrl(null);
            setUploadError('');
          }}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="pdf">PDF Document</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="note">Text Note</option>
        </select>
      </div>

      {/* File Upload or Text Note */}
      {fileType !== 'note' ? (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            File Upload <span className="text-danger">*</span>
          </label>
          {user && (
            <FileUploader
              fileType={fileType}
              userId={user.id}
              onUploadComplete={(url) => {
                setFileUrl(url);
                setUploadError('');
              }}
              onError={(msg) => setUploadError(msg)}
            />
          )}
          {uploadError && (
            <p className="mt-2 text-xs text-danger">{uploadError}</p>
          )}
          {fileUrl && (
            <p className="mt-2 text-xs text-success">File uploaded successfully</p>
          )}
        </div>
      ) : (
        <div>
          <label htmlFor="textContent" className="mb-1.5 block text-sm font-medium text-foreground">
            Note Content <span className="text-danger">*</span>
          </label>
          <textarea
            id="textContent"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Write your note here..."
            rows={6}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Work'}
      </button>
    </form>
  );
}
