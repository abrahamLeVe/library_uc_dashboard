import { fetchFacultadesPages } from "@/app/lib/data/faculty.data";
import Pagination from "@/app/ui/books/pagination";
import { CreateFacultad } from "@/app/ui/faculty/buttons";
import FacultadesTable from "@/app/ui/faculty/table";
import { nunito } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { BooksTableSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Facultades",
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFacultadesPages(query);
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <div className="relative overflow-x-hidden">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${nunito.className} text-2xl`}>Facultades</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 p-2">
        <Search placeholder="Buscar..." />
        <CreateFacultad />
      </div>

      <div className="mt-4">
        <Suspense key={query + currentPage} fallback={<BooksTableSkeleton />}>
          <div className="overflow-x-auto">
            <FacultadesTable
              query={query}
              currentPage={currentPage}
              user={session.user}
            />
          </div>
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
