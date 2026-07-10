'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { VAN_PHOTOS_BUCKET } from '@/lib/owner/onboarding-constants';
import type { PhotoUploadItem } from '@/lib/owner/onboarding-types';
import { ownerErrorClassName } from '@/components/owner/auth-ui';

type StepPhotosProps = {
  photos: PhotoUploadItem[];
  onChange: (photos: PhotoUploadItem[]) => void;
  userId: string;
};

function createPhotoId() {
  return crypto.randomUUID();
}

async function uploadPhoto(
  userId: string,
  file: File,
  onProgress: (progress: number) => void,
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/onboarding/${createPhotoId()}-${safeName}`;

  onProgress(10);

  const { error } = await supabase.storage.from(VAN_PHOTOS_BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  onProgress(90);

  const { data } = supabase.storage.from(VAN_PHOTOS_BUCKET).getPublicUrl(storagePath);

  onProgress(100);

  return { storagePath, publicUrl: data.publicUrl };
}

export function StepPhotos({ photos, onChange, userId }: StepPhotosProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setError('');
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        setError('Please upload image files (JPG, PNG, WebP).');
        return;
      }

      const newItems: PhotoUploadItem[] = imageFiles.map((file, index) => ({
        id: createPhotoId(),
        storagePath: '',
        publicUrl: '',
        fileName: file.name,
        progress: 0,
        status: 'pending',
        isCover: photos.length === 0 && index === 0,
      }));

      let currentBatch = [...photos, ...newItems];
      onChange(currentBatch);

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const item = newItems[i];

        currentBatch = currentBatch.map((p) =>
          p.id === item.id ? { ...p, status: 'uploading' as const, progress: 5 } : p,
        );
        onChange([...currentBatch]);

        try {
          const result = await uploadPhoto(userId, file, (progress) => {
            currentBatch = currentBatch.map((p) =>
              p.id === item.id ? { ...p, progress, status: 'uploading' } : p,
            );
            onChange([...currentBatch]);
          });

          currentBatch = currentBatch.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  ...result,
                  status: 'done' as const,
                  progress: 100,
                }
              : p,
          );
          onChange([...currentBatch]);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          currentBatch = currentBatch.map((p) =>
            p.id === item.id
              ? { ...p, status: 'error' as const, errorMessage: message, progress: 0 }
              : p,
          );
          onChange([...currentBatch]);
        }
      }
    },
    [photos, onChange, userId],
  );

  function setCover(id: string) {
    onChange(photos.map((p) => ({ ...p, isCover: p.id === id })));
  }

  function removePhoto(id: string) {
    const remaining = photos.filter((p) => p.id !== id);
    if (remaining.length > 0 && !remaining.some((p) => p.isCover)) {
      remaining[0].isCover = true;
    }
    onChange([...remaining]);
  }

  const doneCount = photos.filter((p) => p.status === 'done').length;
  const uploadingCount = photos.filter((p) => p.status === 'uploading').length;

  return (
    <div className="space-y-6">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files.length) void processFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragActive
            ? 'border-amber-glow/60 bg-amber-glow/5'
            : 'border-white/15 bg-forest-950/40 hover:border-amber-glow/30'
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-glow/10 text-2xl">
          📷
        </div>
        <p className="mt-4 text-base font-medium text-sand-50">Drag and drop your van photos</p>
        <p className="mt-1 text-sm text-sand-200/60">or click to browse — JPG, PNG, WebP up to 10MB</p>
        <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-sand-100 transition-colors hover:border-amber-glow/40 hover:bg-white/10">
          Choose files
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void processFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {(photos.length > 0 || uploadingCount > 0) && (
        <div className="rounded-xl border border-white/10 bg-forest-950/50 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-sand-200/70">
              {doneCount} of {photos.length} uploaded
              {uploadingCount > 0 && ` · ${uploadingCount} uploading`}
            </span>
            {photos.length > 0 && (
              <span className="font-medium text-amber-glow">
                {Math.round((doneCount / photos.length) * 100)}%
              </span>
            )}
          </div>
          {photos.length > 0 && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${(doneCount / photos.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-sand-200/80">
            Select cover photo <span className="text-sand-200/50">(shown first in search)</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`group relative overflow-hidden rounded-xl border ${
                  photo.isCover ? 'border-amber-glow ring-2 ring-amber-glow/30' : 'border-white/10'
                }`}
              >
                <div className="aspect-[4/3] bg-forest-800">
                  {photo.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.publicUrl} alt={photo.fileName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sand-200/40">
                      {photo.status === 'uploading' ? `${photo.progress}%` : '…'}
                    </div>
                  )}
                  {photo.status === 'uploading' && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-amber-glow transition-all"
                        style={{ width: `${photo.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="ml-auto rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                  >
                    Remove
                  </button>
                  {photo.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => setCover(photo.id)}
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        photo.isCover
                          ? 'bg-amber-glow text-forest-950'
                          : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                    >
                      {photo.isCover ? 'Cover photo' : 'Set as cover'}
                    </button>
                  )}
                </div>
                {photo.isCover && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-glow px-2 py-0.5 text-xs font-semibold text-forest-950">
                    Cover
                  </span>
                )}
                {photo.status === 'error' && (
                  <p className="absolute inset-x-0 bottom-0 bg-rose-500/90 px-2 py-1 text-xs text-white">
                    {photo.errorMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className={ownerErrorClassName}>{error}</p>}
    </div>
  );
}

export function validatePhotos(photos: PhotoUploadItem[]): string | null {
  const done = photos.filter((p) => p.status === 'done');
  if (done.length === 0) return 'Upload at least one photo of your van.';
  if (photos.some((p) => p.status === 'uploading')) return 'Please wait for uploads to finish.';
  if (!done.some((p) => p.isCover)) return 'Select a cover photo.';
  return null;
}
