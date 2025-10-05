import { fetchFilteredFacultades } from "@/app/lib/data/faculty.data";
import { DeleteFacultad, UpdateFacultad } from "./buttons";

export default async function FacultadesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const facultades = await fetchFilteredFacultades(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 text-sm text-gray-900">
          <thead className="bg-gray-100 text-left font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Carreras Asociadas</th>
              <th className="px-4 py-3 text-center w-32">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {facultades.length > 0 ? (
              facultades.map((facultad: any) => (
                <tr
                  key={facultad.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{facultad.id}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {facultad.nombre}
                  </td>

                  <td className="px-4 py-3">
                    {facultad.carreras?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {facultad.carreras.map((carrera: any) => (
                          <li key={carrera.id}>
                            <span className="text-blue-600">
                              {carrera.nombre}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">
                        Sin carreras asignadas
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <UpdateFacultad id={facultad.id} />
                      <DeleteFacultad id={facultad.id} />
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
                  No se encontraron facultades
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
