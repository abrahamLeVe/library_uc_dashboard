import { Carrera } from "@/app/lib/definitions/faculty.definition";
import { UpdateCarrera, DeleteCarrera } from "./buttons";
import { Session } from "next-auth";

interface LatestCarrerasProps {
  carreras: Carrera[];
  id?: number | string;
  user: Session["user"];
}

export default function LatestCarreras({
  carreras,
  id,
  user,
}: LatestCarrerasProps) {
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
                              {/* Solo mostrar Delete si el usuario es ADMIN */}
                              {user?.role === "ADMIN" && (
                                <DeleteCarrera id={carrera.id} />
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
                      No hay carreras registradas aún.
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
