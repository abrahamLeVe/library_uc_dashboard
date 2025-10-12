"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../../db";

export async function deleteEspecialidad(id: number) {
  try {
    // 🔍 Verificar si existe la especialidad
    const [especialidad] = await sql/*sql*/ `
      SELECT id, nombre FROM especialidades WHERE id = ${id};
    `;

    if (!especialidad) {
      return { message: "⚠️ Especialidad no encontrada." };
    }

    // 🔹 2. Eliminar la especialidad
    await sql/*sql*/ `
      DELETE FROM especialidades WHERE id = ${id};
    `;

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/speciality");
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Especialidad "${especialidad.nombre}" eliminada con éxito.`,
    };
  } catch (error: any) {
    console.error("❌ Error al eliminar la especialidad:", error);
    return { message: "❌ Error al eliminar la especialidad." };
  }
}
