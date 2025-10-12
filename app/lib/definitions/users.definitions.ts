export type Role = "ADMIN" | "BIBLIOTECARIO" | "ALUMNO";

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string; // en seed lo puedes hashear
  carrera_id?: number | null;
  rol: Role;
  created_at: string;
  updated_at: string;
  activo: boolean;
}
