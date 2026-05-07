// lib/api.ts

// ============================================
// CONFIGURACIÓN Y CLIENTE HTTP
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_V2 = process.env.NEXT_PUBLIC_API_V2;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID;

// Cliente HTTP base
const apiClient = {
  baseUrl: API_V2,
  token: API_TOKEN,
  institucionId: INSTITUCION_ID,

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  },

  institutionEndpoint(path: string): string {
    return `/institucion/${this.institucionId}${path}`;
  },

  buildImageUrl(imagePath: string | null): string {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return `${API_BASE_URL}/storage/imagenes/instituciones/${imagePath}`;
  }
};

// ============================================
// TIPOS / INTERFACES
// ============================================

export interface ColorInstitucion {
  id_color: number;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
}

export interface DescripcionInstitucion {
  institucion_id: number;
  institucion_nombre: string;
  institucion_iniciales: string;
  institucion_nombre_iniciales: string;
  institucion_logo: string;
  institucion_historia: string;
  institucion_mision: string;
  institucion_vision: string;
  institucion_facebook: string;
  institucion_youtube: string;
  institucion_twitter: string;
  institucion_direccion: string;
  institucion_celular1: number;
  institucion_celular2: number;
  institucion_telefono1: number;
  institucion_telefono2: number;
  institucion_correo1: string;
  institucion_correo2: string;
  institucion_api_google_map: string;
  institucion_objetivos: string;
  institucion_sobre_ins: string;
  institucion_link_video_vision: string;
  colorinstitucion: ColorInstitucion[];
}

export interface Autoridad {
  id_autoridad: number;
  foto_autoridad: string | null;
  nombre_autoridad: string | null;
  cargo_autoridad: string;
  facebook_autoridad: string;
  celular_autoridad: string | null;
  twiter_autoridad: string;
}

export interface Portada {
  portada_id: number;
  portada_imagen: string;
  portada_titulo: string;
  portada_subtitulo: string;
}

export interface Ubicacion {
  id_ubicacion: number;
  ubicacion_imagen: string;
  ubicacion_titulo: string;
  ubicacion_descripcion: string;
  ubicacion_latitud: string;
  ubicacion_longitud: string;
  ubicacion_estado: string;
}

export interface Video {
  video_id: number;
  video_enlace: string;
  video_titulo: string;
  video_breve_descripcion: string;
  video_estado: number;
  video_tipo: string;
}

export interface Publicacion {
  publicaciones_id: number;
  publicaciones_titulo: string;
  publicaciones_imagen: string;
  publicaciones_descripcion: string;
  publicaciones_documento: string;
  publicaciones_fecha: string;
  publicaciones_autor: string;
  publicaciones_tipo: string;
}

export interface LinkExterno {
  id_link: number;
  imagen: string;
  nombre: string;
  url_link: string;
  estado: number;
  tipo: string;
}

export interface Evento {
  evento_id: number;
  evento_titulo: string;
  evento_imagen: string;
  evento_descripcion: string;
  evento_fecha: string;
  evento_hora: string;
  evento_lugar: string;
  tipo_evento: string;
  galeria: any[];
}

export interface Gaceta {
  gaceta_id: number;
  gaceta_titulo: string;
  gaceta_fecha: string;
  gaceta_documento: string;
  gaceta_tipo: string;
}

export interface Curso {
  iddetalle_cursos_academicos: number;
  det_img_portada: string;
  det_titulo: string;
  det_descripcion: string;
  det_costo: number;
  det_costo_ext: number;
  det_costo_profe: number;
  det_cupo_max: number;
  det_carga_horaria: number;
  det_lugar_curso: string;
  det_modalidad: string;
  det_fecha_ini: string;
  det_fecha_fin: string;
  det_codigo: string;
  det_hora_ini: string;
  det_grupo_whatssap: string;
  det_version: string;
  det_estado: string;
  idtipo_curso_otros: number;
  tipo_curso_otro: {
    tipo_conv_curso_nombre: string;
    tipo_conv_curso_estado: string;
  };
  facilitadores: any[];
}

export interface Convocatoria {
  idconvocatorias: number;
  con_foto_portada: string;
  con_titulo: string;
  con_descripcion: string;
  con_estado: string;
  con_fecha_inicio: string;
  con_fecha_fin: string;
  tipo_conv_comun: {
    idtipo_conv_comun: number;
    tipo_conv_comun_titulo: string;
    tipo_conv_comun_estado: string;
  };
}

export interface ServicioCarrera {
  serv_id: number;
  serv_imagen: string;
  serv_nombre: string;
  serv_descripcion: string;
  serv_nro_celular: number;
  serv_active: string;
  imagen: Array<{
    serv_imag_id: number;
    serv_imagen: string;
    serv_id: number;
  }>;
}

export interface OfertaAcademica {
  ofertas_id: number;
  ofertas_titulo: string;
  ofertas_descripcion: string;
  ofertas_inscripciones_ini: string;
  ofertas_inscripciones_fin: string;
  ofertas_fecha_examen: string;
  ofertas_imagen: string;
  ofertas_referencia: string;
  ofertas_estado: number;
}

// ============================================
// SERVICIOS - INSTITUCIÓN PRINCIPAL
// ============================================

export const institutionApi = {
  async getPrincipal(id?: string | number): Promise<DescripcionInstitucion> {
    const institucionId = id || apiClient.institucionId;
    const response = await apiClient.fetch<{ Descripcion: DescripcionInstitucion }>(
      `/institucionesPrincipal/${institucionId}`
    );
    return response.Descripcion;
  },

  async getCurrentPrincipal(): Promise<DescripcionInstitucion> {
    return this.getPrincipal();
  },
};

// ============================================
// SERVICIOS - CONTENIDO (Autoridades, Portada, Videos)
// ============================================

export const contentApi = {
  async getAll(): Promise<{
    autoridad: Autoridad[];
    portada: Portada[];
    ubicacion: Ubicacion[];
    upea_videos: Video[];
  }> {
    return apiClient.fetch(apiClient.institutionEndpoint('/contenido'));
  },

  async getAutoridades(): Promise<Autoridad[]> {
    const data = await this.getAll();
    return data.autoridad;
  },

  async getPortadas(): Promise<Portada[]> {
    const data = await this.getAll();
    return data.portada;
  },

  async getUbicacion(): Promise<Ubicacion[]> {
    const data = await this.getAll();
    return data.ubicacion;
  },

  async getVideos(): Promise<Video[]> {
    const data = await this.getAll();
    return data.upea_videos;
  },
};

// ============================================
// SERVICIOS - RECURSOS (Publicaciones, Links)
// ============================================

export const resourcesApi = {
  async getAll(): Promise<{
    upea_publicaciones: Publicacion[];
    linksExternoInterno: LinkExterno[];
    links: any[];
  }> {
    return apiClient.fetch(apiClient.institutionEndpoint('/recursos'));
  },

  async getPublicaciones(): Promise<Publicacion[]> {
    const data = await this.getAll();
    return data.upea_publicaciones;
  },

  async getLinks(): Promise<LinkExterno[]> {
    const data = await this.getAll();
    return data.linksExternoInterno.filter(link => link.estado === 1);
  },
};

// ============================================
// SERVICIOS - EVENTOS, GACETAS, CURSOS, etc.
// ============================================

export const eventsApi = {
  async getAll(): Promise<{
    upea_gaceta_universitaria: Gaceta[];
    upea_evento: Evento[];
    cursos: Curso[];
    convocatorias: Convocatoria[];
    serviciosCarrera: ServicioCarrera[];
    ofertasAcademicas: OfertaAcademica[];
  }> {
    return apiClient.fetch(apiClient.institutionEndpoint('/gacetaEventos'));
  },

  async getGacetas(): Promise<Gaceta[]> {
    const data = await this.getAll();
    return data.upea_gaceta_universitaria;
  },

  async getEventos(): Promise<Evento[]> {
    const data = await this.getAll();
    return data.upea_evento;
  },

  async getCursos(): Promise<Curso[]> {
    const data = await this.getAll();
    return data.cursos;
  },

  async getConvocatorias(): Promise<Convocatoria[]> {
    const data = await this.getAll();
    return data.convocatorias;
  },

  async getServiciosCarrera(): Promise<ServicioCarrera[]> {
    const data = await this.getAll();
    return data.serviciosCarrera;
  },

  async getOfertasAcademicas(): Promise<OfertaAcademica[]> {
    const data = await this.getAll();
    return data.ofertasAcademicas;
  },
};

// ============================================
// UTILIDADES
// ============================================

export const utils = {
  buildImageUrl: apiClient.buildImageUrl.bind(apiClient),
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  },
};

// ============================================
// EXPORT POR DEFECTO (opcional)
// ============================================

export const api = {
  institution: institutionApi,
  content: contentApi,
  resources: resourcesApi,
  events: eventsApi,
  utils,
};