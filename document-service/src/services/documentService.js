const crypto = require("crypto");
const Document = require("../models/Document");
const { minioClient } = require("../config/storage");

async function uploadDocument({ file, user }) {
  const bucketName = process.env.MINIO_BUCKET;
  const objectName = `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;

  await minioClient.putObject(
    bucketName,
    objectName,
    file.buffer,
    file.size,
    { "Content-Type": file.mimetype }
  );

  const document = await Document.create({
    fileName: file.originalname,
    objectName,
    contentType: file.mimetype,
    size: file.size,
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

  await minioClient.removeObject(process.env.MINIO_BUCKET, document.objectName);
  await document.deleteOne();
  return document;
}

async function getDocumentLink(docId) {
  const document = await Document.findById(docId);
  if (!document) {
    return null;
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

module.exports = {
  uploadDocument,
  updateDocumentMetadata,
  deleteDocument,
  getDocumentLink,
};

