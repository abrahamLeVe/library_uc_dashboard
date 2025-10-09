import { Carrera } from "@/app/lib/definitions/faculty.definition";
import { UpdateCarrera, DeleteCarrera } from "./buttons";

interface LatestCarrerasProps {
  carreras: Carrera[];
  id?: number | string;
}

export default function LatestCarreras({ carreras, id }: LatestCarrerasProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm text-gray-900">
            <thead className="bg-gray-100 text-left font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Facultad</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {carreras.length > 0 ? (
                carreras.map((carrera) => (
                  <tr
                    key={carrera.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{carrera.id}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {carrera.nombre}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {carrera.facultad_nombre || (
                        <span className="italic text-gray-400">
                          Sin facultad
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {carrera.id != id && (
                          <>
                            <UpdateCarrera id={carrera.id} />
                            <DeleteCarrera id={carrera.id} />
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
                    No hay carreras registradas aún.
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
