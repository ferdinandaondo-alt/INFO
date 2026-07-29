'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: params.get('email'),
        token: params.get('token'),
        password,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.error || 'Could not reset password');
      return;
    }
    toast.success('Password updated — sign in with your new password');
    router.push('/login');
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="doc-frame w-full max-w-md rounded-sm p-9">
          <p className="eyebrow">Recovery</p>
          <h1 className="mt-2 font-display font-bold text-3xl text-paper">Set a new password</h1>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                New password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
