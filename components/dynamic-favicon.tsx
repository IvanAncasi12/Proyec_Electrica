'use client';

import { useEffect } from 'react';
import { api, utils } from '@/lib/api';

const getImageUrl = (imagen?: string | null) => {
  if (!imagen) return '';

  if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
    return imagen;
  }

  return utils.buildImageUrl(imagen);
};

export default function DynamicFavicon() {
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const institucion = await api.institution.getCurrentPrincipal();

        if (institucion?.institucion_nombre) {
          document.title = `${institucion.institucion_nombre} - UPEA`;
        }

        const logoBase = getImageUrl(institucion?.institucion_logo);

        if (!logoBase) return;

        const logo = `${logoBase}${logoBase.includes('?') ? '&' : '?'}favicon=${Date.now()}`;

        const icons = document.querySelectorAll<HTMLLinkElement>(
          "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
        );

        icons.forEach((icon) => {
          icon.href = logo;
        });

        let dynamicIcon = document.querySelector('#dynamic-favicon') as HTMLLinkElement | null;

        if (!dynamicIcon) {
          dynamicIcon = document.createElement('link');
          dynamicIcon.id = 'dynamic-favicon';
          dynamicIcon.rel = 'icon';
          document.head.appendChild(dynamicIcon);
        }

        dynamicIcon.href = logo;

        let dynamicShortcut = document.querySelector('#dynamic-shortcut-icon') as HTMLLinkElement | null;

        if (!dynamicShortcut) {
          dynamicShortcut = document.createElement('link');
          dynamicShortcut.id = 'dynamic-shortcut-icon';
          dynamicShortcut.rel = 'shortcut icon';
          document.head.appendChild(dynamicShortcut);
        }

        dynamicShortcut.href = logo;
      } catch (error) {
        console.error('No se pudo cargar el nombre/logo del servicio:', error);
      }
    };

    cargarDatos();
  }, []);

  return null;
}