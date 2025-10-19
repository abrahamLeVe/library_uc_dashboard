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
    .transform((val) => {
      if (!val) return [];

      // Intentamos parsear como JSON
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed
            .map((s) =>
              String(s)
                .trim()
                .replace(/^"+|"+$/g, "")
            )
            .filter((s) => s.length > 0);
        }
      } catch {
        // Si no es JSON, lo tratamos como texto separado por comas
        return val
          .split(",")
          .map((s) => s.trim().replace(/^"+|"+$/g, ""))
          .filter((s) => s.length > 0);
      }

      return [];
    }),
  examen_pdf_url: z.string().optional(),
  imagen: z.string().optional(),
  video_urls: z.array(z.string()).optional(),
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
    video_urls: formData.getAll("video_urls"),
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

    palabras_clave: rawData.palabras_clave,
  };

  // =======================
  // Actualización en BD
  // =======================
  try {
    // 1️⃣ Actualizar campos generales
    await sql/*sql*/ `
      UPDATE libros
      SET titulo = ${data.titulo},
          descripcion = ${data.descripcion ?? null},
          isbn = ${data.isbn ?? null},
          anio_publicacion = ${data.anio_publicacion ?? null},
          editorial = ${data.editorial ?? null},
          idioma = ${data.idioma ?? null},
          paginas = ${data.paginas ?? null},
          pdf_url = ${data.pdf_url},
          examen_pdf_url = ${data.examen_pdf_url ?? null},
          imagen = ${data.imagen ?? null},
          video_urls = ${data.video_urls ?? []},
          facultad_id = ${data.facultad_id},
          carrera_id = ${data.carrera_id},
          especialidad_id = ${data.especialidad_id}
      WHERE id = ${data.id};
    `;

    // 2️⃣ Limpiar autores anteriores
    await sql/*sql*/ `
      DELETE FROM libros_autores WHERE libro_id = ${data.id};
    `;

    // 3️⃣ Insertar nuevos autores
    for (const autorId of data.autores) {
      await sql/*sql*/ `
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${data.id}, ${autorId});
      `;
    }

    // 4️⃣ Limpiar palabras clave anteriores
    await sql/*sql*/ `
      DELETE FROM libros_palabras_clave WHERE libro_id = ${data.id};
    `;

    // 5️⃣ Insertar nuevas palabras clave
    // 5️⃣ Insertar nuevas palabras clave
    if (data.palabras_clave && data.palabras_clave.length > 0) {
      for (const palabraRaw of data.palabras_clave) {
        // Limpiar palabra: quitar espacios y comillas
        const palabra = palabraRaw.trim().replace(/^"+|"+$/g, "");
        if (!palabra) continue;

        // Insertar la palabra si no existe, y obtener su id
        const result = await sql/*sql*/ `
      INSERT INTO palabras_clave (nombre)
      VALUES (${palabra})
      ON CONFLICT (nombre) DO UPDATE SET nombre=EXCLUDED.nombre
      RETURNING id
    `;

        const palabraId = result[0].id;

        // Relacionar con el libro
        await sql/*sql*/ `
      INSERT INTO libros_palabras_clave (libro_id, palabra_id)
      VALUES (${data.id}, ${palabraId})
      ON CONFLICT DO NOTHING
    `;
      }
    }
  } catch (error: any) {
    console.error("❌ Error al actualizar libro:", error);
    const errors: Record<string, string[]> = {};

    if (error.code === "23505" && error.detail) {
      const match = error.detail.match(/\((.*?)\)=\((.*?)\)/);
      if (match) {
        const column = match[1];
        const value = match[2];
        errors[column] = [`El valor "${value}" ya existe.`];
      }
    }

    if (Object.keys(errors).length === 0) {
      errors["_"] = ["Error desconocido al actualizar el libro."];
    }

    return {
      message: "Corrige los errores en los campos indicados.",
      errors,
    };
  }

  // ✅ Revalidar y redirigir
  revalidatePath("/dashboard/books");
  revalidatePath("/dashboard/keywords");
  redirect("/dashboard/books");
}
