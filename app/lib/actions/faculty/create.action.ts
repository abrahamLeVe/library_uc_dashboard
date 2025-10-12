"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";
import { Facultad } from "../../definitions/faculty.definition";

// ✅ Esquema de validación Zod
const FacultadSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre de la facultad debe tener al menos 3 caracteres."),
});

export type StateFacultad = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
  values?: {
    id?: number;
    nombre: string;
  };
};

// ✅ Acción para crear una facultad
export async function createFacultad(
  prevState: StateFacultad,
  formData: FormData
): Promise<StateFacultad> {
  const validated = FacultadSchema.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
      },
    };
  }

  const { nombre } = validated.data;

  try {
    const [facultad] = await sql<Facultad[]>/*sql*/ `
      INSERT INTO facultades (nombre)
      VALUES (${nombre})
      RETURNING id, nombre;
    `;

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/speciality");
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Facultad "${facultad.nombre}" creada con éxito`,
      values: facultad,
    };
  } catch (error: any) {
    console.error("❌ Error creando facultad:", error);
    return { message: "❌ Error al crear la facultad" };
  }
}
