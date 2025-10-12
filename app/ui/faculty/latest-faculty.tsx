"use client";

import { useState } from "react";
import { Facultad } from "@/app/lib/definitions/faculty.definition";
import { UpdateFacultad, DeleteFacultad } from "./buttons";
import { Session } from "next-auth";

interface LatestFacultadesProps {
  facultades: Facultad[];
  id?: number | string;
  user: Session["user"];
}

export default function LatestFacultades({
  facultades,
  id,
  user,
}: LatestFacultadesProps) {
  const [search, setSearch] = useState("");

  // 🔍 Filtrar facultades en el cliente
  const filteredFacultades = facultades.filter((f) =>
    f.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      {/* 🔎 Barra de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar facultad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flow-root">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-200 text-sm text-gray-900">
            <thead className="sticky top-0 bg-gray-100 text-left font-semibold z-10">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredFacultades.length > 0 ? (
                filteredFacultades.map((facultad) => (
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
                            {user?.role === "ADMIN" && (
                              <DeleteFacultad id={facultad.id} />
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
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No se encontraron facultades.
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
