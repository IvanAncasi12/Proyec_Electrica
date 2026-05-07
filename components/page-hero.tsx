    'use client';

import { useEffect, useState } from 'react';
import { api, utils } from '@/lib/api';

interface PageHeroProps {
  title: string;
  breadcrumb: string;
  colors: {
    primario: string;
    secundario: string;
    terciario: string;
  };
}

export default function PageHero({ title, breadcrumb, colors }: PageHeroProps) {
  const [portadas, setPortadas] = useState<string[]>([]);
  const [activePortada, setActivePortada] = useState(0);

  const buildPortadaUrl = (imagen: string) => {
    if (!imagen) return '';

    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }

    return utils.buildImageUrl(imagen);
  };

  useEffect(() => {
    const cargarPortadas = async () => {
      try {
        const contentData = await api.content.getAll();

        if (contentData.portada && contentData.portada.length > 0) {
          const listaPortadas = contentData.portada
            .map((item: any) => buildPortadaUrl(item.portada_imagen))
            .filter(Boolean);

          setPortadas(listaPortadas);
        }
      } catch (error) {
        console.error('Error cargando portadas:', error);
      }
    };

    cargarPortadas();
  }, []);

  useEffect(() => {
    if (portadas.length <= 1) return;

    const interval = setInterval(() => {
      setActivePortada((prev) => (prev + 1) % portadas.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [portadas.length]);

  const removeBrokenPortada = (url: string) => {
    setPortadas((prev) => {
      const nuevas = prev.filter((item) => item !== url);

      if (activePortada >= nuevas.length) {
        setActivePortada(0);
      }

      return nuevas;
    });
  };

  return (
    <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden pt-20 bg-slate-950">
      <div className="absolute inset-0 z-0">
        {portadas.length > 0 ? (
          <>
            {portadas.map((portada, index) => (
              <img
                key={`${portada}-${index}`}
                src={portada}
                alt={`Portada ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === activePortada ? 'opacity-100' : 'opacity-0'
                }`}
                onError={() => removeBrokenPortada(portada)}
              />
            ))}

            <div className="absolute inset-0 bg-slate-950/45" />

            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(135deg, ${colors.primario}55 0%, rgba(15,23,42,0.25) 45%, ${colors.terciario}55 100%)
                `,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, ${colors.primario}35 0%, rgba(255,255,255,0.85) 45%, ${colors.terciario}35 100%)
              `,
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute left-1/2 top-[-8rem] h-[130%] w-[44rem] origin-top -translate-x-[88%] -rotate-[30deg] rounded-full blur-[80px] opacity-40"
          style={{
            background: `linear-gradient(180deg, ${colors.primario}80 0%, ${colors.secundario}45 42%, transparent 80%)`,
          }}
        />

        <div
          className="absolute left-1/2 top-[-8rem] h-[130%] w-[44rem] origin-top -translate-x-[12%] rotate-[30deg] rounded-full blur-[80px] opacity-40"
          style={{
            background: `linear-gradient(180deg, ${colors.terciario}80 0%, ${colors.primario}45 42%, transparent 80%)`,
          }}
        />

        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {portadas.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {portadas.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePortada(index)}
              aria-label={`Ver portada ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activePortada
                  ? 'w-8 bg-white'
                  : 'w-2.5 bg-white/45 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 text-center py-24">
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none mb-8"
          style={{
            background: `linear-gradient(135deg, ${colors.primario} 0%, ${colors.terciario} 55%, ${colors.secundario} 100%)`,
            backgroundSize: '220% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 3s linear infinite',
            filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.45))',
          }}
        >
          {title}
        </h1>

        <div className="inline-flex items-center justify-center gap-2 text-sm text-slate-700 bg-white/85 border border-white/80 rounded-full px-5 py-2 backdrop-blur-xl shadow-lg">
          <a href="/" className="hover:text-slate-950 transition-colors font-bold">
            Inicio
          </a>

          <span className="text-slate-400">/</span>

          <span className="font-black" style={{ color: colors.primario }}>
            {breadcrumb}
          </span>
        </div>
      </div>
    </section>
  );
}