import { LegalLayout } from '@/components/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        This is placeholder policy text. Replace with language reviewed by counsel before launch. It should cover
        what data INFO collects (account info, order/payment metadata, download logs), how it&apos;s used, how long
        it&apos;s retained, third parties it&apos;s shared with (PayPal for payment processing, your email provider
        for receipts), and how users can request deletion or export of their data.
      </p>
      <p>
        Note: this template does not store full card numbers — card payments are handled entirely by PayPal, and
        INFO never sees or stores raw card data.
      </p>
    </LegalLayout>
  );
}
