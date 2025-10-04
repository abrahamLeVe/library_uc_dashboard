"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "../../db";
import { Autor } from "../../definitions/authors.definition";

const AutorSchema = z.object({
  id: z.string().min(1, "ID inválido."),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  nacionalidad: z.string().optional(),
});

export type StateAutor = {
  errors?: {
    id?: string[];
    nombre?: string[];
    nacionalidad?: string[];
  };
  message?: string | null;
  values?: {
    id?: number;
    nombre: string;
    nacionalidad?: string | null;
  };
};

export async function updateAutor(
  prevState: StateAutor,
  formData: FormData
): Promise<StateAutor> {
  const validated = AutorSchema.safeParse({
    id: formData.get("id")?.toString(),
    nombre: formData.get("nombre")?.toString().trim(),
    nacionalidad: formData.get("nacionalidad")?.toString().trim() || null,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos",
      values: {
        id: Number(formData.get("id")) || undefined,
        nombre: formData.get("nombre")?.toString() || "",
        nacionalidad: formData.get("nacionalidad")?.toString() || "",
      },
    };
  }

  const { id, nombre, nacionalidad } = validated.data;

  try {
    const existeAutor = await sql`
      SELECT id FROM autores 
      WHERE LOWER(nombre) = LOWER(${nombre}) 
      AND id != ${id};
    `;

    if (existeAutor.length > 0) {
      return {
        message: "⚠️ Ya existe otro autor con este nombre.",
        errors: { nombre: ["El nombre ya está registrado."] },
        values: { id: Number(id), nombre, nacionalidad },
      };
    }

    const result = await sql<Autor[]>`
      UPDATE autores
      SET nombre = ${nombre}, nacionalidad = ${nacionalidad ?? ""}
      WHERE id = ${id}
      RETURNING id, nombre, nacionalidad;
    `;
    const autorActualizado = result[0];

    revalidatePath("/dashboard/author");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Autor "${autorActualizado.nombre}" actualizado correctamente.`,
      values: autorActualizado,
    };
  } catch (error) {
    console.error("❌ Error al actualizar autor:", error);
    return { message: "❌ Error al actualizar el autor." };
  }
}
