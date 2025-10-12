"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";
import { Carrera } from "../../definitions/faculty.definition";

// ✅ Esquema de validación Zod
const CarreraSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre de la carrera debe tener al menos 3 caracteres."),
  facultad_id: z.string().min(1, "Debe seleccionar una facultad."),
});

export type StateCarrera = {
  errors?: {
    nombre?: string[];
    facultad_id?: string[];
  };
  message?: string | null;
  values?: {
    id?: number;
    nombre: string;
    facultad_id: string | number;
  };
};

// ✅ Acción para crear una carrera
export async function createCarrera(
  prevState: StateCarrera,
  formData: FormData
): Promise<StateCarrera> {
  const validated = CarreraSchema.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    facultad_id: formData.get("facultad_id")?.toString(),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        facultad_id: formData.get("facultad_id")?.toString() || "",
      },
    };
  }

  const { nombre, facultad_id } = validated.data;

  try {
    const [carrera] = await sql<Carrera[]>/*sql*/ `
      INSERT INTO carreras (nombre, facultad_id)
      VALUES (${nombre}, ${facultad_id})
      RETURNING id, nombre, facultad_id;
    `;

    // Revalida rutas donde se muestran carreras
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Carrera "${carrera.nombre}" creada con éxito.`,
      values: carrera,
    };
  } catch (error: any) {
    console.error("❌ Error creando carrera:", error);
    return { message: "❌ Error al crear la carrera." };
  }
}
