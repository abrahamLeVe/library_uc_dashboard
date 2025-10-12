import { sql } from "../db";
import { LatestBook } from "../definitions/books.definitions";

/* ============================================================
📅 LIBROS POR MES
============================================================ */
export type LibrosPorMesItem = {
  mes: number;
  anio: number;
  total: number;
};

export async function fetchLibrosPorMes(): Promise<LibrosPorMesItem[]> {
  try {
    const result = await sql<LibrosPorMesItem[]>`
      SELECT 
        EXTRACT(MONTH FROM l.created_at)::int AS mes,
        EXTRACT(YEAR FROM l.created_at)::int AS anio,
        COUNT(l.id)::int AS total
      FROM libros l
      GROUP BY anio, mes
      ORDER BY anio, mes;
    `;
    return result;
  } catch (error) {
    console.error("❌ Error en fetchLibrosPorMes:", error);
    throw new Error("No se pudieron obtener los libros por mes.");
  }
}

/* ============================================================
📊 DASHBOARD CARDS
============================================================ */
export async function fetchCardData() {
  try {
    const queries = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM libros`,
      sql`SELECT COUNT(*)::int AS count FROM facultades`,
      sql`SELECT COUNT(*)::int AS count FROM carreras`,
      sql`SELECT COUNT(*)::int AS count FROM especialidades`,
      sql`SELECT COUNT(*)::int AS count FROM autores`,
      sql`SELECT COUNT(*)::int AS count FROM usuarios`,
      sql`SELECT COUNT(*)::int AS count FROM libros_asignados`,
    ]);

    return {
      totalLibros: queries[0][0].count,
      totalFacultades: queries[1][0].count,
      totalCarreras: queries[2][0].count,
      totalEspecialidades: queries[3][0].count,
      totalAutores: queries[4][0].count,
      totalUsuarios: queries[5][0].count,
      totalLibrosAsignados: queries[6][0].count,
    };
  } catch (error) {
    console.error("❌ Database Error:", error);
    throw new Error("Failed to fetch card data for library.");
  }
}

/* ============================================================
🆕 ÚLTIMOS LIBROS
============================================================ */
export async function fetchLatestBooks(): Promise<LatestBook[]> {
  try {
    const data = await sql<LatestBook[]>`
      SELECT 
        l.id,
        l.titulo,
        l.anio_publicacion,
        l.created_at,
        e.nombre AS especialidad,
        COALESCE(
          json_agg(
            json_build_object(
              'id', a.id,
              'nombre', a.nombre
            )
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS autores
      FROM libros l
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      GROUP BY l.id, e.nombre
      ORDER BY l.created_at DESC
      LIMIT 6;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest books.");
  }
}
