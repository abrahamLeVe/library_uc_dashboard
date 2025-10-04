"use client";
import { deleteBook } from "@/app/lib/actions/books/delete.action";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useTransition } from "react";

export function CreateBook() {
  return (
    <Link
      href="/dashboard/books/create"
      className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white hover:bg-blue-400 "
    >
      <span className="hidden md:block">Registrar libro</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBook({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/books/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBook({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    startTransition(() => {
      deleteBook(id);
      setShowModal(false);
    });
  };

  return (
    <>
      {/* Botón de borrar */}
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full hover:bg-red-50 transition-colors"
        aria-label="Eliminar libro"
      >
        <TrashIcon className="w-5 h-5 text-red-500" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900">
              Confirmar eliminación
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que deseas eliminar este libro? <br />
              <span className="text-red-500 font-medium">
                Esta acción no se puede deshacer.
              </span>
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
