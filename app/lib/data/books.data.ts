import { sql } from "../db";
import { OnlyLibro } from "../definitions/books.definitions";

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
      LEFT JOIN libros_palabras_clave lpc ON l.id = lpc.libro_id
      LEFT JOIN palabras_clave p ON lpc.palabra_id = p.id
      WHERE
        l.titulo ILIKE ${`%${query}%`} OR
        l.descripcion ILIKE ${`%${query}%`} OR
        l.editorial ILIKE ${`%${query}%`} OR
        l.anio_publicacion::text ILIKE ${`%${query}%`} OR
        f.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        e.nombre ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`} OR
        p.nombre ILIKE ${`%${query}%`}
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
        COALESCE(string_agg(DISTINCT a.nombre, ', '), 'Autor desconocido') AS autores,
        COALESCE(string_agg(DISTINCT p.nombre, ', '), '') AS palabras_clave
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_palabras_clave lpc ON l.id = lpc.libro_id
      LEFT JOIN palabras_clave p ON lpc.palabra_id = p.id
      WHERE 
        l.titulo ILIKE ${`%${query}%`} OR
        l.descripcion ILIKE ${`%${query}%`} OR
        l.editorial ILIKE ${`%${query}%`} OR
        l.anio_publicacion::text ILIKE ${`%${query}%`} OR
        f.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        e.nombre ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`} OR
        p.nombre ILIKE ${`%${query}%`}
      GROUP BY 
        l.id, f.nombre, c.nombre, e.nombre
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
        l.facultad_id,
        l.carrera_id,
        l.especialidad_id,
        f.nombre AS facultad_nombre,
        c.nombre AS carrera_nombre,
        e.nombre AS especialidad_nombre,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', a.id, 'nombre', a.nombre))
          FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS autores,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', p.id, 'nombre', p.nombre))
          FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS palabras_clave
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_palabras_clave lpc ON l.id = lpc.libro_id
      LEFT JOIN palabras_clave p ON lpc.palabra_id = p.id
      WHERE l.id = ${id}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre;
    `;
    return data[0];
  } catch (error) {
    console.error("❌ Error en fetchLibroById:", error);
    throw new Error("No se pudo obtener el libro.");
  }
}

export async function fetchLibrosAll(): Promise<OnlyLibro[]> {
  try {
    const data = await sql/*sql*/ `
      SELECT id, titulo
      FROM libros
      ORDER BY titulo ASC;
    `;
    // 🔹 Convertimos primero a unknown y luego a OnlyLibro[]
    return data as unknown as OnlyLibro[];
  } catch (error) {
    console.error("❌ Database Error fetchLibrosAll:", error);
    throw new Error("Failed to fetch libros.");
  }
}
