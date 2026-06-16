'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, Briefcase, Target, Eye, Users, Award, 
  TrendingUp, Building2, MapPin, ChevronRight,
  Calendar, FileText, Video, Link as LinkIcon
} from 'lucide-react';
import { api, utils, Autoridad } from '@/lib/api';

interface NosotrosContentProps {
  colors: { primario: string; secundario: string; terciario: string; };
}

export default function NosotrosContent({ colors }: NosotrosContentProps) {
  const [institucion, setInstitucion] = useState<any>(null);
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState(true);
   
  const [counts, setCounts] = useState({
    convocatorias: 0,
    comunicados: 0,
    avisos: 0,
    seminarios: 0,
    cursos: 0,
    servicios: 0,
    ofertas: 0,
    publicaciones: 0,
    gacetas: 0,
    eventos: 0,
    videos: 0,
    enlaces: 0,
  });

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [instData, contentData, eventsData, resourcesData] = await Promise.all([
          api.institution.getCurrentPrincipal(),
          api.content.getAll(),
          api.events.getAll(),
          api.resources.getAll()
        ]);
        
        setInstitucion(instData);
        setAutoridades(contentData.autoridad || []);
         
        setCounts({
          convocatorias: (eventsData.convocatorias || []).length,
          comunicados: 0,  
          avisos: 0,
          seminarios: (eventsData.cursos || []).filter((c: any) => 
            c.tipo_curso_otro?.tipo_conv_curso_nombre
              ?.toLowerCase()
              .includes('seminario')
          ).length,
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
        console.error('Error cargando conteos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, []);
 
  const categoriesData = [
    { name: 'Convocatorias', count: counts.convocatorias, href: '/convocatorias', icon: FileText },
    { name: 'Comunicados', count: counts.comunicados, href: '/comunicados', icon: FileText },
    { name: 'Avisos', count: counts.avisos, href: '/avisos', icon: FileText },
    { name: 'Seminarios', count: counts.seminarios, href: '/seminarios', icon: Video },
    { name: 'Cursos', count: counts.cursos, href: '/cursos', icon: BookOpen },
    { name: 'Servicios', count: counts.servicios, href: '/servicios', icon: Briefcase },
    { name: 'Ofertas Académicas', count: counts.ofertas, href: '/ofertas', icon: Award },
    { name: 'Publicaciones', count: counts.publicaciones, href: '/publicaciones', icon: FileText },
    { name: 'Gaceta', count: counts.gacetas, href: '/gacetas', icon: FileText },
    { name: 'Eventos', count: counts.eventos, href: '/eventos', icon: Calendar },
    { name: 'Videos', count: counts.videos, href: '/videos', icon: Video },
    { name: 'Enlaces', count: counts.enlaces, href: '/enlaces', icon: LinkIcon },
  ].filter(cat => cat.count > 0);

  if (loading) {
    return (
      <section className="py-24 bg-slate-950 min-h-screen flex items-center justify-center">
        <div
          className="text-2xl font-semibold animate-pulse"
          style={{ color: colors.primario }}
        >
          Cargando...
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          <div className="lg:col-span-3 space-y-16">
            
            <div className="tech-card p-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.primario}20` }}
                >
                  <BookOpen className="w-8 h-8" style={{ color: colors.primario }} />
                </div>

                <h3
                  className="text-3xl font-bold"
                  style={{ color: colors.primario }}
                >
                  Perfil Profesional
                </h3>
              </div>

              <div
                className="text-slate-300 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{
                  __html: institucion?.institucion_objetivos || '',
                }}
              />
            </div>
 
            <div className="tech-card p-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.secundario}20` }}
                >
                  <Briefcase className="w-8 h-8" style={{ color: colors.secundario }} />
                </div>

                <h3
                  className="text-3xl lg:text-4xl font-black tracking-tight drop-shadow-lg"
                  style={{
                    color: colors.secundario,
                    textShadow: `0 0 18px ${colors.secundario}66`,
                  }}
                >
                  Campo de Trabajo
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Building2,
                    title: 'Sistemas de Potencia',
                    desc: 'Diseño, análisis, operación y mantenimiento de redes eléctricas, subestaciones, líneas de transmisión y distribución de energía.'
                  },
                  {
                    icon: Target,
                    title: 'Instalaciones Eléctricas',
                    desc: 'Diseño, supervisión y ejecución de instalaciones eléctricas residenciales, comerciales e industriales, aplicando normas de seguridad y eficiencia.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Energías Renovables',
                    desc: 'Implementación de sistemas solares, eólicos, eficiencia energética y soluciones sostenibles para el aprovechamiento de recursos energéticos.'
                  },
                  {
                    icon: MapPin,
                    title: 'Automatización y Control',
                    desc: 'Aplicación de controladores, sensores, instrumentación y sistemas automatizados para procesos eléctricos e industriales.'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border hover:scale-105 transition-transform"
                    style={{
                      borderColor: `${colors.primario}30`,
                      backgroundColor: `${colors.primario}05`,
                    }}
                  >
                    <item.icon
                      className="w-8 h-8 mb-3"
                      style={{ color: colors.primario }}
                    />

                    <h4 className="font-bold text-white mb-2">
                      {item.title}
                    </h4>

                    <p className="text-sm text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="tech-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-7 h-7" style={{ color: colors.primario }} />

                  <h3
                    className="text-2xl font-bold"
                    style={{ color: colors.primario }}
                  >
                    Misión
                  </h3>
                </div>

                <div
                  className="text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: institucion?.institucion_mision || '',
                  }}
                />
              </div>

              <div className="tech-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-7 h-7" style={{ color: colors.primario }} />

                  <h3
                    className="text-2xl font-bold"
                    style={{ color: colors.primario }}
                  >
                    Visión
                  </h3>
                </div>

                <div
                  className="text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: institucion?.institucion_vision || '',
                  }}
                />
              </div>
            </div>
 
            <div className="w-full">
              <div
                className="flex items-center justify-center gap-4 mb-10 px-6 py-5 rounded-2xl border bg-slate-900/40"
                style={{
                  borderColor: `${colors.terciario}35`,
                  boxShadow: `0 0 32px ${colors.terciario}18`,
                }}
              >
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.terciario}20` }}
                >
                  <Users className="w-8 h-8" style={{ color: colors.terciario }} />
                </div>

                <h3
                  className="text-3xl lg:text-4xl font-black text-center tracking-tight drop-shadow-lg"
                  style={{
                    color: colors.terciario,
                    textShadow: `0 0 18px ${colors.terciario}66`,
                  }}
                >
                  Nuestras Autoridades
                </h3>
              </div>

              {autoridades.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {autoridades.map((aut) => (
                    <div 
                      key={aut.id_autoridad} 
                      className="group w-full max-w-sm p-8 rounded-2xl border bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
                      style={{ borderColor: `${colors.primario}20` }}
                    >
                     
                      <div
                        className="w-28 h-28 rounded-full overflow-hidden border-2 mb-5 shadow-xl group-hover:scale-105 transition-transform"
                        style={{ borderColor: colors.primario }}
                      >
                        {aut.foto_autoridad ? (
                          <img 
                            src={utils.buildImageUrl(aut.foto_autoridad)} 
                            alt={aut.nombre_autoridad || ''}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <Users className="w-12 h-12 text-slate-500" />
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-white text-lg leading-tight mb-2">
                        {aut.nombre_autoridad}
                      </h4>

                      <span
                        className="text-sm font-medium px-4 py-1.5 rounded-full mb-3"
                        style={{
                          color: colors.secundario,
                          backgroundColor: `${colors.secundario}10`,
                        }}
                      >
                        {aut.cargo_autoridad}
                      </span>

                      {aut.facebook_autoridad && (
                        <div className="flex justify-center gap-3 pt-4 border-t border-slate-800 mt-auto w-full">
                          <a
                            href={aut.facebook_autoridad}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-12">
                  No hay autoridades registradas
                </p>
              )}
            </div>

          </div>
 
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="text-center pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-300 tracking-wider">
                  CATEGORÍAS
                </h3>
              </div>

              <div className="space-y-3">
                {categoriesData.map((cat) => {
                  const Icon = cat.icon;

                  return (
                    <a
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group hover:scale-105"
                      style={{ 
                        borderColor: `${colors.primario}20`,
                        backgroundColor: `${colors.primario}05`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className="w-5 h-5 group-hover:scale-110 transition-transform"
                          style={{ color: colors.primario }}
                        />

                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                          {cat.name}
                        </span>
                      </div>

                      <span 
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: colors.secundario }}
                      >
                        {cat.count}
                      </span>
                    </a>
                  );
                })}
              </div>

              <div
                className="p-6 rounded-xl border text-center"
                style={{
                  borderColor: `${colors.primario}40`,
                  backgroundColor: `${colors.primario}10`,
                }}
              >
                <p className="text-sm text-slate-400 mb-3">
                  ¿Necesitas más información?
                </p>

                <a
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
                    color: '#020617',
                  }}
                >
                  Contáctanos <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}