"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "../../db";

// =======================
// Esquema de validación
// =======================
const EditSchema = z.object({
  id: z.string().min(1, { message: "El ID del libro es requerido." }),
  facultad_id: z.string().min(1, { message: "Seleccione una facultad." }),
  carrera_id: z.string().min(1, { message: "Seleccione una carrera." }),
  especialidad_id: z
    .string()
    .min(1, { message: "Seleccione una especialidad." }),
  autores: z
    .array(z.string())
    .min(1, { message: "Seleccione al menos un autor." }),
  titulo: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres." }),
  pdf_url: z.string().min(3, { message: "Inserte la URL del PDF" }),
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
  video_urls: z.array(z.string()).optional(), // ✅ múltiples URLs
});

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
  values?: Record<string, string | string[]>;
};

// =======================
// Acción principal
// =======================
export async function updateBook(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = EditSchema.safeParse({
    id: formData.get("id"),
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
    video_urls: formData.getAll("video_urls"), // ✅ array de inputs
  });

  // ⚠️ Manejo de errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos.",
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => {
          const allValues = formData.getAll(key).map((v) => String(v));
          return [key, allValues.length > 1 ? allValues : allValues[0]];
        })
      ),
    };
  }

  // =======================
  // Normalización segura
  // =======================
  const rawData = validatedFields.data;

  const data = {
    ...rawData,
    id: Number(rawData.id),
    facultad_id: Number(rawData.facultad_id),
    carrera_id: Number(rawData.carrera_id),
    especialidad_id: Number(rawData.especialidad_id),

    autores: (() => {
      let autores = rawData.autores;
      // Si vino como string JSON, lo parseamos
      if (
        autores.length === 1 &&
        typeof autores[0] === "string" &&
        autores[0].startsWith("[")
      ) {
        try {
          autores = JSON.parse(autores[0]);
        } catch {
          autores = [];
        }
      }
      return autores.map((a) => Number(a)).filter((a) => !isNaN(a));
    })(),

    video_urls: (() => {
      let videos = rawData.video_urls || [];
      if (
        videos.length === 1 &&
        typeof videos[0] === "string" &&
        videos[0].startsWith("[")
      ) {
        try {
          videos = JSON.parse(videos[0]);
        } catch {
          videos = [];
        }
      }
      return videos.filter((v) => v && v.trim() !== "");
    })(),
  };

  // =======================
  // Actualización en BD
  // =======================
  try {
    await sql/*sql*/ `
      UPDATE libros
      SET titulo = ${data.titulo},
          descripcion = ${data.descripcion ?? null},
          isbn = ${data.isbn ?? null},
          anio_publicacion = ${data.anio_publicacion ?? null},
          editorial = ${data.editorial ?? null},
          idioma = ${data.idioma ?? null},
          paginas = ${data.paginas ?? null},
          palabras_clave = ${data.palabras_clave ?? []},
          pdf_url = ${data.pdf_url},
          examen_pdf_url = ${data.examen_pdf_url ?? null},
          imagen = ${data.imagen ?? null},
          video_urls = ${data.video_urls ?? []},
          facultad_id = ${data.facultad_id},
          carrera_id = ${data.carrera_id},
          especialidad_id = ${data.especialidad_id}
      WHERE id = ${data.id};
    `;

    // ✅ Limpiar autores anteriores
    await sql/*sql*/ `
      DELETE FROM libros_autores WHERE libro_id = ${data.id};
    `;

    // ✅ Insertar nuevos autores
    for (const autorId of data.autores) {
      await sql/*sql*/ `
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${data.id}, ${autorId});
      `;
    }
  } catch (error: any) {
    console.error("❌ Error al crear libro:", error.detail);

    const errors: Record<string, string[]> = {};

    if (error.code === "23505" && error.detail) {
      // Regex para extraer la columna del mensaje
      const match = error.detail.match(/\((.*?)\)=\((.*?)\)/);
      if (match) {
        const column = match[1]; // por ejemplo "isbn"
        const value = match[2]; // por ejemplo "978-1234567890"
        errors[column] = [`El valor "${value}" ya existe.`];
      }
    }

    // Si no se reconoce el error, lo enviamos como error general
    if (Object.keys(errors).length === 0) {
      errors["_"] = ["Error desconocido al crear el libro."];
    }

    return {
      message: "Corrige los errores en los campos indicados.",
      errors,
    };
  }

  // ✅ Revalidar y redirigir
  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}
