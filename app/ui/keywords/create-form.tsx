"use client";

import { useActionState, useState, useEffect, startTransition } from "react";
import Link from "next/link";
import {
  createKeyword,
  StateKeyword,
} from "@/app/lib/actions/keywords/create.action";
import { OnlyLibro } from "@/app/lib/definitions/books.definitions";

interface CreateKeywordFormProps {
  libros: OnlyLibro[];
}

const initialState: StateKeyword = { message: null, errors: {} };

export default function CreateKeywordForm({ libros }: CreateKeywordFormProps) {
  const [state, formAction, isPending] = useActionState(
    createKeyword,
    initialState
  );

  // Estado local completamente independiente
  const [nombre, setNombre] = useState<string>("");
  const [selectedLibros, setSelectedLibros] = useState<string[]>([]);

  // 🔹 Solo resetear al guardar con éxito
  useEffect(() => {
    if (state.message?.startsWith("✅")) {
      setNombre("");
      setSelectedLibros([]);
    }
  }, [state.message]);

  const handleLibroSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedLibros(options);
  };

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          // ✅ Envolver en startTransition
          startTransition(() => {
            formData.set("nombre", nombre);
            formData.set("libros", JSON.stringify(selectedLibros));
            formAction(formData);
          });
        }}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Registrar Palabra Clave
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
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: psicología, energía, ecuaciones..."
            className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Libros */}
        <div>
          <label
            htmlFor="libros"
            className="block text-sm font-medium text-gray-700"
          >
            Libros Asociados
          </label>
          <select
            id="libros"
            multiple
            value={selectedLibros}
            onChange={handleLibroSelect}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all h-36"
          >
            {libros.map((libro) => (
              <option key={libro.id} value={String(libro.id)}>
                {libro.titulo}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Mantén presionado <kbd>Ctrl</kbd> (o <kbd>Cmd</kbd> en Mac) para
            seleccionar varios.
          </p>
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
        <div className="flex justify-end items-center gap-3">
          <Link
            href="/dashboard/keywords"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-all"
          >
            {isPending ? "Guardando..." : "Guardar"}
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
        <p key={err} className="mt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
