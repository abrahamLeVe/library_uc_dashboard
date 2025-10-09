"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  StateUpdateCarrera,
  updateCarreraById,
} from "@/app/lib/actions/career/edit.action";
import { Carrera, Facultad } from "@/app/lib/definitions/faculty.definition";

interface EditCarreraFormProps {
  carrera: Carrera; // Carrera actual a editar
  carreras: Carrera[]; // Para validar duplicados
  facultades: Facultad[]; // Para el select
}

const initialState: StateUpdateCarrera = { message: null, errors: {} };

export default function EditCarreraForm({
  carrera,
  carreras,
  facultades,
}: EditCarreraFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCarreraById,
    initialState
  );

  const [nombre, setNombre] = useState(carrera.nombre.trim());
  const [errorNombre, setErrorNombre] = useState("");

  // Validar duplicado en cada cambio
  useEffect(() => {
    const existe = carreras.some(
      (c) =>
        c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== carrera.id
    );

    if (existe) {
      setErrorNombre("⚠️ Esta carrera ya existe.");
    } else {
      setErrorNombre("");
    }
  }, [nombre, carreras, carrera.id]);

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        action={formAction}
        className="w-full max-w-md space-y-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Editar Carrera
        </h2>

        {/* Campo oculto ID */}
        <input type="hidden" name="id" value={carrera.id} />

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la Carrera <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Ingeniería de Sistemas"
            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
              errorNombre
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-400"
                : "border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-400"
            }`}
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Facultad */}
        <div>
          <label
            htmlFor="facultad_id"
            className="block text-sm font-medium text-gray-700"
          >
            Facultad <span className="text-red-500">*</span>
          </label>
          <select
            id="facultad_id"
            name="facultad_id"
            defaultValue={carrera.facultad_id ?? ""}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          >
            <option value="">-- Selecciona una facultad --</option>
            {facultades?.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.nombre}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.facultad_id} />
        </div>

        {/* Mensaje del estado */}
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
              href="/dashboard/career"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Cancelar
            </Link>
          </div>
          <button
            type="submit"
            disabled={isPending || !!errorNombre || nombre.trim() === ""}
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
