'use client';

import { useState, useEffect } from 'react';
import { api, utils } from '@/lib/api';

export default function Hero() {
  const [institucion, setInstitucion] = useState<any>(null);
  const [portadas, setPortadas] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [instData, contentData] = await Promise.all([
          api.institution.getCurrentPrincipal(),
          api.content.getAll(),
        ]);

        setInstitucion(instData);
        setPortadas(contentData.portada || []);

        if (instData.colorinstitucion?.[0]) {
          const colors = instData.colorinstitucion[0];

          document.documentElement.style.setProperty(
            '--color-primario',
            colors.color_primario || '#facc15'
          );
          document.documentElement.style.setProperty(
            '--color-secundario',
            colors.color_secundario || '#2563eb'
          );
          document.documentElement.style.setProperty(
            '--color-terciario',
            colors.color_terciario || '#38bdf8'
          );
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  useEffect(() => {
    if (!institucion?.institucion_nombre) return;

    const fullText = String(institucion.institucion_nombre).toUpperCase();
    let index = 0;

    setDisplayedText('');

    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 85);

    return () => clearInterval(interval);
  }, [institucion]);

  useEffect(() => {
    if (portadas.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % portadas.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [portadas.length]);

  const buildImageUrl = (imagen?: string | null) => {
    if (!imagen) return '';

    const imageClean = String(imagen).trim();

    if (!imageClean) return '';

    if (imageClean.startsWith('http://') || imageClean.startsWith('https://')) {
      return imageClean;
    }

    return utils.buildImageUrl(imageClean);
  };

  const logoUrl = institucion?.institucion_logo
    ? buildImageUrl(institucion.institucion_logo)
    : '';

  const getTitleLines = (text: string) => {
    const cleanText = String(text || '').trim();

    if (!cleanText) return [''];

    const words = cleanText.split(/\s+/);

    if (words.length === 1) return [words[0]];
    if (words.length === 2) return [words[0], words[1]];
    if (words.length === 3) return [words[0], `${words[1]} ${words[2]}`];

    const middle = Math.ceil(words.length / 2);
    return [
      words.slice(0, middle).join(' '),
      words.slice(middle).join(' '),
    ];
  };

      const getLetterStyle = (index: number) => {
      const palette = [
        'var(--color-primario)',
        'var(--color-terciario)',
        '#ffffff',
        'var(--color-primario)',
        'var(--color-terciario)',
      ];

      const color = palette[index % palette.length];

      return {
        color,
        WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
        textShadow: `
          0 2px 0 rgba(0,0,0,0.35),
          0 0 14px ${color},
          0 0 34px ${color},
          0 0 54px rgba(255,255,255,0.18)
        `,
      };
    };

    const renderAnimatedLine = (line: string, offset = 0) => {
      return line.split('').map((char, index) => {
        const absoluteIndex = offset + index;
        const letterStyle = getLetterStyle(absoluteIndex);

        return (
          <span
            key={`${char}-${offset}-${index}`}
            className={`hero-letter ${char === ' ' ? 'mx-[0.16em]' : ''}`}
            style={{
              animationDelay: `${absoluteIndex * 0.05}s`,
              ...(char === ' ' ? { color: 'transparent' } : letterStyle),
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      });
    };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div
          className="absolute -top-36 -right-36 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: 'var(--color-primario)' }}
        />
        <div
          className="absolute -bottom-36 -left-36 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: 'var(--color-terciario)' }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-white/10 border-t-transparent animate-spin"
            style={{ borderTopColor: 'var(--color-primario)' }}
          />
          <p className="text-sm tracking-[0.35em] uppercase text-white/70">
            Cargando
          </p>
        </div>
      </section>
    );
  }

  if (portadas.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-2xl font-black">No hay portadas disponibles</p>
      </section>
    );
  }

  const nombreCarrera = (
    displayedText || String(institucion?.institucion_nombre || '')
  ).toUpperCase();

  const titleLines = getTitleLines(nombreCarrera);

  let letterOffset = 0;

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-slate-950">
      {/* FONDO */}
      <div className="absolute inset-0 z-0">
        {portadas.map((portada, index) => {
          const imagen = buildImageUrl(portada.portada_imagen);

          return (
            <div
              key={portada.portada_id || index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0'
              }`}
            >
              <img
                src={imagen}
                alt={
                  portada.portada_titulo ||
                  institucion?.institucion_nombre ||
                  'Portada'
                }
                className="w-full h-full object-cover scale-[1.03] brightness-[0.92] contrast-[1.08] saturate-[1.08]"
              />
            </div>
          );
        })}

        <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/35 via-slate-950/52 to-slate-950/86" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.28)_55%,rgba(2,6,23,0.72)_100%)]" />

        <div
          className="absolute inset-0 z-20 opacity-[0.12]"
          style={{
            background:
              'linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-20 z-20"
          style={{ backgroundColor: 'var(--color-primario)' }}
        />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-30 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl pt-32 pb-20 text-center">
          <div className="mx-auto max-w-6xl">
            <p
              className="mb-6 text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-[0.55em]"
              style={{ color: 'var(--color-primario)' }}
            >
              Carrera de
            </p>

            <h1 className="text-center font-black leading-[0.9] tracking-tight">
              {titleLines.map((line, lineIndex) => {
                const currentOffset = letterOffset;
                letterOffset += line.length + 1;

                return (
                  <span
                    key={`${line}-${lineIndex}`}
                    className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.7rem] 2xl:text-[7.4rem]"
                  >
                    {renderAnimatedLine(line, currentOffset)}
                  </span>
                );
              })}
            </h1>

            <div className="mt-8 flex items-center justify-center gap-4">
              <div
                className="h-px w-14 sm:w-24"
                style={{ backgroundColor: 'var(--color-primario)' }}
              />
              <span
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-black tracking-[0.35em] border backdrop-blur-md"
                style={{
                  color: 'var(--color-primario)',
                  borderColor: 'rgba(255,255,255,0.14)',
                  background: 'rgba(15,23,42,0.36)',
                }}
              >
                {institucion?.institucion_iniciales}
              </span>
              <div
                className="h-px w-14 sm:w-24"
                style={{ backgroundColor: 'var(--color-primario)' }}
              />
            </div>

            {/* LOGO MÁS GRANDE Y FLIP 3D */}
            <div className="mt-12 sm:mt-14 flex justify-center">
              {logoUrl ? (
                <div className="relative logo-float">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-20 scale-125"
                    style={{ backgroundColor: 'var(--color-primario)' }}
                  />
                  <div className="logo-animado">
                    <img
                      src={logoUrl}
                      alt={institucion?.institucion_nombre || 'Logo'}
                      className="relative h-36 w-36 sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 object-contain opacity-90 hover:opacity-100 transition-all duration-500"
                      style={{
                        filter:
                          'drop-shadow(0 10px 30px rgba(0,0,0,0.38)) drop-shadow(0 0 18px rgba(255,255,255,0.08))',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="h-36 w-36 sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-black opacity-75 logo-float"
                  style={{
                    color: 'var(--color-primario)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="logo-animado">
                    {institucion?.institucion_iniciales || 'UPEA'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INDICADORES */}
      {portadas.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {portadas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ver portada ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-10 bg-white'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        .hero-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(18px) scale(0.96) skewX(-8deg);
          animation: electricReveal 0.55s ease forwards;
          position: relative;
          will-change: transform, opacity, filter;
        }

        .hero-letter::after {
          content: '';
          position: absolute;
          left: 8%;
          right: 8%;
          top: 52%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--color-primario) 20%,
            #ffffff 50%,
            var(--color-terciario) 80%,
            transparent 100%
          );
          opacity: 0;
          filter: blur(0.6px);
          animation: circuitCut 0.4s ease forwards;
          animation-delay: inherit;
        }

        @keyframes electricReveal {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.96) skewX(-8deg);
            filter: brightness(1.9) blur(7px);
          }
          35% {
            opacity: 0.6;
            transform: translateY(8px) scale(1.02) skewX(-4deg);
            filter: brightness(2.2) blur(1.2px);
          }
          65% {
            opacity: 0.9;
            transform: translateY(-2px) scale(1.01) skewX(0deg);
            filter: brightness(1.35) blur(0.4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) skewX(0deg);
            filter: brightness(1) blur(0);
          }
        }

        @keyframes circuitCut {
          0% {
            opacity: 0;
            transform: scaleX(0.2) translateX(-10px);
          }
          45% {
            opacity: 1;
            transform: scaleX(1.05) translateX(0);
          }
          100% {
            opacity: 0;
            transform: scaleX(1.12) translateX(6px);
          }
        }

        .logo-float {
          animation: subtleFloat 4.5s ease-in-out infinite;
        }

        .logo-animado {
          animation: flip-horizontal 5s ease-in-out infinite;
          transform-style: preserve-3d;
          display: inline-block;
          will-change: transform;
        }

        .logo-animado:hover {
          animation-play-state: paused;
        }

        @keyframes subtleFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes flip-horizontal {
          0% {
            transform: perspective(400px) rotateY(0deg);
          }
          100% {
            transform: perspective(400px) rotateY(360deg);
          }
        }
      `}</style>
    </section>
  );
}