import { fetchFilteredAuthors } from "@/app/lib/data/authors.data";
import { DeleteAuthor, UpdateAuthor } from "./buttons";

export default async function AutoresTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Obtenemos los autores con sus libros relacionados
  const autores = await fetchFilteredAuthors(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
          <table className="min-w-full text-gray-900 border-collapse">
            {/* Encabezado sticky elegante */}
            <thead className="sticky top-0 bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Nacionalidad</th>
                <th className="px-4 py-3">Libros Asociados</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {autores.length > 0 ? (
                autores.map((autor: any) => (
                  <tr
                    key={autor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{autor.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {autor.nombre}
                    </td>
                    <td className="px-4 py-3">{autor.nacionalidad || "—"}</td>
                    <td className="px-4 py-3">
                      {autor.libros?.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {autor.libros.map((libro: any) => (
                            <li key={libro.id}>
                              <span className="text-blue-600">
                                {libro.titulo}
                              </span>{" "}
                              <span className="text-gray-500 text-xs">
                                ({libro.anio_publicacion})
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">
                          Sin libros asignados
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <UpdateAuthor id={autor.id} />
                        <DeleteAuthor id={autor.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No se encontraron autores
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
