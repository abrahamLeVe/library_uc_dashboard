"use client";

import { activateUser } from "@/app/lib/actions/users/activate.action";
import { deactivateUser } from "@/app/lib/actions/users/deactivate.action";
import { PencilIcon, PlusIcon, PowerIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useTransition } from "react";

export function CreateUser() {
  return (
    <Link
      href="/dashboard/users/create"
      className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white hover:bg-blue-400 shadow-sm transition-all active:scale-95"
    >
      <span className="hidden md:block">Registrar Usuario</span>
      <PlusIcon className="h-5 md:ml-3" />
    </Link>
  );
}

export function UpdateUser({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 transition-colors shadow-sm"
      aria-label="Editar usuario"
    >
      <PencilIcon className="w-5 text-gray-700" />
    </Link>
  );
}

export function DeactivateUser({ id }: { id: number }) {
  const deactivateUserWithId = deactivateUser.bind(null, id);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDeactivate = () => {
    startTransition(async () => {
      await deactivateUserWithId();
      setShowModal(false);
    });
  };

  return (
    <>
      {/* Botón desactivar */}
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full hover:bg-yellow-50 transition-colors"
        aria-label="Desactivar usuario"
      >
        <PowerIcon className="w-4 text-yellow-600" />
      </button>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl  p-6  animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800">
              Desactivar Usuario
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que deseas desactivar este usuario?
            </p>
            <p className="text-yellow-600 text-sm font-medium mt-1">
              Podrás volver a activarlo más tarde.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeactivate}
                disabled={isPending}
                className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {isPending ? "Desactivando..." : "Desactivar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ActivateUser({ id }: { id: number }) {
  const activateUserWithId = activateUser.bind(null, id);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmActivate = () => {
    startTransition(async () => {
      await activateUserWithId();
      setShowModal(false);
    });
  };

  return (
    <>
      {/* Botón activar */}
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full hover:bg-green-50 transition-colors"
        aria-label="Activar usuario"
      >
        <PowerIcon className="w-4 text-green-600" />
      </button>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 ">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800">
              Activar Usuario
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que deseas activar este usuario?
            </p>
            <p className="text-green-600 text-sm font-medium mt-1">
              El usuario podrá volver a iniciar sesión y usar el sistema.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmActivate}
                disabled={isPending}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {isPending ? "Activando..." : "Activar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
