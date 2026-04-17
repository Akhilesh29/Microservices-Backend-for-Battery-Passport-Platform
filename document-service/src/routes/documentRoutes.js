const express = require("express");
const multer = require("multer");
const { createAuthVerifier } = require("battery-passport-shared");
const {
  upload,
  update,
  remove,
  getLink,
  download,
} = require("../controllers/documentController");

const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });
const authServiceUrl = process.env.AUTH_SERVICE_URL;
const authGuard = createAuthVerifier({
  authServiceUrl,
  allowedRoles: ["admin", "user"],
});

router.post("/upload", authGuard, uploadMiddleware.single("file"), upload);
router.put("/:docId", authGuard, update);
router.delete("/:docId", authGuard, remove);
router.get("/:docId", authGuard, getLink);
router.get("/:docId/download", authGuard, download);

module.exports = router;
