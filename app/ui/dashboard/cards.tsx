import { fetchCardData } from "@/app/lib/data/books.data";
import {
  AcademicCapIcon,
  BookmarkIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  RectangleStackIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { nunito } from "../fonts";

const iconMap = {
  libros: BookOpenIcon,
  facultades: BuildingLibraryIcon,
  carreras: AcademicCapIcon,
  especialidades: RectangleStackIcon,
  autores: UserGroupIcon,
  usuarios: TagIcon,
  librosAsignados: BookmarkIcon,
};

export default async function CardWrapper() {
  const {
    totalLibros,
    totalFacultades,
    totalCarreras,
    totalEspecialidades,
    totalAutores,
    totalUsuarios,
    totalLibrosAsignados,
  } = await fetchCardData();

  return (
    <>
      <Card title="Total Libros" value={totalLibros} type="libros" />
      <Card title="Facultades" value={totalFacultades} type="facultades" />
      <Card title="Carreras" value={totalCarreras} type="carreras" />
      <Card
        title="Especialidades"
        value={totalEspecialidades}
        type="especialidades"
      />
      <Card title="Autores" value={totalAutores} type="autores" />
      <Card title="Usuarios" value={totalUsuarios} type="usuarios" />
      <Card
        title="Libros Asignados"
        value={totalLibrosAsignados}
        type="librosAsignados"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type:
    | "libros"
    | "facultades"
    | "carreras"
    | "especialidades"
    | "autores"
    | "usuarios"
    | "librosAsignados";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${nunito.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
