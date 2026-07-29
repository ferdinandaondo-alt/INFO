import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="mx-auto max-w-2xl px-6 pb-28">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 font-display font-bold text-4xl text-paper">{title}</h1>
          <div className="prose-invert mt-8 space-y-4 text-sm leading-relaxed text-muted">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
