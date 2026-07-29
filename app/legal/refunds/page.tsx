import { LegalLayout } from '@/components/LegalLayout';

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        This is placeholder refund policy text. Replace with your actual policy before launch. A common structure
        for a digital, instant-delivery product: refunds available within 7 days of purchase if the file has not yet
        been downloaded; no refunds once the file has been downloaded, given the nature of digital goods; crypto
        payments are refunded to the originating wallet address only, minus network fees.
      </p>
    </LegalLayout>
  );
}
