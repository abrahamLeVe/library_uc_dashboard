import {
  fetchAutorById,
  fetchAutores,
} from "@/app/lib/data/authors/authors.data";
import EditAuthorForm from "@/app/ui/authors/edit-form";
import LatestAuthors from "@/app/ui/authors/latest-authos";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";

import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Autor",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const autor = await fetchAutorById(Number(id));
  const autores = await fetchAutores();

  if (!autor) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Autores", href: "/dashboard/author" },
          {
            label: "Editar autor",
            href: `/dashboard/author/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <EditAuthorForm autores={autores} autor={autor} />
        <LatestAuthors autores={autores} id={id} />
      </div>
    </main>
  );
}
