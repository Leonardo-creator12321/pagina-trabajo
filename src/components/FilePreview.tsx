'use client';

interface FilePreviewProps {
  fileUrl: string | null;
  fileType: 'pdf' | 'image' | 'video' | 'note';
  textContent?: string | null;
}

export function FilePreview({ fileUrl, fileType, textContent }: FilePreviewProps) {
  if (fileType === 'note') {
    return (
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span>📝</span>
          <span>Text Note</span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-foreground">
          {textContent || 'No content'}
        </p>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="rounded-lg border border-border bg-background p-4 text-center text-sm text-muted">
        No file attached
      </div>
    );
  }

  if (fileType === 'image') {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <img
          src={fileUrl}
          alt="Submission preview"
          className="h-48 w-full object-cover"
        />
      </div>
    );
  }

  if (fileType === 'video') {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <video
          src={fileUrl}
          controls
          className="h-48 w-full bg-black"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (fileType === 'pdf') {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary"
      >
        <span className="text-2xl">📄</span>
        <div>
          <p className="text-sm font-medium text-foreground">PDF Document</p>
          <p className="text-xs text-muted">Click to open in new tab</p>
        </div>
      </a>
    );
  }

  return null;
}
