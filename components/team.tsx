'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Facebook, Twitter, Phone, Loader2 } from 'lucide-react';
import { api, Autoridad, utils } from '@/lib/api';

type TeamColors = {
  primario: string;
  secundario: string;
  terciario: string;
};

type CustomCSSProperties = CSSProperties & Record<`--${string}`, string>;

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '16, 185, 129';
}

function getInitials(name?: string | null) {
  if (!name || !name.trim()) return 'AU';

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Team() {
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState<TeamColors>({
    primario: '#10b981',
    secundario: '#f59e0b',
    terciario: '#06b6d4',
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const instData = await api.institution.getCurrentPrincipal();

        if (instData.colorinstitucion?.[0]) {
          const c = instData.colorinstitucion[0];

          setColors({
            primario: c.color_primario,
            secundario: c.color_secundario,
            terciario: c.color_terciario,
          });

          document.documentElement.style.setProperty('--color-primario', c.color_primario);
          document.documentElement.style.setProperty('--color-secundario', c.color_secundario);
          document.documentElement.style.setProperty('--color-terciario', c.color_terciario);

          document.documentElement.style.setProperty('--color-primario-rgb', hexToRgb(c.color_primario));
          document.documentElement.style.setProperty('--color-secundario-rgb', hexToRgb(c.color_secundario));
          document.documentElement.style.setProperty('--color-terciario-rgb', hexToRgb(c.color_terciario));
        }

        const contentData = await api.content.getAll();
        setAutoridades(contentData.autoridad || []);
      } catch (error) {
        console.error('Error cargando autoridades:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const cssVars: CustomCSSProperties = {
    '--team-primary': colors.primario,
    '--team-secondary': colors.secundario,
    '--team-tertiary': colors.terciario,
    '--team-primary-rgb': hexToRgb(colors.primario),
    '--team-secondary-rgb': hexToRgb(colors.secundario),
    '--team-tertiary-rgb': hexToRgb(colors.terciario),
  };

  if (loading) {
    return (
      <section className="team-loading" style={cssVars}>
        <div className="team-loading-card">
          <div className="team-loading-orbit">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <p className="team-loading-title">Cargando autoridades</p>
            <p className="team-loading-text">Preparando el equipo institucional...</p>
          </div>
        </div>
      </section>
    );
  }

  if (autoridades.length === 0) return null;

  return (
    <section id="team" className="team-section" style={cssVars}>
      {/* FONDOS DECORATIVOS */}
      <div className="team-bg-aurora" aria-hidden="true" />
      <div className="team-circuit-grid" aria-hidden="true" />
      <div className="team-electric-line" aria-hidden="true" />

      <span className="team-lightning team-lightning-one" aria-hidden="true" />
      <span className="team-lightning team-lightning-two" aria-hidden="true" />
      <span className="team-glitch-cut team-glitch-cut-one" aria-hidden="true" />
      <span className="team-glitch-cut team-glitch-cut-two" aria-hidden="true" />

      <div className="team-container">
        {/* ENCABEZADO */}
        <div className="team-header">
          <div className="team-kicker">
            <span className="team-kicker-dot" />
            <span>Equipo directivo</span>
          </div>

          <h2 className="team-title">
            Nuestras Autoridades
          </h2>
        </div>

        {/* TARJETAS */}
        <div className="team-grid">
          {autoridades.map((aut, idx) => (
            <AuthorityCard
              key={aut.id_autoridad}
              autoridad={aut}
              colors={colors}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthorityCard({
  autoridad,
  colors,
  index,
}: {
  autoridad: Autoridad;
  colors: TeamColors;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  const initials = getInitials(autoridad.nombre_autoridad);

  const imageUrl = !imgError && autoridad.foto_autoridad
    ? utils.buildImageUrl(autoridad.foto_autoridad)
    : null;

  const hasSocials =
    autoridad.facebook_autoridad ||
    autoridad.twiter_autoridad ||
    autoridad.celular_autoridad;

  return (
    <article
      className="team-card group"
      style={{ animationDelay: `${index * 140}ms` }}
    >
      <div className="team-card-glow" />
      <div className="team-card-scan" />

      <span className="team-card-corner team-card-corner-tl" />
      <span className="team-card-corner team-card-corner-tr" />
      <span className="team-card-corner team-card-corner-bl" />
      <span className="team-card-corner team-card-corner-br" />

      <div className="team-card-number">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="team-avatar-wrap">
        <span className="team-avatar-ring team-avatar-ring-one" />
        <span className="team-avatar-ring team-avatar-ring-two" />
        <span className="team-avatar-pulse" />

        <div className="team-avatar">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={autoridad.nombre_autoridad || 'Autoridad'}
              className="team-avatar-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="team-avatar-fallback">
              <span>{initials}</span>
            </div>
          )}
        </div>

        <span className="team-status-dot" />
      </div>

      <div className="team-card-content">
        <p className="team-card-label">
          Autoridad
        </p>

        <h3 className="team-card-name">
          {autoridad.nombre_autoridad || 'Nombre no disponible'}
        </h3>

        <p className="team-card-role" style={{ color: colors.secundario }}>
          {autoridad.cargo_autoridad}
        </p>
      </div>

      <div className="team-socials">
        {autoridad.facebook_autoridad && (
          <SocialBtn
            icon={Facebook}
            url={autoridad.facebook_autoridad}
            color={colors.primario}
            label="Facebook"
          />
        )}

        {autoridad.twiter_autoridad && (
          <SocialBtn
            icon={Twitter}
            url={autoridad.twiter_autoridad}
            color={colors.terciario}
            label="Twitter"
          />
        )}

        {autoridad.celular_autoridad && (
          <SocialBtn
            icon={Phone}
            url={`tel:${autoridad.celular_autoridad}`}
            color={colors.secundario}
            label="Teléfono"
          />
        )}

        {!hasSocials && (
          <span className="team-social-empty">
            Información institucional
          </span>
        )}
      </div>
    </article>
  );
}

function SocialBtn({
  icon: Icon,
  url,
  color,
  label,
}: {
  icon: any;
  url: string;
  color: string;
  label: string;
}) {
  const isPhone = url.startsWith('tel:');

  return (
    <a
      href={url}
      target={isPhone ? undefined : '_blank'}
      rel={isPhone ? undefined : 'noopener noreferrer'}
      className="team-social-btn"
      style={{ color }}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}