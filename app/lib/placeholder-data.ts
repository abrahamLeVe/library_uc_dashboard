// =======================
// FACULTADES
// =======================
export const facultades = [
  { id: 1, nombre: "Facultad de Ciencias de la Empresa" },
  { id: 2, nombre: "Facultad de Ingeniería" },
  { id: 3, nombre: "Facultad de Humanidades" },
  { id: 4, nombre: "Facultad de Derecho" },
  { id: 5, nombre: "Facultad de Salud" },
];

// =======================
// CARRERAS
// =======================
export const carreras = [
  { id: 1, nombre: "Administración y Finanzas", facultad_id: 1 },
  { id: 2, nombre: "Ingeniería Civil", facultad_id: 2 },
  { id: 3, nombre: "Psicología", facultad_id: 3 },
  { id: 4, nombre: "Derecho", facultad_id: 4 },
  { id: 5, nombre: "Medicina Humana", facultad_id: 5 },
];

// =======================
// ESPECIALIDADES
// =======================
export const especialidades = [
  { id: 1, nombre: "Gestión Financiera", carrera_id: 1 },
  { id: 2, nombre: "Estructuras", carrera_id: 2 },
  { id: 3, nombre: "Psicología Clínica", carrera_id: 3 },
  { id: 4, nombre: "Derecho Penal", carrera_id: 4 },
  { id: 5, nombre: "Pediatría", carrera_id: 5 },
];

// =======================
// AUTORES
// =======================
export const autores = [
  { id: 1, nombre: "Robert Kiyosaki", nacionalidad: "Estadounidense" },
  { id: 2, nombre: "Mario Vargas Llosa", nacionalidad: "Peruano" },
  { id: 3, nombre: "Sigmund Freud", nacionalidad: "Austríaco" },
  { id: 4, nombre: "Cesare Beccaria", nacionalidad: "Italiano" },
  { id: 5, nombre: "Robbins & Cotran", nacionalidad: "Estadounidense" },
];

// =======================
// LIBROS
// =======================
export const libros = [
  {
    id: 1,
    titulo: "Padre Rico, Padre Pobre",
    descripcion: "Un libro de educación financiera que enseña la diferencia entre activos y pasivos.",
    isbn: "978-1612680194",
    anio_publicacion: 1997,
    editorial: "Plata Publishing",
    idioma: "Español",
    paginas: 336,
    palabras_clave: ["finanzas personales", "inversión", "educación financiera"],
    pdf_url: "/pdfs/padre-rico.pdf",
    examen_pdf_url: "/pdfs/examen-padre-rico.pdf",
    especialidad_id: 1,
    autor_id: 1,
    created_at: "2024-09-01T10:00:00Z",
  },
  {
    id: 2,
    titulo: "Análisis Estructural",
    descripcion: "Principios y métodos para el análisis de estructuras en ingeniería civil.",
    isbn: "978-0132915540",
    anio_publicacion: 2012,
    editorial: "Pearson",
    idioma: "Español",
    paginas: 720,
    palabras_clave: ["estructuras", "ingeniería civil", "cálculo"],
    pdf_url: "/pdfs/analisis-estructural.pdf",
    examen_pdf_url: "/pdfs/examen-analisis-estructural.pdf",
    especialidad_id: 2,
    autor_id: 2,
    created_at: "2024-09-05T12:30:00Z",
  },
  {
    id: 3,
    titulo: "La Interpretación de los Sueños",
    descripcion: "Obra fundamental de la psicología en la que Freud expone la teoría del inconsciente.",
    isbn: "978-8499088044",
    anio_publicacion: 1900,
    editorial: "Penguin Clásicos",
    idioma: "Español",
    paginas: 672,
    palabras_clave: ["psicoanálisis", "sueños", "subconsciente"],
    pdf_url: "/pdfs/interpretacion-suenos.pdf",
    examen_pdf_url: "/pdfs/examen-suenos.pdf",
    especialidad_id: 3,
    autor_id: 3,
    created_at: "2024-09-10T09:15:00Z",
  },
  {
    id: 4,
    titulo: "De los Delitos y de las Penas",
    descripcion: "Tratado clásico de derecho penal que sentó las bases del sistema moderno de justicia.",
    isbn: "978-8491051770",
    anio_publicacion: 1764,
    editorial: "Tecnos",
    idioma: "Español",
    paginas: 240,
    palabras_clave: ["derecho penal", "justicia", "criminología"],
    pdf_url: "/pdfs/delitos-penas.pdf",
    examen_pdf_url: "/pdfs/examen-delitos.pdf",
    especialidad_id: 4,
    autor_id: 4,
    created_at: "2024-09-15T14:45:00Z",
  },
  {
    id: 5,
    titulo: "Patología Estructural y Funcional",
    descripcion: "Manual de referencia en medicina para comprender la fisiopatología y enfermedades.",
    isbn: "978-1455726134",
    anio_publicacion: 2014,
    editorial: "Elsevier",
    idioma: "Español",
    paginas: 1400,
    palabras_clave: ["medicina", "patología", "pediatría"],
    pdf_url: "/pdfs/patologia.pdf",
    examen_pdf_url: "/pdfs/examen-patologia.pdf",
    especialidad_id: 5,
    autor_id: 5,
    created_at: "2024-09-20T08:00:00Z",
  },
];

// =======================
// USUARIOS
// =======================
export const usuarios = [
  // Alumnos
  {
    id: 1,
    nombre: "Ana Torres",
    email: "ana@uc.edu.pe",
    password: "hashedpassword1",
    carrera_id: 1,
    rol: "ALUMNO",
  },
  {
    id: 2,
    nombre: "Luis Fernández",
    email: "luis@uc.edu.pe",
    password: "hashedpassword2",
    carrera_id: 2,
    rol: "ALUMNO",
  },
  {
    id: 3,
    nombre: "María López",
    email: "maria@uc.edu.pe",
    password: "hashedpassword3",
    carrera_id: 3,
    rol: "ALUMNO",
  },
  {
    id: 4,
    nombre: "Carlos Rojas",
    email: "carlos@uc.edu.pe",
    password: "hashedpassword4",
    carrera_id: 4,
    rol: "ALUMNO",
  },
  {
    id: 5,
    nombre: "Sofía García",
    email: "sofia@uc.edu.pe",
    password: "hashedpassword5",
    carrera_id: 5,
    rol: "ALUMNO",
  },

  // Admins
  {
    id: 6,
    nombre: "Administrador General",
    email: "admin@uc.edu.pe",
    password: "hashedadmin",
    carrera_id: null,
    rol: "ADMIN",
  },
  {
    id: 7,
    nombre: "Bibliotecario",
    email: "biblio@uc.edu.pe",
    password: "hashedbiblio",
    carrera_id: null,
    rol: "ADMIN",
  },
];

// =======================
// LIBROS ASIGNADOS
// =======================
export const librosAsignados = [
  { usuario_id: 1, libro_id: 1, fecha_asignacion: "2025-09-25" },
  { usuario_id: 2, libro_id: 2, fecha_asignacion: "2025-09-25" },
  { usuario_id: 3, libro_id: 3, fecha_asignacion: "2025-09-25" },
  { usuario_id: 4, libro_id: 4, fecha_asignacion: "2025-09-25" },
  { usuario_id: 5, libro_id: 5, fecha_asignacion: "2025-09-25" },
];
