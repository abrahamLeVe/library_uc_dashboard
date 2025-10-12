"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * ✅ Esquema de validación Zod para actualización de carrera
 */
const CarreraEditSchema = z.object({
  id: z.string().min(1, { message: "El ID de la carrera es requerido." }),
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  facultad_id: z.string().min(1, { message: "Debe seleccionar una facultad." }),
});

export type StateUpdateCarrera = {
  errors?: Record<string, string[]>;
  message?: string | null;
  values?: Record<string, string>;
};

/**
 * ✅ Acción del servidor: Actualizar carrera por ID
 */
export async function updateCarreraById(
  prevState: StateUpdateCarrera,
  formData: FormData
): Promise<StateUpdateCarrera> {
  // 1️⃣ Validar los campos con Zod
  const validatedFields = CarreraEditSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre"),
    facultad_id: formData.get("facultad_id"),
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
    // 3️⃣ Actualizar carrera
    const result = await sql/*sql*/ `
      UPDATE carreras
      SET nombre = ${data.nombre}, facultad_id = ${data.facultad_id}
      WHERE id = ${data.id}
      RETURNING id, nombre, facultad_id;
    `;

    // 4️⃣ Si no se encuentra la carrera
    if (result.length === 0) {
      return {
        message: "⚠️ No se encontró la carrera especificada.",
        values: data,
      };
    }

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/speciality");
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");
    return {
      message: `✅ Facultad "${data.nombre}" actualizada con éxito.`,
      values: data,
    };
  } catch (error: any) {
    console.error("❌ Error en la base de datos:", error);
    return { message: "Error al actualizar la carrera en la base de datos." };
  }

  // 5️⃣ Revalidar rutas donde se muestran las carreras
}
