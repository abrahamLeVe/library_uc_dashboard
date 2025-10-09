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
  // Facultad de Ciencias de la Empresa
  { id: 1101, nombre: "Administración y Finanzas", facultad_id: 1001 },
  {
    id: 1102,
    nombre: "Administración y Gestión del Talento Humano",
    facultad_id: 1001,
  },
  { id: 1103, nombre: "Administración y Marketing", facultad_id: 1001 },
  {
    id: 1104,
    nombre: "Administración y Negocios Digitales",
    facultad_id: 1001,
  },
  {
    id: 1105,
    nombre: "Administración y Negocios Internacionales",
    facultad_id: 1001,
  },
  { id: 1106, nombre: "Contabilidad y Finanzas", facultad_id: 1001 },
  { id: 1107, nombre: "Economía", facultad_id: 1001 },
  { id: 1108, nombre: "Administración", facultad_id: 1001 },

  // Facultad de Ingeniería
  { id: 1201, nombre: "Arquitectura", facultad_id: 1002 },
  { id: 1202, nombre: "Ciencia de la Computación", facultad_id: 1002 },
  { id: 1203, nombre: "Ingeniería Ambiental", facultad_id: 1002 },
  { id: 1204, nombre: "Ingeniería Civil", facultad_id: 1002 },
  { id: 1205, nombre: "Ingeniería de Minas", facultad_id: 1002 },
  { id: 1206, nombre: "Ingeniería Eléctrica", facultad_id: 1002 },
  { id: 1207, nombre: "Ingeniería Empresarial", facultad_id: 1002 },
  { id: 1208, nombre: "Ingeniería Industrial", facultad_id: 1002 },
  { id: 1209, nombre: "Ingeniería Mecánica", facultad_id: 1002 },
  { id: 1210, nombre: "Ingeniería Mecatrónica", facultad_id: 1002 },
  {
    id: 1211,
    nombre: "Ingeniería de Sistemas e Informática",
    facultad_id: 1002,
  },

  // Facultad de Humanidades
  { id: 1301, nombre: "Ciencias de la Comunicación", facultad_id: 1003 },
  { id: 1302, nombre: "Psicología", facultad_id: 1003 },

  // Facultad de Derecho
  { id: 1401, nombre: "Derecho", facultad_id: 1004 },

  // Facultad de Salud
  { id: 1501, nombre: "Enfermería", facultad_id: 1005 },
  { id: 1502, nombre: "Farmacia y Bioquímica", facultad_id: 1005 },
  { id: 1503, nombre: "Medicina Humana", facultad_id: 1005 },
  { id: 1504, nombre: "Odontología", facultad_id: 1005 },
  {
    id: 1505,
    nombre:
      "Tecnología Médica - Especialidad en Terapia Física y Rehabilitación",
    facultad_id: 1005,
  },
  {
    id: 1506,
    nombre: "Tecnología Médica - Laboratorio Clínico y Anatomía Patológica",
    facultad_id: 1005,
  },
  { id: 1507, nombre: "Tecnología Médica - Radiología", facultad_id: 1005 },
  { id: 1508, nombre: "Nutrición y Dietética", facultad_id: 1005 },
];

// =======================
// ESPECIALIDADES
// =======================
export const especialidades = [
  // Facultad de Ciencias de la Empresa
  { id: 1601, nombre: "Gestión Financiera", carrera_id: 1101 },
  { id: 1602, nombre: "Gestión del Talento Humano", carrera_id: 1102 },
  { id: 1603, nombre: "Marketing Digital", carrera_id: 1103 },
  { id: 1604, nombre: "Negocios Internacionales", carrera_id: 1105 },
  { id: 1605, nombre: "Contabilidad y Finanzas", carrera_id: 1106 },
  { id: 1606, nombre: "Economía", carrera_id: 1107 },

  // Facultad de Ingeniería
  { id: 1701, nombre: "Diseño de Interiores", carrera_id: 1201 },
  { id: 1702, nombre: "Sistemas de Información", carrera_id: 1202 },
  { id: 1703, nombre: "Ingeniería Ambiental", carrera_id: 1203 },
  { id: 1704, nombre: "Ingeniería Civil", carrera_id: 1204 },
  { id: 1705, nombre: "Ingeniería de Minas", carrera_id: 1205 },
  { id: 1706, nombre: "Ingeniería Eléctrica", carrera_id: 1206 },
  { id: 1707, nombre: "Ingeniería Empresarial", carrera_id: 1207 },
  { id: 1708, nombre: "Ingeniería Industrial", carrera_id: 1208 },
  { id: 1709, nombre: "Ingeniería Mecánica", carrera_id: 1209 },
  { id: 1710, nombre: "Ingeniería Mecatrónica", carrera_id: 1210 },
  {
    id: 1711,
    nombre: "Ingeniería de Sistemas e Informática",
    carrera_id: 1211,
  },

  // Facultad de Humanidades
  { id: 1801, nombre: "Comunicación Audiovisual", carrera_id: 1301 },
  { id: 1802, nombre: "Psicología Clínica", carrera_id: 1302 },

  // Facultad de Derecho
  { id: 1901, nombre: "Derecho Penal", carrera_id: 1401 },

  // Facultad de Salud
  { id: 2001, nombre: "Enfermería", carrera_id: 1501 },
  { id: 2002, nombre: "Farmacia y Bioquímica", carrera_id: 1502 },
  { id: 2003, nombre: "Medicina Humana", carrera_id: 1503 },
  { id: 2004, nombre: "Odontología", carrera_id: 1504 },
  { id: 2005, nombre: "Terapia Física y Rehabilitación", carrera_id: 1505 },
  {
    id: 2006,
    nombre: "Laboratorio Clínico y Anatomía Patológica",
    carrera_id: 1506,
  },
  { id: 2007, nombre: "Radiología", carrera_id: 1507 },
  { id: 2008, nombre: "Nutrición y Dietética", carrera_id: 1508 },
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
    facultad_id: 1001, // Facultad de Ciencias de la Empresa
    carrera_id: 1101, // Administración y Finanzas
    especialidad_id: 1601, // Gestión Financiera
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
    imagen: "",
    facultad_id: 1002, // Facultad de Ingeniería
    carrera_id: 1102, // Ingeniería Civil
    especialidad_id: 1704, // Estructuras
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
    imagen: "",
    facultad_id: 1003, // Facultad de Humanidades
    carrera_id: 1103, // Psicología
    especialidad_id: 1802, // Psicología Clínica
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
    imagen: "",
    facultad_id: 1004, // Facultad de Derecho
    carrera_id: 1104, // Derecho
    especialidad_id: 1901, // Derecho Penal
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
    imagen: "",
    facultad_id: 1005, // Facultad de Salud
    carrera_id: 1105, // Medicina Humana
    especialidad_id: 2003, // Pediatría
    created_at: "2025-09-20T08:00:00Z",
  },
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
    id: 1502,
    nombre: "Luis Fernández",
    email: "luis@uc.edu.pe",
    password: "hashedpassword2",
    carrera_id: 1102,
    rol: "ALUMNO",
    created_at: "2025-02-05T09:10:00.000Z",
    updated_at: "2025-04-10T11:45:12.000Z",
    activo: true,
  },
  {
    id: 1503,
    nombre: "María López",
    email: "maria@uc.edu.pe",
    password: "hashedpassword3",
    carrera_id: 1103,
    rol: "ALUMNO",
    created_at: "2025-01-25T14:22:17.000Z",
    updated_at: "2025-04-02T09:18:50.000Z",
    activo: true,
  },
  {
    id: 1504,
    nombre: "Carlos Rojas",
    email: "carlos@uc.edu.pe",
    password: "hashedpassword4",
    carrera_id: 1104,
    rol: "ALUMNO",
    created_at: "2025-02-15T10:05:30.000Z",
    updated_at: "2025-05-01T12:40:00.000Z",
    activo: true,
  },
  {
    id: 1505,
    nombre: "Sofía García",
    email: "sofia@uc.edu.pe",
    password: "hashedpassword5",
    carrera_id: 1105,
    rol: "ALUMNO",
    created_at: "2025-01-12T16:48:00.000Z",
    updated_at: "2025-04-22T13:15:25.000Z",
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
