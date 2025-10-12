// =======================
// FACULTADES
// =======================
export const facultades = [
  { id: 1001, nombre: "Facultad de Ciencias de la Empresa" },
  { id: 1002, nombre: "Facultad de Ingeniería" },
  { id: 1003, nombre: "Facultad de Humanidades" },
  { id: 1004, nombre: "Facultad de Derecho" },
  { id: 1005, nombre: "Facultad de Salud" },
];

// =======================
// CARRERAS
// =======================
export const carreras = [
  { id: 1101, nombre: "Administración y Finanzas", facultad_id: 1001 },
  { id: 1102, nombre: "Administración y Marketing", facultad_id: 1001 },
  { id: 1201, nombre: "Ingeniería Civil", facultad_id: 1002 },
  { id: 1202, nombre: "Ingeniería Industrial", facultad_id: 1002 },
  { id: 1203, nombre: "Ciencia de la Computación", facultad_id: 1002 },
  { id: 1301, nombre: "Psicología", facultad_id: 1003 },
  { id: 1401, nombre: "Derecho", facultad_id: 1004 },
];

// =======================
// ESPECIALIDADES
// =======================
export const especialidades = [
  { id: 1601, nombre: "Cálculo" },
  { id: 1602, nombre: "Gestión Financiera" },
  { id: 1603, nombre: "Marketing Digital" },
  { id: 1604, nombre: "Psicología Clínica" },
  { id: 1605, nombre: "Derecho Penal" },
];

// =======================
// RELACIÓN MUCHOS A MUCHOS (Carreras ↔ Especialidades)
// =======================
export const carrerasEspecialidades = [
  { carrera_id: 1201, especialidad_id: 1601 }, // Cálculo en Ing. Civil
  { carrera_id: 1202, especialidad_id: 1601 }, // Cálculo en Ing. Industrial
  { carrera_id: 1203, especialidad_id: 1601 }, // Cálculo en Computación
  { carrera_id: 1101, especialidad_id: 1602 },
  { carrera_id: 1102, especialidad_id: 1603 },
  { carrera_id: 1301, especialidad_id: 1604 },
  { carrera_id: 1401, especialidad_id: 1605 },
];

// =======================
// LIBROS
// =======================
export const libros = [
  {
    id: 1401,
    titulo: "Padre Rico, Padre Pobre",
    descripcion:
      "Un libro de educación financiera que enseña la diferencia entre activos y pasivos.",
    isbn: "978-1612680194",
    anio_publicacion: 1997,
    editorial: "Plata Publishing",
    idioma: "Español",
    paginas: 336,
    palabras_clave: [
      "finanzas personales",
      "inversión",
      "educación financiera",
    ],
    pdf_url: "/pdfs/padre-rico.pdf",
    examen_pdf_url: "/pdfs/examen-padre-rico.pdf",
    imagen: "",
    facultad_id: 1001,
    carrera_id: 1101,
    especialidad_id: 1602,
    created_at: "2025-01-15T10:00:00Z",

    video_urls: [
      "https://www.youtube.com/watch?v=3bK8e9qD_0E",
      "https://www.youtube.com/watch?v=Vx2LtpJXEhY",
    ],
  },
  {
    id: 1402,
    titulo: "Análisis Estructural",
    descripcion:
      "Principios y métodos para el análisis de estructuras en ingeniería civil.",
    isbn: "978-0132915540",
    anio_publicacion: 2012,
    editorial: "Pearson",
    idioma: "Español",
    paginas: 720,
    palabras_clave: ["estructuras", "ingeniería civil", "cálculo"],
    pdf_url: "/pdfs/analisis-estructural.pdf",
    examen_pdf_url: "/pdfs/examen-analisis-estructural.pdf",
    imagen: "",
    facultad_id: 1002,
    carrera_id: 1201,
    especialidad_id: 1601,
    created_at: "2025-09-05T12:30:00Z",

    video_urls: [
      "https://www.youtube.com/watch?v=t6hL_5fDGrs",
      "https://www.youtube.com/watch?v=yoz2jxqg5dc",
    ],
  },
  {
    id: 1403,
    titulo: "La Interpretación de los Sueños",
    descripcion:
      "Obra fundamental de la psicología en la que Freud expone la teoría del inconsciente.",
    isbn: "978-8499088044",
    anio_publicacion: 1900,
    editorial: "Penguin Clásicos",
    idioma: "Español",
    paginas: 672,
    palabras_clave: ["psicoanálisis", "sueños", "subconsciente"],
    pdf_url: "/pdfs/interpretacion-suenos.pdf",
    examen_pdf_url: "/pdfs/examen-suenos.pdf",
    imagen: "",
    facultad_id: 1003,
    carrera_id: 1301,
    especialidad_id: 1604,
    created_at: "2025-09-10T09:15:00Z",

    video_urls: [""],
  },
];

// =======================
// AUTORES
// =======================
export const autores = [
  { id: 1301, nombre: "Robert Kiyosaki", nacionalidad: "Estadounidense" },
  { id: 1302, nombre: "Sigmund Freud", nacionalidad: "Austríaco" },
];

// =======================
// LIBROS_AUTORES
// =======================
export const librosAutores = [
  { libro_id: 1401, autor_id: 1301 },
  { libro_id: 1403, autor_id: 1302 },
];

// =======================
// USUARIOS
// =======================
export const usuarios = [
  {
    id: 1501,
    nombre: "Ana Torres",
    email: "ana@uc.edu.pe",
    password: "hashedpassword1",
    carrera_id: 1101,
    rol: "ALUMNO",
    created_at: "2025-01-10T08:32:45.000Z",
    updated_at: "2025-03-15T10:20:30.000Z",
    activo: true,
  },
  {
    id: 1506,
    nombre: "Administrador General",
    email: "admin@uc.edu.pe",
    password: "hashedadmin",
    carrera_id: null,
    rol: "ADMIN",
    created_at: "2025-01-01T09:00:00.000Z",
    updated_at: "2025-06-05T11:30:00.000Z",
    activo: true,
  },
  {
    id: 1507,
    nombre: "Bibliotecario",
    email: "biblio@uc.edu.pe",
    password: "hashedbiblio",
    carrera_id: null,
    rol: "BIBLIOTECARIO",
    created_at: "2025-02-20T08:25:10.000Z",
    updated_at: "2025-05-20T10:45:55.000Z",
    activo: true,
  },
];

// =======================
// LIBROS ASIGNADOS
// =======================
export const librosAsignados = [
  { usuario_id: 1501, libro_id: 1402, fecha_asignacion: "2025-09-25" },
  { usuario_id: 1501, libro_id: 1403, fecha_asignacion: "2025-09-25" },
  { usuario_id: 1501, libro_id: 1401, fecha_asignacion: "2025-09-25" },
];
