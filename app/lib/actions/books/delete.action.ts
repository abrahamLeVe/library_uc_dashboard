"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Acción para eliminar un libro por ID
 */
export async function deleteBook(id: string) {
  try {
    // 1. Borrar autores asociados
    await sql/*sql*/ `
      DELETE FROM libros_autores
      WHERE libro_id = ${id};
    `;

    // 2. Borrar el libro
    await sql/*sql*/ `
      DELETE FROM libros
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/keywords");
    revalidatePath("/dashboard/books");
  } catch (error: any) {
    console.error("Database Error (deleteBook):", error);
    throw new Error("No se pudo eliminar el libro.");
  }
}
