'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function PdfUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/pdf', { method: 'POST', body: formData });
    setUploading(false);
    if (res.ok) {
      toast.success('PDF replaced — live immediately, product page unchanged');
      router.refresh();
    } else {
      toast.error('Upload failed');
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block font-mono text-xs text-muted"
      />
      <button onClick={upload} disabled={!file || uploading} className="btn-primary disabled:opacity-50">
        {uploading ? 'Uploading…' : 'Upload & replace'}
      </button>
    </div>
  );
}
