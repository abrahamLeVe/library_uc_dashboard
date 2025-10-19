import { Autor } from "./authors.definition";

export interface Libro {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  anio_publicacion: number;
  editorial: string;
  idioma: string;
  paginas: number;
  pdf_url: string;
  examen_pdf_url: string;
  imagen: string;
  facultad_id: number;
  carrera_id: number;
  especialidad_id: number;
  created_at: string;
  video_urls: string[];
  palabras_clave?: string[]; // ✅ Ahora es opcional y viene de relación
}

export interface LibroAsignado {
  usuario_id: number;
  libro_id: number;
  fecha_asignacion: string;
}

export type LatestBook = {
  id: number;
  titulo: string;
  anio_publicacion: number;
  created_at: string;
  especialidad: string;
  autores: Autor[];
};

// ✅ Nueva entidad
export interface PalabraClave {
  id: number;
  nombre: string;
}

// ✅ Relación N:M
export interface LibroPalabraClave {
  libro_id: number;
  palabra_id: number;
}

export type OnlyLibro = {
  id: number;
  titulo: string;
};
