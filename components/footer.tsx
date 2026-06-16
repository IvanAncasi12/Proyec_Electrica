'use client';

import { useState, useEffect } from 'react';
import { 
  Facebook, Twitter, Youtube, Phone, Mail, MapPin, 
  ArrowUp, ChevronRight, GraduationCap 
} from 'lucide-react';
import { api, utils } from '@/lib/api';

// Enlaces rápidos del sitio
const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Sobre Nosotros', href: '#about' },
  { name: 'Ofertas Académicas', href: '#projects' },
  { name: 'Autoridades', href: '#team' },
  { name: 'Contacto', href: '#contacto' }
];

export default function Footer() {
  const [institucion, setInstitucion] = useState<any>(null);
  const [colors, setColors] = useState({ 
    primario: '#10b981', 
    secundario: '#f59e0b', 
    terciario: '#06b6d4' 
  });

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
        }
      } catch (error) {
        console.error('Error cargando footer:', error);
      }
    };
    cargar();
  }, []);

  const hexToRgba = (hex: string, alpha: number) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!institucion) return null;

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 pt-16 pb-8 overflow-hidden">
       
      <div className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${colors.primario} 1px, transparent 1px), linear-gradient(90deg, ${colors.primario} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
           
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {institucion.institucion_logo && (
                <img 
                  src={utils.buildImageUrl(institucion.institucion_logo)} 
                  alt="Logo" 
                  className="w-10 h-10 object-contain"
                />
              )}
              <h3 className="text-xl font-bold text-white">{institucion.institucion_iniciales || 'UPEA'}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Formando profesionales de excelencia, comprometidos con el desarrollo sostenible y la innovación tecnológica de Bolivia.
            </p>
             
            <div className="flex gap-3 pt-2">
              {institucion.institucion_facebook && (
                <SocialIcon icon={Facebook} url={institucion.institucion_facebook} color={colors.primario} />
              )}
              {institucion.institucion_youtube && (
                <SocialIcon icon={Youtube} url={institucion.institucion_youtube} color="#FF0000" />
              )}
              {institucion.institucion_twitter && (
                <SocialIcon icon={Twitter} url={institucion.institucion_twitter} color={colors.terciario} />
              )}
            </div>
          </div>
 
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5" style={{ color: colors.primario }} />
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: colors.primario }} />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
 
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contacto</h4>
            <ul className="space-y-3">
              {institucion.institucion_direccion && (
                <ContactItem icon={MapPin} text={institucion.institucion_direccion} color={colors.primario} />
              )}
              {institucion.institucion_telefono1 && (
                <ContactItem 
                  icon={Phone} 
                  text={String(institucion.institucion_telefono1).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')} 
                  color={colors.secundario}
                  href={`tel:${institucion.institucion_telefono1}`}
                />
              )}
              {institucion.institucion_correo1 && (
                <ContactItem 
                  icon={Mail} 
                  text={institucion.institucion_correo1} 
                  color={colors.terciario}
                  href={`mailto:${institucion.institucion_correo1}`}
                />
              )}
            </ul>
          </div>
 
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Horario de Atención</h4>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <p className="text-slate-300 text-sm font-medium">Lunes a Viernes</p>
              <p className="text-2xl font-bold mt-1" style={{ color: colors.primario }}>08:00 - 18:00</p>
              <p className="text-slate-500 text-xs mt-2">Atención presencial y virtual</p>
            </div>
         
            <button 
              onClick={scrollToTop}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] mt-4"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
                color: '#020617'
              }}
            >
              <ArrowUp className="w-4 h-4" /> Volver al Inicio
            </button>
          </div>

        </div>
 
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6" />
 
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} <span style={{ color: colors.primario }}>{institucion.institucion_nombre}</span>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://utic.upea.bo/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img
                src="/LOGOUTIC.png"
                alt="U-TIC"
                className="w-10 h-10 rounded-full object-cover border border-slate-700 hover:scale-110 transition-transform duration-300"
              />
            </a>

            <p className="flex items-center gap-1 text-slate-500">
              IAT U - TIC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
 

function SocialIcon({ icon: Icon, url, color }: { icon: any; url: string; color: string }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2.5 rounded-lg border border-slate-800 hover:border-slate-600 hover:bg-slate-900 transition-all hover:-translate-y-1"
      style={{ color }}
      aria-label="Red social"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

function ContactItem({ icon: Icon, text, color, href }: { icon: any; text: string; color: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3 text-sm text-slate-400 hover:text-slate-200 transition-colors">
      <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color }} />
      <span className="leading-relaxed">{text}</span>
    </div>
  );

  return href ? (
    <a href={href} className="block group">{content}</a>
  ) : (
    <li>{content}</li>
  );
}