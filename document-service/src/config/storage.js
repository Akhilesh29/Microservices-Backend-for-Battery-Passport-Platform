const Minio = require("minio");

function getStorageProvider() {
  return process.env.STORAGE_PROVIDER || "minio";
}

const minioClient =
  getStorageProvider() === "minio"
    ? new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT || "minio",
        port: Number(process.env.MINIO_PORT || 9000),
        useSSL: process.env.MINIO_USE_SSL === "true",
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
      })
    : null;

async function ensureBucket() {
  if (getStorageProvider() !== "minio") {
    console.log("MinIO bucket setup skipped; using Mongo-backed document storage");
    return;
  }

  const bucketName = process.env.MINIO_BUCKET;
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
  }
}

module.exports = {
  getStorageProvider,
  minioClient,
  ensureBucket,
};
