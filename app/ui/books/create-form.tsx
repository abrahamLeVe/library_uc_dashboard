"use client";

import { createBook, State } from "@/app/lib/actions/books/create.action";
import { uploadFileWithProgress } from "@/app/lib/utils/upload-file-progress";
import { Button } from "@/app/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { startTransition, useActionState, useState } from "react";
import KeywordSelector from "./keywords-selector";

export default function Form({
  facultades,
  carreras,
  especialidades,
  autores,
  keywords, // <--- nueva prop
}: any) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(
    createBook,
    initialState
  );

  // Estados locales
  const [facultadId, setFacultadId] = useState<number | null>(null);
  const [carreraId, setCarreraId] = useState<number | null>(null);
  const [especialidadId, setEspecialidadId] = useState<number | null>(null);
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<string[]>(
    []
  );
  const [palabrasSeleccionadas, setPalabrasSeleccionadas] = useState<string[]>(
    []
  );

  const [uploading, setUploading] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  // Archivos
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [examenPdfFile, setExamenPdfFile] = useState<File | null>(null);

  // Videos
  const [videoUrls, setVideoUrls] = useState<string[]>([""]);
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

  // Filtrar carreras y especialidades
  const carrerasFiltradas = facultadId
    ? carreras.filter((c: any) => c.facultad_id === facultadId)
    : [];
  const especialidadesFiltradas = carreraId
    ? especialidades.filter((e: any) =>
        e.carreras?.some((c: any) => c.id === carreraId)
      )
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setGlobalProgress(0);

    const fd = new FormData(e.currentTarget);
    facultadId && fd.set("facultad_id", String(facultadId));
    carreraId && fd.set("carrera_id", String(carreraId));
    especialidadId && fd.set("especialidad_id", String(especialidadId));
    autoresSeleccionados.forEach((id) => fd.append("autores", id));
    fd.set("palabras_clave", palabrasSeleccionadas.join(","));

    // Archivos a subir
    const files = [
      { file: pdfFile, field: "pdf_url" },
      { file: imagenFile, field: "imagen" },
      { file: examenPdfFile, field: "examen_pdf_url" },
    ].filter((f) => f.file);

    if (files.length === 0) {
      // No hay archivos, enviamos solo el formulario
      startTransition(() => formAction(fd));
      setUploading(false);
      return;
    }

    try {
      // Total de bytes de todos los archivos
      const totalBytes = files.reduce((acc, f) => acc + (f.file?.size || 0), 0);
      let uploadedBytes = 0;

      const uploads = files.map(({ file, field }) =>
        uploadFileWithProgress(file!, (pct) => {
          const fileUploadedBytes = (file!.size * pct) / 100;
          const totalProgress = uploadedBytes + fileUploadedBytes;
          setGlobalProgress(Math.round((totalProgress / totalBytes) * 100));
        }).then((key) => {
          fd.set(field, key);
          uploadedBytes += file!.size; // marcar como completado
        })
      );

      await Promise.all(uploads);

      startTransition(() => formAction(fd));
    } catch (err: any) {
      console.error(err);
    } finally {
      setUploading(false);
      setGlobalProgress(100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">
        Los campos marcados con <span className="text-red-500">*</span> son
        obligatorios.
      </p>

      {/* FACULTAD */}
      <div>
        <label className="block text-sm font-medium">
          Facultad <span className="text-red-500">*</span>
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
        <FieldError errors={state.errors?.facultad_id} />
      </div>

      {/* CARRERA */}
      <div>
        <label className="block text-sm font-medium">
          Carrera <span className="text-red-500">*</span>
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
              : "Seleccione primero una facultad"}
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
          Especialidad <span className="text-red-500">*</span>
        </label>
        <select
          value={especialidadId ?? ""}
          onChange={(e) => setEspecialidadId(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
          required
          disabled={!carreraId}
        >
          <option value="" disabled>
            {carreraId
              ? "Seleccione una especialidad"
              : "Seleccione primero una carrera"}
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
          Autores <span className="text-red-500">*</span>
        </label>
        <select
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
            <option key={a.id} value={a.id}>
              {a.nombre} ({a.nacionalidad})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Usa Ctrl (Windows) o Cmd (Mac) para seleccionar varios autores.
        </p>
        <FieldError errors={state.errors?.autores} />
      </div>

      {/* TÍTULO */}
      <div>
        <label className="block text-sm font-medium">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="titulo"
          placeholder="Ej: Desarrollo Humano"
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <FieldError errors={state.errors?.titulo} />
      </div>

      {/* PDF del libro */}
      <div>
        <label className="block text-sm font-medium">
          PDF del libro o archivo comprimido{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf,application/pdf,.zip,application/zip,.rar,application/vnd.rar,application/x-rar-compressed"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <FieldError errors={state.errors?.pdf_url} />
      </div>

      {[
        { name: "descripcion", label: "Descripción", type: "textarea" },
        {
          name: "isbn",
          label: "ISBN",
          type: "text",
          placeholder: "978-1234567890",
        },
        {
          name: "anio_publicacion",
          label: "Año de publicación",
          type: "number",
        },
        { name: "editorial", label: "Editorial", type: "text" },
        {
          name: "idioma",
          label: "Idioma",
          type: "text",
          placeholder: "Español",
        },
        { name: "paginas", label: "Páginas", type: "number" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              rows={3}
              className="w-full rounded-md border px-3 py-2"
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              className="w-full rounded-md border px-3 py-2"
            />
          )}
          {/* Mostrar errores específicos */}
          <FieldError errors={state.errors?.[field.name]} />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium">Palabras clave</label>
        <KeywordSelector
          keywords={keywords} // todas las palabras existentes
          selectedKeywords={palabrasSeleccionadas}
          setSelectedKeywords={setPalabrasSeleccionadas}
        />
        <FieldError errors={state.errors?.palabras_clave} />
      </div>

      {/* 🔹 URLs de Videos (múltiples) */}
      <div>
        <label className="block text-sm font-medium">URLs de videos</label>
        {videoUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="url"
              name="video_urls"
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
                <XMarkIcon className="w-5 h-5" />
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

      {/* Imagen y examen PDF */}
      <div>
        <label className="block text-sm font-medium">Imagen del libro</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.imagen} />
      </div>

      <div>
        <label className="block text-sm font-medium">PDF examen</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setExamenPdfFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
        />
        <FieldError errors={state.errors?.examen_pdf_url} />
      </div>

      {/* Mensaje de error o éxito */}
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

      {/* PROGRESO GLOBAL */}
      {uploading && (
        <div className="w-full mb-2">
          <div className="text-sm text-gray-700 mb-1">
            Subiendo archivos... {globalProgress}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={uploading || isPending}>
        {uploading
          ? `Subiendo archivos... ${globalProgress}%`
          : isPending
          ? "Guardando libro..."
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
