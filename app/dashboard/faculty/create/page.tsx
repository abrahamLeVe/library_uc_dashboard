import { fetchFacultadesAll } from "@/app/lib/data/faculty.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import CreateFacultyForm from "@/app/ui/faculty/create-form";
import LatestFacultades from "@/app/ui/faculty/latest-faculty";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Facultad",
};

export default async function Page() {
  const facultades = await fetchFacultadesAll();
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Facultades", href: "/dashboard/faculty" },
          {
            label: "Crear facultad",
            href: "/dashboard/faculty/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <CreateFacultyForm facultades={facultades} />

        <LatestFacultades facultades={facultades} user={session.user} />
      </div>
    </main>
  );
}
