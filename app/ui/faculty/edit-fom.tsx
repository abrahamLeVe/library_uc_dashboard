"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Facultad } from "@/app/lib/definitions/faculty.definition";
import {
  StateUpdateFacultad,
  updateFacultadById,
} from "@/app/lib/actions/faculty/edit.action";

interface EditFacultadFormProps {
  facultad: Facultad; // Facultad actual que se va a editar
  facultades: Facultad[]; // Lista completa (para validar duplicados)
}

const initialState: StateUpdateFacultad = { message: null, errors: {} };

export default function EditFacultadForm({
  facultad,
  facultades,
}: EditFacultadFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateFacultadById,
    initialState
  );
  const [errorNombre, setErrorNombre] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();

    // Verificar si existe otra facultad con el mismo nombre (excluyendo la actual)
    const existe = facultades.some(
      (f) =>
        f.nombre.toLowerCase() === valor.toLowerCase() && f.id !== facultad.id
    );

    if (existe) {
      setErrorNombre("⚠️ Esta facultad ya existe.");
    } else {
      setErrorNombre("");
    }
  };

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        action={formAction}
        className="w-full max-w-md space-y-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Editar Facultad
        </h2>

        {/* Campo oculto ID */}
        <input type="hidden" name="id" value={facultad.id} />

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la Facultad <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            defaultValue={facultad.nombre}
            onChange={handleNombreChange}
            required
            placeholder="Ej: Facultad de Ingeniería"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
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
          <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
            <Link
              href="/dashboard/faculty"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Cancelar
            </Link>
          </div>
          <button
            type="submit"
            disabled={isPending || !!errorNombre}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-all duration-200"
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
        <p key={err} className="mt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
