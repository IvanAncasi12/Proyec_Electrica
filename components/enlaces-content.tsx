'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { api, utils } from '@/lib/api';

interface EnlacesContentProps {
  colors: { primario: string; secundario: string; terciario: string; };
}

export default function EnlacesContent({ colors }: EnlacesContentProps) {
  const [enlaces, setEnlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEnlaces = async () => {
      try {
        const resourcesData = await api.resources.getAll();
         
        const listaEnlaces = (resourcesData.linksExternoInterno || [])
          .filter((link: any) => link.estado === 1);
        
        setEnlaces(listaEnlaces);
      } catch (error) {
        console.error('Error cargando enlaces:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarEnlaces();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold animate-pulse" style={{ color: colors.primario }}>Cargando enlaces...</div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-950">
      <div className="container mx-auto max-w-7xl relative z-10">
         
        <div className="w-full">
            
            {enlaces.length === 0 ? (
              <div className="tech-card p-16 text-center">
                <LinkIcon className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: colors.primario }} />
                <h3 className="text-2xl font-bold text-white mb-2">No hay enlaces disponibles</h3>
                <p className="text-slate-400">Pronto agregaremos nuevos recursos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enlaces.map((enlace) => {
             
                  const imageUrl = enlace.imagen 
                    ? utils.buildImageUrl(enlace.imagen) 
                    : null;

                  return (
                    <div 
                      key={enlace.id_link}
                      className="tech-card p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform group"
                      style={{ borderColor: `${colors.primario}30` }}
                    >
         
                      <div className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center bg-slate-800 group-hover:bg-slate-700 transition-colors overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={enlace.nombre} 
                            className="w-10 h-10 object-contain"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                          />
                        ) : (
                          <ExternalLink className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
 
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                        {enlace.nombre || 'Enlace Institucional'}
                      </h3>
                       
                      {enlace.tipo && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
                          style={{ backgroundColor: colors.secundario }}
                        >
                          {enlace.tipo}
                        </span>
                      )}
                    
                      <a 
                        href={enlace.url_link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                        style={{ 
                          background: `linear-gradient(135deg, ${colors.primario}, ${colors.terciario})`,
                          color: '#020617'
                        }}
                      >
                        Visitar Sitio <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

      </div>
    </section>
  );
}