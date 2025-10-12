import { fetchFilteredEspecialidades } from "@/app/lib/data/speciality.data";
import { DeleteEspecialidad, UpdateEspecialidad } from "./buttons";
import { Session } from "next-auth";

export default async function EspecialidadesTable({
  query,
  currentPage,
  user,
}: {
  query: string;
  currentPage: number;
  user: Session["user"];
}) {
  const especialidades = await fetchFilteredEspecialidades(query, currentPage);

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
                <th className="px-4 py-3">Carreras Asociadas</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {especialidades.length > 0 ? (
                especialidades.map((especialidad: any) => (
                  <tr
                    key={especialidad.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{especialidad.id}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {especialidad.nombre}
                    </td>

                    <td className="px-4 py-3">
                      {especialidad.carreras?.length > 0 ? (
                        <ul className="list-disc list-inside text-blue-600">
                          {especialidad.carreras.map((carrera: any) => (
                            <li key={carrera.id}>{carrera.nombre}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">
                          Sin carreras asociadas
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-6">
                      <div className="flex justify-center gap-2">
                        <UpdateEspecialidad id={especialidad.id} />
                        {/* Solo mostrar Delete si el usuario es ADMIN */}
                        {user?.role === "ADMIN" && (
                          <DeleteEspecialidad id={especialidad.id} />
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
                    No se encontraron especialidades
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
