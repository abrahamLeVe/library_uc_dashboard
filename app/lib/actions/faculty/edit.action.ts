"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";
import { Facultad } from "../../definitions/faculty.definition";

// ✅ Esquema de validación
const FacultadSchema = z.object({
  id: z.number().int().positive("El ID debe ser válido."),
  nombre: z
    .string()
    .min(3, "El nombre de la facultad debe tener al menos 3 caracteres."),
});

export type StateUpdateFacultad = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
  values?: {
    id: number;
    nombre: string;
  };
};

// ✅ Acción para actualizar una facultad
export async function updateFacultadById(
  prevState: StateUpdateFacultad,
  formData: FormData
): Promise<StateUpdateFacultad> {
  const id = Number(formData.get("id"));
  const nombre = formData.get("nombre")?.toString().trim() || "";

  const validated = FacultadSchema.safeParse({ id, nombre });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos",
      values: { id, nombre },
    };
  }

  try {
    const [facultad] = await sql<Facultad[]>/*sql*/ `
      UPDATE facultades
      SET nombre = ${nombre}
      WHERE id = ${id}
      RETURNING id, nombre;
    `;

    if (!facultad) {
      return { message: "⚠️ Facultad no encontrada.", values: { id, nombre } };
    }

    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Facultad "${facultad.nombre}" actualizada con éxito.`,
      values: facultad,
    };
  } catch (error: any) {
    console.error("❌ Error al actualizar la facultad:", error);
    return { message: "❌ Error al actualizar la facultad." };
  }
}
