import { fetchAutores } from "@/app/lib/data/authors/authors.data";
import AuthorForm from "@/app/ui/authors/create-form";
import LatestAuthors from "@/app/ui/authors/latest-authos";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Autor",
};

export default async function Page() {
  const autores = await fetchAutores();

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Autores", href: "/dashboard/author" },
          {
            label: "Registrar autor",
            href: "/dashboard/author/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <AuthorForm autores={autores} />

        <LatestAuthors autores={autores} id={""} />
      </div>
    </main>
  );
}
