"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "../../db";

// ✅ Esquema de validación Zod
const EspecialidadSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre de la especialidad debe tener al menos 3 caracteres."),
  carreras: z.string().refine((val) => {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) && arr.length > 0;
    } catch {
      return false;
    }
  }, "Debe seleccionar al menos una carrera."),
});

export type StateEspecialidad = {
  errors?: {
    nombre?: string[];
    carreras?: string[];
  };
  message?: string | null;
  values?: {
    id?: number;
    nombre: string;
    carreras: string[];
  };
};

// ✅ Acción para crear una especialidad
export async function createEspecialidad(
  prevState: StateEspecialidad,
  formData: FormData
): Promise<StateEspecialidad> {
  // 1️⃣ Validar campos
  const validated = EspecialidadSchema.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    carreras: formData.get("carreras")?.toString(),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos.",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        carreras: [],
      },
    };
  }

  const { nombre, carreras } = validated.data;
  const carrerasArr: number[] = JSON.parse(carreras);

  try {
    // 2️⃣ Verificar si ya existe una especialidad con el mismo nombre
    const existing = await sql`
      SELECT id FROM especialidades WHERE LOWER(nombre) = LOWER(${nombre}) LIMIT 1;
    `;
    if (existing.length > 0) {
      return {
        message: "⚠️ Ya existe una especialidad con ese nombre.",
        errors: { nombre: ["Este nombre ya está registrado."] },
        values: { nombre, carreras: carrerasArr.map(String) },
      };
    }

    // 3️⃣ Insertar nueva especialidad
    const [especialidad] = await sql/*sql*/ `
      INSERT INTO especialidades (nombre)
      VALUES (${nombre})
      RETURNING id, nombre;
    `;

    const especialidadId = especialidad.id;

    // 4️⃣ Insertar relaciones en la tabla intermedia carreras_especialidades
    for (const carreraId of carrerasArr) {
      await sql/*sql*/ `
        INSERT INTO carreras_especialidades (carrera_id, especialidad_id)
        VALUES (${carreraId}, ${especialidadId});
      `;
    }

    // 5️⃣ Revalidar páginas relacionadas
    revalidatePath("/dashboard/speciality");
    revalidatePath("/dashboard/career");
    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Especialidad "${especialidad.nombre}" creada con éxito.`,
      values: {
        id: especialidad.id,
        nombre: especialidad.nombre,
        carreras: carrerasArr.map(String),
      },
    };
  } catch (error: any) {
    console.error("❌ Error creando especialidad:", error);
    return { message: "❌ Error al crear la especialidad." };
  }
}
