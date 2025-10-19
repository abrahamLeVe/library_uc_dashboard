import { sql } from "../db";
import { Keyword, OnlyLibro } from "../definitions/keywords.definition";

const ITEMS_PER_PAGE = 10;

/* ============================================================
📄 PAGINACIÓN DE PALABRAS CLAVE (CON BÚSQUEDA POR LIBRO)
============================================================ */
export async function fetchPalabrasClavePages(query: string) {
  try {
    const data = await sql/*sql*/ `
      SELECT COUNT(DISTINCT pc.id) AS count
      FROM palabras_clave pc
      LEFT JOIN libros_palabras_clave lpc ON pc.id = lpc.palabra_id
      LEFT JOIN libros l ON lpc.libro_id = l.id
      WHERE 
        pc.nombre ILIKE ${`%${query}%`} OR
        l.titulo ILIKE ${`%${query}%`};
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("❌ Database Error:", error);
    throw new Error("Failed to fetch total number of keywords.");
  }
}

/* ============================================================
🔎 PALABRAS CLAVE FILTRADAS (CON LIBROS ASOCIADOS)
============================================================ */
export async function fetchFilteredPalabrasClave(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql/*sql*/ `
      SELECT 
        pc.id,
        pc.nombre,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', l.id, 'titulo', l.titulo)
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) AS libros
      FROM palabras_clave pc
      LEFT JOIN libros_palabras_clave lpc ON pc.id = lpc.palabra_id
      LEFT JOIN libros l ON lpc.libro_id = l.id
      WHERE 
        pc.nombre ILIKE ${`%${query}%`} OR
        l.titulo ILIKE ${`%${query}%`}
      GROUP BY pc.id
      ORDER BY pc.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
    return data;
  } catch (error) {
    console.error("❌ Database Error:", error);
    throw new Error("Failed to fetch filtered keywords.");
  }
}

export async function fetchKeywordById(id: number): Promise<Keyword | null> {
  try {
    const [row] = await sql<Keyword[]>`
      SELECT 
        pc.id,
        pc.nombre,
        COALESCE(
          json_agg(json_build_object('id', l.id, 'titulo', l.titulo))
          FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) AS libros
      FROM palabras_clave pc
      LEFT JOIN libros_palabras_clave lpc ON pc.id = lpc.palabra_id
      LEFT JOIN libros l ON lpc.libro_id = l.id
      WHERE pc.id = ${id}
      GROUP BY pc.id;
    `;
    return row ?? null;
  } catch (error) {
    console.error("❌ Error en fetchKeywordById:", error);
    return null;
  }
}

/* ===========================
🏷️ Traer todas las palabras clave
=========================== */
export async function fetchKeywordsAll(): Promise<Keyword[]> {
  try {
    const data = await sql/*sql*/ `
      SELECT 
        k.id,
        k.nombre,
        COALESCE(
          json_agg(
            json_build_object('id', l.id, 'titulo', l.titulo)
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) AS libros
      FROM palabras_clave k
      LEFT JOIN libros_palabras_clave lpc ON k.id = lpc.palabra_id
      LEFT JOIN libros l ON lpc.libro_id = l.id
      GROUP BY k.id
      ORDER BY k.id DESC;
    `;

    // 🔹 Convertir 'libros' de JSON string a objeto
    return data.map((row: any) => ({
      id: row.id,
      nombre: row.nombre,
      libros: row.libros as OnlyLibro[], // aquí aseguramos el tipo
    }));
  } catch (error) {
    console.error("❌ Database Error fetchKeywordsAll:", error);
    throw new Error("Failed to fetch keywords.");
  }
}

export async function fetchLibroPalabrasClave(libroId: string) {
  const rows = await sql`
    SELECT pc.nombre
    FROM palabras_clave pc
    JOIN libros_palabras_clave lpc ON lpc.palabra_id = pc.id
    WHERE lpc.libro_id = ${libroId};
  `;
  return rows.map((r: any) => r.nombre);
}
