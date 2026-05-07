'use client';
import { useState, useEffect } from 'react';
import { Calendar, FileText, ExternalLink, TrendingUp, Award, Users, Briefcase, X, Download } from 'lucide-react';
import { api, Gaceta } from '@/lib/api';

interface GacetasContentProps { colors: { primario: string; secundario: string; terciario: string; }; }

export default function GacetasContent({ colors }: GacetasContentProps) {
  const [gacetas, setGacetas] = useState<Gaceta[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ convocatorias: 0, comunicados: 0, avisos: 0, seminarios: 0, cursos: 0, servicios: 0, ofertas: 0, publicaciones: 0, gacetas: 0, eventos: 0, videos: 0, enlaces: 0 });

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [eventsData, resourcesData, contentData] = await Promise.all([api.events.getAll(), api.resources.getAll(), api.content.getAll()]);
        setGacetas(eventsData.upea_gaceta_universitaria || []);
        setCounts({
          convocatorias: (eventsData.convocatorias || []).length,
          comunicados: (eventsData.convocatorias || []).filter((c: any) => c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase().includes('comunicado')).length,
          avisos: (eventsData.convocatorias || []).filter((c: any) => c.tipo_conv_comun?.tipo_conv_comun_titulo?.toLowerCase().includes('aviso')).length,
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
      } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };
    cargarTodo();
  }, []);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Por definir';

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

  if (loading) return <section className="py-24 bg-slate-950 min-h-screen flex items-center justify-center"><div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>Cargando gacetas...</div></section>;

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-8">
            {gacetas.length === 0 ? (
              <div className="tech-card p-16 text-center"><FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: colors.primario }} /><h3 className="text-2xl font-bold text-white mb-2">No hay gacetas disponibles</h3><p className="text-slate-400">Pronto publicaremos nuevas ediciones</p></div>
            ) : (
              <div className="space-y-4">
                {gacetas.map((gaceta) => (
                  <div key={gaceta.gaceta_id} className="tech-card p-6 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.01] transition-transform" style={{ borderColor: `${colors.primario}30` }}>
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primario}20` }}>
                      <FileText className="w-8 h-8" style={{ color: colors.primario }} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-bold text-white mb-1">{gaceta.gaceta_titulo}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                        {gaceta.gaceta_fecha && <div className="flex items-center gap-2"><Calendar className="w-4 h-4" style={{ color: colors.secundario }} /><span>{formatDate(gaceta.gaceta_fecha)}</span></div>}
                        {gaceta.gaceta_tipo && <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${colors.secundario}20`, color: colors.secundario }}>{gaceta.gaceta_tipo}</span>}
                      </div>
                    </div>
                    {gaceta.gaceta_documento && (
                      <a href={gaceta.gaceta_documento} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`, color: '#020617' }}>
                        <Download className="w-4 h-4" /> Descargar
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="text-center pb-4 border-b border-slate-800"><h3 className="text-xl font-bold text-slate-300 tracking-wider">CATEGORÍAS</h3></div>
              <div className="space-y-3">
                {categoriesData.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <a key={cat.name} href={cat.href} className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group hover:scale-105" style={{ borderColor: `${colors.primario}20`, backgroundColor: `${colors.primario}05` }}>
                      <div className="flex items-center gap-3"><Icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: colors.primario }} /><span className="text-sm font-medium text-slate-300 group-hover:text-white">{cat.name}</span></div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: colors.primario }}>{cat.count}</span>
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