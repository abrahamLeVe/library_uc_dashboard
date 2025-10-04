"use server";

import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Validación de formulario para un libro
 */
const FormSchema = z.object({
  // Relaciones
  facultad_id: z.string().min(1, { message: "Seleccione una facultad." }),
  carrera_id: z.string().min(1, { message: "Seleccione una carrera." }),
  especialidad_id: z
    .string()
    .min(1, { message: "Seleccione una especialidad." }),
  autores: z
    .array(z.string())
    .min(1, { message: "Seleccione al menos un autor." }),

  // Vitales
  titulo: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres." }),
  pdf_url: z.string().min(3, { message: "Inserte la URL del PDF" }),

  // Opcionales
  descripcion: z.string().optional(),
  isbn: z.string().optional(),
  anio_publicacion: z.coerce.number().optional(),
  editorial: z.string().optional(),
  idioma: z.string().optional(),
  paginas: z.coerce.number().optional(),
  palabras_clave: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
  examen_pdf_url: z.string().optional(),
  imagen: z.string().optional(),
});

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
  values?: Record<string, string | string[]>;
};

/**
 * Acción de crear libro con autores relacionados
 */
export async function createBook(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    facultad_id: formData.get("facultad_id"),
    carrera_id: formData.get("carrera_id"),
    especialidad_id: formData.get("especialidad_id"),
    autores: formData.getAll("autores"),
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion") || undefined,
    isbn: formData.get("isbn") || undefined,
    anio_publicacion: formData.get("anio_publicacion") || undefined,
    editorial: formData.get("editorial") || undefined,
    idioma: formData.get("idioma") || undefined,
    paginas: formData.get("paginas") || undefined,
    palabras_clave: formData.get("palabras_clave") || undefined,
    pdf_url: formData.get("pdf_url"),
    examen_pdf_url: formData.get("examen_pdf_url") || undefined,
    imagen: formData.get("imagen") || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos.",
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => {
          const allValues = formData.getAll(key).map((v) => String(v));
          return [key, allValues.length > 1 ? allValues : allValues[0]];
        })
      ) as Record<string, string | string[]>,
    };
  }

  const {
    facultad_id,
    carrera_id,
    especialidad_id,
    autores,
    titulo,
    descripcion,
    isbn,
    anio_publicacion,
    editorial,
    idioma,
    paginas,
    palabras_clave,
    pdf_url,
    examen_pdf_url,
    imagen,
  } = validatedFields.data;

  try {
    // 1. Insertar libro con todas las relaciones
    const result = await sql/*sql*/ `
      INSERT INTO libros (
        titulo, descripcion, isbn, anio_publicacion, editorial, idioma, paginas,
        palabras_clave, pdf_url, examen_pdf_url, especialidad_id, carrera_id, facultad_id, imagen
      )
      VALUES (
        ${titulo},
        ${descripcion ?? null},
        ${isbn ?? null},
        ${anio_publicacion ?? null},
        ${editorial ?? null},
        ${idioma ?? null},
        ${paginas ?? null},
        ${
          palabras_clave && palabras_clave.length > 0
            ? sql.array(palabras_clave)
            : null
        },
        ${pdf_url},
        ${examen_pdf_url ?? null},
        ${especialidad_id},
        ${carrera_id},
        ${facultad_id},
        ${imagen ?? null}
      )
      RETURNING id;
    `;

    const libroId = result[0].id;

    // 2. Insertar autores en tabla intermedia
    for (const autorId of autores) {
      await sql/*sql*/ `
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${libroId}, ${autorId});
      `;
    }
  } catch (error: any) {
    console.error("Database Error:", error);
    return {
      message: "Error en la base de datos: No se pudo crear el libro.",
    };
  }

  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}
