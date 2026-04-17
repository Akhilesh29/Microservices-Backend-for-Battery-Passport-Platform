const express = require("express");
const { createAuthVerifier } = require("battery-passport-shared");
const {
  createPassport,
  getPassport,
  updatePassport,
  deletePassport,
} = require("../controllers/passportController");

const router = express.Router();
const authServiceUrl = process.env.AUTH_SERVICE_URL;

router.post(
  "/",
  createAuthVerifier({ authServiceUrl, allowedRoles: ["admin"] }),
  createPassport
);
router.get(
  "/:id",
  createAuthVerifier({ authServiceUrl, allowedRoles: ["admin", "user"] }),
  getPassport
);
router.put(
  "/:id",
  createAuthVerifier({ authServiceUrl, allowedRoles: ["admin"] }),
  updatePassport
);
router.delete(
  "/:id",
  createAuthVerifier({ authServiceUrl, allowedRoles: ["admin"] }),
  deletePassport
);

module.exports = router;

