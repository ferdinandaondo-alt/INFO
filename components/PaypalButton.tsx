'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PaypalButton({ email, onSuccess }: { email: string; onSuccess: (orderNumber: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setLoading(false);
      return;
    }

    const scriptId = 'paypal-sdk';
    const renderButtons = () => {
      if (!window.paypal || !containerRef.current) return;
      containerRef.current.innerHTML = '';

      window.paypal
        .Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
          createOrder: async () => {
            const res = await fetch('/api/checkout/paypal/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return data.paypalOrderId;
          },
          onApprove: async (data: any) => {
            const res = await fetch('/api/checkout/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paypalOrderId: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok) {
              toast.error(result.error || 'Payment could not be completed');
              return;
            }
            onSuccess(result.orderNumber);
          },
          onError: () => toast.error('PayPal checkout failed — please try again'),
        })
        .render(containerRef.current);

      setLoading(false);
    };

    if (document.getElementById(scriptId)) {
      renderButtons();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&enable-funding=card`;
    script.onload = renderButtons;
    document.body.appendChild(script);
  }, [email]);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="rounded-sm border border-dashed border-border p-4 text-center text-xs text-muted">
        PayPal isn&apos;t configured yet. Add <code className="text-matrix">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> and{' '}
        <code className="text-matrix">PAYPAL_CLIENT_SECRET</code> to your environment to enable card &amp; PayPal
        checkout.
      </div>
    );
  }

  return (
    <div>
      {loading && <p className="mb-3 font-mono text-[11px] text-muted">Loading secure checkout…</p>}
      <div ref={containerRef} />
    </div>
  );
}
