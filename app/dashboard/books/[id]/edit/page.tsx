import { fetchLibroById } from "@/app/lib/data/books.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import Form from "@/app/ui/books/edit-form";
import { Metadata } from "next";
import { getPdfUrl } from "@/app/lib/s3";
import {
  fetchCarreras,
  fetchEspecialidades,
  fetchFacultadesAll,
} from "@/app/lib/data/faculty.data";
import { fetchAutores } from "@/app/lib/data/authors.data";

export const metadata: Metadata = {
  title: "Editar Libro",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // 1. Traemos datos en paralelo
  const [autores, facultades, carreras, especialidades, libro] =
    await Promise.all([
      fetchAutores(),
      fetchFacultadesAll(),
      fetchCarreras(),
      fetchEspecialidades(),
      fetchLibroById(id),
    ]);
  console.log("libro", libro);
  // 2. Generamos signed URLs para vista previa si existen archivos
  const libroConUrls = {
    ...libro,
    pdf_url_signed: libro.pdf_url
      ? await getPdfUrl(libro.pdf_url, 604800) // 7 días
      : null,
    examen_url_signed: libro.examen_pdf_url
      ? await getPdfUrl(libro.examen_pdf_url, 604800)
      : null,
    imagen_url_signed: libro.imagen
      ? await getPdfUrl(libro.imagen, 604800)
      : null,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Libros", href: "/dashboard/books" },
          {
            label: "Editar Libro",
            href: `/dashboard/books/${params.id}/edit`,
            active: true,
          },
        ]}
      />

      <Form
        autores={autores}
        facultades={facultades}
        carreras={carreras}
        especialidades={especialidades}
        libro={libroConUrls}
      />
    </main>
  );
}
