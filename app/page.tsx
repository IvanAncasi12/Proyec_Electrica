import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import Gallery from '@/components/gallery';
import Footer from '@/components/footer';
import Contactos from '@/components/contactos'
import Team from '@/components/team'

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
       <Team />
      <section id="about">
        <About />
      </section>
      <section id="projects">
        <Gallery />
      </section>
      <Contactos />
      <Footer />
    </main>
  );
}
