// =======================
// ROLES
// =======================
export type Role = "ADMIN" | "ASISTENTE" | "ALUMNO";

// =======================
// INTERFACES
// =======================
export interface Facultad {
  id: number;
  nombre: string;
}

export interface Carrera {
  id: number;
  nombre: string;
  facultad_id: number;
}

export interface Especialidad {
  id: number;
  nombre: string;
  carrera_id: number;
}

export interface Autor {
  id: number;
  nombre: string;
  nacionalidad?: string;
  biografia?: string | null;
}

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
  especialidad_id: number;
  autor_id: number;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string; // en seed lo puedes hashear
  carrera_id?: number | null;
  rol: Role;
}

export interface LibroAsignado {
  usuario_id: number;
  libro_id: number;
  fecha_asignacion: string;
}

// app/lib/definitions.ts
export interface LatestBook {
  id: number;
  titulo: string;
  anio_publicacion: number;
  created_at: string;
  especialidad: string;
  autor: {
    id: number;
    nombre: string;
  } | null;
}
