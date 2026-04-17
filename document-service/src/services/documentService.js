const crypto = require("crypto");
const Document = require("../models/Document");
const { getStorageProvider, minioClient } = require("../config/storage");

async function uploadDocument({ file, user }) {
  const storageProvider = getStorageProvider();
  let objectName = null;

  if (storageProvider === "minio") {
    const bucketName = process.env.MINIO_BUCKET;
    objectName = `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;

    await minioClient.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
      { "Content-Type": file.mimetype }
    );
  }

  const document = await Document.create({
    fileName: file.originalname,
    objectName,
    contentType: file.mimetype,
    size: file.size,
    storageProvider,
    fileData: storageProvider === "mongo" ? file.buffer : undefined,
    uploadedBy: user,
  });

  return document;
}

async function updateDocumentMetadata(docId, metadata) {
  return Document.findByIdAndUpdate(
    docId,
    { metadata },
    { new: true, runValidators: true }
  );
}

async function deleteDocument(docId) {
  const document = await Document.findById(docId);
  if (!document) {
    return null;
  }

  if (document.storageProvider === "minio" && document.objectName) {
    await minioClient.removeObject(process.env.MINIO_BUCKET, document.objectName);
  }

  await document.deleteOne();
  return document;
}

async function getDocumentLink(docId) {
  const document = await Document.findById(docId);
  if (!document) {
    return null;
  }

  if (document.storageProvider === "mongo") {
    return {
      document,
      downloadUrl: null,
    };
  }

  const downloadUrl = await minioClient.presignedGetObject(
    process.env.MINIO_BUCKET,
    document.objectName,
    60 * 15
  );

  return {
    document,
    downloadUrl,
  };
}

async function getStoredDocument(docId) {
  const document = await Document.findById(docId);
  if (!document) {
    return null;
  }

  if (document.storageProvider !== "mongo" || !document.fileData) {
    return null;
  }

  return document;
}

module.exports = {
  uploadDocument,
  updateDocumentMetadata,
  deleteDocument,
  getDocumentLink,
  getStoredDocument,
};
