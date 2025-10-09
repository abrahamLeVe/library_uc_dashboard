import {
  fetchFacultadById,
  fetchFacultadesAll,
} from "@/app/lib/data/faculty.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditFacultadForm from "@/app/ui/faculty/edit-fom";
import LatestFacultades from "@/app/ui/faculty/latest-faculty";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Facultad",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // 🔹 Obtener la facultad específica y todas las facultades
  const facultad = await fetchFacultadById(Number(id));
  const facultades = await fetchFacultadesAll();

  if (!facultad) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Facultades", href: "/dashboard/faculty" },
          {
            label: "Editar facultad",
            href: `/dashboard/faculty/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Formulario de edición */}
        <EditFacultadForm facultad={facultad} facultades={facultades} />

        {/* Tabla lateral con las más recientes */}
        <LatestFacultades facultades={facultades} id={facultad.id} />
      </div>
    </main>
  );
}
