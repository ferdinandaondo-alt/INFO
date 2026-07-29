'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1D2025',
            color: '#F2F0E9',
            border: '1px solid #2A2D33',
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
          },
        }}
      />
    </SessionProvider>
  );
}
