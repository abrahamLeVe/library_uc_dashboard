"use server";

import { sql } from "../db";
import { Especialidad } from "../definitions/faculty.definition";

const ITEMS_PER_PAGE = 10;

/* ============================================================
   📄 Obtener total de páginas de especialidades
============================================================ */
export async function fetchEspecialidadesPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(DISTINCT e.id)::int AS total
      FROM especialidades e
      LEFT JOIN carreras_especialidades ce ON ce.especialidad_id = e.id
      LEFT JOIN carreras c ON ce.carrera_id = c.id
      LEFT JOIN facultades f ON c.facultad_id = f.id
      WHERE e.nombre ILIKE ${"%" + query + "%"}
         OR c.nombre ILIKE ${"%" + query + "%"}
         OR f.nombre ILIKE ${"%" + query + "%"};
    `;

    const total = count[0]?.total || 0;

    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("❌ Error al contar especialidades:", error);
    return 0;
  }
}

/* ============================================================
   🔍 Obtener especialidades filtradas con sus carreras (N:M)
============================================================ */
export async function fetchFilteredEspecialidades(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const rows = await sql`
  SELECT 
    e.id AS especialidad_id,
    e.nombre AS especialidad_nombre,
    c.id AS carrera_id,
    c.nombre AS carrera_nombre,
    f.id AS facultad_id,
    f.nombre AS facultad_nombre
  FROM (
    SELECT DISTINCT e.id, e.nombre
    FROM especialidades e
    LEFT JOIN carreras_especialidades ce ON ce.especialidad_id = e.id
    LEFT JOIN carreras c ON c.id = ce.carrera_id
    LEFT JOIN facultades f ON c.facultad_id = f.id
    WHERE e.nombre ILIKE ${"%" + query + "%"}
       OR c.nombre ILIKE ${"%" + query + "%"}
       OR f.nombre ILIKE ${"%" + query + "%"}
    ORDER BY e.nombre ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  ) AS e
  LEFT JOIN carreras_especialidades ce ON ce.especialidad_id = e.id
  LEFT JOIN carreras c ON c.id = ce.carrera_id
  LEFT JOIN facultades f ON f.id = c.facultad_id
  ORDER BY e.nombre ASC;
`;

    // 🧩 Agrupar por especialidad
    const especialidadesMap = new Map<number, any>();

    for (const row of rows) {
      if (!especialidadesMap.has(row.especialidad_id)) {
        especialidadesMap.set(row.especialidad_id, {
          id: row.especialidad_id,
          nombre: row.especialidad_nombre,
          carreras: [],
        });
      }

      if (row.carrera_id) {
        especialidadesMap.get(row.especialidad_id).carreras.push({
          id: row.carrera_id,
          nombre: row.carrera_nombre,
          facultad: row.facultad_id
            ? {
                id: row.facultad_id,
                nombre: row.facultad_nombre,
              }
            : null,
        });
      }
    }

    return Array.from(especialidadesMap.values());
  } catch (error) {
    console.error("❌ Error al obtener especialidades filtradas:", error);
    return [];
  }
}

/* ============================================================
   📚 Obtener todas las especialidades (sin paginación)
   con todas las carreras asociadas
============================================================ */
export async function fetchEspecialidadesAll(): Promise<
  {
    id: number;
    nombre: string;
    carreras: {
      id: number;
      nombre: string;
      facultad_id: number | null;
      facultad_nombre: string | null;
    }[];
  }[]
> {
  try {
    const rows = await sql`
      SELECT
        e.id AS especialidad_id,
        e.nombre AS especialidad_nombre,
        c.id AS carrera_id,
        c.nombre AS carrera_nombre,
        f.id AS facultad_id,
        f.nombre AS facultad_nombre
      FROM especialidades e
      LEFT JOIN carreras_especialidades ce ON ce.especialidad_id = e.id
      LEFT JOIN carreras c ON c.id = ce.carrera_id
      LEFT JOIN facultades f ON f.id = c.facultad_id
      ORDER BY e.nombre ASC;
    `;

    const map = new Map<number, any>();

    for (const row of rows) {
      if (!map.has(row.especialidad_id)) {
        map.set(row.especialidad_id, {
          id: row.especialidad_id,
          nombre: row.especialidad_nombre,
          carreras: [],
        });
      }

      if (row.carrera_id) {
        map.get(row.especialidad_id).carreras.push({
          id: row.carrera_id,
          nombre: row.carrera_nombre,
          facultad_id: row.facultad_id,
          facultad_nombre: row.facultad_nombre,
        });
      }
    }

    return Array.from(map.values());
  } catch (error) {
    console.error("❌ Error al obtener especialidades:", error);
    return [];
  }
}

/* ============================================================
   🧾 Obtener una especialidad por ID (con sus carreras)
============================================================ */
export async function fetchEspecialidadById(
  id: number
): Promise<Especialidad | null> {
  try {
    const rows = await sql`
      SELECT 
        e.id AS especialidad_id,
        e.nombre AS especialidad_nombre,
        c.id AS carrera_id,
        c.nombre AS carrera_nombre
      FROM especialidades e
      LEFT JOIN carreras_especialidades ce ON e.id = ce.especialidad_id
      LEFT JOIN carreras c ON c.id = ce.carrera_id
      WHERE e.id = ${id};
    `;

    if (rows.length === 0) return null;

    const especialidad = {
      id: rows[0].especialidad_id,
      nombre: rows[0].especialidad_nombre,
      carreras: rows
        .filter((r) => r.carrera_id)
        .map((r) => ({ id: r.carrera_id, nombre: r.carrera_nombre })),
    };

    return especialidad as any;
  } catch (error) {
    console.error("❌ Error al obtener especialidad por ID:", error);
    return null;
  }
}
