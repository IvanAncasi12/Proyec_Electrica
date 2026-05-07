'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Youtube, Twitter, Send, Navigation, Loader2 } from 'lucide-react';
import { api, DescripcionInstitucion } from '@/lib/api';

export default function Contactos() {
  const [institucion, setInstitucion] = useState<DescripcionInstitucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState({ primario: '#10b981', secundario: '#f59e0b', terciario: '#06b6d4' });

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await api.institution.getCurrentPrincipal();
        setInstitucion(data);
        
        if (data.colorinstitucion?.[0]) {
          const c = data.colorinstitucion[0];
          setColors({
            primario: c.color_primario,
            secundario: c.color_secundario,
            terciario: c.color_terciario
          });
          
          document.documentElement.style.setProperty('--color-primario', c.color_primario);
          document.documentElement.style.setProperty('--color-secundario', c.color_secundario);
          document.documentElement.style.setProperty('--color-terciario', c.color_terciario);
        }
      } catch (error) {
        console.error('Error cargando contactos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl font-semibold animate-pulse" style={{ color: colors.primario }}>
          <Loader2 className="w-6 h-6 animate-spin" /> Cargando información de contacto...
        </div>
      </section>
    );
  }
 
  const formatPhone = (phone: number | string | null) => {
    if (!phone) return null;
    return String(phone).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  return (
    <section id="contacto" className="py-24 px-4 relative overflow-hidden bg-slate-950/90">
       
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${colors.primario}10` }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `${colors.terciario}10` }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
         
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-6xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            Contáctanos
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Estamos aquí para resolver tus dudas. Visítanos, llámanos o escríbenos directamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
           
          <div className="lg:col-span-3 space-y-6">
          
            {institucion?.institucion_direccion && (
              <InfoCard icon={MapPin} title="Dirección" value={institucion.institucion_direccion} color={colors.primario} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
              {institucion?.institucion_telefono1 && (
                <InfoCard icon={Phone} title="Teléfono Fijo" value={formatPhone(institucion.institucion_telefono1)} color={colors.secundario} isLink href={`tel:${institucion.institucion_telefono1}`} />
              )}
              {institucion?.institucion_celular1 && (
                <InfoCard icon={Phone} title="Celular / WhatsApp" value={formatPhone(institucion.institucion_celular1)} color={colors.secundario} isLink href={`tel:${institucion.institucion_celular1}`} />
              )}
            </div>
 
            {(institucion?.institucion_correo1 || institucion?.institucion_correo2) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institucion.institucion_correo1 && (
                  <InfoCard icon={Mail} title="Correo Principal" value={institucion.institucion_correo1} color={colors.terciario} isLink href={`mailto:${institucion.institucion_correo1}`} />
                )}
                {institucion.institucion_correo2 && (
                  <InfoCard icon={Mail} title="Correo Secundario" value={institucion.institucion_correo2} color={colors.terciario} isLink href={`mailto:${institucion.institucion_correo2}`} />
                )}
              </div>
            )}
 
            <div className="tech-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.primario }}>
                <Send className="w-5 h-5" /> Síguenos en redes
              </h3>
              <div className="flex gap-4 flex-wrap">
                {institucion?.institucion_facebook && (
                  <SocialLink icon={Facebook} url={institucion.institucion_facebook} label="Facebook" color={colors.primario} />
                )}
                {institucion?.institucion_youtube && (
                  <SocialLink icon={Youtube} url={institucion.institucion_youtube} label="YouTube" color="#FF0000" />
                )}
                {institucion?.institucion_twitter && (
                  <SocialLink icon={Twitter} url={institucion.institucion_twitter} label="Twitter" color={colors.terciario} />
                )}
              </div>
            </div>
          </div>
 
          <div className="lg:col-span-2 space-y-6">
             
            <div className="tech-card p-2 overflow-hidden rounded-2xl shadow-2xl">
              {institucion?.institucion_api_google_map ? (
                <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden">
                  <iframe
                    src={institucion.institucion_api_google_map}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center bg-slate-800 rounded-xl text-center p-6">
                  <MapPin className="w-12 h-12 mb-3 opacity-40" style={{ color: colors.primario }} />
                  <p className="text-slate-400">Ubicación no disponible en mapa</p>
                </div>
              )}
            </div>
             
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(institucion?.institucion_direccion || 'Ingeniería Civil UPEA')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full py-4 rounded-xl font-semibold text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`, 
                color: '#020617',
                boxShadow: `0 10px 30px ${colors.primario}40`
              }}
            >
              <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
              Abrir en Google Maps
            </a>
 
            <div className="tech-card p-5 flex items-center gap-4">
              <Clock className="w-8 h-8 shrink-0" style={{ color: colors.secundario }} />
              <div>
                <h4 className="font-semibold text-white">Horario de Atención</h4>
                <p className="text-sm text-slate-400">Lunes a Viernes: 8:00 - 18:00</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
 

function InfoCard({ icon: Icon, title, value, color, isLink, href }: any) {
  if (!value) return null;
  
  const content = (
    <div className="tech-card p-5 flex items-start gap-4 group hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className="p-3 rounded-xl shrink-0 transition-colors" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{title}</h3>
        <p className="text-base md:text-lg text-white font-medium truncate" title={String(value)}>
          {value}
        </p>
      </div>
    </div>
  );

  return isLink ? (
    <a href={href} className="block hover:bg-white/5 rounded-xl transition-colors">
      {content}
    </a>
  ) : content;
}

function SocialLink({ icon: Icon, url, label, color }: any) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={label}
      className="p-3 rounded-xl border transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
      style={{ 
        borderColor: `${color}40`, 
        backgroundColor: `${color}10`, 
        color 
      }}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}