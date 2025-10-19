// app/lib/definitions/keywords.definition.ts

export interface OnlyLibro {
  id: number;
  titulo: string;
}

export interface Keyword {
  id: number;
  nombre: string;
  libros?: OnlyLibro[]; // Los libros asociados a esta palabra clave
}
