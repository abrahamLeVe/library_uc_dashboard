"use server";

import { sql } from "../db";
import { Autor } from "../definitions/authors.definition";

// Traer total de páginas
export async function fetchAutoresPages(query: string) {
  const count = await sql`
    SELECT COUNT(*)::int AS total
    FROM autores
    WHERE nombre ILIKE ${"%" + query + "%"}
  `;
  const total = count[0]?.total || 0;
  const perPage = 5;
  return Math.ceil(total / perPage);
}

export async function fetchFilteredAuthors(query: string, currentPage: number) {
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const autores = await sql/*sql*/ `
    SELECT 
      a.id,
      a.nombre,
      a.nacionalidad,
      COALESCE(
        json_agg(
          json_build_object(
            'id', l.id,
            'titulo', l.titulo,
            'anio_publicacion', l.anio_publicacion
          )
        ) FILTER (WHERE l.id IS NOT NULL), '[]'
      ) AS libros
    FROM autores a
    LEFT JOIN libros_autores la ON la.autor_id = a.id
    LEFT JOIN libros l ON l.id = la.libro_id
    WHERE a.nombre ILIKE ${"%" + query + "%"}
     OR a.nacionalidad ILIKE ${"%" + query + "%"}
    GROUP BY a.id
    ORDER BY a.nombre ASC
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  return autores;
}

export async function fetchAutores(): Promise<Autor[]> {
  try {
    const autores = await sql/*sql*/ `
      SELECT id, nombre, nacionalidad
      FROM autores
      ORDER BY nombre ASC
    `;
    return autores.map((autor) => ({
      id: autor.id,
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
    })) as Autor[];
  } catch (error) {
    console.error("❌ Error fetching autores:", error);
    return [];
  }
}

/* ✅ NUEVA FUNCIÓN: traer autor por ID */
export async function fetchAutorById(id: number): Promise<Autor | null> {
  try {
    const [autor] = await sql/*sql*/ `
      SELECT id, nombre, nacionalidad
      FROM autores
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!autor) return null;

    return {
      id: autor.id,
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
    } as Autor;
  } catch (error) {
    console.error("❌ Error fetching autor by ID:", error);
    return null;
  }
}
