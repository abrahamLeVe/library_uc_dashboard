"use client";

import { deleteKeyword } from "@/app/lib/actions/keywords/delete.action";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useTransition } from "react";

export function CreateKeyword() {
  return (
    <Link
      href="/dashboard/keywords/create"
      className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white hover:bg-blue-400 transition-colors"
    >
      <span className="hidden md:block">Registrar Palabra clave</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateKeyword({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/keywords/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 transition-colors"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteKeyword({ id }: { id: number }) {
  const deletePalabraWithId = deleteKeyword.bind(null, id);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deletePalabraWithId();
      setShowModal(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full hover:bg-red-50 transition-colors"
        aria-label="Eliminar Palabra"
      >
        <TrashIcon className="w-4 text-red-600" />
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <h2 className="text-lg font-semibold text-gray-800">
              Eliminar palabra
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que quieres eliminar esta palabra?
            </p>
            <span className="text-red-500 font-medium">
              Esta acción no se puede deshacer.
            </span>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:opacity-50"
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
