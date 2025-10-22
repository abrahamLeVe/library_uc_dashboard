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
// ===============================
// LIBROS ↔ ESPECIALIDADES (N:M)
// ===============================
export const librosEspecialidades = [
  // Padre Rico, Padre Pobre → Educación financiera
  { libro_id: 1401, especialidad_id: 1602 },

  // Análisis Estructural → Cálculo
  { libro_id: 1402, especialidad_id: 1601 },

  // La Interpretación de los Sueños → Psicología Clínica
  { libro_id: 1403, especialidad_id: 1604 },

  // El Poder del Hábito → Derecho Penal (según tu data actual)
  { libro_id: 1404, especialidad_id: 1605 },
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
    pdf_url: "/pdfs/interpretacion-suenos.pdf",
    examen_pdf_url: "/pdfs/examen-suenos.pdf",
    imagen: "",
    facultad_id: 1003,
    carrera_id: 1301,
    especialidad_id: 1604,
    created_at: "2025-09-10T09:15:00Z",
    video_urls: [""],
  },
  {
    id: 1404,
    titulo: "El Poder del Hábito",
    descripcion:
      "Explora cómo los hábitos influyen en nuestras vidas y cómo cambiarlos.",
    isbn: "978-0307741996",
    anio_publicacion: 2014,
    editorial: "Random House",
    idioma: "Español",
    paginas: 400,
    pdf_url: "/pdfs/poder-habito.pdf",
    examen_pdf_url: "/pdfs/examen-habito.pdf",
    imagen: "",
    facultad_id: 1003,
    carrera_id: 1301,
    especialidad_id: 1605,
    created_at: "2025-09-20T11:00:00Z",
    video_urls: ["https://www.youtube.com/watch?v=OMbsGBlpP30"],
  },
];

// =======================
// PALABRAS CLAVE
// =======================
export const palabrasClave = [
  { id: 1000, nombre: "matemáticas" },
  { id: 1001, nombre: "álgebra" },
  { id: 1002, nombre: "cálculo diferencial" },
  { id: 1003, nombre: "cálculo integral" },
  { id: 1004, nombre: "física" },
  { id: 1005, nombre: "química" },
  { id: 1006, nombre: "biología" },
  { id: 1007, nombre: "genética" },
  { id: 1008, nombre: "microbiología" },
  { id: 1009, nombre: "anatomía" },
  { id: 1010, nombre: "fisiología" },
  { id: 1011, nombre: "bioquímica" },
  { id: 1012, nombre: "programación" },
  { id: 1013, nombre: "inteligencia artificial" },
  { id: 1014, nombre: "algoritmos" },
  { id: 1015, nombre: "desarrollo web" },
  { id: 1016, nombre: "bases de datos" },
  { id: 1017, nombre: "sistemas operativos" },
  { id: 1018, nombre: "redes" },
  { id: 1019, nombre: "seguridad informática" },
  { id: 1020, nombre: "big data" },
  { id: 1021, nombre: "machine learning" },
  { id: 1022, nombre: "estadística" },
  { id: 1023, nombre: "probabilidad" },
  { id: 1025, nombre: "infraestructura" },
  { id: 1026, nombre: "mecánica de suelos" },
  { id: 1027, nombre: "topografía" },
  { id: 1028, nombre: "concreto armado" },
  { id: 1029, nombre: "resistencia de materiales" },
  { id: 1030, nombre: "hidráulica" },
  { id: 1031, nombre: "electrónica" },
  { id: 1032, nombre: "circuitos eléctricos" },
  { id: 1033, nombre: "sistemas digitales" },
  { id: 1034, nombre: "robótica" },
  { id: 1035, nombre: "telecomunicaciones" },
  { id: 1036, nombre: "control automático" },
  { id: 1037, nombre: "ingeniería industrial" },
  { id: 1038, nombre: "logística" },
  { id: 1039, nombre: "gestión de operaciones" },
  { id: 1040, nombre: "lean manufacturing" },
  { id: 1041, nombre: "investigación de operaciones" },
  { id: 1042, nombre: "economía" },
  { id: 1043, nombre: "microeconomía" },
  { id: 1044, nombre: "macroeconomía" },
  { id: 1045, nombre: "contabilidad" },
  { id: 1046, nombre: "finanzas" },
  { id: 1047, nombre: "auditoría" },
  { id: 1048, nombre: "administración" },
  { id: 1049, nombre: "marketing" },
  { id: 1050, nombre: "recursos humanos" },
  { id: 1051, nombre: "liderazgo" },
  { id: 1052, nombre: "emprendimiento" },
  { id: 1053, nombre: "ética empresarial" },
  { id: 1054, nombre: "derecho civil" },
  { id: 1055, nombre: "derecho penal" },
  { id: 1056, nombre: "derecho constitucional" },
  { id: 1057, nombre: "derecho laboral" },
  { id: 1058, nombre: "derecho internacional" },
  { id: 1059, nombre: "psicología" },
  { id: 1061, nombre: "conductismo" },
  { id: 1062, nombre: "psicología social" },
  { id: 1063, nombre: "neurociencia" },
  { id: 1064, nombre: "sociología" },
  { id: 1065, nombre: "antropología" },
  { id: 1066, nombre: "filosofía" },
  { id: 1067, nombre: "lógica" },
  { id: 1068, nombre: "ética" },
  { id: 1069, nombre: "historia universal" },
  { id: 1070, nombre: "historia del arte" },
  { id: 1071, nombre: "literatura" },
  { id: 1072, nombre: "lingüística" },
  { id: 1073, nombre: "educación" },
  { id: 1074, nombre: "pedagogía" },
  { id: 1075, nombre: "metodología de investigación" },
  { id: 1076, nombre: "tesis" },
  { id: 1077, nombre: "metodología científica" },
  { id: 1078, nombre: "geografía" },
  { id: 1079, nombre: "astronomía" },
  { id: 1080, nombre: "geología" },
  { id: 1081, nombre: "ecología" },
  { id: 1082, nombre: "medio ambiente" },
  { id: 1083, nombre: "energías renovables" },
  { id: 1084, nombre: "sustentabilidad" },
  { id: 1085, nombre: "nutrición" },
  { id: 1086, nombre: "farmacología" },
  { id: 1087, nombre: "enfermería" },
  { id: 1088, nombre: "medicina" },
  { id: 1089, nombre: "cirugía" },
  { id: 1090, nombre: "odontología" },
  { id: 1091, nombre: "farmacéutica" },
  { id: 1092, nombre: "microcontroladores" },
  { id: 1093, nombre: "arduino" },
  { id: 1094, nombre: "diseño gráfico" },
  { id: 1095, nombre: "photoshop" },
  { id: 1096, nombre: "ilustración" },
  { id: 1097, nombre: "arquitectura" },
  { id: 1098, nombre: "dibujo técnico" },
  { id: 1099, nombre: "planeamiento urbano" },
  { id: 1100, nombre: "ética profesional" },
  { id: 1101, nombre: "teoría de juegos" },
  { id: 1102, nombre: "macroeconomía avanzada" },
  { id: 1103, nombre: "microeconomía intermedia" },
  { id: 1104, nombre: "ingeniería de software" },
  { id: 1105, nombre: "patrones de diseño" },
  { id: 1106, nombre: "arquitectura de software" },
  { id: 1107, nombre: "seguridad web" },
  { id: 1108, nombre: "criptografía" },
  { id: 1109, nombre: "biotecnología" },
  { id: 1110, nombre: "zoología" },
  { id: 1111, nombre: "botánica" },
  { id: 1112, nombre: "biología celular" },
  { id: 1113, nombre: "bioinformática" },
  { id: 1114, nombre: "biofísica" },
  { id: 1115, nombre: "óptica" },
  { id: 1116, nombre: "termodinámica" },
  { id: 1117, nombre: "hidrostática" },
  { id: 1118, nombre: "electromagnetismo" },
  { id: 1119, nombre: "física cuántica" },
  { id: 1120, nombre: "álgebra lineal" },
  { id: 1121, nombre: "ecuaciones diferenciales" },
  { id: 1122, nombre: "cálculo vectorial" },
  { id: 1123, nombre: "métodos numéricos" },
  { id: 1124, nombre: "teoría de números" },
  { id: 1125, nombre: "lógica matemática" },
  { id: 1126, nombre: "trigonometría" },
  { id: 1127, nombre: "geometría analítica" },
  { id: 1128, nombre: "estadística descriptiva" },
  { id: 1129, nombre: "estadística inferencial" },
  { id: 1130, nombre: "ingeniería ambiental" },
  { id: 1131, nombre: "saneamiento ambiental" },
  { id: 1132, nombre: "contaminación ambiental" },
  { id: 1133, nombre: "impacto ambiental" },
  { id: 1134, nombre: "desarrollo sostenible" },
  { id: 1135, nombre: "energía solar" },
  { id: 1136, nombre: "energía eólica" },
  { id: 1137, nombre: "energía hidráulica" },
  { id: 1138, nombre: "química orgánica" },
  { id: 1139, nombre: "química inorgánica" },
  { id: 1140, nombre: "química analítica" },
  { id: 1141, nombre: "termodinámica química" },
  { id: 1142, nombre: "mecánica clásica" },
  { id: 1143, nombre: "psicología educativa" },
  { id: 1144, nombre: "psicología clínica" },
  { id: 1145, nombre: "psicoterapia" },
  { id: 1146, nombre: "trabajo social" },
  { id: 1147, nombre: "criminología" },
  { id: 1148, nombre: "derecho procesal" },
  { id: 1149, nombre: "juicios orales" },
  { id: 1150, nombre: "metodología jurídica" },
  { id: 1151, nombre: "ciencia política" },
  { id: 1152, nombre: "relaciones internacionales" },
  { id: 1153, nombre: "geopolítica" },
  { id: 1154, nombre: "comercio exterior" },
  { id: 1155, nombre: "aduanas" },
  { id: 1156, nombre: "contabilidad financiera" },
  { id: 1157, nombre: "contabilidad de costos" },
  { id: 1158, nombre: "planeación financiera" },
  { id: 1159, nombre: "banca" },
  { id: 1160, nombre: "bolsa de valores" },
  { id: 1161, nombre: "proyectos de inversión" },
  { id: 1162, nombre: "microfinanzas" },
  { id: 1163, nombre: "emprendimiento digital" },
  { id: 1164, nombre: "comercio electrónico" },
  { id: 1165, nombre: "publicidad" },
  { id: 1166, nombre: "copywriting" },
  { id: 1167, nombre: "negociación" },
  { id: 1168, nombre: "coaching empresarial" },
  { id: 1169, nombre: "desarrollo profesional" },
  { id: 1170, nombre: "gestión de proyectos" },
  { id: 1171, nombre: "scrum" },
  { id: 1172, nombre: "pmi" },
  { id: 1173, nombre: "kanban" },
  { id: 1174, nombre: "metodologías ágiles" },
  { id: 1175, nombre: "sistemas de información" },
  { id: 1176, nombre: "ingeniería de datos" },
  { id: 1177, nombre: "devops" },
  { id: 1178, nombre: "docker" },
  { id: 1179, nombre: "kubernetes" },
  { id: 1180, nombre: "cloud computing" },
  { id: 1181, nombre: "aws" },
  { id: 1182, nombre: "azure" },
  { id: 1183, nombre: "google cloud" },
  { id: 1184, nombre: "react" },
  { id: 1185, nombre: "nodejs" },
  { id: 1186, nombre: "typescript" },
  { id: 1187, nombre: "nestjs" },
  { id: 1188, nombre: "sql" },
  { id: 1189, nombre: "postgresql" },
  { id: 1190, nombre: "mysql" },
  { id: 1191, nombre: "mongodb" },
  { id: 1192, nombre: "firebase" },
  { id: 1193, nombre: "data science" },
  { id: 1194, nombre: "estadística aplicada" },
  { id: 1195, nombre: "procesamiento de señales" },
  { id: 1196, nombre: "visión artificial" },
  { id: 1197, nombre: "realidad aumentada" },
  { id: 1198, nombre: "realidad virtual" },
  { id: 1199, nombre: "blockchain" },
  { id: 1200, nombre: "criptomonedas" },
  { id: 1701, nombre: "finanzas personales" },
  { id: 1702, nombre: "inversión" },
  { id: 1703, nombre: "educación financiera" },
  { id: 1704, nombre: "estructuras" },
  { id: 1705, nombre: "ingeniería civil" },
  { id: 1706, nombre: "cálculo" },
  { id: 1707, nombre: "psicoanálisis" },
  { id: 1708, nombre: "sueños" },
  { id: 1709, nombre: "subconsciente" },
  { id: 1710, nombre: "motivación" }, // 👈 Nueva palabra clave usada en varios libros
];

// ===============================
// LIBROS ↔ PALABRAS CLAVE (N:M)
// ===============================
export const librosPalabrasClave = [
  // Padre Rico, Padre Pobre
  { libro_id: 1401, palabra_id: 1701 },
  { libro_id: 1401, palabra_id: 1702 },
  { libro_id: 1401, palabra_id: 1703 },
  { libro_id: 1401, palabra_id: 1710 }, // también está relacionado con motivación

  // Análisis Estructural
  { libro_id: 1402, palabra_id: 1704 },
  { libro_id: 1402, palabra_id: 1705 },
  { libro_id: 1402, palabra_id: 1706 },

  // Interpretación de los Sueños
  { libro_id: 1403, palabra_id: 1707 },
  { libro_id: 1403, palabra_id: 1708 },
  { libro_id: 1403, palabra_id: 1709 },

  // El Poder del Hábito
  { libro_id: 1404, palabra_id: 1710 }, // también usa motivación
  { libro_id: 1404, palabra_id: 1703 }, // también relacionado con educación financiera

  // Extra: Otro libro con motivación
  { libro_id: 1402, palabra_id: 1710 }, // motivación en otro libro también
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
