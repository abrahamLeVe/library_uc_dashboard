import { fetchFilteredBooks } from "@/app/lib/data/books.data";
import { getPdfUrl } from "@/app/lib/s3";
import { DeleteBook, UpdateBook } from "./buttons";

export default async function LibrosTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const libros = await fetchFilteredBooks(query, currentPage);
  const librosConUrls = await Promise.all(
    libros.map(async (libro: any) => {
      const pdf_url_signed = libro.pdf_url
        ? await getPdfUrl(libro.pdf_url, 604800)
        : null;
      const examen_url_signed = libro.examen_pdf_url
        ? await getPdfUrl(libro.examen_pdf_url, 604800)
        : null;
      const imagen_url_signed = libro.imagen
        ? await getPdfUrl(libro.imagen, 604800)
        : null;

      return { ...libro, pdf_url_signed, examen_url_signed, imagen_url_signed };
    })
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
          <table className="min-w-full text-gray-900 border-collapse">
            <thead className="bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Autores</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Editorial</th>
                <th className="px-4 py-3">Idioma</th>
                <th className="px-4 py-3">Páginas</th>
                <th className="px-4 py-3">Facultad</th>
                <th className="px-4 py-3">Carrera</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3 text-center w-32">Archivos</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white text-xs">
              {librosConUrls.map((libro: any) => (
                <tr
                  key={libro.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {libro.imagen_url_signed ? (
                      <img
                        src={libro.imagen_url_signed}
                        alt={`Portada de ${libro.titulo}`}
                        className="h-16 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>

                  <td className="px-4 py-3">{libro.titulo}</td>
                  <td className="px-4 py-3">{libro.autores}</td>
                  <td className="px-4 py-3">{libro.anio}</td>
                  <td className="px-4 py-3">{libro.editorial}</td>
                  <td className="px-4 py-3">{libro.idioma}</td>
                  <td className="px-4 py-3">{libro.paginas}</td>
                  <td className="px-4 py-3">{libro.facultad}</td>
                  <td className="px-4 py-3">{libro.carrera}</td>
                  <td className="px-4 py-3">{libro.especialidad}</td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      {libro.pdf_url_signed && (
                        <a
                          href={libro.pdf_url_signed}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          📖 Libro
                        </a>
                      )}
                      {libro.examen_url_signed && (
                        <a
                          href={libro.examen_url_signed}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          📝 Examen
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <UpdateBook id={libro.id} />
                      <DeleteBook id={libro.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
