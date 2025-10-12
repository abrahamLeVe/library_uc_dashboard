// =======================
// DEFINICIONES DE ENTIDADES
// =======================

/**
 * Facultad
 * Representa una facultad dentro de la universidad.
 */
export interface Facultad {
  id: number;
  nombre: string;
  carreras?: Carrera[]; // Relación opcional: una facultad tiene muchas carreras
}

/**
 * Carrera
 * Representa una carrera perteneciente a una facultad.
 */
export interface Carrera {
  id: number;
  nombre: string;
  facultad_id: number; // Debe ser number, no string
  facultad_nombre?: string; // Nombre de la facultad asociada (opcional)
  especialidades?: Especialidad[]; // Relación opcional N:M con especialidades
}

/**
 * Especialidad
 * Representa una especialidad que puede estar asociada a varias carreras.
 */
export interface Especialidad {
  id: number;
  nombre: string;
  carreras: {
    id: number;
    nombre: string;
    facultad?: {
      id: number;
      nombre: string;
    } | null;
  }[]; // ✅ Ya no es opcional
}
