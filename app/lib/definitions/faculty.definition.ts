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
  carreras?: Carrera[]; // Relación opcional
}

/**
 * Carrera
 * Representa una carrera perteneciente a una facultad.
 */
export interface Carrera {
  id: number;
  nombre: string;
  facultad_id: number;
  especialidades?: Especialidad[]; // Relación opcional
}

/**
 * Especialidad
 * Representa una especialidad dentro de una carrera.
 */
export interface Especialidad {
  id: number;
  nombre: string;
  carrera_id: number;
}
