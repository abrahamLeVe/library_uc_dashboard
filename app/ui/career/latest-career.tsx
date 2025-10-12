"use client";

import { useState } from "react";
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
  const [search, setSearch] = useState("");

  // 🔍 Filtrar carreras en el cliente
  const filteredCarreras = carreras.filter((carrera) => {
    const query = search.toLowerCase();
    const facultad = carrera.facultad_nombre?.toLowerCase() || "";
    return (
      carrera.nombre.toLowerCase().includes(query) || facultad.includes(query)
    );
  });

  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      {/* 🔎 Barra de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar carrera o facultad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
                {filteredCarreras.length > 0 ? (
                  filteredCarreras.map((carrera) => (
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
                      No se encontraron carreras.
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
