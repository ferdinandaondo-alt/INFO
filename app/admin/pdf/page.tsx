import { PdfUploadForm } from '@/components/PdfUploadForm';

export default function AdminPdfPage() {
  return (
    <div className="doc-frame rounded-sm p-6">
      <p className="eyebrow mb-3">Replace product PDF</p>
      <p className="mb-5 text-sm text-muted">
        Uploading a new file swaps what buyers download without touching the product page&apos;s design or copy.
      </p>
      <PdfUploadForm />
    </div>
  );
}
