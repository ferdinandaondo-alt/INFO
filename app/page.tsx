import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Stats } from '@/components/Stats';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Pricing } from '@/components/Pricing';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
