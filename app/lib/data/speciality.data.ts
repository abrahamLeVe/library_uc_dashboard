"use server";

import { sql } from "../db";
import { Carrera, Especialidad } from "../definitions/faculty.definition";

/**
 * 📄 Obtener total de páginas de especialidades (para paginación)
 */
export async function fetchEspecialidadesPages(query: string) {
  const count = await sql/*sql*/ `
    SELECT COUNT(*)::int AS total
    FROM especialidades e
    LEFT JOIN carreras c ON e.carrera_id = c.id
    WHERE e.nombre ILIKE ${"%" + query + "%"}
       OR c.nombre ILIKE ${"%" + query + "%"}
  `;

  const total = count[0]?.total || 0;
  const perPage = 5;
  return Math.ceil(total / perPage);
}

/**
 * 🔍 Obtener especialidades filtradas con paginación
 */
export async function fetchFilteredEspecialidades(
  query: string,
  currentPage: number
) {
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const especialidades = await sql/*sql*/ `
    SELECT 
      e.id,
      e.nombre,
      c.id AS carrera_id,
      c.nombre AS carrera_nombre,
      f.id AS facultad_id,
      f.nombre AS facultad_nombre
    FROM especialidades e
    LEFT JOIN carreras c ON e.carrera_id = c.id
    LEFT JOIN facultades f ON c.facultad_id = f.id
    WHERE e.nombre ILIKE ${"%" + query + "%"}
       OR c.nombre ILIKE ${"%" + query + "%"}
       OR f.nombre ILIKE ${"%" + query + "%"}
    ORDER BY e.nombre ASC
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  // 🧩 Mapeo: convertir datos planos en estructura anidada
  return especialidades.map((e: any) => ({
    id: e.id,
    nombre: e.nombre,
    carrera: e.carrera_id
      ? {
          id: e.carrera_id,
          nombre: e.carrera_nombre,
          facultad: e.facultad_id
            ? {
                id: e.facultad_id,
                nombre: e.facultad_nombre,
              }
            : null,
        }
      : null,
  }));
}

/**
 * 📚 Obtener todas las especialidades (sin paginación) — con nombre de la carrera y facultad
 */
export async function fetchEspecialidadesAll(): Promise<
  {
    id: number;
    nombre: string;
    carrera_id: number | null;
    carrera_nombre: string | null;
    facultad_id: number | null;
    facultad_nombre: string | null;
  }[]
> {
  try {
    const especialidades = await sql/*sql*/ `
      SELECT
        e.id,
        e.nombre,
        e.carrera_id,
        c.nombre AS carrera_nombre,
        f.id   AS facultad_id,
        f.nombre AS facultad_nombre
      FROM especialidades e
      LEFT JOIN carreras c ON c.id = e.carrera_id
      LEFT JOIN facultades f ON f.id = c.facultad_id
      ORDER BY e.nombre ASC;
    `;

    return especialidades.map((e: any) => ({
      id: e.id,
      nombre: e.nombre,
      carrera_id: e.carrera_id ?? null,
      carrera_nombre: e.carrera_nombre ?? null,
      facultad_id: e.facultad_id ?? null,
      facultad_nombre: e.facultad_nombre ?? null,
    }));
  } catch (error) {
    console.error("❌ Error al obtener especialidades:", error);
    return [];
  }
}

/**
 * 🧾 Obtener una especialidad por su ID
 */
export async function fetchEspecialidadById(
  id: number
): Promise<Especialidad | null> {
  try {
    const [especialidad] = await sql/*sql*/ `
      SELECT id, nombre, carrera_id
      FROM especialidades
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!especialidad) return null;

    return {
      id: especialidad.id,
      nombre: especialidad.nombre,
      carrera_id: especialidad.carrera_id,
    } as Especialidad;
  } catch (error) {
    console.error("❌ Error al obtener especialidad por ID:", error);
    return null;
  }
}

export async function fetchCarrerasAll(): Promise<Carrera[]> {
  try {
    const carreras = await sql/*sql*/ `
      SELECT id, nombre, facultad_id
      FROM carreras
      ORDER BY nombre ASC;
    `;

    return carreras.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      facultad_id: c.facultad_id,
    })) as Carrera[];
  } catch (error) {
    console.error("❌ Error al obtener carreras:", error);
    return [];
  }
}
