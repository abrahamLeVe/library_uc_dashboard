"use server";

import { z } from "zod";
import { sql } from "../../db";
import { revalidatePath } from "next/cache";

const UpdateEspecialidadSchema = z.object({
  id: z.string().min(1, "ID inválido."),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  carreras: z.string().refine((val) => {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) && arr.length > 0;
    } catch {
      return false;
    }
  }, "Debe seleccionar al menos una carrera."),
});

export type StateUpdateEspecialidad = {
  message: string | null;
  errors?: {
    id?: string[];
    nombre?: string[];
    carreras?: string[];
  };
};

export async function updateEspecialidadById(
  prevState: StateUpdateEspecialidad,
  formData: FormData
): Promise<StateUpdateEspecialidad> {
  const validated = UpdateEspecialidadSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre")?.toString().trim(),
    carreras: formData.get("carreras")?.toString(),
  });

  if (!validated.success) {
    return {
      message: "❌ Datos inválidos.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { id, nombre, carreras } = validated.data;
  const carrerasArr: number[] = JSON.parse(carreras);

  try {
    // Verificar duplicado (excluyendo el actual)
    const existing = await sql`
      SELECT id FROM especialidades 
      WHERE LOWER(nombre) = LOWER(${nombre}) AND id <> ${id}
      LIMIT 1;
    `;
    if (existing.length > 0) {
      return {
        message: "⚠️ Ya existe otra especialidad con ese nombre.",
        errors: { nombre: ["Este nombre ya está en uso."] },
      };
    }

    // Actualizar nombre
    await sql`
      UPDATE especialidades
      SET nombre = ${nombre}
      WHERE id = ${id};
    `;

    // Actualizar relaciones (borramos y reinsertamos)
    await sql`DELETE FROM carreras_especialidades WHERE especialidad_id = ${id};`;

    for (const carreraId of carrerasArr) {
      await sql`
        INSERT INTO carreras_especialidades (carrera_id, especialidad_id)
        VALUES (${carreraId}, ${id});
      `;
    }

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/speciality");
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");

    return { message: `✅ Especialidad "${nombre}" actualizada con éxito.` };
  } catch (error: any) {
    console.error("❌ Error actualizando especialidad:", error);
    return { message: "❌ Error al actualizar la especialidad." };
  }
}
