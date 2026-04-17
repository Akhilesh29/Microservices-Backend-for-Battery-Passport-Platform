const {
  uploadDocument,
  updateDocumentMetadata,
  deleteDocument,
  getDocumentLink,
  getStoredDocument,
} = require("../services/documentService");

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const document = await uploadDocument({
      file: req.file,
      user: req.user,
    });

    res.status(201).json({
      docId: document.id,
      fileName: document.fileName,
      createdAt: document.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const document = await updateDocumentMetadata(req.params.docId, req.body.metadata || {});
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const document = await deleteDocument(req.params.docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getLink(req, res, next) {
  try {
    const result = await getDocumentLink(req.params.docId);
    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    const downloadUrl =
      result.downloadUrl ||
      `${req.protocol}://${req.get("host")}/api/documents/${result.document.id}/download`;

    res.status(200).json({
      docId: result.document.id,
      fileName: result.document.fileName,
      downloadUrl,
    });
  } catch (error) {
    next(error);
  }
}

async function download(req, res, next) {
  try {
    const document = await getStoredDocument(req.params.docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found for direct download" });
    }

    res.setHeader("Content-Type", document.contentType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.fileName}"`
    );
    res.status(200).send(document.fileData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  upload,
  update,
  remove,
  getLink,
  download,
};
