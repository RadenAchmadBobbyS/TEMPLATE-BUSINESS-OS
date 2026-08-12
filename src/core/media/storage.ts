import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET || "businessos-media";
const PUBLIC_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "https://example.com/assets";

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

export async function deleteStorageObject(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    await s3.send(command);
    return true;
  } catch (error) {
    console.error("Failed to delete storage object:", error);
    // Don't throw for MVP so DB sync doesn't break if S3 object was already deleted
    return false;
  }
}
