"use server";

import { sql } from "../db";
import { Carrera } from "../definitions/faculty.definition";

/**
 * 📄 Obtener total de páginas de carreras (para paginación)
 */
export async function fetchCarrerasPages(query: string) {
  const count = await sql/*sql*/ `
    SELECT COUNT(*)::int AS total
    FROM carreras
    WHERE nombre ILIKE ${"%" + query + "%"}
  `;

  const total = count[0]?.total || 0;
  const perPage = 5;
  return Math.ceil(total / perPage);
}

/**
 * 🔍 Obtener carreras filtradas con paginación (por nombre de carrera o facultad)
 */
export async function fetchFilteredCarreras(
  query: string,
  currentPage: number
) {
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const carreras = await sql/*sql*/ `
    SELECT 
      c.id,
      c.nombre,
      f.id AS facultad_id,
      f.nombre AS facultad_nombre,
      COALESCE(
        json_agg(
          json_build_object(
            'id', e.id,
            'nombre', e.nombre
          )
        ) FILTER (WHERE e.id IS NOT NULL), '[]'
      ) AS especialidades
    FROM carreras c
    LEFT JOIN facultades f ON c.facultad_id = f.id
    LEFT JOIN especialidades e ON e.carrera_id = c.id
    WHERE 
      c.nombre ILIKE ${"%" + query + "%"} 
      OR f.nombre ILIKE ${"%" + query + "%"}
    GROUP BY c.id, f.id, f.nombre
    ORDER BY c.nombre ASC
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  return carreras;
}

/**
 * 📚 Obtener todas las carreras (sin paginación)
 * Incluye el nombre de la facultad.
 */
export async function fetchCarrerasAll(): Promise<Carrera[]> {
  try {
    const carreras = await sql/*sql*/ `
      SELECT 
        c.id, 
        c.nombre, 
        c.facultad_id,
        f.nombre AS facultad_nombre
      FROM carreras AS c
      LEFT JOIN facultades AS f ON c.facultad_id = f.id
      ORDER BY c.nombre ASC;
    `;

    return carreras.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      facultad_id: c.facultad_id,
      facultad_nombre: c.facultad_nombre ?? null,
    })) as Carrera[];
  } catch (error) {
    console.error("❌ Error al obtener carreras:", error);
    return [];
  }
}

/**
 * 🧾 Obtener una carrera por su ID
 */
export async function fetchCarreraById(id: number): Promise<Carrera | null> {
  try {
    const [carrera] = await sql/*sql*/ `
      SELECT id, nombre, facultad_id
      FROM carreras
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!carrera) return null;

    return {
      id: carrera.id,
      nombre: carrera.nombre,
      facultad_id: carrera.facultad_id,
    } as Carrera;
  } catch (error) {
    console.error("❌ Error al obtener carrera por ID:", error);
    return null;
  }
}

/**
 * 🏫 Obtener todas las facultades para usar en selects
 */
export async function fetchFacultades() {
  try {
    const facultades = await sql/*sql*/ `
      SELECT id, nombre
      FROM facultades
      ORDER BY nombre ASC
    `;
    return facultades;
  } catch (error) {
    console.error("❌ Error fetching facultades:", error);
    return [];
  }
}

/**
 * 🎓 Obtener todas las especialidades (por carrera)
 */
export async function fetchEspecialidades() {
  try {
    const especialidades = await sql/*sql*/ `
      SELECT id, nombre, carrera_id
      FROM especialidades
      ORDER BY nombre ASC
    `;
    return especialidades;
  } catch (error) {
    console.error("❌ Error fetching especialidades:", error);
    return [];
  }
}
