import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminNav } from '@/components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if ((session.user as any)?.role !== 'ADMIN') redirect('/dashboard');

  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="mx-auto max-w-6xl px-6 pb-28">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 font-display font-bold text-4xl text-paper">Control room</h1>
          <AdminNav />
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
