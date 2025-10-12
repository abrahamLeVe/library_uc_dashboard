import { fetchCarrerasAll } from "@/app/lib/data/career.data";
import { fetchEspecialidadesAll } from "@/app/lib/data/speciality.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import CreateEspecialidadForm from "@/app/ui/speciality/create-form";
import LatestEspecialidades from "@/app/ui/speciality/latest-speciality";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Especialidad",
};

export default async function Page() {
  // 🔹 Obtener todas las carreras para el select del formulario
  const carreras = await fetchCarrerasAll();
  const especialidades = await fetchEspecialidadesAll();
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Especialidades", href: "/dashboard/especialidad" },
          {
            label: "Crear especialidad",
            href: "/dashboard/especialidad/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 🔹 Formulario para registrar una especialidad */}
        <CreateEspecialidadForm carreras={carreras} />

        {/* 🔹 Tabla con las especialidades más recientes */}
        <LatestEspecialidades
          especialidades={especialidades}
          user={session.user}
        />
      </div>
    </main>
  );
}
