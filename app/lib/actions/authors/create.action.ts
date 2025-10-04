"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";
import { Autor } from "../../definitions/authors.definition";

const AutorSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  nacionalidad: z.string().optional(),
});

export type StateAutor = {
  errors?: {
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

export async function createAutor(
  prevState: StateAutor,
  formData: FormData
): Promise<StateAutor> {
  const validated = AutorSchema.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    nacionalidad: formData.get("nacionalidad")?.toString().trim() || undefined,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        nacionalidad: formData.get("nacionalidad")?.toString() || "",
      },
    };
  }

  const { nombre, nacionalidad } = validated.data;

  try {
    const [autor] = await sql<Autor[]>/*sql*/ `
      INSERT INTO autores (nombre, nacionalidad)
      VALUES (${nombre}, ${nacionalidad ?? null})
      RETURNING id, nombre, nacionalidad;
    `;

    revalidatePath("/dashboard/author");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Autor "${autor.nombre}" creado con éxito`,
      values: autor,
    };
  } catch (error: any) {
    console.error("❌ Error creando autor:", error);
    return { message: "❌ Error al crear el autor" };
  }
}
