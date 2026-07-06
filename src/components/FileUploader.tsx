'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { FileType } from '@/types/database';

interface FileUploaderProps {
  fileType: Exclude<FileType, 'note'>;
  userId: string;
  onUploadComplete: (url: string) => void;
  onError: (message: string) => void;
}

const ACCEPTED_TYPES: Record<Exclude<FileType, 'note'>, string> = {
  pdf: '.pdf,application/pdf',
  image: 'image/png,image/jpeg,image/gif,image/webp',
  video: 'video/mp4,video/webm,video/ogg',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileUploader({ fileType, userId, onUploadComplete, onError }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      onError('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
    onError('');
  }

  async function uploadFile(): Promise<string | null> {
    if (!selectedFile) return null;

    setUploading(true);
    setUploadProgress('Uploading...');

    try {
      const supabase = createClient();
      const timestamp = Date.now();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${userId}/${timestamp}_${safeName}`;

      const { error } = await supabase.storage
        .from('work-evidence')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        onError(`Upload failed: ${error.message}`);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('work-evidence')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      onUploadComplete(publicUrl);
      setUploadProgress('Upload complete!');
      return publicUrl;
    } catch (err) {
      onError('Upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  function clearFile() {
    setSelectedFile(null);
    setUploadProgress('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES[fileType]}
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
        />
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">{selectedFile.name}</span>
            <span className="text-xs text-muted">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {uploadProgress && (
              <span className="text-xs text-success">{uploadProgress}</span>
            )}
            <button
              type="button"
              onClick={clearFile}
              disabled={uploading}
              className="text-xs text-muted transition-colors hover:text-danger"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {selectedFile && !uploadProgress.includes('complete') && (
        <button
          type="button"
          onClick={uploadFile}
          disabled={uploading}
          className="rounded-lg bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/25 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      )}
    </div>
  );
}
