import Pagination from "@/app/ui/books/pagination";
import { nunito } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { BooksTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchEspecialidadesPages } from "@/app/lib/data/speciality.data";
import { CreateEspecialidad } from "@/app/ui/speciality/buttons";
import EspecialidadesTable from "@/app/ui/speciality/table";

export const metadata: Metadata = {
  title: "Especialidades",
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // 🔹 Obtener total de páginas según filtro
  const totalPages = await fetchEspecialidadesPages(query);

  return (
    <div className="relative overflow-x-hidden">
      {/* Título principal */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${nunito.className} text-2xl`}>Especialidades</h1>
      </div>

      {/* Barra de búsqueda y botón */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 p-2">
        <Search placeholder="Buscar especialidad o carrera..." />
        <CreateEspecialidad />
      </div>

      {/* Tabla de especialidades */}
      <div className="mt-4">
        <Suspense key={query + currentPage} fallback={<BooksTableSkeleton />}>
          <div className="overflow-x-auto">
            <EspecialidadesTable query={query} currentPage={currentPage} />
          </div>
        </Suspense>
      </div>

      {/* Paginación */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
