'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Youtube,
  Twitter,
  Send,
  Navigation,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import PageHero from '@/components/page-hero';

export default function ContactoPage() {
  const [institucion, setInstitucion] = useState<any>(null);
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

        setInstitucion(instData);

        if (instData.colorinstitucion?.[0]) {
          const c = instData.colorinstitucion[0];

          setColors({
            primario: c.color_primario || '#10b981',
            secundario: c.color_secundario || '#f59e0b',
            terciario: c.color_terciario || '#06b6d4',
          });
        }
      } catch (error) {
        console.error('Error cargando contacto:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div
          className="flex items-center gap-3 text-xl font-semibold animate-pulse"
          style={{ color: colors.primario }}
        >
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando información de contacto...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <PageHero
        title="Contáctanos"
        breadcrumb="Contacto"
        colors={colors}
      />

      <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-8">
                Información de Contacto
              </h2>

              {institucion?.institucion_direccion && (
                <ContactCard
                  icon={MapPin}
                  title="Nuestra Dirección"
                  value={institucion.institucion_direccion}
                  color={colors.primario}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institucion?.institucion_telefono1 && (
                  <ContactCard
                    icon={Phone}
                    title="Teléfono"
                    value={String(institucion.institucion_telefono1).replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      '$1-$2-$3'
                    )}
                    color={colors.secundario}
                    href={`tel:${institucion.institucion_telefono1}`}
                  />
                )}

                {institucion?.institucion_celular1 && (
                  <ContactCard
                    icon={Phone}
                    title="Celular / WhatsApp"
                    value={String(institucion.institucion_celular1).replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      '$1-$2-$3'
                    )}
                    color={colors.secundario}
                    href={`tel:${institucion.institucion_celular1}`}
                  />
                )}
              </div>

              {(institucion?.institucion_correo1 ||
                institucion?.institucion_correo2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {institucion.institucion_correo1 && (
                    <ContactCard
                      icon={Mail}
                      title="Correo Principal"
                      value={institucion.institucion_correo1}
                      color={colors.terciario}
                      href={`mailto:${institucion.institucion_correo1}`}
                    />
                  )}

                  {institucion.institucion_correo2 && (
                    <ContactCard
                      icon={Mail}
                      title="Correo Secundario"
                      value={institucion.institucion_correo2}
                      color={colors.terciario}
                      href={`mailto:${institucion.institucion_correo2}`}
                    />
                  )}
                </div>
              )}

              <div className="tech-card p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Send
                    className="w-5 h-5"
                    style={{ color: colors.primario }}
                  />
                  Síguenos en redes
                </h3>

                <div className="flex gap-4">
                  {institucion?.institucion_facebook && (
                    <SocialIcon
                      icon={Facebook}
                      url={institucion.institucion_facebook}
                      color={colors.primario}
                    />
                  )}

                  {institucion?.institucion_youtube && (
                    <SocialIcon
                      icon={Youtube}
                      url={institucion.institucion_youtube}
                      color="#FF0000"
                    />
                  )}

                  {institucion?.institucion_twitter && (
                    <SocialIcon
                      icon={Twitter}
                      url={institucion.institucion_twitter}
                      color={colors.terciario}
                    />
                  )}
                </div>
              </div>

              <div className="tech-card p-6 flex items-center gap-4 mt-4">
                <Clock
                  className="w-8 h-8 shrink-0"
                  style={{ color: colors.secundario }}
                />

                <div>
                  <h4 className="font-semibold text-white">
                    Horario de Atención
                  </h4>
                  <p className="text-sm text-slate-400">
                    Lunes a Viernes: 08:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="h-full min-h-[500px] flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-white">
                Ubicación
              </h2>

              <div className="tech-card p-2 flex-1 rounded-2xl overflow-hidden shadow-2xl relative bg-slate-900">
                {institucion?.institucion_api_google_map ? (
                  <iframe
                    src={institucion.institucion_api_google_map}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '450px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10">
                    <MapPin
                      className="w-16 h-16 mb-4 opacity-30"
                      style={{ color: colors.primario }}
                    />

                    <p className="text-slate-400 text-lg mb-4">
                      No hay mapa disponible
                    </p>

                    <p className="text-slate-500">
                      {institucion?.institucion_direccion}
                    </p>
                  </div>
                )}
              </div>

              {institucion?.institucion_direccion && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    institucion.institucion_direccion
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-semibold text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
                    color: '#020617',
                    boxShadow: `0 10px 30px ${colors.primario}40`,
                  }}
                >
                  <Navigation className="w-5 h-5" />
                  Cómo llegar desde Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactCard({ icon: Icon, title, value, color, href }: any) {
  const content = (
    <div className="tech-card p-6 flex items-start gap-4 group hover:-translate-y-1 transition-all duration-300">
      <div
        className="p-3 rounded-xl shrink-0 transition-colors"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon
          className="w-6 h-6 transition-transform group-hover:scale-110"
          style={{ color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
          {title}
        </h3>

        <p
          className="text-base md:text-lg text-white font-medium truncate"
          title={String(value)}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block hover:bg-white/5 rounded-xl transition-colors">
      {content}
    </a>
  ) : (
    content
  );
}

function SocialIcon({
  icon: Icon,
  url,
  color,
}: {
  icon: any;
  url: string;
  color: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-slate-900 transition-all hover:-translate-y-1"
      style={{ color }}
      aria-label="Red social"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}