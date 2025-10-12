"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../../db";

export async function deleteFacultad(id: number) {
  try {
    // Verificar si existe la facultad
    const [facultad] = await sql/*sql*/ `
      SELECT id, nombre FROM facultades WHERE id = ${id};
    `;
    if (!facultad) {
      return { message: "⚠️ Facultad no encontrada." };
    }

    // 🔹 1. Quitar la referencia de los usuarios (evita error de foreign key)
    await sql/*sql*/ `
      UPDATE usuarios
      SET carrera_id = NULL
      WHERE carrera_id IN (
        SELECT id FROM carreras WHERE facultad_id = ${id}
      );
    `;

    // 🔹 2. Eliminar las carreras de esa facultad
    await sql/*sql*/ `
      DELETE FROM carreras WHERE facultad_id = ${id};
    `;

    // 🔹 3. Eliminar la facultad
    await sql/*sql*/ `
      DELETE FROM facultades WHERE id = ${id};
    `;

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/speciality");
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");

    return { message: `✅ Facultad "${facultad.nombre}" eliminada con éxito.` };
  } catch (error: any) {
    console.error("❌ Error al eliminar la facultad:", error);
    return { message: "❌ Error al eliminar la facultad." };
  }
}
