"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";

// ✅ Esquema de validación Zod actualizado
const KeywordSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre de la palabra clave debe tener al menos 2 caracteres."),
  // Hacer que libros sea opcional
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

export type StateKeyword = {
  errors?: {
    nombre?: string[];
    libros?: string[];
  };
  message?: string | null;
  values?: {
    id?: number;
    nombre: string;
    libros: number[];
  };
};

// ✅ Acción para crear una palabra clave
export async function createKeyword(
  prevState: StateKeyword,
  formData: FormData
): Promise<StateKeyword> {
  const nombre = (formData.get("nombre")?.toString() || "").trim();
  const librosRaw = formData.get("libros")?.toString() || "";

  // 1️⃣ Validar campos
  const validated = KeywordSchema.safeParse({ nombre, libros: librosRaw });
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos.",
      values: { nombre, libros: [] },
    };
  }

  const librosArr = validated.data.libros;

  // 2️⃣ Verificar si ya existe la palabra clave
  const existing = await sql`
    SELECT id FROM palabras_clave WHERE LOWER(nombre) = LOWER(${nombre}) LIMIT 1;
  `;
  if (existing.length > 0) {
    return {
      message: "⚠️ Ya existe una palabra clave con ese nombre.",
      errors: { nombre: ["Este nombre ya está registrado."] },
      values: { nombre, libros: librosArr },
    };
  }

  try {
    // 3️⃣ Insertar nueva palabra clave
    const [keyword] = await sql`
      INSERT INTO palabras_clave (nombre)
      VALUES (${nombre})
      RETURNING id, nombre;
    `;
    const keywordId = keyword.id;

    // 4️⃣ Insertar relaciones solo si hay libros
    for (const libroId of librosArr) {
      await sql`
        INSERT INTO libros_palabras_clave (libro_id, palabra_id)
        VALUES (${libroId}, ${keywordId})
        ON CONFLICT DO NOTHING;
      `;
    }

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/keywords");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Palabra clave "${keyword.nombre}" creada con éxito.`,
      values: { id: undefined, nombre: "", libros: [] },
    };
  } catch (error: any) {
    console.error("❌ Error creando palabra clave:", error);
    return {
      message: "❌ Error al crear la palabra clave.",
      values: { nombre, libros: librosArr },
    };
  }
}
