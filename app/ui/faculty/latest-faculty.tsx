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
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">ID</th>
                  <th className="px-3 py-5 font-medium">Nombre</th>
                  <th className="px-3 py-5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {facultades.map((facultad) => (
                  <tr
                    key={facultad.id}
                    className="border-b text-sm last:border-none"
                  >
                    <td className="py-3 pl-6 pr-3">{facultad.id}</td>
                    <td className="px-3 py-3">{facultad.nombre}</td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {facultad.id != id && (
                          <>
                            <UpdateFacultad id={facultad.id} />
                            <DeleteFacultad id={facultad.id} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {facultades.length === 0 && (
              <p className="p-4 text-center text-gray-500 text-sm">
                No hay facultades registradas aún.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
