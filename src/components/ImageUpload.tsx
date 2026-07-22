import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { uploadAsset } from '../lib/utils';

export function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Foto',
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    const { url, error } = await uploadAsset(file, folder);
    setUploading(false);
    if (error) { setError(error); return; }
    onChange(url);
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200">
          {value ? (
            <>
              <img src={value} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => onChange('')}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white transition hover:bg-black/70"
                type="button"
                aria-label="Hapus foto"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-300">
              <Upload className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-outline px-4 py-2 text-xs">
              {uploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengunggah...</> : <><Upload className="h-3.5 w-3.5" /> Unggah file</>}
            </button>
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="atau tempel URL gambar"
            className="input mt-2 text-xs"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
