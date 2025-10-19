import Pagination from "@/app/ui/books/pagination";
import { nunito } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { BooksTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";

import { fetchPalabrasClavePages } from "@/app/lib/data/palabras-clave.data";
import KeywordsTable from "@/app/ui/keywords/table";
import { CreateKeyword } from "@/app/ui/keywords/buttons";

export const metadata: Metadata = {
  title: "Palabras Clave",
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  // 🔹 Obtener total de páginas según filtro
  const totalPages = await fetchPalabrasClavePages(query);

  return (
    <div className="relative overflow-x-hidden">
      {/* Título principal */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${nunito.className} text-2xl`}>Palabras Clave</h1>
      </div>

      {/* Barra de búsqueda y botón */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 p-2">
        <Search placeholder="Buscar palabra clave o libro asociado..." />
        <CreateKeyword />
      </div>

      {/* Tabla de palabras clave */}
      <div className="mt-4">
        <Suspense key={query + currentPage} fallback={<BooksTableSkeleton />}>
          <div className="overflow-x-auto">
            <KeywordsTable
              query={query}
              currentPage={currentPage}
              user={session.user}
            />
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
