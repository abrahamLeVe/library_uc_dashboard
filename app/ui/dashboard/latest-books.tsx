import clsx from "clsx";
import { nunito } from "../fonts";
import { fetchLatestBooks } from "@/app/lib/data/dashboard.data";

export default async function LatestBooks() {
  const latestBooks = await fetchLatestBooks();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${nunito.className} mb-4 text-xl md:text-2xl`}>
        Últimos Libros
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestBooks.map((book, i) => (
            <div
              key={book.id}
              className={clsx(
                "flex flex-row items-center justify-between py-4 ",
                { "border-t border-gray-200": i !== 0 }
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="mr-4 h-8 w-8 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-green-800">
                    {book.titulo.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="w-0 flex-1 overflow-hidden">
                  <p
                    className="truncate text-sm font-semibold md:text-base"
                    title={book.titulo}
                  >
                    {book.titulo}
                  </p>
                  <p className="hidden truncate text-sm text-gray-500 sm:block">
                    {book.autores.length > 0
                      ? book.autores.map((a) => a.nombre).join(", ")
                      : "Autor desconocido"}
                    {" — "}
                    {book.especialidad}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                <p className="truncate text-sm font-medium md:text-base text-gray-700">
                  {book.anio_publicacion}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {new Date(book.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
