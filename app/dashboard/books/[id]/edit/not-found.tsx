import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <FaceFrownIcon className="w-12 text-gray-400" />
      <h2 className="text-2xl font-semibold text-gray-700">
        404 - No encontrado
      </h2>
      <p className="text-gray-600">
        El recurso solicitado no se pudo encontrar o ha sido eliminado de la
        base de datos.
      </p>
      <Link
        href="/dashboard/books"
        className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-500"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
