import { Especialidad } from "@/app/lib/definitions/faculty.definition";
import { UpdateEspecialidad, DeleteEspecialidad } from "./buttons";
import { Session } from "next-auth";

interface LatestEspecialidadesProps {
  especialidades: Especialidad[];
  id?: number | string;
  user: Session["user"];
}

export default function LatestEspecialidades({
  especialidades,
  id,
  user,
}: LatestEspecialidadesProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
            <table className="min-w-full border border-gray-200 text-sm text-gray-900">
              {/* 🧠 Encabezado fijo */}
              <thead className="sticky top-0 bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
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
                              {/* Solo mostrar Delete si el usuario es ADMIN */}
                              {user?.role === "ADMIN" && (
                                <DeleteEspecialidad id={especialidad.id} />
                              )}
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
    </div>
  );
}
