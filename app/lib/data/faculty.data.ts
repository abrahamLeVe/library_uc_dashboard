"use server";

import { sql } from "../db";
import { Facultad } from "../definitions/faculty.definition";

/**
 * 📄 Obtener total de páginas de facultades (para paginación)
 */
export async function fetchFacultadesPages(query: string) {
  const count = await sql/*sql*/ `
    SELECT COUNT(*)::int AS total
    FROM facultades
    WHERE nombre ILIKE ${"%" + query + "%"}
  `;

  const total = count[0]?.total || 0;
  const perPage = 5;
  return Math.ceil(total / perPage);
}

/**
 * 🔍 Obtener facultades filtradas con paginación
 */
export async function fetchFilteredFacultades(
  query: string,
  currentPage: number
) {
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const facultades = await sql/*sql*/ `
    SELECT 
      f.id,
      f.nombre,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'nombre', c.nombre
          )
        ) FILTER (WHERE c.id IS NOT NULL), '[]'
      ) AS carreras
    FROM facultades f
    LEFT JOIN carreras c ON c.facultad_id = f.id
    WHERE f.nombre ILIKE ${"%" + query + "%"}
    GROUP BY f.id
    ORDER BY f.nombre ASC
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  return facultades;
}

/**
 * 📚 Obtener todas las facultades (sin paginación)
 */
export async function fetchFacultadesAll(): Promise<Facultad[]> {
  try {
    const facultades = await sql/*sql*/ `
      SELECT id, nombre
      FROM facultades
      ORDER BY nombre ASC;
    `;

    return facultades.map((f) => ({
      id: f.id,
      nombre: f.nombre,
    })) as Facultad[];
  } catch (error) {
    console.error("❌ Error al obtener facultades:", error);
    return [];
  }
}

/**
 * 🧾 Obtener una facultad por su ID
 */
export async function fetchFacultadById(id: number): Promise<Facultad | null> {
  try {
    const [facultad] = await sql/*sql*/ `
      SELECT id, nombre
      FROM facultades
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!facultad) return null;

    return {
      id: facultad.id,
      nombre: facultad.nombre,
    } as Facultad;
  } catch (error) {
    console.error("❌ Error al obtener facultad por ID:", error);
    return null;
  }
}
