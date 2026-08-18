import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET || "businessos-media";
const PUBLIC_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "https://example.com/assets";

const IS_S3_CONFIGURED = !!process.env.S3_ACCESS_KEY && !!process.env.S3_SECRET_KEY && process.env.S3_ACCESS_KEY !== "dummy";

const s3 = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "dummy",
    secretAccessKey: process.env.S3_SECRET_KEY || "dummy",
  },
  // Ensure paths work for both S3 and R2/Spaces
  forcePathStyle: true,
});

export async function generateUploadUrl(key: string, contentType: string, expiresIn: number = 3600) {
  if (!IS_S3_CONFIGURED) {
    throw new Error("S3 storage is not configured. Please check your environment variables.");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
  
  return {
    uploadUrl,
    s3Key: key,
    publicUrl: `${PUBLIC_URL}/${key}`,
  };
}

export async function uploadStorageObject(key: string, body: Buffer, contentType: string) {
  if (!IS_S3_CONFIGURED) {
    throw new Error("S3 storage is not configured. Please check your environment variables.");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);

  return {
    s3Key: key,
    publicUrl: `${PUBLIC_URL}/${key}`,
  };
}

export async function deleteStorageObject(key: string) {
  if (!IS_S3_CONFIGURED) {
    throw new Error("S3 storage is not configured. Please check your environment variables.");
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    await s3.send(command);
    return true;
  } catch (error: any) {
    console.error("Failed to delete storage object:", error);
    throw new Error("Failed to delete object from storage: " + error.message);
  }
}
