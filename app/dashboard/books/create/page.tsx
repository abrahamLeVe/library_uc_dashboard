import {
  fetchFacultades,
  fetchCarreras,
  fetchEspecialidades,
} from "@/app/lib/data";
import { fetchAutores } from "@/app/lib/data/authors/authors.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import Form from "@/app/ui/books/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Libro",
};

export default async function Page() {
  const [autores, facultades, carreras, especialidades] = await Promise.all([
    fetchAutores(),
    fetchFacultades(),
    fetchCarreras(),
    fetchEspecialidades(),
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
      />
    </main>
  );
}
