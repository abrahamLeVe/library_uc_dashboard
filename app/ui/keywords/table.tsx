import { fetchFilteredPalabrasClave } from "@/app/lib/data/palabras-clave.data";
import { DeleteKeyword, UpdateKeyword } from "./buttons";
import { Session } from "next-auth";

export default async function KeywordsTable({
  query,
  currentPage,
  user,
}: {
  query: string;
  currentPage: number;
  user: Session["user"];
}) {
  const keywords = await fetchFilteredPalabrasClave(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
          <table className="min-w-full text-gray-900 border-collapse">
            {/* Encabezado */}
            <thead className="sticky top-0 bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Palabra Clave</th>
                <th className="px-4 py-3">Libros Asociados</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {keywords.length > 0 ? (
                keywords.map((keyword: any) => (
                  <tr
                    key={keyword.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{keyword.id}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {keyword.nombre}
                    </td>

                    <td className="px-4 py-3">
                      {keyword.libros?.length > 0 ? (
                        <ul className="list-disc list-inside text-blue-600">
                          {keyword.libros.map((libro: any) => (
                            <li key={libro.id}>{libro.titulo}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">
                          Sin libros asociados
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-6">
                      <div className="flex justify-center gap-2">
                        <UpdateKeyword id={keyword.id} />
                        {user?.role === "ADMIN" && (
                          <DeleteKeyword id={keyword.id} />
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
                    No se encontraron palabras clave
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
