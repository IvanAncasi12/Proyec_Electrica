'use client';

import { useState, useEffect } from 'react';
import { Target, Eye, BookOpen, Award, TrendingUp, Users } from 'lucide-react';
import { api, DescripcionInstitucion } from '@/lib/api';
 
const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function About() {
  const [institucion, setInstitucion] = useState<DescripcionInstitucion | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mision' | 'vision'>('mision');
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
          
          document.documentElement.style.setProperty('--color-primario', c.color_primario);
          document.documentElement.style.setProperty('--color-secundario', c.color_secundario);
          document.documentElement.style.setProperty('--color-terciario', c.color_terciario);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>
          Cargando información...
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-24 overflow-hidden bg-slate-950/90">
       
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: hexToRgba(colors.primario, 0.15) }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: hexToRgba(colors.terciario, 0.15) }} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
         
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl lg:text-6xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            {institucion?.institucion_nombre}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full"
            style={{ background: `linear-gradient(90deg, ${colors.primario}, ${colors.terciario})` }} />
        </div>
 
        <div className="mb-24">
          <div className="tech-card p-8 lg:p-12 border-l-4" style={{ borderLeftColor: colors.primario }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(colors.primario, 0.15) }}>
                <Award className="w-8 h-8" style={{ color: colors.primario }} />
              </div>
              <h3 className="text-3xl font-bold" style={{ color: colors.primario }}>Perfil Profesional</h3>
            </div>
            <div className="text-slate-300 leading-relaxed space-y-4 text-lg content-html"
              dangerouslySetInnerHTML={{ __html: institucion?.institucion_objetivos || '' }} />
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="tech-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" style={{ color: colors.terciario }} />
              <h3 className="text-2xl font-bold text-white">Nuestra Historia</h3>
            </div>
            <div className="text-slate-400 leading-relaxed content-html"
              dangerouslySetInnerHTML={{ __html: institucion?.institucion_historia || '' }} />
          </div>

          <div className="space-y-6">
            <div className="flex gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
              {[
                { id: 'mision', label: 'Misión', icon: Target },
                { id: 'vision', label: 'Visión', icon: Eye }
              ].map(tab => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id ? 'shadow-lg scale-105' : 'opacity-70 hover:opacity-100 hover:bg-slate-800'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? colors.primario : 'transparent',
                    color: activeTab === tab.id ? '#020617' : colors.primario
                  }}>
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tech-card p-8 min-h-[300px]">
              {activeTab === 'mision' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: colors.primario }}>
                    <Target className="w-6 h-6" /> Misión
                  </h3>
                  <div className="text-slate-300 leading-relaxed content-html"
                    dangerouslySetInnerHTML={{ __html: institucion?.institucion_mision || '' }} />
                </div>
              )}
              {activeTab === 'vision' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: colors.terciario }}>
                    <Eye className="w-6 h-6" /> Visión
                  </h3>
                  <div className="text-slate-300 leading-relaxed content-html"
                    dangerouslySetInnerHTML={{ __html: institucion?.institucion_vision || '' }} />
                </div>
              )}
            </div>
          </div>
        </div>
 
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
          {[
            { label: 'Años de Trayectoria', value: '+43', icon: Award },
            { label: 'Egresados', value: '5000+', icon: Users },
            { label: 'Proyectos', value: '200+', icon: TrendingUp },
            { label: 'Especialidades', value: '5', icon: BookOpen }
          ].map((stat, idx) => (
            <div key={idx} className="tech-card p-6 text-center group hover:-translate-y-2 transition-transform">
              <stat.icon className="w-8 h-8 mx-auto mb-3 transition-colors" style={{ color: colors.primario }} />
              <div className="text-3xl font-bold text-white mb-1" style={{ color: colors.primario }}>{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
 
        <VideoSection colors={colors} institucion={institucion} />

      </div>
    </section>
  );
}
 
// ============================================
// COMPONENTE DE VIDEO - CORREGIDO
// ============================================

function VideoSection({ colors, institucion }: { colors: any, institucion: DescripcionInstitucion | null }) {
  const videoUrl = institucion?.institucion_link_video_vision;

  if (!videoUrl) return null;
 
  const getYouTubeId = (url: string) => {
    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) return null;

  return (
    <div className="mt-24">
      <div className="text-center mb-12 space-y-4">
        <h3 className="text-3xl lg:text-4xl font-bold" style={{ color: colors.primario }}>
          Nuestra Visión en Acción
        </h3>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Descubre nuestro compromiso con la excelencia y la innovación
        </p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 tech-card">
          <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`}
              title="Video Institucional"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
            />
        </div>
 
        <div className="absolute -inset-4 rounded-3xl opacity-20 blur-xl -z-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.primario} 0%, transparent 70%)` }} />
      </div>
    </div>
  );
}