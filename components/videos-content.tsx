'use client';

import { useState, useEffect } from 'react';
import { Play, FileText, ExternalLink, TrendingUp, Award, Users, Briefcase, Calendar } from 'lucide-react';
import { api, Video } from '@/lib/api';

interface VideosContentProps { colors: { primario: string; secundario: string; terciario: string; }; }

export default function VideosContent({ colors }: VideosContentProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ 
    convocatorias: 0, comunicados: 0, avisos: 0, seminarios: 0, 
    cursos: 0, servicios: 0, ofertas: 0, publicaciones: 0, 
    gacetas: 0, eventos: 0, videos: 0, enlaces: 0 
  });

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [eventsData, resourcesData, contentData] = await Promise.all([
          api.events.getAll(), 
          api.resources.getAll(), 
          api.content.getAll()
        ]);
        setVideos(contentData.upea_videos || []);
        setCounts({
          convocatorias: (eventsData.convocatorias || []).length,
          comunicados: (eventsData.convocatorias || []).filter((c: any) => 
            c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase().includes('comunicado')).length,
          avisos: (eventsData.convocatorias || []).filter((c: any) => 
            c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase().includes('aviso')).length,
          seminarios: (eventsData.cursos || []).filter((c: any) => 
            c.tipo_curso_otro?.tipo_conv_curso_nombre?.toLowerCase().includes('seminario')).length,
          cursos: (eventsData.cursos || []).length,
          servicios: (eventsData.serviciosCarrera || []).length,
          ofertas: (eventsData.ofertasAcademicas || []).length,
          publicaciones: (resourcesData.upea_publicaciones || []).length,
          gacetas: (eventsData.upea_gaceta_universitaria || []).length,
          eventos: (eventsData.upea_evento || []).length,
          videos: (contentData.upea_videos || []).length,
          enlaces: (resourcesData.linksExternoInterno || []).length,
        });
      } catch (error) { 
        console.error('Error:', error); 
      } finally { 
        setLoading(false); 
      }
    };
    cargarTodo();
  }, []);

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].split('&')[0].split('?')[0];
      }
    }
    return null;
  };

  const categoriesData = [
    { name: 'Convocatorias', count: counts.convocatorias, href: '/convocatorias', icon: FileText },
    { name: 'Comunicados', count: counts.comunicados, href: '/comunicados', icon: FileText },
    { name: 'Avisos', count: counts.avisos, href: '/avisos', icon: FileText },
    { name: 'Seminarios', count: counts.seminarios, href: '/seminarios', icon: TrendingUp },
    { name: 'Cursos', count: counts.cursos, href: '/cursos', icon: Award },
    { name: 'Servicios', count: counts.servicios, href: '/servicios', icon: Briefcase },
    { name: 'Ofertas Académicas', count: counts.ofertas, href: '/ofertas', icon: Award },
    { name: 'Publicaciones', count: counts.publicaciones, href: '/publicaciones', icon: FileText },
    { name: 'Gaceta', count: counts.gacetas, href: '/gacetas', icon: FileText },
    { name: 'Eventos', count: counts.eventos, href: '/eventos', icon: Calendar },
    { name: 'Videos', count: counts.videos, href: '/videos', icon: TrendingUp },
    { name: 'Enlaces', count: counts.enlaces, href: '/enlaces', icon: ExternalLink },
  ].filter(cat => cat.count > 0);

  if (loading) {
    return (
      <section className="py-24 bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>
          Cargando videos...
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
      
      {/* ✅ SIN MODAL - Videos se abren en YouTube (nueva pestaña) */}

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          <div className="lg:col-span-3 space-y-8">
            {videos.length === 0 ? (
              <div className="tech-card p-16 text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: colors.primario }} />
                <h3 className="text-2xl font-bold text-white mb-2">No hay videos disponibles</h3>
                <p className="text-slate-400">Pronto subiremos nuevo contenido</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                  const videoId = getYouTubeId(video.video_enlace);
                  
                  return (
                    <div 
                      key={video.video_id} 
                      className="tech-card overflow-hidden hover:scale-[1.02] transition-transform group"
                      style={{ borderColor: `${colors.primario}30` }}
                    >
                      {/* Miniatura - Click para abrir en YouTube */}
                      <div 
                        className="relative aspect-video cursor-pointer"
                        onClick={() => {
                          // ✅ Abrir video en nueva pestaña
                          if (video.video_enlace) {
                            window.open(video.video_enlace, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        {videoId ? (
                          <>
                            <img 
                              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                              alt={video.video_titulo} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <Play className="w-12 h-12 opacity-30" style={{ color: colors.primario }} />
                          </div>
                        )}
                        
                        {/* Botón con ícono de enlace externo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border-4 border-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all shadow-lg">
                            <ExternalLink className="w-7 h-7 text-slate-900" />
                          </div>
                        </div>
                        
                        {/* Badge "Ver en YouTube" */}
                        <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-red-600 text-white text-xs font-medium flex items-center gap-1">
                          <Play className="w-3 h-3" fill="white" /> YouTube
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 group-hover:text-emerald-300 transition-colors">
                          {video.video_titulo}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {video.video_breve_descripcion}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="text-center pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-300 tracking-wider">CATEGORÍAS</h3>
              </div>
              <div className="space-y-3">
                {categoriesData.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <a 
                      key={cat.name} 
                      href={cat.href} 
                      className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group hover:scale-105"
                      style={{ borderColor: `${colors.primario}20`, backgroundColor: `${colors.primario}05` }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: colors.primario }} />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">{cat.name}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: colors.primario }}>
                        {cat.count}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}