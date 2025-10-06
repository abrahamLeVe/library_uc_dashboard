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

  const [facultadId, setFacultadId] = useState<number | null>(null);
  const [carreraId, setCarreraId] = useState<number | null>(null);
  const [especialidadId, setEspecialidadId] = useState<number | null>(null);
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<string[]>(
    []
  );

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [examenPdfFile, setExamenPdfFile] = useState<File | null>(null);

  // Filtrar carreras según facultad
  const carrerasFiltradas = carreras.filter(
    (c: any) => c.facultad_id === facultadId
  );

  // Filtrar especialidades según carrera
  const especialidadesFiltradas = especialidades.filter(
    (e: any) => e.carrera_id === carreraId
  );

  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (facultadId) fd.set("facultad_id", String(facultadId));
    if (carreraId) fd.set("carrera_id", String(carreraId));

    try {
      setUploading(true); // 👈 empieza loading en cuanto subes archivos

      const uploads: Promise<any>[] = [];

      if (pdfFile) {
        const data = new FormData();
        data.append("file", pdfFile);
        uploads.push(
          axios.post("/api/s3", data).then((res) => {
            const key = res.data?.data?.key;
            if (!key) throw new Error("No se pudo subir el PDF");
            fd.set("pdf_url", key);
          })
        );
      }

      if (imagenFile) {
        const data = new FormData();
        data.append("file", imagenFile);
        uploads.push(
          axios.post("/api/s3", data).then((res) => {
            const key = res.data?.data?.key;
            if (!key) throw new Error("No se pudo subir la imagen");
            fd.set("imagen", key);
          })
        );
      }

      if (examenPdfFile) {
        const data = new FormData();
        data.append("file", examenPdfFile);
        uploads.push(
          axios.post("/api/s3", data).then((res) => {
            const key = res.data?.data?.key;
            if (!key) throw new Error("No se pudo subir el examen");
            fd.set("examen_pdf_url", key);
          })
        );
      }

      await Promise.all(uploads);

      // ahora ya no hace falta el loading local
      setUploading(false);

      // dispara el server action (aquí ya entra el isPending)
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
      {/* Mostrar mensaje general */}
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
          required
          disabled={!carreraId}
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
              {a.nombre} ({a.nacionalidad})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Usa Ctrl (Windows) o Cmd (Mac) para seleccionar varios autores
        </p>
        <FieldError errors={state.errors?.autores} />
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium">
          Título<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="titulo"
          placeholder="Ej: Padre Rico, Padre Pobre"
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <FieldError errors={state.errors?.titulo} />
      </div>

      {/* PDF del libro */}
      <div>
        <label className="block text-sm font-medium">
          PDF del libro<span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          placeholder="Breve descripción del libro"
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
          placeholder="978-1234567890"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Año publicación */}
      <div>
        <label className="block text-sm font-medium">Año de publicación</label>
        <input
          type="number"
          name="anio_publicacion"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Editorial */}
      <div>
        <label className="block text-sm font-medium">Editorial</label>
        <input
          type="text"
          name="editorial"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Idioma */}
      <div>
        <label className="block text-sm font-medium">Idioma</label>
        <input
          type="text"
          name="idioma"
          placeholder="Ej: Español"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Páginas */}
      <div>
        <label className="block text-sm font-medium">Páginas</label>
        <input
          type="number"
          name="paginas"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Palabras clave */}
      <div>
        <label className="block text-sm font-medium">Palabras clave</label>
        <input
          type="text"
          name="palabras_clave"
          placeholder="separadas, por, comas"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Imagen del libro */}
      <div>
        <label className="block text-sm font-medium">Imagen del libro</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border px-3 py-2"
        />
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
        <FieldError errors={state.errors?.examen_pdf_url} />
      </div>

      {/* Botón */}
      <Button type="submit" disabled={uploading || isPending}>
        {uploading
          ? "Subiendo archivos..."
          : isPending
          ? "Guardando..."
          : "Guardar"}
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
