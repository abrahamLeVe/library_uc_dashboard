"use client";

import { createBook, State } from "@/app/lib/actions/books/create.action";
import { Button } from "@/app/ui/button";
import axios from "axios";
import { useActionState, useState, startTransition } from "react";

export default function Form({
  facultades,
  carreras,
  especialidades,
  autores,
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
  const [uploading, setUploading] = useState(false);

  // Archivos
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [examenPdfFile, setExamenPdfFile] = useState<File | null>(null);
  // ===============================
  // 🔹 Campo: URLs de Videos (múltiples)
  // ===============================
  const [videoUrls, setVideoUrls] = useState<string[]>([""]);

  const handleVideoUrlChange = (index: number, value: string) => {
    const updated = [...videoUrls];
    updated[index] = value;
    setVideoUrls(updated);
  };

  const addVideoUrlField = () => {
    setVideoUrls([...videoUrls, ""]);
  };

  const removeVideoUrlField = (index: number) => {
    if (videoUrls.length === 1) return;
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  };

  // 🔹 Filtrar carreras por facultad
  const carrerasFiltradas = facultadId
    ? carreras.filter((c: any) => c.facultad_id === facultadId)
    : [];

  // 🔹 Filtrar especialidades por carrera (ajustado a tabla intermedia)
  const especialidadesFiltradas = carreraId
    ? especialidades.filter((e: any) =>
        e.carreras?.some((c: any) => c.id === carreraId)
      )
    : [];

  // =======================================
  // 📤 Envío del formulario
  // =======================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (facultadId) fd.set("facultad_id", String(facultadId));
    if (carreraId) fd.set("carrera_id", String(carreraId));
    if (especialidadId) fd.set("especialidad_id", String(especialidadId));
    autoresSeleccionados.forEach((id) => fd.append("autores", id));

    try {
      setUploading(true);

      const uploads: Promise<void>[] = [];

      // Subida de archivos a S3
      const uploadFile = (file: File | null, field: string) => {
        if (!file) return;
        const data = new FormData();
        data.append("file", file);
        uploads.push(
          axios.post("/api/s3", data).then((res) => {
            const key = res.data?.data?.key;
            if (!key) throw new Error(`Error al subir ${field}`);
            fd.set(field, key);
          })
        );
      };

      uploadFile(pdfFile, "pdf_url");
      uploadFile(imagenFile, "imagen");
      uploadFile(examenPdfFile, "examen_pdf_url");

      await Promise.all(uploads);

      setUploading(false);

      // Ejecuta la acción del servidor
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
          PDF del libro <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="application/pdf"
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
        {
          name: "palabras_clave",
          label: "Palabras clave",
          type: "text",
          placeholder: "separadas, por, comas",
        },
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

// =================================================
// 🔸 Componente para mostrar errores
// =================================================
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
