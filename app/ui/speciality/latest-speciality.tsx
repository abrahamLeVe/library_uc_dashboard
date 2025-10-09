import { Especialidad } from "@/app/lib/definitions/faculty.definition";
import { UpdateEspecialidad, DeleteEspecialidad } from "./buttons";

interface LatestEspecialidadesProps {
  especialidades: Especialidad[];
  id?: number | string;
}

export default function LatestEspecialidades({
  especialidades,
  id,
}: LatestEspecialidadesProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm text-gray-900">
            <thead className="bg-gray-100 text-left font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Carrera</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {especialidades.length > 0 ? (
                especialidades.map((especialidad) => (
                  <tr
                    key={especialidad.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{especialidad.id}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {especialidad.nombre}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {especialidad.carrera_nombre || "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {especialidad.id != id && (
                          <>
                            <UpdateEspecialidad id={especialidad.id} />
                            <DeleteEspecialidad id={especialidad.id} />
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
                    No hay especialidades registradas aún.
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
