import { LegalLayout } from '@/components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        This is placeholder terms text. Replace with language reviewed by counsel before launch. It should cover:
        the license granted on purchase (personal use, no redistribution/resale of the PDF), payment terms for card,
        PayPal, and crypto, that crypto payments are manually verified before access is granted and may take time to
        confirm, account responsibilities, and limitation of liability.
      </p>
    </LegalLayout>
  );
}
