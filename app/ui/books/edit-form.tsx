"use client";

import { State, updateBook } from "@/app/lib/actions/books/edit.action";
import { Button } from "@/app/ui/button";
import axios from "axios";
import { startTransition, useActionState, useState } from "react";

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

  // Inicializamos a partir del libro (sin useEffect)
  const [facultadId, setFacultadId] = useState<number | null>(
    libro?.facultad_id ?? null
  );
  const [carreraId, setCarreraId] = useState<number | null>(
    libro?.carrera_id ?? null
  );
  const [especialidadId, setEspecialidadId] = useState<number | null>(
    libro?.especialidad_id ?? null
  );
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<string[]>(
    libro?.autores?.map((a: any) => String(a.id)) ?? []
  );

  // Archivos
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [examenPdfFile, setExamenPdfFile] = useState<File | null>(null);
  const [eliminarImagen, setEliminarImagen] = useState(false);
  const [eliminarExamen, setEliminarExamen] = useState(false);

  // Múltiples URLs de video
  const [videoUrls, setVideoUrls] = useState<string[]>(
    libro?.video_urls && libro.video_urls.length > 0 ? libro.video_urls : [""]
  );
  const [uploading, setUploading] = useState(false);
  const handleVideoUrlChange = (index: number, value: string) => {
    const updated = [...videoUrls];
    updated[index] = value;
    setVideoUrls(updated);
  };

  const addVideoUrlField = () => setVideoUrls([...videoUrls, ""]);
  const removeVideoUrlField = (index: number) => {
    if (videoUrls.length === 1) return;
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  };

  // Filtrados dinámicos — importantes: especialidades usan `carreras` array
  const carrerasFiltradas = facultadId
    ? carreras.filter((c: any) => c.facultad_id === facultadId)
    : [];

  const especialidadesFiltradas = carreraId
    ? especialidades.filter(
        (e: any) =>
          Array.isArray(e.carreras) &&
          e.carreras.some((c: any) => c.id === carreraId)
      )
    : [];

  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Campos básicos
    fd.set("id", String(libro.id));
    fd.set("autores", JSON.stringify(autoresSeleccionados));
    fd.set(
      "video_urls",
      JSON.stringify(videoUrls.filter((v) => v.trim() !== ""))
    );

    // Aseguramos setear los ids si están seleccionados (también tenemos name en los selects)
    if (facultadId) fd.set("facultad_id", String(facultadId));
    if (carreraId) fd.set("carrera_id", String(carreraId));
    if (especialidadId) fd.set("especialidad_id", String(especialidadId));

    try {
      setUploading(true);
      // Imagen
      if (eliminarImagen) {
        fd.set("imagen", "");
      } else if (imagenFile) {
        const uploadData = new FormData();
        uploadData.append("file", imagenFile);
        const res = await axios.post("/api/s3", uploadData);
        const key = res.data?.data?.key;
        if (!key) throw new Error("Error subiendo imagen");
        fd.set("imagen", key);
      } else {
        fd.set("imagen", libro.imagen ?? "");
      }

      // PDF libro
      if (pdfFile) {
        const uploadData = new FormData();
        uploadData.append("file", pdfFile);
        const res = await axios.post("/api/s3", uploadData);
        const key = res.data?.data?.key;
        if (!key) throw new Error("Error subiendo pdf");
        fd.set("pdf_url", key);
      } else {
        fd.set("pdf_url", libro.pdf_url ?? "");
      }

      // Examen PDF
      if (eliminarExamen) {
        fd.set("examen_pdf_url", "");
      } else if (examenPdfFile) {
        const uploadData = new FormData();
        uploadData.append("file", examenPdfFile);
        const res = await axios.post("/api/s3", uploadData);
        const key = res.data?.data?.key;
        if (!key) throw new Error("Error subiendo examen");
        fd.set("examen_pdf_url", key);
      } else {
        fd.set("examen_pdf_url", libro.examen_pdf_url ?? "");
      }
      setUploading(false);
      // Ejecutar action
      startTransition(() => {
        formAction(fd);
      });
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Error subiendo archivos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state?.message && (
        <div
          className={`p-2 rounded text-sm ${
            state.errors && Object.keys(state.errors).length > 0
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {state.message}
        </div>
      )}

      <p className="text-sm text-gray-600 mb-4">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios.
      </p>

      {/* FACULTAD */}
      <div>
        <label className="block text-sm font-medium">
          Facultad<span className="text-red-500">*</span>
        </label>
        <select
          name="facultad_id"
          value={facultadId ?? ""}
          onChange={(e) => {
            const v = Number(e.target.value) || null;
            setFacultadId(v);
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
        <FieldError errors={state.errors?.facultad_id} />
      </div>

      {/* CARRERA */}
      <div>
        <label className="block text-sm font-medium">
          Carrera<span className="text-red-500">*</span>
        </label>
        <select
          name="carrera_id"
          value={carreraId ?? ""}
          onChange={(e) => {
            const v = Number(e.target.value) || null;
            setCarreraId(v);
            setEspecialidadId(null);
          }}
          disabled={!facultadId}
          className="w-full rounded-md border px-3 py-2"
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
        <FieldError errors={state.errors?.carrera_id} />
      </div>

      {/* ESPECIALIDAD */}
      <div>
        <label className="block text-sm font-medium">
          Especialidad<span className="text-red-500">*</span>
        </label>
        <select
          name="especialidad_id"
          value={especialidadId ?? ""}
          onChange={(e) => setEspecialidadId(Number(e.target.value) || null)}
          disabled={!carreraId}
          className="w-full rounded-md border px-3 py-2"
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

      {/* AUTORES */}
      <div>
        <label className="block text-sm font-medium">
          Autores<span className="text-red-500">*</span>
        </label>
        <select
          name="autores"
          multiple
          value={autoresSeleccionados}
          onChange={(e) =>
            setAutoresSeleccionados(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          className="w-full rounded-md border px-3 py-2"
          required
        >
          {autores.map((a: any) => (
            <option key={a.id} value={String(a.id)}>
              {a.nombre}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Usa Ctrl (Windows) o Cmd (Mac) para seleccionar varios autores
        </p>
        <FieldError errors={state.errors?.autores} />
      </div>

      {/* TÍTULO */}
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
        <FieldError errors={state.errors?.titulo} />
      </div>

      {/* PDF libro */}
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
        {libro.pdf_url_signed && (
          <div className="mt-2">
            <a
              href={libro.pdf_url_signed}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Ver PDF actual
            </a>
          </div>
        )}
        <FieldError errors={state.errors?.pdf_url} />
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
        <FieldError errors={state.errors?.descripcion} />
      </div>

      {/* Otros campos (ISBN, año, editorial, idioma, páginas, palabras clave) */}
      <div>
        <label className="block text-sm font-medium">ISBN</label>
        <input
          type="text"
          name="isbn"
          defaultValue={libro.isbn ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.isbn} />
      </div>

      <div>
        <label className="block text-sm font-medium">Año de publicación</label>
        <input
          type="number"
          name="anio_publicacion"
          defaultValue={libro.anio ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.anio_publicacion} />
      </div>

      <div>
        <label className="block text-sm font-medium">Editorial</label>
        <input
          type="text"
          name="editorial"
          defaultValue={libro.editorial ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.editorial} />
      </div>

      <div>
        <label className="block text-sm font-medium">Idioma</label>
        <input
          type="text"
          name="idioma"
          defaultValue={libro.idioma ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.idioma} />
      </div>

      <div>
        <label className="block text-sm font-medium">Páginas</label>
        <input
          type="number"
          name="paginas"
          defaultValue={libro.paginas ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.paginas} />
      </div>

      <div>
        <label className="block text-sm font-medium">Palabras clave</label>
        <input
          type="text"
          name="palabras_clave"
          defaultValue={(libro.palabras_clave || []).join(", ")}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.palabras_clave} />
      </div>

      {/* URLs de videos (múltiples) */}
      <div>
        <label className="block text-sm font-medium">URLs de videos</label>
        {videoUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="url"
              value={url}
              onChange={(e) => handleVideoUrlChange(index, e.target.value)}
              placeholder="https://www.youtube.com/watch?v=xxxxx"
              className="w-full rounded-md border px-3 py-2"
            />
            {videoUrls.length > 1 && (
              <button
                type="button"
                onClick={() => removeVideoUrlField(index)}
                className="px-2 py-1 text-red-600 border rounded hover:bg-red-50"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addVideoUrlField}
          className="mt-1 text-blue-600 text-sm hover:underline"
        >
          + Añadir otra URL
        </button>
        <FieldError errors={state.errors?.video_urls} />
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
        <FieldError errors={state.errors?.imagen} />
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
              rel="noreferrer"
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
        <FieldError errors={state.errors?.examen_pdf_url} />
      </div>
      {state?.message && (
        <div
          className={`p-2 rounded text-sm ${
            state.errors && Object.keys(state.errors).length > 0
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* BOTÓN */}
      <Button type="submit" disabled={uploading || isPending}>
        {uploading
          ? "Subiendo archivos..."
          : isPending
          ? "Guardando..."
          : "Guardar libro"}
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
