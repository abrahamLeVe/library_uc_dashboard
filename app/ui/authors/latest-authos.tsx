import { Autor } from "@/app/lib/definitions/authors.definition";
import { UpdateAuthor, DeleteAuthor } from "./buttons";
// import { DeleteAuthor, UpdateAuthor } from "./buttons";

interface LatestAuthorsProps {
  autores: Autor[];
  id: number | string;
}

export default function LatestAuthors({ autores, id }: LatestAuthorsProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">ID</th>
                  <th className="px-3 py-5 font-medium">Nombre</th>
                  <th className="px-4 py-3">Nacionalidad</th>
                  <th className="px-3 py-5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {autores.map((autor) => (
                  <tr
                    key={autor.id}
                    className="border-b text-sm last:border-none"
                  >
                    <td className="py-3 pl-6 pr-3">{autor.id}</td>
                    <td className="px-3 py-3">{autor.nombre}</td>

                    <td className="px-4 py-3">{autor.nacionalidad || "—"}</td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {autor.id != id && (
                          <>
                            <UpdateAuthor id={autor.id} />
                            <DeleteAuthor id={autor.id} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
