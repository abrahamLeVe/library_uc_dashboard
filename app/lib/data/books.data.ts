import { sql } from "../db";
import { LatestBook } from "../definitions/books.definitions";

const ITEMS_PER_PAGE = 10;

/* ============================================================
📄 PAGINACIÓN DE LIBROS
============================================================ */
export async function fetchBooksPages(query: string) {
  try {
    const data = await sql/*sql*/ `
      SELECT COUNT(DISTINCT l.id) AS count
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE 
        l.titulo ILIKE ${`%${query}%`} OR
        l.descripcion ILIKE ${`%${query}%`} OR
        l.editorial ILIKE ${`%${query}%`} OR
        l.anio_publicacion::text ILIKE ${`%${query}%`} OR
        f.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        e.nombre ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("❌ Database Error:", error);
    throw new Error("Failed to fetch total number of books.");
  }
}

/* ============================================================
📚 LIBROS FILTRADOS (CON PÁGINAS)
============================================================ */
export async function fetchFilteredBooks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql/*sql*/ `
      SELECT 
        l.id,
        l.titulo,
        l.descripcion,
        l.anio_publicacion AS anio,
        l.editorial,
        l.idioma,
        l.paginas,
        l.isbn,
        l.pdf_url,
        l.examen_pdf_url,
        l.imagen,
        l.video_urls,
        f.nombre AS facultad,
        c.nombre AS carrera,
        e.nombre AS especialidad,
        COALESCE(string_agg(a.nombre, ', '), 'Autor desconocido') AS autores
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE 
        l.titulo ILIKE ${`%${query}%`} OR
        l.descripcion ILIKE ${`%${query}%`} OR
        l.editorial ILIKE ${`%${query}%`} OR
        l.anio_publicacion::text ILIKE ${`%${query}%`} OR
        f.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        e.nombre ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`}
      GROUP BY 
        l.id, l.titulo, l.descripcion, l.anio_publicacion, 
        l.editorial, l.idioma, l.paginas, l.isbn,
        l.pdf_url, l.examen_pdf_url, l.imagen, l.video_urls,
        f.nombre, c.nombre, e.nombre
      ORDER BY l.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return data;
  } catch (error) {
    console.error("❌ Database Error:", error);
    throw new Error("Failed to fetch filtered books.");
  }
}

/* ============================================================
📘 LIBRO POR ID
============================================================ */
export async function fetchLibroById(id: string) {
  try {
    const data = await sql/*sql*/ `
      SELECT 
        l.id,
        l.titulo,
        l.descripcion,
        l.anio_publicacion AS anio,
        l.editorial,
        l.idioma,
        l.paginas,
        l.isbn,
        l.pdf_url,
        l.examen_pdf_url,
        l.imagen,
        l.video_urls,
        l.palabras_clave,
        l.facultad_id,
        l.carrera_id,
        l.especialidad_id,
        f.nombre AS facultad_nombre,
        c.nombre AS carrera_nombre,
        e.nombre AS especialidad_nombre,
        COALESCE(
          json_agg(
            json_build_object('id', a.id, 'nombre', a.nombre)
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS autores
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE l.id = ${id}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre;
    `;

    return data[0];
  } catch (error) {
    console.error("❌ Error en fetchLibroById:", error);
    throw new Error("No se pudo obtener el libro.");
  }
}

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
