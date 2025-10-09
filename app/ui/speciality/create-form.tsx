"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createEspecialidad,
  StateEspecialidad,
} from "@/app/lib/actions/speciality/create.action";
import { Carrera } from "@/app/lib/definitions/faculty.definition";

interface CreateEspecialidadFormProps {
  carreras: Carrera[];
}

const initialState: StateEspecialidad = { message: null, errors: {} };

export default function CreateEspecialidadForm({
  carreras,
}: CreateEspecialidadFormProps) {
  const [state, formAction, isPending] = useActionState(
    createEspecialidad,
    initialState
  );

  const [errorNombre, setErrorNombre] = useState("");

  // ✅ Validar si el nombre ya existe (comparación insensible a mayúsculas)
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();
    const existe = carreras.some(
      (car) =>
        car.especialidades?.some(
          (esp) => esp.nombre.toLowerCase() === valor.toLowerCase()
        ) ?? false
    );

    if (existe) {
      setErrorNombre("⚠️ Esta especialidad ya existe en alguna carrera.");
    } else {
      setErrorNombre("");
    }
  };

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        action={formAction}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Registrar Especialidad <span className="text-red-500">*</span>
        </h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la Especialidad <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            onChange={handleNombreChange}
            required
            placeholder="Ej: Ingeniería de Software"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Select de carrera */}
        <div>
          <label
            htmlFor="carrera_id"
            className="block text-sm font-medium text-gray-700"
          >
            Carrera Asociada <span className="text-red-500">*</span>
          </label>
          <select
            id="carrera_id"
            name="carrera_id"
            required
            defaultValue=""
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          >
            <option value="" disabled>
              Selecciona una carrera
            </option>
            {carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.carrera_id} />
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
              href="/dashboard/especialidad"
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
