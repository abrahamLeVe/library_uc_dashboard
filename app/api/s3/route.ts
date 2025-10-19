import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME!;
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 50 MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/octet-stream",
  "application/x-compressed",
  "application/gzip",
  "application/x-gzip",
  "application/x-tgz",
  "application/x-tar",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    console.log("Received file:", file);
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validación de tamaño
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "El archivo supera el límite máximo de 50MB",
        },
        { status: 400 }
      );
    }

    // Validación de tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tipo de archivo no permitido. Solo PDF, imágenes (jpg, png, webp) o archivos .zip/.rar",
        },
        { status: 400 }
      );
    }

    const Body = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: file.name, // <-- se mantiene exacto
        Body,
        ContentType: file.type,
      })
    );

    return NextResponse.json({
      success: true,
      message: "Archivo subido correctamente",
      data: { key: file.name },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Error al subir el archivo" },
      { status: 500 }
    );
  }
}
