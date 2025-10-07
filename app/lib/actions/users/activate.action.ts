"use server";

import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function activateUser(id: number) {
  try {
    await sql`
      UPDATE usuarios
      SET activo = TRUE, updated_at = NOW()
      WHERE id = ${id};
    `;

    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("❌ Error al activar usuario:", error);
    throw new Error("No se pudo activar el usuario.");
  }
}
