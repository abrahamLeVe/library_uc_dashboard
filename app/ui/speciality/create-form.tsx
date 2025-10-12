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
  const [selectedCarreras, setSelectedCarreras] = useState<string[]>([]);

  // ✅ Manejar selección múltiple de carreras
  const handleCarreraSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedCarreras(options);
  };

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        action={async (formData) => {
          formData.set("carreras", JSON.stringify(selectedCarreras));
          formAction(formData);
        }}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Registrar Especialidad
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
            required
            placeholder="Ej: Ingeniería de Software"
            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all `}
          />

          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Select múltiple de carreras */}
        <div>
          <label
            htmlFor="carreras"
            className="block text-sm font-medium text-gray-700"
          >
            Carreras Asociadas <span className="text-red-500">*</span>
          </label>
          <select
            id="carreras"
            name="carreras"
            multiple
            required
            value={selectedCarreras}
            onChange={handleCarreraSelect}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 h-36"
          >
            {carreras.map((carrera) => (
              <option key={carrera.id} value={String(carrera.id)}>
                {carrera.nombre} ({carrera.facultad_nombre})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Mantén presionada <kbd>Ctrl</kbd> (o <kbd>Cmd</kbd> en Mac) para
            seleccionar varias.
          </p>
          <FieldError errors={state.errors?.carreras} />
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
              href="/dashboard/speciality"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Cancelar
            </Link>
          </div>
          <button
            type="submit"
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
