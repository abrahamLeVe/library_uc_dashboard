/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  autores,
  carreras,
  carrerasEspecialidades,
  especialidades,
  facultades,
  libros,
  librosAsignados,
  librosAutores,
  usuarios,
} from "@/app/lib/placeholder-data";
import bcrypt from "bcrypt";
import { sql } from "../lib/db";

/* ===========================
   CREACIÓN DE TABLAS
=========================== */
async function createTables() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // FACULTADES
  await sql`
    CREATE TABLE IF NOT EXISTS facultades (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  // CARRERAS
  await sql`
    CREATE TABLE IF NOT EXISTS carreras (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      facultad_id INT REFERENCES facultades(id) ON DELETE CASCADE,
      UNIQUE (nombre, facultad_id)
    );
  `;

  // ESPECIALIDADES
  await sql`
    CREATE TABLE IF NOT EXISTS especialidades (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  // RELACIÓN N:M Carreras ↔ Especialidades
  await sql`
    CREATE TABLE IF NOT EXISTS carreras_especialidades (
      carrera_id INT REFERENCES carreras(id) ON DELETE CASCADE,
      especialidad_id INT REFERENCES especialidades(id) ON DELETE CASCADE,
      PRIMARY KEY (carrera_id, especialidad_id)
    );
  `;

  // AUTORES
  await sql`
    CREATE TABLE IF NOT EXISTS autores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE,
      nacionalidad VARCHAR(100)
    );
  `;

  // LIBROS
  await sql`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL UNIQUE,
      descripcion TEXT,
      isbn VARCHAR(20) UNIQUE,
      anio_publicacion INT,
      editorial VARCHAR(255),
      idioma VARCHAR(100),
      paginas INT,
      palabras_clave TEXT[],
      pdf_url TEXT,
      examen_pdf_url TEXT,
      imagen TEXT,
      facultad_id INT REFERENCES facultades(id) ON DELETE CASCADE,
      carrera_id INT REFERENCES carreras(id) ON DELETE CASCADE,
      especialidad_id INT REFERENCES especialidades(id) ON DELETE CASCADE,
      video_urls TEXT[],
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // LIBROS_AUTORES
  await sql`
    CREATE TABLE IF NOT EXISTS libros_autores (
      libro_id INT REFERENCES libros(id) ON DELETE CASCADE,
      autor_id INT REFERENCES autores(id) ON DELETE CASCADE,
      PRIMARY KEY (libro_id, autor_id)
    );
  `;

  // USUARIOS
  await sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      carrera_id INT REFERENCES carreras(id),
      rol VARCHAR(20) NOT NULL CHECK (rol IN ('ALUMNO','ADMIN','BIBLIOTECARIO')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      activo BOOLEAN DEFAULT TRUE
    );
  `;

  // LIBROS ASIGNADOS
  await sql`
    CREATE TABLE IF NOT EXISTS libros_asignados (
      usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
      libro_id INT REFERENCES libros(id) ON DELETE CASCADE,
      fecha_asignacion DATE NOT NULL,
      PRIMARY KEY (usuario_id, libro_id)
    );
  `;
}

/* ===========================
   LIMPIAR TABLAS
=========================== */
async function clearTables() {
  await sql`TRUNCATE TABLE libros_asignados, libros_autores, usuarios, libros, autores, carreras_especialidades, especialidades, carreras, facultades RESTART IDENTITY CASCADE`;
}

/* ===========================
   SEEDERS
=========================== */
async function seedFacultades() {
  for (const f of facultades) {
    await sql`
      INSERT INTO facultades (id, nombre)
      VALUES (${f.id}, ${f.nombre})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedCarreras() {
  for (const c of carreras) {
    await sql`
      INSERT INTO carreras (id, nombre, facultad_id)
      VALUES (${c.id}, ${c.nombre}, ${c.facultad_id})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedEspecialidades() {
  for (const e of especialidades) {
    await sql`
      INSERT INTO especialidades (id, nombre)
      VALUES (${e.id}, ${e.nombre})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedCarrerasEspecialidades() {
  for (const ce of carrerasEspecialidades) {
    await sql`
      INSERT INTO carreras_especialidades (carrera_id, especialidad_id)
      VALUES (${ce.carrera_id}, ${ce.especialidad_id})
      ON CONFLICT (carrera_id, especialidad_id) DO NOTHING;
    `;
  }
}

async function seedAutores() {
  for (const a of autores) {
    await sql`
      INSERT INTO autores (id, nombre, nacionalidad)
      VALUES (${a.id}, ${a.nombre}, ${a.nacionalidad})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedLibros() {
  for (const l of libros) {
    await sql`
      INSERT INTO libros (
        id, titulo, descripcion, isbn, anio_publicacion, editorial, idioma, paginas,
        palabras_clave, pdf_url, examen_pdf_url, imagen,
        facultad_id, carrera_id, especialidad_id, video_urls, created_at
      )
      VALUES (
        ${l.id}, ${l.titulo}, ${l.descripcion}, ${l.isbn}, ${
      l.anio_publicacion
    },
        ${l.editorial}, ${l.idioma}, ${l.paginas}, ${sql.array(
      l.palabras_clave
    )},
        ${l.pdf_url}, ${l.examen_pdf_url}, ${l.imagen},
        ${l.facultad_id}, ${l.carrera_id}, ${l.especialidad_id},
        ${sql.array(l.video_urls)}, ${l.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedLibrosAutores() {
  for (const la of librosAutores) {
    await sql`
      INSERT INTO libros_autores (libro_id, autor_id)
      VALUES (${la.libro_id}, ${la.autor_id})
      ON CONFLICT (libro_id, autor_id) DO NOTHING;
    `;
  }
}

async function seedUsuarios() {
  for (const u of usuarios) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await sql`
      INSERT INTO usuarios (
        id, nombre, email, password, carrera_id, rol, created_at, updated_at, activo
      )
      VALUES (
        ${u.id}, ${u.nombre}, ${u.email}, ${hashedPassword},
        ${u.carrera_id}, ${u.rol}, ${u.created_at}, ${u.updated_at}, ${u.activo}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

async function seedLibrosAsignados() {
  for (const la of librosAsignados) {
    await sql`
      INSERT INTO libros_asignados (usuario_id, libro_id, fecha_asignacion)
      VALUES (${la.usuario_id}, ${la.libro_id}, ${la.fecha_asignacion})
      ON CONFLICT (usuario_id, libro_id) DO NOTHING;
    `;
  }
}

/* ===========================
   MAIN
=========================== */
export async function GET() {
  try {
    await sql.begin(async () => {
      await createTables();
      await clearTables();
      await seedFacultades();
      await seedCarreras();
      await seedEspecialidades();
      await seedCarrerasEspecialidades();
      await seedAutores();
      await seedLibros();
      await seedLibrosAutores();
      await seedUsuarios();
      await seedLibrosAsignados();
    });

    return Response.json({ message: "✅ Base de datos sembrada con éxito 🚀" });
  } catch (error) {
    console.error("❌ Error al sembrar:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
