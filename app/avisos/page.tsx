'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AvisosContent from '@/components/avisos-content';
import PageHero from '@/components/page-hero';

export default function AvisosPage() {
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState({
    primario: '#10b981',
    secundario: '#f59e0b',
    terciario: '#06b6d4',
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const instData = await api.institution.getCurrentPrincipal();

        if (instData.colorinstitucion?.[0]) {
          const c = instData.colorinstitucion[0];

          setColors({
            primario: c.color_primario || '#10b981',
            secundario: c.color_secundario || '#f59e0b',
            terciario: c.color_terciario || '#06b6d4',
          });
        }
      } catch (error) {
        console.error('Error cargando colores institucionales:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-[-8rem] h-[130%] w-[48rem] origin-top -translate-x-[88%] -rotate-[30deg] rounded-full blur-[80px] opacity-65"
            style={{
              background: `linear-gradient(180deg, ${colors.primario}99 0%, ${colors.secundario}55 42%, transparent 80%)`,
            }}
          />

          <div
            className="absolute left-1/2 top-[-8rem] h-[130%] w-[48rem] origin-top -translate-x-[12%] rotate-[30deg] rounded-full blur-[80px] opacity-65"
            style={{
              background: `linear-gradient(180deg, ${colors.terciario}99 0%, ${colors.primario}55 42%, transparent 80%)`,
            }}
          />

          <div className="absolute inset-0 bg-white/45" />

          <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10 flex items-center gap-4 px-7 py-5 rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-2xl shadow-slate-300/40">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border"
            style={{
              color: colors.primario,
              borderColor: `${colors.primario}55`,
              backgroundColor: `${colors.primario}12`,
              boxShadow: `0 18px 40px ${colors.primario}25`,
            }}
          >
            <span className="w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin" />
          </div>

          <div>
            <p className="text-slate-900 text-lg font-black">
              Cargando avisos
            </p>
            <p className="text-slate-500 text-sm">
              Preparando anuncios institucionales...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageHero
        title="Avisos"
        breadcrumb="Avisos"
        colors={colors}
      />

      <AvisosContent colors={colors} />

      <Footer />
    </div>
  );
}