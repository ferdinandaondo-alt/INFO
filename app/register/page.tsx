'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await signIn('credentials', { email, password, redirect: false });
      toast.success('Account created');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="doc-frame w-full max-w-md rounded-sm p-9">
          <p className="eyebrow">Registration</p>
          <h1 className="mt-2 font-display font-bold text-3xl text-paper">Create your account</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
            </div>
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
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
              <p className="mt-1.5 font-mono text-[10px] text-muted">Minimum 8 characters</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating…' : 'Create account'}
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
            Already have an account?{' '}
            <Link href="/login" className="text-matrix hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
