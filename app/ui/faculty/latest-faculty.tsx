import { Facultad } from "@/app/lib/definitions/faculty.definition";
import { UpdateFacultad, DeleteFacultad } from "./buttons";

interface LatestFacultadesProps {
  facultades: Facultad[];
  id?: number | string;
}

export default function LatestFacultades({
  facultades,
  id,
}: LatestFacultadesProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm text-gray-900">
            <thead className="bg-gray-100 text-left font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {facultades.length > 0 ? (
                facultades.map((facultad) => (
                  <tr
                    key={facultad.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{facultad.id}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {facultad.nombre}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {facultad.id != id && (
                          <>
                            <UpdateFacultad id={facultad.id} />
                            <DeleteFacultad id={facultad.id} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No hay facultades registradas aún.
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
