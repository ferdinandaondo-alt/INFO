'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSent(true);
      toast.success('Message sent');
    } else {
      toast.error('Could not send message');
    }
  }

  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="mx-auto max-w-xl px-6 pb-28">
          <p className="eyebrow">Support</p>
          <h1 className="mt-3 font-display font-bold text-4xl text-paper">Get in touch</h1>

          {sent ? (
            <p className="doc-frame mt-8 rounded-sm p-6 text-sm text-muted">
              Thanks — we&apos;ll reply within one business day.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-paper outline-none focus:border-matrix"
              />
              <button type="submit" className="btn-primary w-full">Send message</button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
