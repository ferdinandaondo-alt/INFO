'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
    toast.success('If that email exists, a reset link is on its way');
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="doc-frame w-full max-w-md rounded-sm p-9">
          <p className="eyebrow">Recovery</p>
          <h1 className="mt-2 font-display font-bold text-3xl text-paper">Reset your password</h1>
          {sent ? (
            <p className="mt-6 text-sm text-muted">
              Check your inbox for a reset link. It expires in 1 hour.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
