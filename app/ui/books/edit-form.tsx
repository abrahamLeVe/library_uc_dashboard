"use client";

import { updateBook, State } from "@/app/lib/actions/books/edit.action";
import { Button } from "@/app/ui/button";
import axios from "axios";
import { useActionState, useState, startTransition } from "react";

export default function EditForm({
  libro,
  facultades,
  carreras,
  especialidades,
  autores,
}: any) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(
    updateBook,
    initialState
  );

  console.log("Libro a editar:", libro);

  // Estados de selects
  const [facultadId, setFacultadId] = useState<number | null>(
    libro.facultad_id ?? null
  );
  const [carreraId, setCarreraId] = useState<number | null>(
    libro.carrera_id ?? null
  );
  const [especialidadId, setEspecialidadId] = useState<number | null>(
    libro.especialidad_id ?? null
  );
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<string[]>(
    libro.autores?.map((a: any) => String(a.id)) ?? []
  );

  // Archivos
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [examenPdfFile, setExamenPdfFile] = useState<File | null>(null);
  const [eliminarImagen, setEliminarImagen] = useState(false);
  const [eliminarExamen, setEliminarExamen] = useState(false);

  // Filtrado dinámico
  const carrerasFiltradas = carreras.filter(
    (c: any) => c.facultad_id === facultadId
  );
  const especialidadesFiltradas = especialidades.filter(
    (e: any) => e.carrera_id === carreraId
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("id", String(libro.id));

    if (facultadId) fd.set("facultad_id", String(facultadId));
    if (carreraId) fd.set("carrera_id", String(carreraId));
    if (especialidadId) fd.set("especialidad_id", String(especialidadId));

    try {
      // Imagen
      if (eliminarImagen) {
        fd.set("imagen", "");
      } else if (imagenFile) {
        const uploadData = new FormData();
        uploadData.append("file", imagenFile);
        const res = await axios.post("/api/s3", uploadData);
        const key = res.data?.data?.key;
        if (!key) throw new Error("No se pudo subir la imagen");
        fd.set("imagen", `${key}`);
      } else {
        fd.set("imagen", libro.imagen ?? "");
      }

      // PDF libro (👈 solo se reemplaza, no se elimina nunca)
      if (pdfFile) {
        const uploadData = new FormData();
        uploadData.append("file", pdfFile);
        const res = await axios.post("/api/s3", uploadData);
        const key = res.data?.data?.key;
        if (!key) throw new Error("No se pudo subir el PDF");
        fd.set("pdf_url", `${key}`);
      } else {
        // Si no se sube nuevo, se mantiene el actual
        fd.set("pdf_url", libro.pdf_url ?? "");
      }

      // Examen
      if (eliminarExamen) {
        fd.set("examen_pdf_url", "");
      } else if (examenPdfFile) {
        const uploadData = new FormData();
        uploadData.append("file", examenPdfFile);
        const res = await axios.post("/api/s3", uploadData);
        const key = res.data?.data?.key;
        if (!key) throw new Error("No se pudo subir el examen PDF");
        fd.set("examen_pdf_url", `${key}`);
      } else {
        fd.set("examen_pdf_url", libro.examen_pdf_url ?? "");
      }

      startTransition(() => {
        formAction(fd);
      });
    } catch (err) {
      console.error(err);
      alert("Error subiendo archivos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Errores generales */}
      {state?.message && (
        <div className="p-2 rounded bg-red-100 text-red-600">
          {state.message}
        </div>
      )}
      <p className="text-sm text-gray-600 mb-4">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios.
      </p>

      {/* Facultad */}
      <div>
        <label className="block text-sm font-medium">
          Facultad<span className="text-red-500">*</span>
        </label>
        <select
          value={facultadId ?? ""}
          onChange={(e) => {
            setFacultadId(Number(e.target.value));
            setCarreraId(null);
            setEspecialidadId(null);
          }}
          className="w-full rounded-md border px-3 py-2"
          required
        >
          <option value="" disabled>
            Seleccione una facultad
          </option>
          {facultades.map((f: any) => (
            <option key={f.id} value={f.id}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Carrera */}
      <div>
        <label className="block text-sm font-medium">
          Carrera<span className="text-red-500">*</span>
        </label>
        <select
          value={carreraId ?? ""}
          onChange={(e) => {
            setCarreraId(Number(e.target.value));
            setEspecialidadId(null);
          }}
          className="w-full rounded-md border px-3 py-2"
          disabled={!facultadId}
          required
        >
          <option value="" disabled>
            {facultadId
              ? "Seleccione una carrera"
              : "Seleccione primero facultad"}
          </option>
          {carrerasFiltradas.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Especialidad */}
      <div>
        <label className="block text-sm font-medium">
          Especialidad<span className="text-red-500">*</span>
        </label>
        <select
          name="especialidad_id"
          value={especialidadId ?? ""}
          onChange={(e) => setEspecialidadId(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
          disabled={!carreraId}
          required
        >
          <option value="" disabled>
            {carreraId
              ? "Seleccione una especialidad"
              : "Seleccione primero carrera"}
          </option>
          {especialidadesFiltradas.map((e: any) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.especialidad_id} />
      </div>

      {/* Autores */}
      <div>
        <label className="block text-sm font-medium">
          Autores<span className="text-red-500">*</span>
        </label>
        <select
          name="autores"
          multiple
          className="w-full rounded-md border px-3 py-2"
          value={autoresSeleccionados}
          onChange={(e) =>
            setAutoresSeleccionados(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          required
        >
          {autores.map((a: any) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Usa Ctrl (Windows) o Cmd (Mac) para seleccionar varios autores
        </p>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium">
          Título<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="titulo"
          defaultValue={libro.titulo ?? ""}
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* PDF libro (👈 no se elimina, solo reemplaza) */}
      <div>
        <label className="block text-sm font-medium">
          PDF del libro<span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.pdf_url} />
        {libro.pdf_url_signed && (
          <div className="mt-2 space-y-1">
            <a
              href={libro.pdf_url_signed}
              target="_blank"
              className="text-blue-600 underline"
            >
              Ver PDF actual
            </a>
          </div>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          defaultValue={libro.descripcion ?? ""}
          className="w-full rounded-md border px-3 py-2"
          rows={3}
        />
      </div>

      {/* ISBN */}
      <div>
        <label className="block text-sm font-medium">ISBN</label>
        <input
          type="text"
          name="isbn"
          defaultValue={libro.isbn ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Año publicación */}
      <div>
        <label className="block text-sm font-medium">Año de publicación</label>
        <input
          type="number"
          name="anio_publicacion"
          defaultValue={libro.anio ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Editorial */}
      <div>
        <label className="block text-sm font-medium">Editorial</label>
        <input
          type="text"
          name="editorial"
          defaultValue={libro.editorial ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Idioma */}
      <div>
        <label className="block text-sm font-medium">Idioma</label>
        <input
          type="text"
          name="idioma"
          defaultValue={libro.idioma ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Páginas */}
      <div>
        <label className="block text-sm font-medium">Páginas</label>
        <input
          type="number"
          name="paginas"
          defaultValue={libro.paginas ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Palabras clave */}
      <div>
        <label className="block text-sm font-medium">Palabras clave</label>
        <input
          type="text"
          name="palabras_clave"
          defaultValue={libro.palabras_clave ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium">Imagen del libro</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
        />
        {libro.imagen_url_signed && !eliminarImagen && (
          <div className="mt-2 space-y-1">
            <img
              src={libro.imagen_url_signed}
              alt="Vista previa"
              className="h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => setEliminarImagen(true)}
              className="text-xs text-red-600 underline"
            >
              Eliminar imagen actual
            </button>
          </div>
        )}
      </div>

      {/* PDF examen */}
      <div>
        <label className="block text-sm font-medium">PDF examen</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setExamenPdfFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
        />
        {libro.examen_url_signed && !eliminarExamen && (
          <div className="mt-2 space-x-2">
            <a
              href={libro.examen_url_signed}
              target="_blank"
              className="text-green-600 underline"
            >
              Ver examen actual
            </a>
            <button
              type="button"
              onClick={() => setEliminarExamen(true)}
              className="text-xs text-red-600 underline"
            >
              Eliminar examen actual
            </button>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando cambios..." : "Actualizar"}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <div aria-live="polite">
      {errors.map((err) => (
        <p key={err} className="mt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
