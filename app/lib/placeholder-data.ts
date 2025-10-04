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
  { id: 1102, nombre: "Ingeniería Civil", facultad_id: 1002 },
  { id: 1103, nombre: "Psicología", facultad_id: 1003 },
  { id: 1104, nombre: "Derecho", facultad_id: 1004 },
  { id: 1105, nombre: "Medicina Humana", facultad_id: 1005 },
];

// =======================
// ESPECIALIDADES
// =======================
export const especialidades = [
  { id: 1201, nombre: "Gestión Financiera", carrera_id: 1101 },
  { id: 1202, nombre: "Estructuras", carrera_id: 1102 },
  { id: 1203, nombre: "Psicología Clínica", carrera_id: 1103 },
  { id: 1204, nombre: "Derecho Penal", carrera_id: 1104 },
  { id: 1205, nombre: "Pediatría", carrera_id: 1105 },
];

// =======================
// AUTORES
// =======================
export const autores = [
  { id: 1301, nombre: "Robert Kiyosaki", nacionalidad: "Estadounidense" },
  { id: 1302, nombre: "Mario Vargas Llosa", nacionalidad: "Peruano" },
  { id: 1303, nombre: "Sigmund Freud", nacionalidad: "Austríaco" },
  { id: 1304, nombre: "Cesare Beccaria", nacionalidad: "Italiano" },
  { id: 1305, nombre: "Robbins & Cotran", nacionalidad: "Estadounidense" },
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
    imagen: "/images/padre-rico.jpg",
    facultad_id: 1001, // Facultad de Ciencias de la Empresa
    carrera_id: 1101, // Administración y Finanzas
    especialidad_id: 1201, // Gestión Financiera
    created_at: "2025-01-15T10:00:00Z",
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
    imagen: "/images/analisis-estructural.jpg",
    facultad_id: 1002, // Facultad de Ingeniería
    carrera_id: 1102, // Ingeniería Civil
    especialidad_id: 1202, // Estructuras
    created_at: "2025-09-05T12:30:00Z",
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
    imagen: "/images/analisis-estructural.jpg",
    facultad_id: 1003, // Facultad de Humanidades
    carrera_id: 1103, // Psicología
    especialidad_id: 1203, // Psicología Clínica
    created_at: "2025-09-10T09:15:00Z",
  },
  {
    id: 1404,
    titulo: "De los Delitos y de las Penas",
    descripcion:
      "Tratado clásico de derecho penal que sentó las bases del sistema moderno de justicia.",
    isbn: "978-8491051770",
    anio_publicacion: 1764,
    editorial: "Tecnos",
    idioma: "Español",
    paginas: 240,
    palabras_clave: ["derecho penal", "justicia", "criminología"],
    pdf_url: "/pdfs/delitos-penas.pdf",
    examen_pdf_url: "/pdfs/examen-delitos.pdf",
    imagen: "/images/analisis-estructural.jpg",
    facultad_id: 1004, // Facultad de Derecho
    carrera_id: 1104, // Derecho
    especialidad_id: 1204, // Derecho Penal
    created_at: "2025-09-15T14:45:00Z",
  },
  {
    id: 1405,
    titulo: "Patología Estructural y Funcional",
    descripcion:
      "Manual de referencia en medicina para comprender la fisiopatología y enfermedades.",
    isbn: "978-1455726134",
    anio_publicacion: 2014,
    editorial: "Elsevier",
    idioma: "Español",
    paginas: 1400,
    palabras_clave: ["medicina", "patología", "pediatría"],
    pdf_url: "/pdfs/patologia.pdf",
    examen_pdf_url: "/pdfs/examen-patologia.pdf",
    imagen: "/images/analisis-estructural.jpg",
    facultad_id: 1005, // Facultad de Salud
    carrera_id: 1105, // Medicina Humana
    especialidad_id: 1205, // Pediatría
    created_at: "2025-09-20T08:00:00Z",
  },
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
  },
  {
    id: 1502,
    nombre: "Luis Fernández",
    email: "luis@uc.edu.pe",
    password: "hashedpassword2",
    carrera_id: 1102,
    rol: "ALUMNO",
  },
  {
    id: 1503,
    nombre: "María López",
    email: "maria@uc.edu.pe",
    password: "hashedpassword3",
    carrera_id: 1103,
    rol: "ALUMNO",
  },
  {
    id: 1504,
    nombre: "Carlos Rojas",
    email: "carlos@uc.edu.pe",
    password: "hashedpassword4",
    carrera_id: 1104,
    rol: "ALUMNO",
  },
  {
    id: 1505,
    nombre: "Sofía García",
    email: "sofia@uc.edu.pe",
    password: "hashedpassword5",
    carrera_id: 1105,
    rol: "ALUMNO",
  },
  {
    id: 1506,
    nombre: "Administrador General",
    email: "admin@uc.edu.pe",
    password: "hashedadmin",
    carrera_id: null,
    rol: "ADMIN",
  },
  {
    id: 1507,
    nombre: "Bibliotecario",
    email: "biblio@uc.edu.pe",
    password: "hashedbiblio",
    carrera_id: null,
    rol: "BIBLIOTECARIO",
  },
];

// =======================
// LIBROS ASIGNADOS
// =======================
export const librosAsignados = [
  { usuario_id: 1501, libro_id: 1401, fecha_asignacion: "2025-09-25" },
  { usuario_id: 1502, libro_id: 1402, fecha_asignacion: "2025-09-25" },
  { usuario_id: 1503, libro_id: 1403, fecha_asignacion: "2025-09-25" },
  { usuario_id: 1504, libro_id: 1404, fecha_asignacion: "2025-09-25" },
  { usuario_id: 1505, libro_id: 1405, fecha_asignacion: "2025-09-25" },
];

// =======================
// LIBROS_AUTORES
// =======================
export const librosAutores = [
  { libro_id: 1401, autor_id: 1301 },
  { libro_id: 1402, autor_id: 1302 },
  { libro_id: 1403, autor_id: 1303 },
  { libro_id: 1404, autor_id: 1304 },
  { libro_id: 1405, autor_id: 1305 },
  { libro_id: 1405, autor_id: 1302 }, // ejemplo de libro con varios autores
];
