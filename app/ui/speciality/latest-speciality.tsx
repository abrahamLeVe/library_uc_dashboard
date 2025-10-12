"use client";

import { useState } from "react";
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
  const [search, setSearch] = useState("");

  // 🔍 Filtrar especialidades en el cliente
  const filteredEspecialidades = especialidades.filter((e) => {
    const query = search.toLowerCase();
    const carreras =
      e.carreras?.map((c) => c.nombre.toLowerCase()).join(" ") || "";
    return e.nombre.toLowerCase().includes(query) || carreras.includes(query);
  });

  return (
    <div className="md:col-span-4 overflow-y-auto h-[550px] text-sm">
      <div className="flow-root">
        {/* 🔎 Barra de búsqueda */}
        <div className="mb-3 flex items-center justify-between">
          <input
            type="text"
            placeholder="Buscar especialidad o carrera..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl bg-gray-50 p-2 shadow-sm md:pt-0">
            <table className="min-w-full border border-gray-200 text-sm text-gray-900">
              {/* 🧠 Encabezado fijo */}
              <thead className="sticky top-0 bg-gray-100 text-left text-sm font-semibold shadow-sm z-10">
                <tr>
                  <th className="px-4 py-3 w-12">ID</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Carreras asociadas</th>
                  <th className="px-4 py-3 text-center w-32">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredEspecialidades.length > 0 ? (
                  filteredEspecialidades.map((especialidad) => (
                    <tr
                      key={especialidad.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">{especialidad.id}</td>

                      <td className="px-4 py-3 font-medium text-gray-800">
                        {especialidad.nombre}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {especialidad.carreras &&
                        especialidad.carreras.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {especialidad.carreras.map((carrera) => (
                              <li key={carrera.id}>
                                {carrera.nombre}
                                {carrera.facultad?.nombre && (
                                  <span className="text-gray-500">
                                    {" "}
                                    ({carrera.facultad.nombre})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          {especialidad.id != id && (
                            <>
                              <UpdateEspecialidad id={especialidad.id} />
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
                      No se encontraron especialidades.
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
