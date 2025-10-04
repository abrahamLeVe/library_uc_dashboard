"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../../db";
import { Autor } from "../../definitions/authors.definition";

export async function deleteAutor(id: number) {
  try {
    // Verificar si existe el autor
    const autor = await sql<Autor[]>/*sql*/ `
      SELECT id, nombre FROM autores WHERE id = ${id};
    `;

    if (autor.length === 0) {
      return { message: "⚠️ El autor no existe o ya fue eliminado." };
    }

    // Eliminar dependencias si existen (libros_autores)
    await sql/*sql*/ `
      DELETE FROM libros_autores WHERE autor_id = ${id};
    `;

    // Eliminar el autor
    await sql/*sql*/ `
      DELETE FROM autores WHERE id = ${id};
    `;

    // Revalidar rutas relacionadas

    revalidatePath("/dashboard/author");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Autor "${autor[0].nombre}" eliminado correctamente.`,
    };
  } catch (error) {
    console.error("❌ Error al eliminar autor:", error);
    return { message: "❌ Error al eliminar el autor." };
  }
}
