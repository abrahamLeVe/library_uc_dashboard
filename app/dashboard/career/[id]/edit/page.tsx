import { fetchCarreraById, fetchCarrerasAll } from "@/app/lib/data/career.data";
import { fetchFacultadesAll } from "@/app/lib/data/faculty.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditCarreraForm from "@/app/ui/career/edit-fom";
import LatestCarreras from "@/app/ui/career/latest-career";
import { auth } from "@/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Carrera",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // 🔹 Obtener la carrera específica y todas las carreras
  const carrera = await fetchCarreraById(Number(id));
  const carreras = await fetchCarrerasAll();
  const facultades = await fetchFacultadesAll();
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  if (!carrera) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Carreras", href: "/dashboard/career" },
          {
            label: "Editar carrera",
            href: `/dashboard/career/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Formulario de edición */}
        <EditCarreraForm
          carrera={carrera}
          carreras={carreras}
          facultades={facultades}
        />

        {/* Tabla lateral con las más recientes */}
        <LatestCarreras
          carreras={carreras}
          id={carrera.id}
          user={session.user}
        />
      </div>
    </main>
  );
}
