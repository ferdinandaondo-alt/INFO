'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error('Invalid email or password');
    } else {
      toast.success('Welcome back');
      router.push('/dashboard');
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="doc-frame w-full max-w-md rounded-sm p-9">
          <p className="eyebrow">Access</p>
          <h1 className="mt-2 font-display font-bold text-3xl text-paper">Sign in</h1>

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
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Password</label>
                <Link href="/forgot-password" className="font-mono text-[11px] text-matrix hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="btn-secondary w-full"
          >
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            No account yet?{' '}
            <Link href="/register" className="text-matrix hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
