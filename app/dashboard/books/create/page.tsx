import { fetchAutores } from "@/app/lib/data/authors.data";
import { fetchCarrerasAll } from "@/app/lib/data/career.data";
import { fetchFacultadesAll } from "@/app/lib/data/faculty.data";
import { fetchKeywordsAll } from "@/app/lib/data/palabras-clave.data";
import { fetchEspecialidadesAll } from "@/app/lib/data/speciality.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import Form from "@/app/ui/books/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Libro",
};

export default async function Page() {
  const [autores, facultades, carreras, especialidades, keywords] =
    await Promise.all([
      fetchAutores(),
      fetchFacultadesAll(),
      fetchCarrerasAll(),
      fetchEspecialidadesAll(),
      fetchKeywordsAll(),
    ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Libros", href: "/dashboard/books" },
          {
            label: "Crear Libro",
            href: "/dashboard/books/create",
            active: true,
          },
        ]}
      />

      <Form
        autores={autores}
        facultades={facultades}
        carreras={carreras}
        especialidades={especialidades}
        keywords={keywords}
      />
    </main>
  );
}
