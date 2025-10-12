"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../../db";

export async function deleteCarrera(id: number) {
  try {
    // 🔍 1. Verificar si existe la carrera
    const [carrera] = await sql/*sql*/ `
      SELECT id, nombre FROM carreras WHERE id = ${id};
    `;

    if (!carrera) {
      return { message: "⚠️ Carrera no encontrada." };
    }

    // 🔹 2. Quitar la referencia de los usuarios
    await sql/*sql*/ `
      UPDATE usuarios
      SET carrera_id = NULL
      WHERE carrera_id = ${id};
    `;

    // 🔹 3. Eliminar las relaciones entre carrera y especialidades
    await sql/*sql*/ `
      DELETE FROM carreras_especialidades WHERE carrera_id = ${id};
    `;

    // 🔹 4. Eliminar las especialidades huérfanas (sin carreras asociadas)
    await sql/*sql*/ `
      DELETE FROM especialidades
      WHERE id NOT IN (
        SELECT especialidad_id FROM carreras_especialidades
      );
    `;

    // 🔹 5. Eliminar la carrera
    await sql/*sql*/ `
      DELETE FROM carreras WHERE id = ${id};
    `;

    // 🔹 6. Revalidar las rutas
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/books");

    return { message: `✅ Carrera "${carrera.nombre}" eliminada con éxito.` };
  } catch (error: any) {
    console.error("❌ Error al eliminar la carrera:", error);
    return { message: "❌ Error al eliminar la carrera." };
  }
}
