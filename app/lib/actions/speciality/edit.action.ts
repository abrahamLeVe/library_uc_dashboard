"use server";

import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * ✅ Esquema de validación Zod para actualización de especialidad
 */
const EspecialidadEditSchema = z.object({
  id: z.string().min(1, { message: "El ID de la especialidad es requerido." }),
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  carrera_id: z.string().min(1, { message: "Debe seleccionar una carrera." }),
});

export type StateUpdateEspecialidad = {
  errors?: Record<string, string[]>;
  message?: string | null;
  values?: Record<string, string>;
};

/**
 * ✅ Acción del servidor: Actualizar especialidad por ID
 */
export async function updateEspecialidadById(
  prevState: StateUpdateEspecialidad,
  formData: FormData
): Promise<StateUpdateEspecialidad> {
  // 1️⃣ Validar los campos con Zod
  const validatedFields = EspecialidadEditSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre"),
    carrera_id: formData.get("carrera_id"),
  });

  // 2️⃣ Si hay errores → devolvemos los mensajes claros y valores originales
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos o contienen errores.",
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => [
          key,
          String(formData.get(key)),
        ])
      ),
    };
  }

  const data = validatedFields.data;

  try {
    // 3️⃣ Actualizar especialidad
    const result = await sql/*sql*/ `
      UPDATE especialidades
      SET nombre = ${data.nombre}, carrera_id = ${data.carrera_id}
      WHERE id = ${data.id}
      RETURNING id, nombre, carrera_id;
    `;

    // 4️⃣ Si no se encuentra la especialidad
    if (result.length === 0) {
      return {
        message: "⚠️ No se encontró la especialidad especificada.",
        values: data,
      };
    }

    // 5️⃣ Revalidar rutas relacionadas
    revalidatePath("/dashboard/specialty");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Especialidad "${data.nombre}" actualizada con éxito.`,
      values: data,
    };
  } catch (error: any) {
    console.error("❌ Error en la base de datos:", error);
    return {
      message: "Error al actualizar la especialidad en la base de datos.",
    };
  }
}
