"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../../db";

export async function deleteCarrera(id: number) {
  try {
    // 🔍 Verificar si existe la carrera
    const [carrera] = await sql/*sql*/ `
      SELECT id, nombre FROM carreras WHERE id = ${id};
    `;

    if (!carrera) {
      return { message: "⚠️ Carrera no encontrada." };
    }

    // 🔹 1. Quitar la referencia de los usuarios (evita error de foreign key)
    await sql/*sql*/ `
      UPDATE usuarios
      SET carrera_id = NULL
      WHERE carrera_id = ${id};
    `;

    // 🔹 2. Eliminar las especialidades asociadas a esta carrera
    await sql/*sql*/ `
      DELETE FROM especialidades WHERE carrera_id = ${id};
    `;

    // 🔹 3. Eliminar la carrera
    await sql/*sql*/ `
      DELETE FROM carreras WHERE id = ${id};
    `;

    // 🔹 4. Revalidar las rutas afectadas
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/books");

    return { message: `✅ Carrera "${carrera.nombre}" eliminada con éxito.` };
  } catch (error: any) {
    console.error("❌ Error al eliminar la carrera:", error);
    return { message: "❌ Error al eliminar la carrera." };
  }
}
