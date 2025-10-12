import { fetchUsers } from "@/app/lib/data/users.data";
import { ActivateUser, DeactivateUser, UpdateUser } from "./buttons";

export default async function LatestUsers() {
  const users = await fetchUsers();

  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
            <table className="min-w-full border border-gray-200 text-sm text-gray-900">
              {/* 🧠 Encabezado fijo */}
              <thead className="sticky top-0 bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
                <tr>
                  <th className="px-4 py-4 sm:pl-6">Nombre</th>
                  <th className="px-3 py-4">Correo</th>
                  <th className="px-3 py-4">Rol</th>
                  <th className="px-3 py-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-none hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-3 pl-6 pr-3 font-medium text-gray-800">
                        {user.nombre}
                      </td>
                      <td className="px-3 py-3 text-gray-600">{user.email}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.rol === "ADMIN"
                              ? "bg-blue-100 text-blue-700"
                              : user.rol === "BIBLIOTECARIO"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.rol}
                        </span>
                      </td>
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
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-gray-500 italic"
                    >
                      No hay usuarios registrados todavía.
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
