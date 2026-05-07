'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, FileText, ExternalLink,
  TrendingUp, Award, Users, Briefcase, X
} from 'lucide-react';
import { api, Convocatoria } from '@/lib/api';

interface ConvocatoriasContentProps {
  colors: { primario: string; secundario: string; terciario: string; };
}

export default function ConvocatoriasContent({ colors }: ConvocatoriasContentProps) {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    convocatorias: 0, comunicados: 0, avisos: 0, seminarios: 0,
    cursos: 0, servicios: 0, ofertas: 0, publicaciones: 0,
    gacetas: 0, eventos: 0, videos: 0, enlaces: 0,
  });

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [eventsData, resourcesData, contentData] = await Promise.all([
          api.events.getAll(),
          api.resources.getAll(),
          api.content.getAll()
        ]);
        
        const todos = eventsData.convocatorias || [];
        const soloConvocatorias = todos.filter(c => {
          const tipo = c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase() || '';
          const titulo = c.con_titulo?.toLowerCase() || '';
          return tipo.includes('convocatoria') || titulo.includes('convocatoria');
        });
        
        setConvocatorias(soloConvocatorias);
        
        setCounts({
          convocatorias: soloConvocatorias.length,
          comunicados: todos.filter(c => {
            const tipo = c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase() || '';
            return tipo.includes('comunicado');
          }).length,
          avisos: todos.filter(c => {
            const tipo = c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase() || '';
            return tipo.includes('aviso');
          }).length,
          seminarios: (eventsData.cursos || []).filter((c: any) => c.tipo_curso_otro?.tipo_conv_curso_nombre?.toLowerCase().includes('seminario')).length,
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Por definir';
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
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
        <div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>Cargando convocatorias...</div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
    
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8 text-white" />
          </button>
          <img 
            src={selectedImage} 
            alt="Vista ampliada" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          <div className="lg:col-span-3 space-y-8">
            
            {convocatorias.length === 0 ? (
              <div className="tech-card p-16 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: colors.primario }} />
                <h3 className="text-2xl font-bold text-white mb-2">No hay convocatorias disponibles</h3>
                <p className="text-slate-400">Pronto publicaremos nuevas oportunidades</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {convocatorias.map((convocatoria) => (
                  <div 
                    key={convocatoria.idconvocatorias}
                    className="tech-card p-6 hover:scale-[1.01] transition-transform"
                    style={{ borderColor: `${colors.primario}30` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
             
                      <div 
                        className="w-full md:w-64 h-48 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group"
                        onClick={() => convocatoria.con_foto_portada && setSelectedImage(convocatoria.con_foto_portada)}
                      >
                        {convocatoria.con_foto_portada ? (
                          <img 
                            src={convocatoria.con_foto_portada} 
                            alt={convocatoria.con_titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <FileText className="w-12 h-12 opacity-30" style={{ color: colors.primario }} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="mb-3">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                            style={{ backgroundColor: colors.primario }}
                          >
                            {convocatoria.tipo_conv_comun?.tipo_conv_comun_titulo || 'Convocatoria'}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            {convocatoria.con_titulo}
                          </h3>
                        </div>

                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                          {convocatoria.con_descripcion}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          {convocatoria.con_fecha_inicio && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" style={{ color: colors.secundario }} />
                              <span>Inicio: {formatDate(convocatoria.con_fecha_inicio)}</span>
                            </div>
                          )}
                          {convocatoria.con_fecha_fin && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" style={{ color: colors.terciario }} />
                              <span>Fin: {formatDate(convocatoria.con_fecha_fin)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                      style={{ 
                        borderColor: `${colors.primario}20`,
                        backgroundColor: `${colors.primario}05`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: colors.primario }} />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">{cat.name}</span>
                      </div>
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: colors.primario }}
                      >
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