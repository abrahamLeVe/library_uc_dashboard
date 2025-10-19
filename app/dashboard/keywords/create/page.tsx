import { fetchLibrosAll } from "@/app/lib/data/books.data";
import { fetchKeywordsAll } from "@/app/lib/data/palabras-clave.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import CreateKeywordForm from "@/app/ui/keywords/create-form";
import LatestKeywords from "@/app/ui/keywords/latest-keywords";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Palabra Clave",
};

export default async function Page() {
  // 🔹 Obtener todos los libros para asociarlos a una palabra clave
  const libros = await fetchLibrosAll();
  const keywords = await fetchKeywordsAll();
  const session = await auth();

  if (!session) return <div>Not authenticated</div>;

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Palabras Clave", href: "/dashboard/keywords" },
          {
            label: "Crear Palabra Clave",
            href: "/dashboard/keywords/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 🔹 Formulario para registrar palabra clave */}
        <CreateKeywordForm libros={libros} />

        {/* 🔹 Tabla con keywords más recientes */}
        <LatestKeywords keywords={keywords} user={session.user} />
      </div>
    </main>
  );
}
