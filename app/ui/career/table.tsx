import { fetchFilteredCarreras } from "@/app/lib/data/career.data";
import { DeleteCarrera, UpdateCarrera } from "./buttons";
import { Session } from "next-auth";

export default async function CarrerasTable({
  query,
  currentPage,
  user,
}: {
  query: string;
  currentPage: number;
  user: Session["user"];
}) {
  const carreras = await fetchFilteredCarreras(query, currentPage);

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
                <th className="px-4 py-3">Facultad Asociada</th>
                <th className="px-4 py-3">Especialidades</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {carreras.length > 0 ? (
                carreras.map((carrera: any) => (
                  <tr
                    key={carrera.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-4 py-3">{carrera.id}</td>

                    {/* Nombre */}
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {carrera.nombre}
                    </td>

                    {/* Facultad */}
                    <td className="px-4 py-3">
                      {carrera.facultad_nombre ? (
                        <span className="text-blue-600 font-medium">
                          {carrera.facultad_nombre}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Sin facultad asignada
                        </span>
                      )}
                    </td>

                    {/* Especialidades */}
                    <td className="px-4 py-3">
                      {carrera.especialidades?.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {carrera.especialidades.map((esp: any) => (
                            <li key={esp.id}>
                              <span className="text-green-600">
                                {esp.nombre}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">
                          Sin especialidades
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="whitespace-nowrap py-3 pl-6 pr-6">
                      <div className="flex justify-center gap-2">
                        <UpdateCarrera id={carrera.id} />
                        {/* Solo mostrar Delete si el usuario es ADMIN */}
                        {user?.role === "ADMIN" && (
                          <DeleteCarrera id={carrera.id} />
                        )}
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
                    No se encontraron carreras
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
