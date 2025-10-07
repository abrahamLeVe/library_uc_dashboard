import { fetchFilteredUsers } from "@/app/lib/data/users.data";
import { User } from "@/app/lib/definitions/users.definitions";
import { ActivateUser, DeactivateUser, UpdateUser } from "./buttons";

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await fetchFilteredUsers(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
          <table className="min-w-full text-gray-900 border-collapse">
            {/* Encabezado */}
            <thead className="sticky top-0 bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
              <tr>
                <th className="px-4 py-4 sm:pl-6">Nombre</th>
                <th className="px-3 py-4">Correo</th>
                <th className="px-3 py-4">Rol</th>
                <th className="px-3 py-4">Estado</th>
                <th className="px-3 py-4">Creado</th>
                <th className="px-3 py-4 text-right pr-6">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length > 0 ? (
                users.map((user: User) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Nombre */}
                    <td className="py-3 pl-6 pr-3 font-medium text-gray-800">
                      {user.nombre}
                    </td>

                    {/* Correo */}
                    <td className="px-3 py-3 text-gray-600">{user.email}</td>

                    {/* Rol */}
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.rol === "ADMIN"
                            ? "bg-blue-100 text-blue-700"
                            : user.rol === "ASISTENTE"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.rol}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.activo ? "Activo" : "Desactivado"}
                      </span>
                    </td>

                    {/* Fecha de creación */}
                    <td className="px-3 py-3 text-gray-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "es-PE",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    {/* Acciones */}
                    <td className="whitespace-nowrap py-3 pl-6 pr-6">
                      <div className="flex justify-end gap-3">
                        <UpdateUser id={user.id} />
                        {user.activo ? (
                          <DeactivateUser id={user.id} />
                        ) : (
                          <ActivateUser id={user.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Sin resultados
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-500 italic"
                  >
                    No se encontraron usuarios.
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
