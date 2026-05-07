'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { api, OfertaAcademica } from '@/lib/api';

export default function Gallery() {
  const [ofertas, setOfertas] = useState<OfertaAcademica[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOferta, setSelectedOferta] = useState<OfertaAcademica | null>(null);
  const [colors, setColors] = useState({ 
    primario: '#10b981', 
    secundario: '#f59e0b', 
    terciario: '#06b6d4' 
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        
        const instData = await api.institution.getCurrentPrincipal();
        if (instData.colorinstitucion?.[0]) {
          const c = instData.colorinstitucion[0];
          setColors({
            primario: c.color_primario,
            secundario: c.color_secundario,
            terciario: c.color_terciario
          });
        }
 
        const data = await api.events.getOfertasAcademicas();
       
        const activas = data.filter((o: OfertaAcademica) => o.ofertas_estado === 1);
        setOfertas(activas);
      } catch (error) {
        console.error('Error cargando ofertas:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);
 
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Por definir';
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-24 bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>
          Cargando ofertas académicas...
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 px-4 relative overflow-hidden bg-slate-950/90">
       
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: `${colors.primario}10` }} />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: `${colors.terciario}10` }} />
      </div>

      <div className="container mx-auto max-w-7xl">
         
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-6xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            Ofertas Académicas
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Cursos, diplomados y programas de especialización para tu desarrollo profesional
          </p>
        </div>
  
        {ofertas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl">No hay ofertas académicas disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {ofertas.map(oferta => (
              <div
                key={oferta.ofertas_id}
                onClick={() => setSelectedOferta(oferta)}
                className="group cursor-pointer tech-card overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="relative h-64 overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10"></div>
                  {oferta.ofertas_imagen ? (
                    <img
                      src={oferta.ofertas_imagen}
                      alt={oferta.ofertas_titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <Calendar className="w-16 h-16 opacity-30" style={{ color: colors.primario }} />
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {oferta.ofertas_titulo}
                  </h3>
                  <p className="text-slate-300 text-sm line-clamp-3">
                    {oferta.ofertas_descripcion}
                  </p>
               
                  <div className="pt-3 border-t border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-4 h-4" style={{ color: colors.primario }} />
                      <span>
                        Inicio: {formatDate(oferta.ofertas_inscripciones_ini)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-4 h-4" style={{ color: colors.terciario }} />
                      <span>
                        Fin: {formatDate(oferta.ofertas_inscripciones_fin)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
 
        {selectedOferta && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            onClick={() => setSelectedOferta(null)}>
            <div className="bg-slate-900 border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" 
              onClick={e => e.stopPropagation()}
              style={{ borderColor: `${colors.primario}40` }}>
              
              <button
                onClick={() => setSelectedOferta(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors z-10"
              >
                <X className="w-6 h-6 text-slate-300" />
              </button>

              <div className="relative h-64 overflow-hidden">
                {selectedOferta.ofertas_imagen ? (
                  <img
                    src={selectedOferta.ofertas_imagen}
                    alt={selectedOferta.ofertas_titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <Calendar className="w-20 h-20 opacity-30" style={{ color: colors.primario }} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
              </div>

              <div className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-white">{selectedOferta.ofertas_titulo}</h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ color: colors.primario }}>Descripción</h3>
                  <p className="text-slate-300 leading-relaxed">{selectedOferta.ofertas_descripcion}</p>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ borderColor: `${colors.primario}30`, backgroundColor: `${colors.primario}10` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5" style={{ color: colors.primario }} />
                      <span className="font-semibold" style={{ color: colors.primario }}>Inscripciones</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {formatDate(selectedOferta.ofertas_inscripciones_ini)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Hasta: {formatDate(selectedOferta.ofertas_inscripciones_fin)}
                    </p>
                  </div>

                  {selectedOferta.ofertas_fecha_examen && (
                    <div className="p-4 rounded-lg border" style={{ borderColor: `${colors.terciario}30`, backgroundColor: `${colors.terciario}10` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5" style={{ color: colors.terciario }} />
                        <span className="font-semibold" style={{ color: colors.terciario }}>Examen</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        {formatDate(selectedOferta.ofertas_fecha_examen)}
                      </p>
                    </div>
                  )}
                </div>
 
                {selectedOferta.ofertas_referencia && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-5 h-5" style={{ color: colors.primario }} />
                    <span>{selectedOferta.ofertas_referencia}</span>
                  </div>
                )}
 
                <button
                  onClick={() => window.open(`mailto:info@upea.bo?subject=Información sobre ${selectedOferta.ofertas_titulo}`, '_blank')}
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
                    color: '#020617'
                  }}
                >
                  Más Información
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}