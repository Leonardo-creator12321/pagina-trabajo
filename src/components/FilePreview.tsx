'use client';

import { useState } from 'react';

interface FilePreviewProps {
  fileUrl: string | null;
  fileType: 'pdf' | 'image' | 'video' | 'note';
  textContent?: string | null;
}

export function FilePreview({ fileUrl, fileType, textContent }: FilePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);

  if (fileType === 'note') {
    return (
      <div className="rounded-lg border border-border bg-background p-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted">
          <span className="text-lg">📝</span>
          <span className="font-medium">Text Note</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {textContent || 'No content available'}
        </p>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="rounded-lg border border-border bg-background p-6 text-center">
        <p className="text-sm text-muted">No file attached to this submission.</p>
      </div>
    );
  }

  if (fileType === 'image') {
    if (imageError) {
      return (
        <div className="rounded-lg border border-border bg-background p-6 text-center">
          <p className="mb-3 text-sm text-muted">
            Unable to load the image preview.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
          >
            <span>🖼️</span>
            <span>Open Image in New Tab</span>
          </a>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        {imageLoading && (
          <div className="flex h-64 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-xs text-muted">Loading image...</span>
            </div>
          </div>
        )}
        <img
          src={fileUrl}
          alt="Submission preview"
          className={`max-h-[500px] w-full object-contain ${imageLoading ? 'hidden' : 'block'}`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-t border-border bg-background p-3 text-xs text-primary transition-colors hover:bg-primary/5"
        >
          <span>🔗</span>
          <span>Open full size in new tab</span>
        </a>
      </div>
    );
  }

  if (fileType === 'video') {
    if (videoError) {
      return (
        <div className="rounded-lg border border-border bg-background p-6 text-center">
          <p className="mb-3 text-sm text-muted">
            Unable to load the video preview. The file might still be processing or the format is not supported by your browser.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
          >
            <span>🎬</span>
            <span>Download / Open Video</span>
          </a>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        {videoLoading && (
          <div className="flex h-64 items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-xs text-muted">Loading video...</span>
            </div>
          </div>
        )}
        <video
          src={fileUrl}
          controls
          preload="metadata"
          className={`max-h-[500px] w-full bg-black ${videoLoading ? 'hidden' : 'block'}`}
          onLoadedData={() => setVideoLoading(false)}
          onCanPlay={() => setVideoLoading(false)}
          onError={() => {
            setVideoLoading(false);
            setVideoError(true);
          }}
        >
          Your browser does not support the video tag.
        </video>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-t border-border bg-background p-3 text-xs text-primary transition-colors hover:bg-primary/5"
        >
          <span>🔗</span>
          <span>Open video in new tab</span>
        </a>
      </div>
    );
  }

  if (fileType === 'pdf') {
    // Use Google Docs Viewer as primary method since Supabase Storage
    // often returns Content-Disposition: attachment which prevents inline display.
    // Fallback to direct link if the viewer doesn't work.
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    return (
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative">
          <iframe
            src={googleViewerUrl}
            title="PDF Preview"
            className="h-[600px] w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-background p-3">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
          >
            <span>📄</span>
            <span>Download PDF</span>
          </a>
          <a
            href={googleViewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
          >
            <span>🔗</span>
            <span>Open in Google Viewer</span>
          </a>
          <span className="text-xs text-muted">
            If the preview does not load, use the links above.
          </span>
        </div>
      </div>
    );
  }

  return null;
}
