import { fetchUserById } from "@/app/lib/data/users.data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditUserForm from "@/app/ui/users/edit-fom";
import LatestUsers from "@/app/ui/users/latest-users";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Editar Usuario",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Usuarios", href: "/dashboard/users" },
          {
            label: "Editar Usuario",
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <EditUserForm user={user} />
        <Suspense>
          <LatestUsers />
        </Suspense>
      </div>
    </main>
  );
}
