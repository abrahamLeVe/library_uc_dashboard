export function uploadFileWithProgress(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("Archivo no proporcionado"));

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "/api/s3", true);

    // ✅ Progreso REAL
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    // ✅ Respuesta del servidor
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (!res?.success || !res?.data?.key) {
            return reject(
              new Error(res?.message || "Error en la respuesta del servidor")
            );
          }
          onProgress(100); // ✅ Asegura que llegue al 100%
          resolve(res.data.key);
        } catch {
          reject(new Error("Respuesta inválida del servidor"));
        }
      } else {
        reject(new Error(`Error HTTP ${xhr.status} al subir archivo`));
      }
    };

    xhr.onerror = () => reject(new Error("Error de conexión al subir archivo"));
    xhr.ontimeout = () => reject(new Error("Tiempo de espera agotado"));
    xhr.timeout = 300000; // 5 minutos por si suben archivos grandes

    xhr.send(formData);
  });
}
