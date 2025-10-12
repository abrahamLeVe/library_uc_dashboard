"use server";

import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcrypt";

// 🧱 Estado del formulario
export type StateUser = {
  message: string | null;
  errors?: Record<string, string[]>;
  values?: {
    name: string;
    email: string;
    password?: string;
    role?: string;
  };
};

// 📋 Validación con Zod
const FormSchemaUser = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { message: "El nombre no puede exceder 100 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener mínimo 6 caracteres." }),
  role: z.enum(["BIBLIOTECARIO"], {
    message: "Rol inválido.",
  }),
});

// 🧠 Acción servidor: crear usuario
export async function createUser(
  prevState: StateUser,
  formData: FormData
): Promise<StateUser> {
  const validatedFields = FormSchemaUser.safeParse({
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString(),
    role: formData.get("role")?.toString().toUpperCase() || "BIBLIOTECARIO",
  });

  // ❌ Errores de validación
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Datos inválidos. Revisa el formulario.",
      values: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        role: formData.get("role")?.toString() || "BIBLIOTECARIO",
      },
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    // ⚙️ Verificar si ya existe el correo
    const existingUser = await sql`
      SELECT id FROM usuarios WHERE LOWER(email) = LOWER(${email}) LIMIT 1;
    `;
    if (existingUser.length > 0) {
      return {
        errors: { email: ["⚠️ Ya existe un usuario con este correo."] },
        message: `El usuario con correo "${email}" ya está registrado.`,
        values: { name, email, role },
      };
    }

    // 🔐 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insertar en la tabla correcta
    await sql`
      INSERT INTO usuarios (nombre, email, password, rol, activo, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, true, NOW(), NOW());
    `;

    revalidatePath("/dashboard/users");

    return {
      message: `✅ Usuario "${name}" creado exitosamente.`,
      values: { name: "", email: "", role },
    };
  } catch (error: any) {
    console.error("❌ Error creando usuario:", error);
    return { message: "❌ Error creando usuario. Intenta nuevamente." };
  }
}
