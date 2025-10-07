"use server";

import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";
import { StateUser } from "./create.action";

// ✅ Validación con nombres de campo correctos
const FormSchemaUserUpdate = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  password: z.string().optional(),
  rol: z.enum(["ADMIN", "BIBLIOTECARIO", "ALUMNO"], {
    message: "Rol inválido.",
  }),
});

export async function updateUser(
  id: string,
  prevState: StateUser,
  formData: FormData
): Promise<StateUser> {
  const validated = FormSchemaUserUpdate.safeParse({
    nombre: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString() || undefined,
    rol: formData.get("role")?.toString().toUpperCase(),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "❌ Datos inválidos.",
    };
  }

  const { nombre, email, password, rol } = validated.data;

  try {
    // ⚙️ Verificar si ya existe otro usuario con el mismo correo
    const existing = await sql`
      SELECT id FROM usuarios WHERE LOWER(email) = LOWER(${email}) AND id != ${id};
    `;
    if (existing.length > 0) {
      return {
        errors: { email: ["⚠️ Ya existe otro usuario con este correo."] },
        message: `El correo "${email}" ya está en uso.`,
      };
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await sql`
        UPDATE usuarios
        SET nombre = ${nombre},
            email = ${email},
            password = ${hashed},
            rol = ${rol},
            updated_at = NOW()
        WHERE id = ${id};
      `;
    } else {
      await sql`
        UPDATE usuarios
        SET nombre = ${nombre},
            email = ${email},
            rol = ${rol},
            updated_at = NOW()
        WHERE id = ${id};
      `;
    }

    revalidatePath("/dashboard/users");

    return {
      message: `✅ Usuario "${nombre}" actualizado correctamente.`,
    };
  } catch (error) {
    console.error("❌ Error actualizando usuario:", error);
    return { message: "❌ Error al actualizar usuario." };
  }
}
