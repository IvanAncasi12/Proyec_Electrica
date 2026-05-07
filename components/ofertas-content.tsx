'use client';
import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, ExternalLink, TrendingUp, Award, Users, Briefcase, X } from 'lucide-react';
import { api, OfertaAcademica } from '@/lib/api';

interface OfertasContentProps { colors: { primario: string; secundario: string; terciario: string; }; }

export default function OfertasContent({ colors }: OfertasContentProps) {
  const [ofertas, setOfertas] = useState<OfertaAcademica[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [counts, setCounts] = useState({ convocatorias: 0, comunicados: 0, avisos: 0, seminarios: 0, cursos: 0, servicios: 0, ofertas: 0, publicaciones: 0, gacetas: 0, eventos: 0, videos: 0, enlaces: 0 });

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [eventsData, resourcesData, contentData] = await Promise.all([api.events.getAll(), api.resources.getAll(), api.content.getAll()]);
        setOfertas(eventsData.ofertasAcademicas || []);
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

  if (loading) return <section className="py-24 bg-slate-950 min-h-screen flex items-center justify-center"><div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>Cargando ofertas...</div></section>;

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" onClick={() => setSelectedImage(null)}><X className="w-8 h-8 text-white" /></button>
          <img src={selectedImage} alt="Vista ampliada" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-8">
            {ofertas.length === 0 ? (
              <div className="tech-card p-16 text-center"><Award className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: colors.primario }} /><h3 className="text-2xl font-bold text-white mb-2">No hay ofertas disponibles</h3><p className="text-slate-400">Pronto publicaremos nuevas oportunidades</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ofertas.map((oferta) => (
                  <div key={oferta.ofertas_id} className="tech-card p-6 hover:scale-[1.02] transition-transform" style={{ borderColor: `${colors.primario}30` }}>
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-48 rounded-xl overflow-hidden cursor-pointer group" onClick={() => oferta.ofertas_imagen && setSelectedImage(oferta.ofertas_imagen)}>
                        {oferta.ofertas_imagen ? <img src={oferta.ofertas_imagen} alt={oferta.ofertas_titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center bg-slate-800"><Award className="w-12 h-12 opacity-30" style={{ color: colors.primario }} /></div>}
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2" style={{ backgroundColor: colors.primario }}>{oferta.ofertas_referencia || 'Oferta'}</span>
                        <h3 className="text-xl font-bold text-white mb-2">{oferta.ofertas_titulo}</h3>
                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{oferta.ofertas_descripcion}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          {oferta.ofertas_inscripciones_ini && <div className="flex items-center gap-2"><Calendar className="w-4 h-4" style={{ color: colors.secundario }} /><span>Inicio: {formatDate(oferta.ofertas_inscripciones_ini)}</span></div>}
                          {oferta.ofertas_fecha_examen && <div className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: colors.terciario }} /><span>Examen: {formatDate(oferta.ofertas_fecha_examen)}</span></div>}
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