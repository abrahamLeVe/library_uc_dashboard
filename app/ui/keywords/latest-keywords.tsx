"use client";

import { useState } from "react";
import { UpdateKeyword, DeleteKeyword } from "./buttons";
import { Session } from "next-auth";
import { Keyword } from "@/app/lib/definitions/keywords.definition";

interface LatestKeywordsProps {
  keywords: Keyword[];
  id?: number | string;
  user: Session["user"];
}

export default function LatestKeywords({
  keywords,
  id,
  user,
}: LatestKeywordsProps) {
  const [search, setSearch] = useState("");

  // 🔍 Filtrar keywords en el cliente
  const filteredKeywords = keywords.filter((k) => {
    const query = search.toLowerCase();
    const libros = k.libros?.map((l) => l.titulo.toLowerCase()).join(" ") || "";
    return k.nombre.toLowerCase().includes(query) || libros.includes(query);
  });

  return (
    <div className="md:col-span-4 overflow-y-auto h-[550px] text-sm">
      <div className="flow-root">
        {/* 🔎 Barra de búsqueda */}
        <div className="mb-3 flex items-center justify-between">
          <input
            type="text"
            placeholder="Buscar palabra clave o libro..."
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
                  <th className="px-4 py-3">Palabra Clave</th>
                  <th className="px-4 py-3">Libros asociados</th>
                  <th className="px-4 py-3 text-center w-32">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredKeywords.length > 0 ? (
                  filteredKeywords.map((keyword) => (
                    <tr
                      key={keyword.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">{keyword.id}</td>

                      <td className="px-4 py-3 font-medium text-gray-800">
                        {keyword.nombre}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {keyword.libros && keyword.libros.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {keyword.libros.map((libro) => (
                              <li key={libro.id}>{libro.titulo}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          {keyword.id != id && (
                            <>
                              <UpdateKeyword id={keyword.id} />
                              {user?.role === "ADMIN" && (
                                <DeleteKeyword id={keyword.id} />
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
                      No se encontraron palabras clave.
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
