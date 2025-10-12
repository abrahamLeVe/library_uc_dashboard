"use server";

import { sql } from "../db";
import { Carrera } from "../definitions/faculty.definition";
const ITEMS_PER_PAGE = 10;

/* ============================================================
📄 Obtener total de páginas (para paginación de carreras)
============================================================ */
export async function fetchCarrerasPages(query: string): Promise<number> {
  try {
    const result = await sql/*sql*/ `
      SELECT COUNT(*)::int AS total
      FROM carreras
      WHERE nombre ILIKE ${`%${query}%`}
    `;

    const total = result[0]?.total ?? 0;
    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("❌ Error al contar carreras:", error);
    return 0;
  }
}

/* ============================================================
   🔍 Obtener carreras filtradas (paginadas + facultad + especialidades)
============================================================ */
export async function fetchFilteredCarreras(
  query: string,
  currentPage: number
) {
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

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
    LEFT JOIN carreras_especialidades ce ON ce.carrera_id = c.id
    LEFT JOIN especialidades e ON e.id = ce.especialidad_id
    WHERE 
      c.nombre ILIKE ${`%${query}%`}
      OR f.nombre ILIKE ${`%${query}%`}
    GROUP BY c.id, f.id, f.nombre
    ORDER BY c.nombre ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
  `;

    return carreras;
  } catch (error) {
    console.error("❌ Error al filtrar carreras:", error);
    return [];
  }
}

/* ============================================================
   📚 Obtener todas las carreras (sin paginación)
============================================================ */
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
    }));
  } catch (error) {
    console.error("❌ Error al obtener todas las carreras:", error);
    return [];
  }
}

/* ============================================================
   🧾 Obtener una carrera por su ID
============================================================ */
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
    };
  } catch (error) {
    console.error("❌ Error al obtener carrera por ID:", error);
    return null;
  }
}
