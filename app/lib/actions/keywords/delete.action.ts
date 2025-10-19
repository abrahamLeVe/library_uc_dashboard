"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../../db";

export async function deleteKeyword(id: number) {
  try {
    // 🔍 Verificar si existe la palabra clave
    const [keyword] = await sql<{ id: number; nombre: string }[]>`
      SELECT id, nombre FROM palabras_clave WHERE id = ${id};
    `;

    if (!keyword) {
      return { message: "⚠️ Palabra clave no encontrada." };
    }

    // 🔹 Eliminar relaciones en libros_palabras_clave
    await sql`
      DELETE FROM libros_palabras_clave WHERE palabra_id = ${id};
    `;

    // 🔹 Eliminar la palabra clave
    await sql`
      DELETE FROM palabras_clave WHERE id = ${id};
    `;

    // 🔹 Revalidar páginas
    revalidatePath("/dashboard/keywords");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Palabra clave "${keyword.nombre}" eliminada con éxito.`,
    };
  } catch (error: any) {
    console.error("❌ Error al eliminar la palabra clave:", error);
    return { message: "❌ Error al eliminar la palabra clave." };
  }
}
