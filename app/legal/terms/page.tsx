import { LegalLayout } from '@/components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        We are not legally liable from actions that are committed with the obtainance of the file
        our main aim is educational content, this should be understood clearly. your actions may result
        in legal distress, be cautious about how you treat this information.
      </p>
    </LegalLayout>
  );
}
