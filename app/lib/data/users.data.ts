"use server";

import { sql } from "../db";
import { User } from "../definitions/users.definitions";

const ITEMS_PER_PAGE = 6;

/* =============================
   ✅ OBTENER TODOS LOS USUARIOS
============================= */
export async function fetchUsers(): Promise<User[]> {
  try {
    const users = await sql<User[]>`
      SELECT id, nombre, email, rol, activo, created_at, updated_at
      FROM usuarios
      ORDER BY created_at DESC;
    `;
    return users;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios.");
  }
}

/* =============================
   ✅ FILTRAR USUARIOS + PAGINACIÓN
============================= */
export async function fetchFilteredUsers(
  query: string,
  currentPage: number
): Promise<User[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const users = await sql<User[]>`
      SELECT id, nombre, email, rol, activo, created_at, updated_at
      FROM usuarios
      WHERE nombre ILIKE ${"%" + query + "%"}
         OR email ILIKE ${"%" + query + "%"}
         OR rol ILIKE ${"%" + query + "%"}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
    return users;
  } catch (error) {
    console.error("❌ Error al filtrar usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios filtrados.");
  }
}

/* =============================
   ✅ CANTIDAD DE PÁGINAS
============================= */
export async function fetchUsersPages(query: string): Promise<number> {
  try {
    const result = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM usuarios
      WHERE nombre ILIKE ${"%" + query + "%"}
         OR email ILIKE ${"%" + query + "%"}
         OR rol ILIKE ${"%" + query + "%"};
    `;

    return Math.ceil(result[0].count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("❌ Error al calcular páginas de usuarios:", error);
    throw new Error("No se pudo calcular la cantidad de páginas.");
  }
}

/* =============================
   ✅ BUSCAR USUARIO POR ID
============================= */
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const result = await sql<User[]>`
      SELECT id, nombre, email, rol, activo, created_at, updated_at
      FROM usuarios
      WHERE id = ${id}
      LIMIT 1;
    `;
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("❌ Error al obtener usuario por ID:", error);
    throw new Error("No se pudo obtener el usuario.");
  }
}

/* =============================
   ✅ BUSCAR USUARIO POR EMAIL
============================= */
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`
      SELECT id, nombre, email, password, rol, activo, created_at, updated_at
      FROM usuarios
      WHERE email = ${email}
      LIMIT 1;
    `;
    return result[0];
  } catch (error) {
    console.error("❌ Error al obtener usuario por email:", error);
    throw new Error("No se pudo obtener el usuario.");
  }
}
