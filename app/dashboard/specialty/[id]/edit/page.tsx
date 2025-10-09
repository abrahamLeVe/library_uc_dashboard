import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchCarrerasAll } from "@/app/lib/data/career.data";

import {
  fetchEspecialidadById,
  fetchEspecialidadesAll,
} from "@/app/lib/data/speciality.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import LatestEspecialidades from "@/app/ui/speciality/latest-speciality";
import EditEspecialidadForm from "@/app/ui/speciality/edit-fom";

export const metadata: Metadata = {
  title: "Editar Especialidad",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);

  // 🔹 Obtener la especialidad específica y todas las especialidades
  const especialidad = await fetchEspecialidadById(id);
  const especialidades = await fetchEspecialidadesAll();

  // 🔹 Obtener carreras (para el select en el formulario)
  const carreras = await fetchCarrerasAll();

  if (!especialidad) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Especialidades", href: "/dashboard/specialty" },
          {
            label: "Editar especialidad",
            href: `/dashboard/specialty/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Formulario de edición */}
        <EditEspecialidadForm
          especialidad={especialidad}
          especialidades={especialidades}
          carreras={carreras}
        />

        {/* Tabla lateral con las más recientes */}
        <LatestEspecialidades
          especialidades={especialidades}
          id={especialidad.id}
        />
      </div>
    </main>
  );
}
