"use server";

import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Validación de campos con Zod
 */
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
  video_url: z.string().optional(),
});

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
  values?: Record<string, string | string[]>;
};

/**
 * Acción para actualizar libro
 */
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
    video_url: formData.get("video_url") || undefined,
  });

  // Si hay errores → devolverlos al formulario
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

  const data = validatedFields.data;

  try {
    // Actualizar datos del libro
    await sql/*sql*/ `
  UPDATE libros
  SET titulo = ${data.titulo},
      descripcion = ${data.descripcion ?? null},
      isbn = ${data.isbn ?? null},
      anio_publicacion = ${data.anio_publicacion ?? null},
      editorial = ${data.editorial ?? null},
      idioma = ${data.idioma ?? null},
      paginas = ${data.paginas ?? null},
      palabras_clave = ${data.palabras_clave ?? null},
      pdf_url = ${data.pdf_url},
      examen_pdf_url = ${data.examen_pdf_url ?? null},
      imagen = ${data.imagen ?? null},
      video_url = ${data.video_url ?? null}, -- ✅ agregado
      facultad_id = ${data.facultad_id},
      carrera_id = ${data.carrera_id},
      especialidad_id = ${data.especialidad_id}
  WHERE id = ${data.id};
`;

    // Resetear autores del libro
    await sql/*sql*/ `
      DELETE FROM libros_autores
      WHERE libro_id = ${data.id};
    `;

    // Insertar de nuevo los autores seleccionados
    for (const autorId of data.autores) {
      await sql/*sql*/ `
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${data.id}, ${autorId});
      `;
    }
  } catch (error: any) {
    console.error("Database Error:", error);
    return { message: "Error en la base de datos." };
  }

  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}
