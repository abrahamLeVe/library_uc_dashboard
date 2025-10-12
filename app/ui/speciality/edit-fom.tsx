"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Carrera,
  Especialidad,
} from "@/app/lib/definitions/faculty.definition";
import {
  StateUpdateEspecialidad,
  updateEspecialidadById,
} from "@/app/lib/actions/speciality/edit.action";

interface EditEspecialidadFormProps {
  especialidad: Especialidad;
  especialidades: Especialidad[];
  carreras: Carrera[];
}

const initialState: StateUpdateEspecialidad = { message: null, errors: {} };

export default function EditEspecialidadForm({
  especialidad,
  especialidades,
  carreras,
}: EditEspecialidadFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateEspecialidadById,
    initialState
  );
  const [errorNombre, setErrorNombre] = useState("");
  const [selectedCarreras, setSelectedCarreras] = useState<number[]>(
    especialidad.carreras.map((c) => c.id)
  );

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();
    const existe = especialidades.some(
      (esp) =>
        esp.nombre.toLowerCase() === valor.toLowerCase() &&
        esp.id !== especialidad.id
    );
    setErrorNombre(existe ? "⚠️ Esta especialidad ya existe." : "");
  };

  const handleCarreraToggle = (id: number) => {
    setSelectedCarreras((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // 👇 Cuando el estado de la acción cambia y fue exitoso, refresca datos del servidor
  useEffect(() => {
    if (
      state.message &&
      state.message.startsWith("✅") &&
      (!state.errors || Object.keys(state.errors).length === 0)
    ) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="md:col-span-4 flex justify-center">
      <form
        action={(formData) => {
          formData.set("carreras", JSON.stringify(selectedCarreras));
          formAction(formData);
        }}
        className="w-full max-w-md space-y-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Editar Especialidad
        </h2>

        <input type="hidden" name="id" value={especialidad.id} />

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
            defaultValue={especialidad.nombre}
            onChange={handleNombreChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Carreras múltiples */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carreras asociadas <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded-lg">
            {carreras.map((carrera) => (
              <label
                key={carrera.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  value={carrera.id}
                  checked={selectedCarreras.includes(carrera.id)}
                  onChange={() => handleCarreraToggle(carrera.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {carrera.nombre}
              </label>
            ))}
          </div>
          <FieldError errors={state.errors?.carreras} />
        </div>

        {/* Mensaje */}
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
            href="/dashboard/specialty"
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
