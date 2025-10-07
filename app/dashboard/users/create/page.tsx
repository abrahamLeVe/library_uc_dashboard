import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import UserForm from "@/app/ui/users/create-form";
import LatestUsers from "@/app/ui/users/latest-users";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Registrar Usuario",
};

export default async function Page() {
  return (
    <main className="relative overflow-hidden ">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Usuarios", href: "/dashboard/users" },
          {
            label: "Crear usuario",
            href: "/dashboard/users/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <UserForm />
        <Suspense>
          <LatestUsers />
        </Suspense>
      </div>
    </main>
  );
}
