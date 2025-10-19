"use server";

import { z } from "zod";
import { sql } from "../../db";
import { revalidatePath } from "next/cache";

// ✅ Esquema de validación Zod actualizado
const UpdateKeywordSchema = z.object({
  id: z.string().min(1, "ID inválido."),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  // libros opcional
  libros: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      try {
        const arr = JSON.parse(val);
        return Array.isArray(arr)
          ? arr
              .filter((v) => v !== "")
              .map((v) => Number(v))
              .filter((v) => !isNaN(v))
          : [];
      } catch {
        return [];
      }
    }),
});

export type StateUpdateKeyword = {
  message: string | null;
  errors?: {
    id?: string[];
    nombre?: string[];
    libros?: string[];
  };
};

// ✅ Acción para actualizar palabra clave
export async function updateKeywordById(
  prevState: StateUpdateKeyword,
  formData: FormData
): Promise<StateUpdateKeyword> {
  const validated = UpdateKeywordSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre")?.toString().trim(),
    libros: formData.get("libros")?.toString(),
  });

  if (!validated.success) {
    return {
      message: "❌ Datos inválidos.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { id, nombre, libros } = validated.data;
  const librosArr: number[] = libros;

  try {
    // Verificar duplicado (excluyendo el actual)
    const existing = await sql`
      SELECT id FROM palabras_clave
      WHERE LOWER(nombre) = LOWER(${nombre}) AND id <> ${id}
      LIMIT 1;
    `;
    if (existing.length > 0) {
      return {
        message: "⚠️ Ya existe otra palabra clave con ese nombre.",
        errors: { nombre: ["Este nombre ya está en uso."] },
      };
    }

    // Actualizar nombre
    await sql`
      UPDATE palabras_clave
      SET nombre = ${nombre}
      WHERE id = ${id};
    `;

    // Actualizar relaciones (borramos y reinsertamos si hay libros)
    await sql`DELETE FROM libros_palabras_clave WHERE palabra_id = ${id};`;

    for (const libroId of librosArr) {
      await sql`
        INSERT INTO libros_palabras_clave (libro_id, palabra_id)
        VALUES (${libroId}, ${id})
        ON CONFLICT DO NOTHING;
      `;
    }

    // Revalidar páginas relacionadas
    revalidatePath("/dashboard/keywords");
    revalidatePath("/dashboard/books");

    return { message: `✅ Palabra clave "${nombre}" actualizada con éxito.` };
  } catch (error: any) {
    console.error("❌ Error actualizando palabra clave:", error);
    return { message: "❌ Error al actualizar la palabra clave." };
  }
}
