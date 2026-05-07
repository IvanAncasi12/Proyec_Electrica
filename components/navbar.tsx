'use client';

import { useState, useEffect, useMemo } from 'react';
import type { MouseEvent } from 'react';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import { institutionApi, utils, DescripcionInstitucion } from '@/lib/api';

interface NavItem {
  name: string;
  href?: string;
  children?: NavItem[];
}

const navStructure: NavItem[] = [
  { name: 'Inicio', href: '/' },
  {
    name: 'Carrera',
    children: [
      { name: 'Nosotros', href: '/nosotros' },
    ]
  },
  {
    name: 'Convocatorias',
    children: [
      { name: 'Convocatorias', href: '/convocatorias' },
      { name: 'Comunicados', href: '/comunicados' },
      { name: 'Avisos', href: '/avisos' }
    ]
  },
  {
    name: 'Cursos',
    children: [
      { name: 'Cursos', href: '/cursos' },
      { name: 'Seminarios', href: '/seminarios' }
    ]
  },
  {
    name: 'Más',
    children: [
      { name: 'Servicios', href: '/servicios' },
      { name: 'Ofertas Académicas', href: '/ofertas' },
      { name: 'Publicaciones', href: '/publicaciones' },
      { name: 'Gacetas', href: '/gacetas' },
      { name: 'Eventos', href: '/eventos' },
      { name: 'Videos', href: '/videos' }
    ]
  },
  { name: 'Contactos', href: '/contacto' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [institucion, setInstitucion] = useState<DescripcionInstitucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [autoRotate, setAutoRotate] = useState(0);

  useEffect(() => {
    setIsMounted(true);

    let animationFrameId: number;

    const animate = () => {
      setAutoRotate(prev => (prev + 0.25) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const fetchData = async () => {
      try {
        const data = await institutionApi.getCurrentPrincipal();
        setInstitucion(data);

        if (data.colorinstitucion?.[0]) {
          const colors = data.colorinstitucion[0];

          document.documentElement.style.setProperty('--color-primario', colors.color_primario);
          document.documentElement.style.setProperty('--color-secundario', colors.color_secundario);
          document.documentElement.style.setProperty('--color-terciario', colors.color_terciario);

          const primarioRgb = hexToRgb(colors.color_primario);
          const secundarioRgb = hexToRgb(colors.color_secundario);

          document.documentElement.style.setProperty('--color-primario-rgb', primarioRgb);
          document.documentElement.style.setProperty('--color-secundario-rgb', secundarioRgb);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xRotation = ((y - rect.height / 2) / rect.height) * -18;
    const yRotation = ((x - rect.width / 2) / rect.width) * 18;

    setRotateX(xRotation);
    setRotateY(yRotation);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const logoUrl = institucion ? utils.buildImageUrl(institucion.institucion_logo) : '';

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 166, 81';
  }

  const particlePositions = useMemo(
    () =>
      isMounted
        ? Array.from({ length: 8 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${8 + Math.random() * 8}s`,
            delay: `${Math.random() * 5}s`,
            size: `${2 + Math.random() * 3}px`,
          }))
        : Array.from({ length: 8 }).map(() => ({
            left: '0%',
            top: '0%',
            duration: '10s',
            delay: '0s',
            size: '2px',
          })),
    [isMounted]
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">

      <div className="absolute inset-0 navbar-aurora-bg" />
      <div className="absolute inset-0 navbar-tech-grid" />
 
      <div className="absolute top-0 left-0 right-0 h-[2px] navbar-energy-line" />
 
      <span className="navbar-glitch-strip strip-one" />
      <span className="navbar-glitch-strip strip-two" />

      <div className="relative z-10 container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
 
          <div
            className="flex items-center gap-4 cursor-pointer group min-w-0"
            onClick={() => scrollToSection('inicio')}
          >
            {loading ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 animate-pulse border border-white/10" />
            ) : (
              <div
                className="logo-3d-container relative shrink-0"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + autoRotate}deg)`,
                  transition: rotateX === 0 && rotateY === 0 ? 'transform 0.25s ease-out' : 'transform 0.08s ease-out',
                }}
              >
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ backgroundColor: 'var(--color-primario)' }}
                />

                <div className="navbar-logo-card relative w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-3xl border border-white/15 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-white/20 via-transparent to-transparent" />

                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo Institución"
                      className="relative z-10 w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  ) : (
                    <div className="relative z-10 w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-black text-[var(--color-primario)]">
                      IC
                    </div>
                  )}
                </div>

                <div
                  className="absolute -inset-2 rounded-3xl border border-dashed opacity-70 pointer-events-none navbar-logo-orbit"
                  style={{ borderColor: 'var(--color-terciario)' }}
                />

                <div
                  className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-slate-950"
                  style={{
                    backgroundColor: 'var(--color-primario)',
                    boxShadow: '0 0 18px var(--color-primario)',
                  }}
                />
              </div>
            )}

            <div className="hidden lg:block min-w-0">

              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-8 h-px"
                  style={{ backgroundColor: 'var(--color-primario)' }}
                />

                <p className="text-xs xl:text-sm font-bold tracking-[0.28em] uppercase text-[var(--color-primario)]">
                  {institucion?.institucion_iniciales || 'UPEA'}
                </p>
              </div>
            </div>
          </div> 

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl px-2 py-2 shadow-2xl shadow-black/20">
            {navStructure.map((item) => (
              <div
                key={item.name}
                className="relative group/nav"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => item.children && setActiveDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`navbar-link-shine relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-full transition-all overflow-hidden ${
                        activeDropdown === item.name
                          ? 'text-white bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <ChevronDown
                        className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180 text-[var(--color-primario)]' : ''
                        }`}
                      />
                    </button>

                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200 min-w-[230px]">
                      <div className="navbar-dropdown-card overflow-hidden py-2">
                        {item.children.map((child) => (
                          <div key={child.name} className="relative group/nested">
                            {child.children ? (
                              <>
                                <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[var(--color-primario)]/10 cursor-pointer transition-colors">
                                  {child.name}
                                  <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                                </div>

                                <div className="absolute left-full top-0 ml-2 opacity-0 invisible translate-x-2 group-hover/nested:opacity-100 group-hover/nested:visible group-hover/nested:translate-x-0 transition-all duration-200 min-w-[190px]">
                                  <div className="navbar-dropdown-card overflow-hidden py-2">
                                    {child.children.map((sub) => (
                                      <a
                                        key={sub.name}
                                        href={sub.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-slate-300 hover:text-[var(--color-primario)] hover:bg-[var(--color-primario)]/10 transition-colors"
                                      >
                                        {sub.name}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <a
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className="group/item flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[var(--color-primario)]/10 transition-colors"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full opacity-40 group-hover/item:opacity-100 transition-opacity"
                                  style={{ backgroundColor: 'var(--color-primario)' }}
                                />
                                <span>{child.name}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="navbar-link-shine relative block px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition-all overflow-hidden"
                  >
                    <span className="relative z-10">{item.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">

            <a
              href="/enlaces"
              onClick={() => setIsOpen(false)}
              className="relative overflow-hidden px-4 py-2.5 text-sm font-bold text-[var(--color-primario)] border border-[var(--color-primario)]/40 rounded-full hover:bg-[var(--color-primario)]/10 transition-all hover:shadow-[0_0_24px_rgba(var(--color-primario-rgb,0,166,81),0.28)]"
            >
              Enlaces
            </a>

            <a
              href="https://servicioadministrador.upea.bo/sign-in"
              target="_blank"
              rel="noopener noreferrer"
              className="group/login relative flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--color-primario), var(--color-secundario))',
                color: '#020617',
                boxShadow: '0 0 28px rgba(var(--color-primario-rgb,0,166,81),0.35)',
              }}
            >
              <span className="absolute inset-0 translate-x-[-120%] group-hover/login:translate-x-[120%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              <LogIn className="relative z-10 w-4 h-4" />
              <span className="relative z-10">Iniciar Sesión</span>
            </a>
          </div>
 
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative p-3 rounded-2xl text-slate-200 border border-white/10 bg-white/[0.06] backdrop-blur-xl hover:text-[var(--color-primario)] hover:border-[var(--color-primario)]/40 transition-all"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
 
        {isOpen && (
          <div className="lg:hidden navbar-mobile-panel relative mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-black/40">
            <div className="absolute inset-0 navbar-tech-grid opacity-40" />

            <div className="relative z-10 p-4 space-y-2">
              {navStructure.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-2xl transition-colors"
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            activeDropdown === item.name ? 'rotate-180 text-[var(--color-primario)]' : ''
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeDropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="ml-4 pl-4 border-l border-[var(--color-primario)]/35 space-y-1 py-2">
                          {item.children.map((child) => (
                            <div key={child.name}>
                              {child.children ? (
                                <>
                                  <button
                                    onClick={() => toggleDropdown(child.name)}
                                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-slate-400 hover:text-[var(--color-primario)] rounded-xl hover:bg-[var(--color-primario)]/10 transition-colors"
                                  >
                                    {child.name}
                                    <ChevronDown
                                      className={`w-4 h-4 transition-transform duration-300 ${
                                        activeDropdown === child.name ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>

                                  <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                      activeDropdown === child.name ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                  >
                                    <div className="pl-4 space-y-1 py-1">
                                      {child.children.map((sub) => (
                                        <a
                                          key={sub.name}
                                          href={sub.href}
                                          onClick={() => setIsOpen(false)}
                                          className="block px-3 py-2 text-xs text-slate-500 hover:text-[var(--color-primario)] hover:bg-[var(--color-primario)]/5 rounded-xl transition-colors"
                                        >
                                          {sub.name}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <a
                                  href={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-[var(--color-primario)] hover:bg-[var(--color-primario)]/10 rounded-xl transition-colors"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                  />
                                  {child.name}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-base font-bold text-slate-200 hover:text-white hover:bg-white/5 rounded-2xl transition-colors"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-[var(--color-primario)]/25 mt-4 space-y-3">
                <a
                  href="/enlaces"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-black text-[var(--color-primario)] border border-[var(--color-primario)]/40 rounded-2xl hover:bg-[var(--color-primario)]/10 transition-colors"
                >
                  Enlaces
                </a>

                <a
                  href="https://servicioadministrador.upea.bo/sign-in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl font-black text-sm transition-all hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primario), var(--color-secundario))',
                    color: '#020617',
                  }}
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
 
      {isMounted && (
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute rounded-full navbar-electric-particle"
              style={{
                width: pos.size,
                height: pos.size,
                left: pos.left,
                top: pos.top,
                animationDuration: pos.duration,
                animationDelay: pos.delay,
              }}
            />
          ))}
        </div>
      )}
    </nav>
  );
}