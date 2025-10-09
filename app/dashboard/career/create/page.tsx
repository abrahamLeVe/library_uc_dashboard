import { fetchFacultadesAll } from "@/app/lib/data/faculty.data";
import { fetchCarrerasAll } from "@/app/lib/data/career.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import CreateCareerForm from "@/app/ui/career/create-form";
import { Metadata } from "next";
import LatestCarreras from "@/app/ui/career/latest-career";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Registrar Carrera",
};

export default async function Page() {
  // ✅ Se obtienen todas las facultades (para el select)
  const facultades = await fetchFacultadesAll();

  // ✅ Se obtienen todas las carreras (para validar duplicados)
  const carreras = await fetchCarrerasAll();
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Carreras", href: "/dashboard/career" },
          {
            label: "Crear carrera",
            href: "/dashboard/career/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <CreateCareerForm facultades={facultades} carreras={carreras} />

        <LatestCarreras carreras={carreras} user={session.user} />
      </div>
    </main>
  );
}
