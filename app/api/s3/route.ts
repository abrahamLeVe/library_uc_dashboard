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

export { bucketName, s3Client };

// --------------------
// SUBIDA DE ARCHIVO
// --------------------
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const Body = Buffer.from(await file.arrayBuffer());

    // Subir archivo
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: file.name,
      ContentLength: 31457280, // hasta 30 MB
      Body,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: { key: file.name }, // <-- solo guardas el key
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Error uploading file" },
      { status: 500 }
    );
  }
}
