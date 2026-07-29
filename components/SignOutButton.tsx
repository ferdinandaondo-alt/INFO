'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton({ className = '' }: { className?: string }) {
  return (
    <button onClick={() => signOut()} className={className}>
      Sign out
    </button>
  );
}
