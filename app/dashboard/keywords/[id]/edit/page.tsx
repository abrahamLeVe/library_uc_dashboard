import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchLibrosAll } from "@/app/lib/data/books.data";

import {
  fetchKeywordById,
  fetchKeywordsAll,
} from "@/app/lib/data/palabras-clave.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditKeywordForm from "@/app/ui/keywords/edit-fom";
import LatestKeywords from "@/app/ui/keywords/latest-keywords";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Editar Palabra Clave",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);

  // 🔹 Obtener la keyword específica y todas las keywords
  const keyword = await fetchKeywordById(id);
  const keywords = await fetchKeywordsAll();

  // 🔹 Obtener todos los libros (para el select en el formulario)
  const libros = await fetchLibrosAll();
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  if (!keyword) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Palabras Clave", href: "/dashboard/keywords" },
          {
            label: "Editar palabra clave",
            href: `/dashboard/keywords/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Formulario de edición */}
        <EditKeywordForm
          keyword={keyword}
          libros={libros}
          keywords={keywords}
        />

        {/* Tabla lateral con las más recientes */}
        <LatestKeywords keywords={keywords} user={session.user} />
      </div>
    </main>
  );
}
