"use client";

import { useActionState, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Keyword, OnlyLibro } from "@/app/lib/definitions/keywords.definition";
import {
  StateUpdateKeyword,
  updateKeywordById,
} from "@/app/lib/actions/keywords/edit.action";
import { startTransition } from "react";

interface EditKeywordFormProps {
  keyword: Keyword;
  keywords: Keyword[];
  libros: OnlyLibro[];
}

const initialState: StateUpdateKeyword = { message: null, errors: {} };

export default function EditKeywordForm({
  keyword,
  keywords,
  libros,
}: EditKeywordFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateKeywordById,
    initialState
  );

  const [nombre, setNombre] = useState(keyword.nombre);
  const [selectedLibros, setSelectedLibros] = useState<number[]>(
    keyword.libros?.map((l) => l.id) ?? []
  );
  const [errorNombre, setErrorNombre] = useState("");
  const [search, setSearch] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombre(valor);

    const existe = keywords.some(
      (k) =>
        k.nombre.toLowerCase() === valor.toLowerCase() && k.id !== keyword.id
    );
    setErrorNombre(existe ? "⚠️ Esta palabra clave ya existe." : "");
  };

  const handleLibroToggle = (id: number) => {
    setSelectedLibros((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  // Filtrado de libros por buscador
  const filteredLibros = useMemo(() => {
    if (!search.trim()) return libros;
    const term = search.toLowerCase();
    return libros.filter((libro) => libro.titulo.toLowerCase().includes(term));
  }, [libros, search]);

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          formData.set("id", String(keyword.id));
          formData.set("nombre", nombre);
          formData.set("libros", JSON.stringify(selectedLibros));
          startTransition(() => formAction(formData));
        }}
        className="w-full max-w-md space-y-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Editar Palabra Clave
        </h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la palabra clave <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Buscador de libros */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Buscar libros
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por título..."
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Libros asociados */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Libros asociados
          </label>
          <div className="max-h-60 overflow-y-auto border p-2 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLibros.map((libro) => (
              <label key={libro.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={libro.id}
                  checked={selectedLibros.includes(libro.id)}
                  onChange={() => handleLibroToggle(libro.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {libro.titulo}
              </label>
            ))}
            {filteredLibros.length === 0 && (
              <p className="col-span-full text-sm text-gray-500">
                No se encontraron libros.
              </p>
            )}
          </div>
          <FieldError errors={state.errors?.libros} />
        </div>

        {/* Mensajes */}
        {state.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              !state.errors || Object.keys(state.errors).length === 0
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/keywords"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending || !!errorNombre}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <div aria-live="polite">
      {errors.map((err) => (
        <p key={err} className="mt-1 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
