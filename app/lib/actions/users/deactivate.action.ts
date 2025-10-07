"use server";

import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function deactivateUser(id: number) {
  try {
    await sql`
      UPDATE usuarios
      SET activo = FALSE, updated_at = NOW()
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    return { success: false, message: "No se pudo desactivar el usuario" };
  }
}
