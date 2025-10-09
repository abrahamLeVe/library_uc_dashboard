"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";

// ✅ Esquema de validación Zod
const EspecialidadSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre de la especialidad debe tener al menos 3 caracteres."),
  carrera_id: z.string().min(1, "Debe seleccionar una carrera."),
});

export type StateEspecialidad = {
  errors?: {
    nombre?: string[];
    carrera_id?: string[];
  };
  message?: string | null;
  values?: {
    id?: number;
    nombre: string;
    carrera_id: string;
  };
};

// ✅ Acción para crear una especialidad
export async function createEspecialidad(
  prevState: StateEspecialidad,
  formData: FormData
): Promise<StateEspecialidad> {
  // 1️⃣ Validar campos
  const validated = EspecialidadSchema.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    carrera_id: formData.get("carrera_id")?.toString(),
  });

  // 2️⃣ Si hay errores → retornamos los mensajes claros
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos.",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        carrera_id: formData.get("carrera_id")?.toString() || "",
      },
    };
  }

  const { nombre, carrera_id } = validated.data;

  try {
    // 3️⃣ Insertar nueva especialidad
    const [especialidad] = await sql<
      {
        id: number;
        nombre: string;
        carrera_id: string;
      }[]
    >/*sql*/ `
      INSERT INTO especialidades (nombre, carrera_id)
      VALUES (${nombre}, ${carrera_id})
      RETURNING id, nombre, carrera_id;
    `;

    // 4️⃣ Revalidar rutas donde se muestran especialidades
    revalidatePath("/dashboard/specialty");
    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Especialidad "${especialidad.nombre}" creada con éxito.`,
      values: {
        id: especialidad.id,
        nombre: especialidad.nombre,
        carrera_id: especialidad.carrera_id,
      },
    };
  } catch (error: any) {
    console.error("❌ Error creando especialidad:", error);
    return { message: "❌ Error al crear la especialidad." };
  }
}
