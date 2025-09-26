import postgres from "postgres";
import { LatestBook, User } from "./definitions";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
      SELECT * FROM usuarios WHERE email=${email}
    `;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

// =======================
// LIBROS POR MES
// =======================
export type LibrosPorMesItem = {
  mes: number;
  anio: number;
  total: number;
};

export async function fetchLibrosPorMes(): Promise<LibrosPorMesItem[]> {
  try {
    const result = await sql<LibrosPorMesItem[]>`
      SELECT 
        EXTRACT(MONTH FROM created_at)::int AS mes,
        EXTRACT(YEAR FROM created_at)::int AS anio,
        COUNT(DISTINCT libros.id)::int AS total
      FROM libros
      GROUP BY anio, mes
      ORDER BY anio, mes;
    `;

    return result;
  } catch (error) {
    console.error("Error en fetchLibrosPorMes:", error);
    throw new Error("No se pudieron obtener los libros por mes.");
  }
}

export async function fetchCardData() {
  try {
    const totalLibrosPromise = sql`SELECT COUNT(*) FROM libros`;
    const totalFacultadesPromise = sql`SELECT COUNT(*) FROM facultades`;
    const totalCarrerasPromise = sql`SELECT COUNT(*) FROM carreras`;
    const totalEspecialidadesPromise = sql`SELECT COUNT(*) FROM especialidades`;
    const totalAutoresPromise = sql`SELECT COUNT(*) FROM autores`;
    const totalUsuariosPromise = sql`SELECT COUNT(*) FROM usuarios`;
    const totalLibrosAsignadosPromise = sql`SELECT COUNT(*) FROM libros_asignados`;

    const [
      libros,
      facultades,
      carreras,
      especialidades,
      autores,
      usuarios,
      librosAsignados,
    ] = await Promise.all([
      totalLibrosPromise,
      totalFacultadesPromise,
      totalCarrerasPromise,
      totalEspecialidadesPromise,
      totalAutoresPromise,
      totalUsuariosPromise,
      totalLibrosAsignadosPromise,
    ]);

    return {
      totalLibros: Number(libros[0].count ?? "0"),
      totalFacultades: Number(facultades[0].count ?? "0"),
      totalCarreras: Number(carreras[0].count ?? "0"),
      totalEspecialidades: Number(especialidades[0].count ?? "0"),
      totalAutores: Number(autores[0].count ?? "0"),
      totalUsuarios: Number(usuarios[0].count ?? "0"),
      totalLibrosAsignados: Number(librosAsignados[0].count ?? "0"),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data for library.");
  }
}





export async function fetchLatestBooks(): Promise<LatestBook[]> {
  try {
    const data = await sql<LatestBook[]>`
      SELECT 
        l.id,
        l.titulo,
        l.anio_publicacion,
        l.created_at,
        e.nombre AS especialidad,
        jsonb_build_object(
          'id', a.id,
          'nombre', a.nombre
        ) AS autor
      FROM libros l
      JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN autores a ON l.autor_id = a.id
      ORDER BY l.created_at DESC
      LIMIT 5;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest books.");
  }
}
