"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "../../db";

const FormSchema = z.object({
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
  video_urls: z.array(z.string()).optional(), // ✅ ahora array
});

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
  values?: Record<string, string | string[]>;
};

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
    video_urls: formData.getAll("video_urls"), // ✅ recibe array
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
    video_urls,
  } = validatedFields.data;

  try {
    // 1️⃣ Insertar libro
    const result = await sql/*sql*/ `
  INSERT INTO libros (
    titulo, descripcion, isbn, anio_publicacion, editorial, idioma, paginas,
    pdf_url, examen_pdf_url, imagen, video_urls,
    facultad_id, carrera_id, especialidad_id
  )
  VALUES (
    ${titulo},
    ${descripcion ?? null},
    ${isbn ?? null},
    ${anio_publicacion ?? null},
    ${editorial ?? null},
    ${idioma ?? null},
    ${paginas ?? null},
    ${pdf_url},
    ${examen_pdf_url ?? null},
    ${imagen ?? null},
    ${video_urls || []},
    ${facultad_id},
    ${carrera_id},
    ${especialidad_id}
  )
  RETURNING id;
`;

    const libroId = result[0].id;

    // 2️⃣ Relacionar autores
    for (const autorId of autores) {
      await sql/*sql*/ `
    INSERT INTO libros_autores (libro_id, autor_id)
    VALUES (${libroId}, ${autorId});
  `;
    }

    if (palabras_clave && palabras_clave.length > 0) {
      for (const palabra of palabras_clave) {
        // ✅ Revisar si ya existe
        const existing = await sql/*sql*/ `
      SELECT id FROM palabras_clave WHERE nombre = ${palabra}
    `;

        let palabraId: number;
        if (existing.length > 0) {
          // Solo relacionar con libro
          palabraId = existing[0].id;
        } else {
          // Crear nueva palabra clave
          const inserted = await sql/*sql*/ `
        INSERT INTO palabras_clave (nombre) VALUES (${palabra}) RETURNING id
      `;
          palabraId = inserted[0].id;
        }

        // Relacionar con libro, evitando duplicados
        await sql/*sql*/ `
      INSERT INTO libros_palabras_clave (libro_id, palabra_id)
      VALUES (${libroId}, ${palabraId})
      ON CONFLICT DO NOTHING
    `;
      }
    }
  } catch (error: any) {
    console.error("❌ Error al crear libro:", error);

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

  revalidatePath("/dashboard/books");
  revalidatePath("/dashboard/keywords");
  redirect("/dashboard/books");
}
