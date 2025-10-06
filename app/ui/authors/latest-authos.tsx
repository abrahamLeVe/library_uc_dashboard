import { Autor } from "@/app/lib/definitions/authors.definition";
import { UpdateAuthor, DeleteAuthor } from "./buttons";

interface LatestAuthorsProps {
  autores: Autor[];
  id: number | string;
}

export default function LatestAuthors({ autores, id }: LatestAuthorsProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm text-gray-900">
            <thead className="bg-gray-100 text-left font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Nacionalidad</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {autores.length > 0 ? (
                autores.map((autor) => (
                  <tr
                    key={autor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{autor.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {autor.nombre}
                    </td>
                    <td className="px-4 py-3">
                      {autor.nacionalidad || (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {autor.id != id && (
                          <>
                            <UpdateAuthor id={autor.id} />
                            <DeleteAuthor id={autor.id} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
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
