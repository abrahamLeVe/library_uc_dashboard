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
  palabras_clave: string[];
  pdf_url: string;
  examen_pdf_url: string;
  imagen: string;
  facultad_id: number;
  carrera_id: number;
  especialidad_id: number;
  created_at: string;
  video_urls: string[];
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
  autores: Autor[]; // ahora es array
};
