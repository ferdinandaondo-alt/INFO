import { LegalLayout } from '@/components/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        you are assured privacy with us. No information shared on info is either stored or shared to 3rd parties or any form 
        of enforcement authority. This is our assurance to all users and customers.
      </p>
      <p>
        Note: this template does not store full card numbers — card payments are handled entirely by PayPal, and
        INFO never sees or stores raw card data.
      </p>
    </LegalLayout>
  );
}
